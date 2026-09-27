-- 하트(인기도): 한 사람이 여러 번 보낼 수 있다. 단, 같은 앱에 같은 IP는 1분 안에 다시 세지 않는다.
-- IP 원문은 저장하지 않는다(md5만). 1분 판정용 기록은 하루가 지나면 지운다.

create table if not exists public.app_hearts (
  site text   primary key check (site ~ '^[a-z0-9-]{1,32}$'),
  n    bigint not null default 0
);
alter table public.app_hearts enable row level security;
revoke all on public.app_hearts from anon, authenticated;

create table if not exists public.heart_recent (
  site    text        not null,
  ip_hash text        not null,
  last_at timestamptz not null default now(),
  primary key (site, ip_hash)
);
create index if not exists heart_recent_last_idx on public.heart_recent (last_at);
alter table public.heart_recent enable row level security;
revoke all on public.heart_recent from anon, authenticated;

-- 하트 보내기 → (현재 하트 수, 이번에 셌는지)
create or replace function public.heart_app(p_site text)
returns table (hearts bigint, counted boolean)
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

  select r.last_at into v_last from heart_recent r where r.site = p_site and r.ip_hash = v_hash for update;
  if v_last is null or v_last < now() - interval '1 minute' then
    insert into heart_recent (site, ip_hash, last_at) values (p_site, v_hash, now())
      on conflict (site, ip_hash) do update set last_at = now();
    insert into app_hearts (site, n) values (p_site, 1)
      on conflict (site) do update set n = app_hearts.n + 1;
    v_counted := true;
  end if;

  -- 가끔 오래된 판정 기록 정리
  if random() < 0.01 then
    delete from heart_recent r where r.last_at < now() - interval '1 day';
  end if;

  return query select coalesce((select a.n from app_hearts a where a.site = p_site), 0)::bigint, v_counted;
end;
$$;

-- 포털 요약에 하트 추가 (반환 모양이 바뀌므로 다시 만든다)
drop function if exists public.app_summary();
create function public.app_summary()
returns table (site_id text, plays bigint, avg_stars numeric, votes bigint, hearts bigint)
language sql
stable
security definer
set search_path = public
as $$
  with p as (
    select s.site, sum(s.n)::bigint as plays from daily_stats s where s.kind = 'done' group by s.site
  ), r as (
    select a.site, round(avg(a.stars)::numeric, 1) as avg_stars, count(*)::bigint as votes
      from app_ratings a group by a.site
  ), h as (
    select x.site, x.n as hearts from app_hearts x
  ), ids as (
    select site from p union select site from r union select site from h
  )
  select ids.site, coalesce(p.plays, 0), r.avg_stars, coalesce(r.votes, 0), coalesce(h.hearts, 0)
    from ids
    left join p on p.site = ids.site
    left join r on r.site = ids.site
    left join h on h.site = ids.site;
$$;

revoke all on function public.heart_app(text) from public;
revoke all on function public.app_summary() from public;
grant execute on function public.heart_app(text) to anon, authenticated;
grant execute on function public.app_summary() to anon, authenticated;
