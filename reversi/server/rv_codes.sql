-- お誘いの番号（2026-11-26 あまねさん「LINEでお誘い用番号を発行して、それを入力したらつながる」）
-- 招待した人ごとに 6けたの番号を 1つ（24時間 有効・何人でも使える）。中継（rv-push, service_role）だけが読み書きする
create table if not exists public.rv_codes (
  code text primary key check (code ~ '^[0-9]{6}$'),
  host_id text not null,
  name text not null default '',
  at timestamptz not null default now()
);
create index if not exists rv_codes_host on public.rv_codes (host_id, at desc);
-- まちがった番号の 記録（当てずっぽう よけ：通信元ごとに 1時間 20回まで）
create table if not exists public.rv_code_tries (
  id bigserial primary key,
  ip text not null default '',
  at timestamptz not null default now()
);
create index if not exists rv_code_tries_ip on public.rv_code_tries (ip, at desc);
alter table public.rv_codes enable row level security;
alter table public.rv_code_tries enable row level security;
revoke all on public.rv_codes from anon, authenticated;
revoke all on public.rv_code_tries from anon, authenticated;

-- 2026-11-26：中継（service_role）に 読み書きを許す（はじめ これが なく 番号が 出せなかった）
grant select, insert, update, delete on public.rv_codes to service_role;
grant select, insert, update, delete on public.rv_code_tries to service_role;
grant usage, select on sequence public.rv_code_tries_id_seq to service_role;
