-- 나라별 방문: Supabase 앞단(Cloudflare)이 붙여 주는 cf-ipcountry 헤더의 국가 코드만 센다. IP 는 저장하지 않는다.
-- bump_stat 이 'pv'(조회) · 'in_search_*'(검색 유입) · 'in_social_*'(SNS 유입) 을 받을 때 daily_geo 에도 +1.
-- 보기(대시보드 SQL Editor): select * from geo_summary;  /  select * from geo_report;

drop function if exists public._probe_geo();

create table if not exists public.daily_geo (
  day     date   not null,
  site    text   not null check (site ~ '^[a-z0-9-]{1,32}$'),
  country text   not null check (country ~ '^[A-Z0-9]{2}$'),   -- XX = 알 수 없음, T1 = Tor
  kind    text   not null check (kind in ('pv', 'search', 'social')),
  n       bigint not null default 0,
  primary key (day, site, country, kind)
);
alter table public.daily_geo enable row level security;
revoke all on public.daily_geo from anon, authenticated;

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
  v_geo := case when p_kind = 'pv' then 'pv'
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

-- 나라 이름·지역 (한글). 없는 코드는 코드 그대로 '기타' 로 보인다.
create table if not exists public.country_names (
  code    text primary key,
  name_ko text not null,
  region  text not null
);
alter table public.country_names enable row level security;
revoke all on public.country_names from anon, authenticated;
insert into public.country_names (code, name_ko, region) values
  ('KR','대한민국','동아시아'),('JP','일본','동아시아'),('CN','중국','동아시아'),('TW','대만','동아시아'),('HK','홍콩','동아시아'),('MO','마카오','동아시아'),('MN','몽골','동아시아'),
  ('TH','태국','동남아시아'),('VN','베트남','동남아시아'),('ID','인도네시아','동남아시아'),('PH','필리핀','동남아시아'),('MY','말레이시아','동남아시아'),('SG','싱가포르','동남아시아'),('MM','미얀마','동남아시아'),('KH','캄보디아','동남아시아'),('LA','라오스','동남아시아'),
  ('IN','인도','남아시아'),('PK','파키스탄','남아시아'),('BD','방글라데시','남아시아'),('LK','스리랑카','남아시아'),('NP','네팔','남아시아'),
  ('AE','아랍에미리트','중동'),('SA','사우디아라비아','중동'),('IL','이스라엘','중동'),('TR','튀르키예','중동'),('IR','이란','중동'),('QA','카타르','중동'),
  ('GB','영국','유럽'),('FR','프랑스','유럽'),('DE','독일','유럽'),('ES','스페인','유럽'),('IT','이탈리아','유럽'),('NL','네덜란드','유럽'),('BE','벨기에','유럽'),('CH','스위스','유럽'),('AT','오스트리아','유럽'),('LU','룩셈부르크','유럽'),
  ('SE','스웨덴','유럽'),('NO','노르웨이','유럽'),('DK','덴마크','유럽'),('FI','핀란드','유럽'),('PL','폴란드','유럽'),('PT','포르투갈','유럽'),('IE','아일랜드','유럽'),('CZ','체코','유럽'),('RO','루마니아','유럽'),('GR','그리스','유럽'),('HU','헝가리','유럽'),('UA','우크라이나','유럽'),('RU','러시아','유럽'),
  ('US','미국','북미'),('CA','캐나다','북미'),
  ('MX','멕시코','중남미'),('BR','브라질','중남미'),('AR','아르헨티나','중남미'),('CL','칠레','중남미'),('CO','콜롬비아','중남미'),('PE','페루','중남미'),('VE','베네수엘라','중남미'),('EC','에콰도르','중남미'),('GT','과테말라','중남미'),('CU','쿠바','중남미'),('DO','도미니카공화국','중남미'),('UY','우루과이','중남미'),('BO','볼리비아','중남미'),('PY','파라과이','중남미'),('CR','코스타리카','중남미'),('PA','파나마','중남미'),
  ('AU','호주','오세아니아'),('NZ','뉴질랜드','오세아니아'),
  ('ZA','남아프리카공화국','아프리카'),('EG','이집트','아프리카'),('NG','나이지리아','아프리카'),('KE','케냐','아프리카'),('MA','모로코','아프리카'),('DZ','알제리','아프리카'),('TN','튀니지','아프리카'),('SN','세네갈','아프리카'),('CI','코트디부아르','아프리카'),
  ('XX','알 수 없음','기타'),('T1','Tor','기타')
on conflict (code) do update set name_ko = excluded.name_ko, region = excluded.region;

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
 where g.day >= (now() at time zone 'Asia/Seoul')::date - 29
 group by g.country, c.name_ko, c.region
 order by pageviews_30d desc;

revoke all on public.geo_report from anon, authenticated;
revoke all on public.geo_summary from anon, authenticated;
