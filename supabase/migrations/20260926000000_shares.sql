-- 공유 링크 저장소: 사이트 입력값(payload)을 짧은 id로 저장하고, 조회수·생성 수를 센다.
-- 모든 사이트(life, ladder, past-life ...)가 같은 테이블을 쓴다. site 컬럼으로 구분한다.
--
-- 보안 원칙
-- - 테이블에 직접 접근하는 정책은 없다(RLS on, 정책 없음). anon 키로는 아래 함수 3개만 부를 수 있다.
-- - 목록 조회 함수가 없으므로 남의 공유를 훑어볼 수 없다. id를 아는 사람만 그 하나를 읽는다.
-- - payload 크기 제한(2KB)과 IP당 분당 생성 제한(10개)으로 스팸 적재를 막는다.
-- - IP는 원문을 저장하지 않고 md5 해시만 저장한다.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.shares (
  id          text primary key,
  site        text        not null check (site ~ '^[a-z0-9-]{1,32}$'),
  lang        text        not null default 'ko' check (lang ~ '^[a-z]{2}(-[A-Za-z]{2,4})?$'),
  payload     jsonb       not null check (pg_column_size(payload) <= 2048),
  views       integer     not null default 0,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists shares_site_idx on public.shares (site);
create index if not exists shares_ip_recent_idx on public.shares (ip_hash, created_at);

alter table public.shares enable row level security;
revoke all on public.shares from anon, authenticated;

-- 공유 만들기: 짧은 id(8자, URL-safe)를 돌려준다.
create or replace function public.create_share(p_site text, p_lang text, p_payload jsonb)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id   text;
  v_ip   text;
  v_hash text;
begin
  if p_site !~ '^[a-z0-9-]{1,32}$' then
    raise exception 'invalid site';
  end if;
  if p_payload is null or pg_column_size(p_payload) > 2048 then
    raise exception 'payload too large';
  end if;

  v_ip := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  v_hash := case when v_ip = '' then null else md5(v_ip) end;

  if v_hash is not null and (
    select count(*) from shares where ip_hash = v_hash and created_at > now() - interval '1 minute'
  ) >= 10 then
    raise exception 'rate limited';
  end if;

  loop
    v_id := translate(encode(gen_random_bytes(6), 'base64'), '+/', '-_');
    begin
      insert into shares (id, site, lang, payload, ip_hash)
      values (v_id, p_site, coalesce(nullif(p_lang, ''), 'ko'), p_payload, v_hash);
      return v_id;
    exception when unique_violation then
      -- 드물게 id가 겹치면 다시 뽑는다
    end;
  end loop;
end;
$$;

-- 공유 열기: payload를 돌려주고 조회수를 1 올린다. 없으면 빈 결과.
create or replace function public.get_share(p_id text)
returns table (site text, lang text, payload jsonb, views integer)
language sql
security definer
set search_path = public
as $$
  update shares s
     set views = s.views + 1
   where s.id = p_id
  returning s.site, s.lang, s.payload, s.views;
$$;

-- 사이트별 누적 생성 수 (예: "지금까지 N명의 인생이 그려졌어요")
create or replace function public.share_count(p_site text)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from shares where site = p_site;
$$;

revoke all on function public.create_share(text, text, jsonb) from public;
revoke all on function public.get_share(text) from public;
revoke all on function public.share_count(text) from public;
grant execute on function public.create_share(text, text, jsonb) to anon, authenticated;
grant execute on function public.get_share(text) to anon, authenticated;
grant execute on function public.share_count(text) to anon, authenticated;
