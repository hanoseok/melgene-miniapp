-- 플레이 수·하트를 같은 방식으로 센다: 앱마다, 같은 IP(md5)는 30초 안에 다시 세지 않는다.
-- 인기도 점수 = 하트 × 10 + 별점 합(한 사람당 1~5점) + 플레이 × 1.
-- (20260927000000_hearts.sql 의 app_hearts / heart_recent 를 대체한다)

create table if not exists public.app_counts (
  site text   not null check (site ~ '^[a-z0-9-]{1,32}$'),
  kind text   not null check (kind in ('heart', 'play')),
  n    bigint not null default 0,
  primary key (site, kind)
);
alter table public.app_counts enable row level security;
revoke all on public.app_counts from anon, authenticated;

create table if not exists public.app_hit_recent (
  site    text        not null,
  kind    text        not null,
  ip_hash text        not null,
  last_at timestamptz not null default now(),
  primary key (site, kind, ip_hash)
);
create index if not exists app_hit_recent_last_idx on public.app_hit_recent (last_at);
alter table public.app_hit_recent enable row level security;
revoke all on public.app_hit_recent from anon, authenticated;

-- 예전 하트 합계를 옮긴다 (있으면)
do $$
begin
  if to_regclass('public.app_hearts') is not null then
    insert into public.app_counts (site, kind, n)
      select site, 'heart', n from public.app_hearts
      on conflict (site, kind) do update set n = greatest(public.app_counts.n, excluded.n);
  end if;
end $$;

-- 내부용: 30초 판정 + 합계 +1. 공개 호출 불가.
create or replace function public._count_hit(p_site text, p_kind text, p_secs int)
returns table (total bigint, counted boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip      text;
  v_hash    text;
  v_last    timestamptz;
  v_counted boolean := false;
begin
  if coalesce(p_site, '') !~ '^[a-z0-9-]{1,32}$' then
    raise exception 'invalid site';
  end if;
  v_ip := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  v_hash := md5(coalesce(nullif(trim(v_ip), ''), 'unknown'));

  select r.last_at into v_last from app_hit_recent r
   where r.site = p_site and r.kind = p_kind and r.ip_hash = v_hash for update;
  if v_last is null or v_last < now() - make_interval(secs => p_secs) then
    insert into app_hit_recent (site, kind, ip_hash, last_at) values (p_site, p_kind, v_hash, now())
      on conflict (site, kind, ip_hash) do update set last_at = now();
    insert into app_counts (site, kind, n) values (p_site, p_kind, 1)
      on conflict (site, kind) do update set n = app_counts.n + 1;
    v_counted := true;
  end if;

  if random() < 0.01 then
    delete from app_hit_recent r where r.last_at < now() - interval '1 day';
  end if;

  return query select coalesce((select c.n from app_counts c where c.site = p_site and c.kind = p_kind), 0)::bigint, v_counted;
end;
$$;
revoke all on function public._count_hit(text, text, int) from public, anon, authenticated;

-- 하트 (30초)
drop function if exists public.heart_app(text);
create function public.heart_app(p_site text)
returns table (hearts bigint, counted boolean)
language sql
security definer
set search_path = public
as $$ select h.total, h.counted from _count_hit(p_site, 'heart', 30) h; $$;

-- 플레이 = 앱에 들어온 수 (30초)
create or replace function public.play_app(p_site text)
returns table (plays bigint, counted boolean)
language sql
security definer
set search_path = public
as $$ select h.total, h.counted from _count_hit(p_site, 'play', 30) h; $$;

-- 포털 요약: 참여(플레이)·별점·하트·인기도 점수
drop function if exists public.app_summary();
create function public.app_summary()
returns table (site_id text, plays bigint, avg_stars numeric, votes bigint, hearts bigint, score bigint)
language sql
stable
security definer
set search_path = public
as $$
  with c as (
    select x.site,
           coalesce(sum(x.n) filter (where x.kind = 'play'), 0)::bigint  as plays,
           coalesce(sum(x.n) filter (where x.kind = 'heart'), 0)::bigint as hearts
      from app_counts x group by x.site
  ), r as (
    select a.site, round(avg(a.stars)::numeric, 1) as avg_stars, count(*)::bigint as votes,
           sum(a.stars)::bigint as star_sum
      from app_ratings a group by a.site
  ), ids as (
    select site from c union select site from r
  )
  select ids.site,
         coalesce(c.plays, 0),
         r.avg_stars,
         coalesce(r.votes, 0),
         coalesce(c.hearts, 0),
         (coalesce(c.hearts, 0) * 10 + coalesce(r.star_sum, 0) + coalesce(c.plays, 0))::bigint
    from ids
    left join c on c.site = ids.site
    left join r on r.site = ids.site;
$$;

-- 예전 하트 테이블 정리
drop table if exists public.heart_recent;
drop table if exists public.app_hearts;

revoke all on function public.heart_app(text) from public;
revoke all on function public.play_app(text) from public;
revoke all on function public.app_summary() from public;
grant execute on function public.heart_app(text) to anon, authenticated;
grant execute on function public.play_app(text) to anon, authenticated;
grant execute on function public.app_summary() to anon, authenticated;
