#!/usr/bin/env bash
# apps/* 를 배포 단위로 묶어 dist/ 에 만든다.
#
#   dist/miniapp/             → 포털(apps/hub) — 미니앱 메인 (예: https://miniapp.melgene.com/)
#   dist/miniapp/<사이트>/     → 미니앱 도메인의 경로 (예: https://miniapp.melgene.com/life/)
#   dist/hub/                 → 루트 도메인에도 같은 포털 (예: https://melgene.com, canonical 은 miniapp)
#   dist/legacy/<사이트>/      → 예전 서브도메인(예: life.melgene.com)을 새 주소로 넘겨주는 리다이렉트
#   dist/UNITS                → "dist 하위경로 저장소" 목록 (deploy.sh 가 읽는다)
#
# 원본은 https://<사이트>.example.com / https://example.com 자리표시자를 쓰고,
# dist/에서만 deploy.env 기준 실제 주소로 치환한다.
# 로컬 개발에서는 apps/<name>/shared 가 ../../shared 심볼릭 링크지만, dist/에는 실제 파일을 복사한다.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPS_DIR="$ROOT_DIR/apps"
SHARED_DIR="$ROOT_DIR/shared"
DIST_DIR="$ROOT_DIR/dist"

# shellcheck source=deploy.env
source "$ROOT_DIR/deploy.env"

# Supabase 공개용 값(Project URL + publishable 키)은 소스 저장소에 두지 않는다 — 로컬 전용 deploy.local.env(.gitignore)에서 읽는다.
if [[ -f "$ROOT_DIR/deploy.local.env" ]]; then
  # shellcheck source=/dev/null
  source "$ROOT_DIR/deploy.local.env"
fi
SUPABASE_URL="${SUPABASE_URL:-}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}"
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "!! deploy.local.env 에 SUPABASE_URL / SUPABASE_ANON_KEY 가 없다 (공유 링크·통계·별점이 꺼진 채 배포됨 → 중단)" >&2
  exit 1
