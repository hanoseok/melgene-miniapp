#!/usr/bin/env bash
# Cloudflare Pages 로 배포한다 (GitHub 불필요). 사전 준비: README "Cloudflare Pages" 참고.
#   ./deploy-cf.sh            # miniapp(miniapp.melgene.com) + hub(melgene.com) 둘 다
#   ./deploy-cf.sh miniapp    # 하나만
# 인증: 먼저 한 번 `npx wrangler login`(브라우저 로그인) — 토큰을 파일에 두지 않는다.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
./deploy-prep.sh
units=("$@"); [[ ${#units[@]} -gt 0 ]] || units=(miniapp hub)
for u in "${units[@]}"; do
  case "$u" in
    miniapp) project=melgene-miniapp ;;
    hub)     project=melgene-hub ;;
    *) echo "알 수 없는 단위: $u"; exit 1 ;;
  esac
  echo "==> $u -> Cloudflare Pages ($project)"
  npx --yes wrangler pages deploy "dist/$u" --project-name "$project" --branch main --commit-dirty=true
done
