#!/usr/bin/env bash
# DNS 레코드가 들어가고 GitHub에 연결될 때까지 기다렸다가 커스텀 도메인으로 전환·재배포한다.
# 사용: ./wait-and-switch.sh melgene.com [최대 분, 기본 360]
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN="${1:?도메인을 인자로 넣는다}"
MAX_MIN="${2:-360}"

for ((i = 1; i <= MAX_MIN; i++)); do
  if "$ROOT_DIR/switch-domain.sh" "$DOMAIN" --check >/dev/null 2>&1; then
    code="$(curl -s -m 15 -o /dev/null -w '%{http_code}' https://api.github.com)"
    if [[ "$code" =~ ^(200|301|302|403)$ ]]; then
      echo "[$(date '+%H:%M')] DNS 준비됨 + GitHub 연결됨 → 전환 시작"
      exec "$ROOT_DIR/switch-domain.sh" "$DOMAIN"
    fi
    echo "[$(date '+%H:%M')] DNS 준비됨, GitHub 연결 대기 (HTTP $code)"
  else
    (( i % 10 == 1 )) && echo "[$(date '+%H:%M')] DNS 레코드 대기 중 (${i}/${MAX_MIN}분)"
  fi
  sleep 60
done
echo "!! ${MAX_MIN}분 동안 조건이 맞지 않아 멈췄다. 나중에 ./switch-domain.sh $DOMAIN 으로 다시 시도한다." >&2
exit 1
