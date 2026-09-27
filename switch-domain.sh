#!/usr/bin/env bash
# 커스텀 도메인으로 전환한다. DNS가 GitHub Pages를 제대로 가리킬 때만 deploy.env를 바꾸고 재배포한다.
# (DNS 전에 전환하면 github.io 주소가 아직 없는 도메인으로 리다이렉트되어 사이트가 끊긴다.)
# 사용: ./switch-domain.sh melgene.com
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN="${1:?도메인을 인자로 넣는다. 예: ./switch-domain.sh melgene.com}"
source "$ROOT_DIR/deploy.env"

GH_IPS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
TARGET="$GH_OWNER.github.io"
fail=0

# 로컬 DNS 캐시(옛 주차 IP 등)에 속지 않도록 도메인의 권한 네임서버에 직접 묻는다.
AUTH_NS="$(dig +short NS "$DOMAIN" @a.gtld-servers.net +norec 2>/dev/null | head -1)"
[[ -z "$AUTH_NS" ]] && AUTH_NS="$(dig +norec NS "$DOMAIN" @a.gtld-servers.net | awk '/AUTHORITY SECTION/{f=1;next} f&&/NS/{print $5; exit}')"
DIG_AT=${AUTH_NS:+@$AUTH_NS}
echo "==> 권한 네임서버: ${AUTH_NS:-(기본 리졸버)}"

echo "==> $DOMAIN A 레코드"
apex="$(dig +short A "$DOMAIN" $DIG_AT | sort)"
for ip in $GH_IPS; do
  if grep -qx "$ip" <<<"$apex"; then echo "    ok  $ip"; else echo "    없음 $ip"; fail=1; fi
done

for sub in www $(ls "$ROOT_DIR/apps" | grep -v '^hub$'); do
  got="$(dig +short CNAME "$sub.$DOMAIN" $DIG_AT | sed 's/\.$//')"
  if [[ "$got" == "$TARGET" ]]; then echo "    ok  $sub.$DOMAIN -> $got"; else echo "    없음 $sub.$DOMAIN CNAME $TARGET (현재: ${got:-없음})"; fail=1; fi
done

if [[ $fail -ne 0 ]]; then
  echo "!! DNS가 아직 준비되지 않았다. README '커스텀 도메인 연결'의 레코드를 넣고 다시 실행한다." >&2
  exit 1
fi

# ./switch-domain.sh <도메인> --check : DNS 확인만 하고 끝낸다 (자동 대기 스크립트용)
[[ "${2:-}" == "--check" ]] && { echo "==> DNS 준비 완료"; exit 0; }

sed -i '' "s/^CUSTOM_DOMAIN=.*/CUSTOM_DOMAIN=$DOMAIN/" "$ROOT_DIR/deploy.env"
echo "==> deploy.env: CUSTOM_DOMAIN=$DOMAIN"
"$ROOT_DIR/deploy.sh"
echo "==> 완료. 인증서 발급(수 분~수 시간) 후 각 저장소 Settings → Pages에서 Enforce HTTPS를 켠다."
