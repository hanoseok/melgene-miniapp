-- 광고·방문 통계: 이벤트를 한 줄씩 쌓지 않고 (날짜, 사이트, 언어, 종류)별 하루 합계만 올린다.
-- kind 예: pv(페이지 조회), ad_filled / ad_unfilled(자동 광고 채움 여부), life_play, life_share_link ...
-- 공개(anon)는 bump_stat() 호출만 가능하다. 합계 조회(ad_report)는 대시보드/서비스 키로만 본다.

create table if not exists public.daily_stats (
  day   date   not null,
  site  text   not null check (site ~ '^[a-z0-9-]{1,32}$'),
  lang  text   not null check (lang ~ '^[a-z]{2}(-[A-Za-z]{2,4})?$'),
  kind  text   not null check (kind ~ '^[a-z0-9_]{1,32}$'),
  n     bigint not null default 0,
  primary key (day, site, lang, kind)
);

alter table public.daily_stats enable row level security;
revoke all on public.daily_stats from anon, authenticated;

create or replace function public.bump_stat(p_site text, p_lang text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day  date := (now() at time zone 'Asia/Seoul')::date;
  v_lang text := case when coalesce(p_lang, '') ~ '^[a-z]{2}(-[A-Za-z]{2,4})?$' then p_lang else 'ko' end;
begin
  if coalesce(p_site, '') !~ '^[a-z0-9-]{1,32}$' or coalesce(p_kind, '') !~ '^[a-z0-9_]{1,32}$' then
    return;
  end if;
  -- 새 종류가 끝없이 늘어나는 것을 막는다: 하루 2,000행이 넘으면 새 행은 만들지 않는다.
  if not exists (select 1 from daily_stats where day = v_day and site = p_site and lang = v_lang and kind = p_kind)
     and (select count(*) from daily_stats where day = v_day) >= 2000 then
    return;
  end if;
  insert into daily_stats (day, site, lang, kind, n)
  values (v_day, p_site, v_lang, p_kind, 1)
  on conflict (day, site, lang, kind) do update set n = daily_stats.n + 1;
end;
$$;

revoke all on function public.bump_stat(text, text, text) from public;
grant execute on function public.bump_stat(text, text, text) to anon, authenticated;

-- 대시보드용 요약 (anon 비공개)
create or replace view public.ad_report with (security_invoker = true) as
select day, site,
       coalesce(sum(n) filter (where kind = 'pv'), 0)          as pageviews,
       coalesce(sum(n) filter (where kind = 'ad_filled'), 0)   as ads_filled,
       coalesce(sum(n) filter (where kind = 'ad_unfilled'), 0) as ads_unfilled,
       round(100.0 * sum(n) filter (where kind = 'ad_filled')
             / nullif(sum(n) filter (where kind in ('ad_filled', 'ad_unfilled')), 0), 1) as fill_rate_pct
  from daily_stats
 group by day, site
 order by day desc, site;

revoke all on public.ad_report from anon, authenticated;