fi
if [[ ! "$SUPABASE_URL" =~ ^https://[a-z0-9]+\.supabase\.co$ ]]; then
  echo "!! SUPABASE_URL 형식이 이상하다" >&2; exit 1
fi
# 비밀 키 차단: sb_secret_ 또는 service_role JWT 는 절대 배포하지 않는다
if [[ "$SUPABASE_ANON_KEY" == sb_secret_* ]] || { [[ "$SUPABASE_ANON_KEY" == eyJ* ]] && printf '%s' "$SUPABASE_ANON_KEY" | cut -d. -f2 | base64 -D 2>/dev/null | grep -q service_role; }; then
  echo "!! SUPABASE_ANON_KEY 가 비밀(secret/service_role) 키다 — 배포 중단. publishable 키만 쓴다." >&2
  exit 1
fi
if [[ "$SUPABASE_ANON_KEY" != sb_publishable_* && "$SUPABASE_ANON_KEY" != eyJ* ]]; then
  echo "!! SUPABASE_ANON_KEY 형식이 이상하다 (sb_publishable_… 이어야 함)" >&2; exit 1
fi

# apps/*/app.config.js 와 shared/site.config.js 의 SITES 가 어긋나면 멈춘다 (고치려면 node tools/gen-all.js)
node "$ROOT_DIR/tools/gen-sites.js" --check
MINIAPP_SUB="${MINIAPP_SUB:-miniapp}"
REPO_miniapp="${REPO_miniapp:-miniapp}"
ADSENSE_CLIENT="${ADSENSE_CLIENT:-}"

repo_of() {
  local key="REPO_${1//-/_}"
  echo "${!key:-}"
}

# 미니앱 도메인 루트 (끝 슬래시 없음)
if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
  HUB_URL="https://$CUSTOM_DOMAIN"
  MINIAPP_URL="https://$MINIAPP_SUB.$CUSTOM_DOMAIN"
else
  HUB_URL="https://$GH_OWNER.github.io/$(repo_of hub)"
  MINIAPP_URL="https://$GH_OWNER.github.io/$REPO_miniapp"
fi

# 포털(apps/hub)의 대표 주소는 미니앱 도메인 루트다. 루트 도메인은 같은 포털을 보여 준다.
PORTAL_URL="$MINIAPP_URL"

url_of() {
  if [[ "$1" == "hub" ]]; then echo "$PORTAL_URL"; else echo "$MINIAPP_URL/$1"; fi
}

SITE_NAMES=()
for site_path in "$APPS_DIR"/*/; do
  name="$(basename "$site_path")"
  [[ "$name" == "hub" || ! -f "$site_path/app.config.js" ]] || SITE_NAMES+=("$name")
done

# 자리표시자 → 실제 주소. 서브도메인을 먼저, 루트를 마지막에 바꾼다.
# https://<앱>.example.com → <미니앱 도메인>/<앱> (아직 폴더가 없는 앱도 SITE_CONFIG 에 있으면 바뀐다)
SED_SCRIPT="s#https://([a-z0-9-]+)\.example\.com#$MINIAPP_URL/\1#g;"
SED_SCRIPT+="s#https://example\.com#$PORTAL_URL#g;"
SED_SCRIPT+="s#ROOT_DOMAIN: 'example\.com'#ROOT_DOMAIN: '${CUSTOM_DOMAIN:-$GH_OWNER.github.io}'#g;"

# AdSense 자동 광고: 광고 자리를 따로 두지 않고 <head>에 스크립트만 넣는다.
ADS_HEAD=""
ADS_TXT="# AdSense 게시자 ID가 정해지면 deploy.env 의 ADSENSE_CLIENT 로 자동 생성된다."
if [[ -n "$ADSENSE_CLIENT" ]]; then
  ADS_HEAD="<meta name=\"google-adsense-account\" content=\"$ADSENSE_CLIENT\"><script async src=\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=$ADSENSE_CLIENT\" crossorigin=\"anonymous\"></script>"
  ADS_TXT="google.com, ${ADSENSE_CLIENT#ca-}, DIRECT, f08c47fec0942fa0"
fi

# 사이트 하나를 target 으로 복사하고 주소 치환·광고 삽입
build_site() {
  local src="$1" target="$2"
  mkdir -p "$target"
  cp -RL "$src"/. "$target"/
  rm -rf "$target/shared" "$target/tools" "$target/.omc"
  rm -f "$target/app.config.js" "$target/README.md"   # 모듈 등록 정보·설명은 배포하지 않는다
  cp -RL "$SHARED_DIR" "$target/shared"
  # 배포본에만 Supabase 공개용 값을 넣는다 (소스의 site.config.js 는 빈 값)
  sed -i '' -e "s#SUPABASE_URL: ''#SUPABASE_URL: '$SUPABASE_URL'#" -e "s#SUPABASE_ANON_KEY: ''#SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY'#" "$target/shared/site.config.js"
  grep -q "SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY'" "$target/shared/site.config.js" || { echo "!! $target: Supabase 값 넣기 실패" >&2; exit 1; }
  find "$target" -type f \( -name '*.html' -o -name '*.js' -o -name '*.xml' -o -name '*.txt' -o -name '*.json' \) \
    -exec sed -E -i '' -e "$SED_SCRIPT" {} +
  if [[ -n "$ADS_HEAD" ]]; then
    find "$target" -type f -name '*.html' -exec sed -i '' -e "s#</head>#$ADS_HEAD</head>#" {} +
  fi
}

# 배포 단위 루트(도메인 루트)에 공통 파일
finish_root() {
  local root="$1" host="$2" unit="${3:-}" f files
  touch "$root/.nojekyll"
  # Search Console HTML 파일 인증 (deploy.env GSC_FILES_<단위>)
  files="GSC_FILES_${unit}"
  for f in ${!files:-}; do printf 'google-site-verification: %s' "$f" > "$root/$f"; done
  printf '%s\n' "$ADS_TXT" > "$root/ads.txt"
  [[ -n "${CUSTOM_DOMAIN:-}" ]] && printf '%s\n' "$host" > "$root/CNAME"
  return 0
}

redirect_page() {
  # $1 = 이동할 기본 URL(끝 슬래시 없음), $2 = 경로·쿼리·해시를 이어 붙일지(1/0)
  local base="$1" keep="$2"
  local js="location.replace('$base/');"
  [[ "$keep" == "1" ]] && js="location.replace('$base' + location.pathname + location.search + location.hash);"
  cat <<HTML
<!doctype html>
<html><head><meta charset="utf-8"><meta name="robots" content="noindex">
<link rel="canonical" href="$base/">
<meta http-equiv="refresh" content="0; url=$base/">
<title>Redirecting…</title>
<script>$js</script>
</head><body><a href="$base/">$base/</a></body></html>
HTML
}

notfound_page() {
  # 없는 주소 → 영어 루트 전환 전의 /en/ 주소를 새 주소로, 알려진 미니앱 안이면 그 앱 첫 화면, 아니면 포털.
  # 주소에 언어 폴더(/ja/ … /it/ /pt/)가 있으면 그 언어의 첫 화면으로.
  # $1 = 이동할 도메인 기본 URL(끝 슬래시 없음). 쿼리·해시는 유지(공유 링크 보호).
  local base="$1" known langs
  known="$(printf '"%s",' "${SITE_NAMES[@]}")"
  # 언어 폴더 목록(shared/i18n.js LOCALES 의 dir, 루트 en 제외) — 모르는 주소라도 언어는 지킨다
  langs="$(node -e "console.log(require('$ROOT_DIR/shared/i18n.js').LOCALES.filter(l => l.dir).map(l => JSON.stringify(l.dir)).join(','))")"
  cat <<HTML
<!doctype html>
<html><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Redirecting…</title>
<noscript><meta http-equiv="refresh" content="0; url=$base/"></noscript>
<script>(function () {
  var base = '$base', known = [${known%,}], langs = [$langs];
  var p = location.pathname, tail = location.search + location.hash;
  var m = p.match(/^\/(?:([a-z0-9-]+)\/)?en(?:\/(.*))?$/);
  if (m && (!m[1] || known.indexOf(m[1]) >= 0)) { location.replace(base + '/' + (m[1] ? m[1] + '/' : '') + (m[2] || '') + tail); return; }
  var seg = p.split('/'), s = seg[1];
  if (known.indexOf(s) >= 0 && base !== location.origin) { location.replace(base + p + tail); return; }
  var app = known.indexOf(s) >= 0 ? s + '/' : '';
  var lg = app ? seg[2] : seg[1];
  location.replace(base + '/' + app + (langs.indexOf(lg) >= 0 ? lg + '/' : '') + tail);
})();</script>
</head><body><a href="$base/">$base/</a></body></html>
HTML
}

echo "==> dist/ 초기화"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
: > "$DIST_DIR/UNITS"

# 1) 루트 도메인 → 포털과 같은 내용 (canonical 은 미니앱 도메인)
echo "==> hub -> dist/hub ($HUB_URL/, canonical $PORTAL_URL/)"
build_site "$APPS_DIR/hub" "$DIST_DIR/hub"
finish_root "$DIST_DIR/hub" "${CUSTOM_DOMAIN:-}" hub
notfound_page "$PORTAL_URL" > "$DIST_DIR/hub/404.html"   # melgene.com/<앱>/… → 미니앱 주소로
echo "hub $(repo_of hub)" >> "$DIST_DIR/UNITS"

# 2) 미니앱 도메인: 루트 = 포털, /<사이트>/ = 각 미니앱
M="$DIST_DIR/miniapp"
echo "==> portal -> dist/miniapp ($PORTAL_URL/)"
build_site "$APPS_DIR/hub" "$M"
for name in "${SITE_NAMES[@]}"; do
  echo "==> $name -> dist/miniapp/$name ($(url_of "$name")/)"
  build_site "$APPS_DIR/$name" "$M/$name"
  rm -f "$M/$name/robots.txt" "$M/$name/ads.txt"   # 도메인 루트에만 둔다
done
finish_root "$M" "$MINIAPP_SUB.${CUSTOM_DOMAIN:-}" miniapp
{
  echo "User-agent: *"
  echo "Allow: /"
  echo "Sitemap: $PORTAL_URL/sitemap-index.xml"
  echo "Sitemap: $PORTAL_URL/sitemap.xml"
  for name in "${SITE_NAMES[@]}"; do echo "Sitemap: $(url_of "$name")/sitemap.xml"; done
} > "$M/robots.txt"
# Search Console 에 한 번만 제출하면 되는 사이트맵 색인
TODAY="$(date +%F)"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  echo "  <sitemap><loc>$PORTAL_URL/sitemap.xml</loc><lastmod>$TODAY</lastmod></sitemap>"
  for name in "${SITE_NAMES[@]}"; do
    [[ -f "$M/$name/sitemap.xml" ]] && echo "  <sitemap><loc>$(url_of "$name")/sitemap.xml</loc><lastmod>$TODAY</lastmod></sitemap>"
  done
  echo '</sitemapindex>'
} > "$M/sitemap-index.xml"
notfound_page "$PORTAL_URL" > "$M/404.html"
echo "miniapp $REPO_miniapp" >> "$DIST_DIR/UNITS"

# 3) 예전 서브도메인 → 새 주소로 리다이렉트 (경로·쿼리·해시 유지: 이미 공유된 링크 보호)
if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
  for name in "${SITE_NAMES[@]}"; do
    repo="$(repo_of "$name")"
    [[ -z "$repo" ]] && continue
    L="$DIST_DIR/legacy/$name"
    mkdir -p "$L"
    redirect_page "$(url_of "$name")" 1 > "$L/index.html"
    cp "$L/index.html" "$L/404.html"
    touch "$L/.nojekyll"
    printf '%s\n' "$name.$CUSTOM_DOMAIN" > "$L/CNAME"
    echo "legacy/$name $repo" >> "$DIST_DIR/UNITS"
    echo "==> $name.$CUSTOM_DOMAIN -> $(url_of "$name")/ (리다이렉트)"
  done
fi

if grep -rqE "https://([a-z-]+\.)?example\.com" "$DIST_DIR" --include='*.html' --include='*.js' --include='*.xml'; then
  echo "!! dist/에 example.com 자리표시자 주소가 남아 있다:" >&2
  grep -rnE "https://([a-z-]+\.)?example\.com" "$DIST_DIR" --include='*.html' --include='*.js' --include='*.xml' | head >&2
  exit 1
fi

echo "==> 완료. 배포 단위:"
sed 's/^/    /' "$DIST_DIR/UNITS"
