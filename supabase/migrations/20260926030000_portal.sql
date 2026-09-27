-- 포털용: 앱 별점 · 참여 수 요약 · 투표(밸런스 게임) · 점수 분포(반응속도 등).
-- 공개(anon)는 아래 함수만 부를 수 있다. 테이블 직접 조회는 막는다.
-- 참여 수 = daily_stats 의 kind='done' 합계 (각 앱이 한 번 끝까지 했을 때 track('done')).

-- ---------------------------------------------------------------
-- 별점: 기기당(브라우저 localStorage 의 임의 id) 앱마다 1표, 다시 누르면 바뀐다.
-- ---------------------------------------------------------------
create table if not exists public.app_ratings (
  site       text        not null check (site ~ '^[a-z0-9-]{1,32}$'),
  voter      text        not null,               -- md5(클라이언트 임의 id)
  stars      smallint    not null check (stars between 1 and 5),
  ip_hash    text,
  updated_at timestamptz not null default now(),
  primary key (site, voter)
);
create index if not exists app_ratings_ip_idx on public.app_ratings (ip_hash, updated_at);
alter table public.app_ratings enable row level security;
revoke all on public.app_ratings from anon, authenticated;

create or replace function public.rate_app(p_site text, p_voter text, p_stars int)
returns table (site_id text, avg_stars numeric, votes bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip   text;
  v_hash text;
begin
  if coalesce(p_site, '') !~ '^[a-z0-9-]{1,32}$'
     or coalesce(p_voter, '') !~ '^[A-Za-z0-9_-]{8,64}$'
     or p_stars is null or p_stars not between 1 and 5 then
    raise exception 'invalid rating';
  end if;
  v_ip := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  v_hash := case when v_ip = '' then null else md5(v_ip) end;
  if v_hash is not null and (
    select count(*) from app_ratings r where r.ip_hash = v_hash and r.updated_at > now() - interval '1 minute'
  ) >= 20 then
    raise exception 'rate limited';
  end if;
  insert into app_ratings (site, voter, stars, ip_hash)
  values (p_site, md5(p_voter), p_stars, v_hash)
  on conflict (site, voter) do update
    set stars = excluded.stars, ip_hash = excluded.ip_hash, updated_at = now();
  return query
    select r.site, round(avg(r.stars)::numeric, 1), count(*)::bigint
      from app_ratings r where r.site = p_site group by r.site;
end;
$$;

-- 포털 카드용: 앱별 참여 수 + 평균 별점 + 평가 수
create or replace function public.app_summary()
returns table (site_id text, plays bigint, avg_stars numeric, votes bigint)
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
  )
  select coalesce(p.site, r.site), coalesce(p.plays, 0), r.avg_stars, coalesce(r.votes, 0)
    from p full join r on r.site = p.site;
$$;

-- ---------------------------------------------------------------
-- 투표 (밸런스 게임 등): 질문(qid)별 선택지(opt) 합계만 저장
-- ---------------------------------------------------------------
create table if not exists public.poll_counts (
  poll text     not null check (poll ~ '^[a-z0-9-]{1,32}$'),
  qid  text     not null check (qid ~ '^[a-z0-9_-]{1,32}$'),
  opt  smallint not null check (opt between 0 and 9),
  n    bigint   not null default 0,
  primary key (poll, qid, opt)
);
alter table public.poll_counts enable row level security;
revoke all on public.poll_counts from anon, authenticated;

create or replace function public.poll_vote(p_poll text, p_qid text, p_opt int)
returns table (option smallint, votes bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(p_poll, '') !~ '^[a-z0-9-]{1,32}$' or coalesce(p_qid, '') !~ '^[a-z0-9_-]{1,32}$'
     or p_opt is null or p_opt not between 0 and 9 then
    raise exception 'invalid vote';
  end if;
  -- 질문 수가 끝없이 늘어나는 것을 막는다 (투표 하나당 질문 500개까지)
  if not exists (select 1 from poll_counts c where c.poll = p_poll and c.qid = p_qid)
     and (select count(distinct c.qid) from poll_counts c where c.poll = p_poll) >= 500 then
    raise exception 'too many questions';
  end if;
  insert into poll_counts (poll, qid, opt, n) values (p_poll, p_qid, p_opt, 1)
  on conflict (poll, qid, opt) do update set n = poll_counts.n + 1;
  return query select c.opt, c.n from poll_counts c where c.poll = p_poll and c.qid = p_qid order by c.opt;
end;
$$;

create or replace function public.poll_results(p_poll text)
returns table (qid text, option smallint, votes bigint)
language sql
stable
security definer
set search_path = public
as $$
  select c.qid, c.opt, c.n from poll_counts c where c.poll = p_poll order by c.qid, c.opt;
$$;

-- ---------------------------------------------------------------
-- 점수 분포 (반응속도 등): 게임별 구간(bucket)마다 인원 수 → 클라이언트가 상위 N% 계산
-- ---------------------------------------------------------------
create table if not exists public.score_hist (
  game   text   not null check (game ~ '^[a-z0-9-]{1,32}$'),
  bucket int    not null check (bucket between 0 and 100000),
  n      bigint not null default 0,
  primary key (game, bucket)
);
alter table public.score_hist enable row level security;
revoke all on public.score_hist from anon, authenticated;

create or replace function public.submit_score(p_game text, p_bucket int)
returns table (score_bucket int, players bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(p_game, '') !~ '^[a-z0-9-]{1,32}$' or p_bucket is null or p_bucket not between 0 and 100000 then
    raise exception 'invalid score';
  end if;
  if not exists (select 1 from score_hist h where h.game = p_game and h.bucket = p_bucket)
     and (select count(*) from score_hist h where h.game = p_game) >= 2000 then
    raise exception 'too many buckets';
  end if;
  insert into score_hist (game, bucket, n) values (p_game, p_bucket, 1)
  on conflict (game, bucket) do update set n = score_hist.n + 1;
  return query select h.bucket, h.n from score_hist h where h.game = p_game order by h.bucket;
end;
$$;

create or replace function public.score_distribution(p_game text)
returns table (score_bucket int, players bigint)
language sql
stable
security definer
set search_path = public
as $$
  select h.bucket, h.n from score_hist h where h.game = p_game order by h.bucket;
$$;

-- 권한: 공개는 함수 실행만
revoke all on function public.rate_app(text, text, int) from public;
revoke all on function public.app_summary() from public;
revoke all on function public.poll_vote(text, text, int) from public;
revoke all on function public.poll_results(text) from public;
revoke all on function public.submit_score(text, int) from public;
revoke all on function public.score_distribution(text) from public;
grant execute on function public.rate_app(text, text, int) to anon, authenticated;
grant execute on function public.app_summary() to anon, authenticated;
grant execute on function public.poll_vote(text, text, int) to anon, authenticated;
grant execute on function public.poll_results(text) to anon, authenticated;
grant execute on function public.submit_score(text, int) to anon, authenticated;
grant execute on function public.score_distribution(text) to anon, authenticated;
