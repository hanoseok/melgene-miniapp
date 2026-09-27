-- 방문자 나라 코드(2글자)만 돌려준다 — 기본 언어(en) 페이지에서 지역 언어 페이지로 자동 이동할 때 쓴다(shared/common.js).
-- Supabase 앞단(Cloudflare)이 붙이는 cf-ipcountry 요청 헤더를 그대로 읽는다. 테이블 없음, 아무것도 저장하지 않는다(IP 저장 안 함).
-- 모르는 값(XX = 알 수 없음, T1 = Tor 등)이나 헤더가 없으면 null.
-- 호출: POST /rest/v1/rpc/client_country  {}  → "KR" 또는 null

create or replace function public.client_country()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_cc text;
begin
  v_cc := upper(coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'cf-ipcountry', ''));
  if v_cc !~ '^[A-Z]{2}$' or v_cc in ('XX', 'T1') then
    return null;
  end if;
  return v_cc;
end;
$$;
revoke all on function public.client_country() from public;
grant execute on function public.client_country() to anon, authenticated;
