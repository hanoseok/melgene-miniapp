#!/usr/bin/env bash
# deploy-prep.sh 가 만든 배포 단위(dist/UNITS: "하위경로 저장소")를
# github.com/<GH_OWNER>/<저장소> 의 배포 브랜치로 강제 푸시하고 GitHub Pages를 켠다.
# 배포 브랜치: BRANCH_<단위>(deploy.env) → 없으면 저장소가 소스 저장소(SOURCE_REPO)면 gh-pages, 아니면 main.
# 소스 저장소의 main 에는 절대 푸시하지 않는다(안전장치로 멈춘다).
# 사용: ./deploy.sh              (전체)
#       ./deploy.sh miniapp      (지정 단위만: hub, miniapp, legacy/life ...)
#       DEPLOY_DRY_RUN=1 ./deploy.sh   (dist 만 만들고 어디로 갈지만 보여 준다)
# 인증은 gh CLI(github.com, keyring)를 쓴다. 잘못된 GITHUB_TOKEN 환경변수가 있어도 무시한다.
# GitHub HTTPS/API에 닿지 않으면(회사 프록시 장애 등) SSH로 푸시만 하고 API 단계는 건너뛴다.
# 브랜치 배포 Pages는 저장소 루트의 CNAME 파일로 커스텀 도메인을 인식한다.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"
source "$ROOT_DIR/deploy.env"

unset GITHUB_TOKEN GH_TOKEN
export GH_HOST=github.com

API_OK=0
code="$(curl -s -m 10 -o /dev/null -w '%{http_code}' https://api.github.com || true)"
[[ "$code" =~ ^(200|301|302|403)$ ]] && API_OK=1
[[ $API_OK -eq 1 ]] || echo "!! GitHub API에 연결되지 않는다(HTTP $code). SSH로 푸시만 한다."

"$ROOT_DIR/deploy-prep.sh"

while read -r unit repo; do
  [[ -z "$unit" || -z "$repo" ]] && continue
  if [[ $# -gt 0 ]] && ! printf '%s\n' "$@" | grep -qx "$unit"; then continue; fi
  full="$GH_OWNER/$repo"
  src="$DIST_DIR/$unit"
  bkey="BRANCH_${unit//[^A-Za-z0-9]/_}"
  branch="${!bkey:-}"
  if [[ -z "$branch" ]]; then
    if [[ "$repo" == "${SOURCE_REPO:-}" ]]; then branch=gh-pages; else branch=main; fi
  fi
  if [[ "$repo" == "${SOURCE_REPO:-}" && "$branch" == "main" ]]; then
    echo "!! $unit: 소스 저장소($full)의 main 에는 배포하지 않는다. BRANCH_ 설정을 확인한다." >&2
    exit 1
  fi
  if [[ ! -d "$src" || "$src" != "$DIST_DIR"/?* ]]; then
    echo "!! $unit: 배포 폴더가 없다 ($src)" >&2
    exit 1
  fi
  echo "==> $unit -> $full ($branch)"
  [[ -n "${DEPLOY_DRY_RUN:-}" ]] && continue   # DEPLOY_DRY_RUN=1 ./deploy.sh : 대상만 보고 푸시하지 않는다

  if [[ $API_OK -eq 1 ]] && ! gh repo view "$full" >/dev/null 2>&1; then
    gh repo create "$full" --public --description "$unit — melgene 정적 배포본" >/dev/null
    echo "    저장소 생성"
  fi

  (
    cd "$src"
    rm -rf .git
    git init -q -b "$branch"
    git add -A
    git -c user.name="${GIT_AUTHOR_NAME_DEPLOY:-$GH_OWNER}" -c user.email="${GIT_AUTHOR_EMAIL_DEPLOY:-$GH_OWNER@users.noreply.github.com}" \
      commit -q -m "deploy $(date '+%Y-%m-%d %H:%M')"
    if [[ $API_OK -eq 1 ]]; then
      git -c credential.helper= -c credential.helper='!gh auth git-credential' \
        push -q -f "https://github.com/$full.git" "$branch"
    else
      git push -q -f "git@github.com:$full.git" "$branch"
    fi
    rm -rf .git
  )

  if [[ $API_OK -eq 0 ]]; then
    echo "    푸시 완료 (SSH). Pages 설정 API는 건너뜀"
    continue
  fi

  if ! gh api "repos/$full/pages" >/dev/null 2>&1; then
    gh api -X POST "repos/$full/pages" -f "source[branch]=$branch" -f "source[path]=/" >/dev/null
    echo "    Pages 활성화"
  fi

  cname=""
  [[ -f "$src/CNAME" ]] && cname="$(cat "$src/CNAME")"
  gh api -X PUT "repos/$full/pages" -f "cname=$cname" -F "source[branch]=$branch" -F "source[path]=/" >/dev/null 2>&1 || true

  echo "    $(gh api "repos/$full/pages" -q .html_url)"
done < "$DIST_DIR/UNITS"
