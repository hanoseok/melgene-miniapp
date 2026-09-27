-- 유입 경로 보고서: common.js 가 밖에서 들어온 첫 페이지마다 daily_stats 에 남기는 종류를 모아 본다.
--   in_search_<google|naver|daum|bing|yahoo|duckduckgo|baidu|yandex|coccoc|ecosia>
--   in_social_<x|facebook|instagram|threads|tiktok|kakao|line|whatsapp|youtube|reddit>
--   in_direct (주소 직접 입력·북마크·앱 안 브라우저 등 referrer 없음), in_other (그 밖의 사이트)
-- 주소(referrer)는 저장하지 않는다. 대시보드(SQL Editor)에서만 조회: select * from traffic_report;

create or replace view public.traffic_report with (security_invoker = true) as
select day, site,
       coalesce(sum(n) filter (where kind = 'pv'), 0)                         as pageviews,
       coalesce(sum(n) filter (where kind like 'in\_search\_%'), 0)           as from_search,
       coalesce(sum(n) filter (where kind = 'in_search_google'), 0)           as google,
       coalesce(sum(n) filter (where kind = 'in_search_naver'), 0)            as naver,
       coalesce(sum(n) filter (where kind like 'in\_search\_%'
                                 and kind not in ('in_search_google', 'in_search_naver')), 0) as other_search,
       coalesce(sum(n) filter (where kind like 'in\_social\_%'), 0)           as from_social,
       coalesce(sum(n) filter (where kind = 'in_direct'), 0)                  as direct,
       coalesce(sum(n) filter (where kind = 'in_other'), 0)                   as other_sites
  from daily_stats
 group by day, site
 order by day desc, site;

revoke all on public.traffic_report from anon, authenticated;
