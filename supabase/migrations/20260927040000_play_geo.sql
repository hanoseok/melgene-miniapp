-- 앱별·나라별 "시작(start)"과 "끝까지 완료(done)" 수.
-- 모든 미니앱은 한 판이 시작될 때 track('start'), 끝(결과)에 닿을 때 track('done') 을 한 번씩 보낸다 → bump_stat.
-- bump_stat 이 'start'·'done' 도 daily_geo 에 kind 'start'·'done' 으로 +1 (국가 코드만, IP 저장 안 함).
-- 보기(대시보드 SQL Editor): select * from play_report;  /  select * from play_summary;

-- daily_geo.kind 체크 제약 교체 (20260927030000_geo.sql 에서 이름 없이 inline 으로 만들었으므로 찾아서 지운다)
do $$
declare
  r record;
begin
  for r in
    select c.conname
      from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
     where c.conrelid = 'public.daily_geo'::regclass
       and c.contype = 'c'
       and a.attname = 'kind'
  loop
    execute format('alter table public.daily_geo drop constraint %I', r.conname);
  end loop;
end;
$$;
alter table public.daily_geo
  add constraint daily_geo_kind_check check (kind in ('pv', 'search', 'social', 'start', 'done'));

create or replace function public.bump_stat(p_site text, p_lang text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day  date := (now() at time zone 'Asia/Seoul')::date;
  v_lang text := case when coalesce(p_lang, '') ~ '^[a-z]{2}(-[A-Za-z]{2,4})?$' then p_lang else 'ko' end;
  v_geo  text;
  v_cc   text;
begin
  if coalesce(p_site, '') !~ '^[a-z0-9-]{1,32}$' or coalesce(p_kind, '') !~ '^[a-z0-9_]{1,32}$' then
    return;
  end if;
  -- 새 종류가 끝없이 늘어나는 것을 막는다: 하루 2,000행이 넘으면 새 행은 만들지 않는다.
  if exists (select 1 from daily_stats where day = v_day and site = p_site and lang = v_lang and kind = p_kind)
     or (select count(*) from daily_stats where day = v_day) < 2000 then
    insert into daily_stats (day, site, lang, kind, n)
    values (v_day, p_site, v_lang, p_kind, 1)
    on conflict (day, site, lang, kind) do update set n = daily_stats.n + 1;
  end if;

  -- 나라별 (국가 코드만)
  v_geo := case when p_kind in ('pv', 'start', 'done') then p_kind
                when p_kind like 'in\_search\_%' then 'search'
                when p_kind like 'in\_social\_%' then 'social' end;
  if v_geo is not null then
    v_cc := upper(coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'cf-ipcountry', ''));
    if v_cc !~ '^[A-Z0-9]{2}$' then v_cc := 'XX'; end if;
    if exists (select 1 from daily_geo where day = v_day and site = p_site and country = v_cc and kind = v_geo)
       or (select count(*) from daily_geo where day = v_day) < 5000 then
      insert into daily_geo (day, site, country, kind, n)
      values (v_day, p_site, v_cc, v_geo, 1)
      on conflict (day, site, country, kind) do update set n = daily_geo.n + 1;
    end if;
  end if;
end;
$$;
revoke all on function public.bump_stat(text, text, text) from public;
grant execute on function public.bump_stat(text, text, text) to anon, authenticated;

-- geo_report·geo_summary 는 조회·유입만 센다 (start/done 행 때문에 0 뿐인 줄이 생기지 않게). 모양은 그대로.
-- 날짜·앱·나라별
create or replace view public.geo_report with (security_invoker = true) as
select g.day, g.site, g.country,
       coalesce(c.name_ko, g.country) as country_name,
       coalesce(c.region, '기타')      as region,
       coalesce(sum(g.n) filter (where g.kind = 'pv'), 0)     as pageviews,
       coalesce(sum(g.n) filter (where g.kind = 'search'), 0) as from_search,
       coalesce(sum(g.n) filter (where g.kind = 'social'), 0) as from_social
  from daily_geo g
  left join country_names c on c.code = g.country
 where g.kind in ('pv', 'search', 'social')
 group by g.day, g.site, g.country, c.name_ko, c.region
 order by g.day desc, pageviews desc;

-- 최근 30일 나라별 합계 (모든 앱)
create or replace view public.geo_summary with (security_invoker = true) as
select g.country,
       coalesce(c.name_ko, g.country) as country_name,
       coalesce(c.region, '기타')      as region,
       coalesce(sum(g.n) filter (where g.kind = 'pv'), 0)     as pageviews_30d,
       coalesce(sum(g.n) filter (where g.kind = 'search'), 0) as from_search_30d,
       coalesce(sum(g.n) filter (where g.kind = 'social'), 0) as from_social_30d,
       round(100.0 * coalesce(sum(g.n) filter (where g.kind = 'pv'), 0)
             / nullif(sum(coalesce(sum(g.n) filter (where g.kind = 'pv'), 0)) over (), 0), 1) as share_pct
  from daily_geo g
  left join country_names c on c.code = g.country
 where g.kind in ('pv', 'search', 'social')
   and g.day >= (now() at time zone 'Asia/Seoul')::date - 29
 group by g.country, c.name_ko, c.region
 order by pageviews_30d desc;

-- 날짜·앱·나라별 시작/완료
create or replace view public.play_report with (security_invoker = true) as
select g.day, g.site, g.country,
       coalesce(c.name_ko, g.country) as country_name,
       coalesce(c.region, '기타')      as region,
       coalesce(sum(g.n) filter (where g.kind = 'start'), 0) as starts,
       coalesce(sum(g.n) filter (where g.kind = 'done'), 0)  as completions,
       round(100.0 * coalesce(sum(g.n) filter (where g.kind = 'done'), 0)
             / nullif(coalesce(sum(g.n) filter (where g.kind = 'start'), 0), 0), 1) as completion_pct
  from daily_geo g
  left join country_names c on c.code = g.country
 where g.kind in ('start', 'done')
 group by g.day, g.site, g.country, c.name_ko, c.region
 order by g.day desc, starts desc;

-- 최근 30일 앱 × 나라별 합계
create or replace view public.play_summary with (security_invoker = true) as
select g.site, g.country,
       coalesce(c.name_ko, g.country) as country_name,
       coalesce(c.region, '기타')      as region,
       coalesce(sum(g.n) filter (where g.kind = 'start'), 0) as starts_30d,
       coalesce(sum(g.n) filter (where g.kind = 'done'), 0)  as completions_30d,
       round(100.0 * coalesce(sum(g.n) filter (where g.kind = 'done'), 0)
             / nullif(coalesce(sum(g.n) filter (where g.kind = 'start'), 0), 0), 1) as completion_pct
  from daily_geo g
  left join country_names c on c.code = g.country
 where g.kind in ('start', 'done')
   and g.day >= (now() at time zone 'Asia/Seoul')::date - 29
 group by g.site, g.country, c.name_ko, c.region
 order by g.site, starts_30d desc;

revoke all on public.play_report from anon, authenticated;
revoke all on public.play_summary from anon, authenticated;
revoke all on public.geo_report from anon, authenticated;
revoke all on public.geo_summary from anon, authenticated;
