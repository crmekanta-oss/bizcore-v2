-- Run this in your Supabase SQL editor

create table if not exists sales_entries (
  id bigint generated always as identity primary key,
  date text, client text, product text,
  qty int, amount numeric, status text,
  created_at timestamptz default now()
);

create table if not exists inventory (
  id bigint generated always as identity primary key,
  name text, category text, units int, unit text,
  reorder int, cost numeric, status text,
  created_at timestamptz default now()
);

create table if not exists supplier_payments (
  id bigint generated always as identity primary key,
  supplier text, invoice text, amount numeric,
  due text, paid_on text, status text,
  created_at timestamptz default now()
);

create table if not exists receivables (
  id bigint generated always as identity primary key,
  client text, invoice text, amount numeric,
  due text, status text,
  created_at timestamptz default now()
);

create table if not exists fabric_orders (
  id bigint generated always as identity primary key,
  fabric text, qty text, supplier text,
  order_date text, delivery text, amount numeric, status text,
  created_at timestamptz default now()
);

create table if not exists google_ads (
  id bigint generated always as identity primary key,
  campaign text, budget numeric, spend numeric,
  clicks int, impressions int, conversions int,
  revenue numeric, status text,
  created_at timestamptz default now()
);

create table if not exists meta_ads (
  id bigint generated always as identity primary key,
  campaign text, budget numeric, spend numeric,
  reach int, impressions int, conversions int,
  revenue numeric, status text,
  created_at timestamptz default now()
);

create table if not exists communication_ads (
  id bigint generated always as identity primary key,
  campaign text, budget numeric, spend numeric,
  clicks int, impressions int, conversions int,
  revenue numeric, status text, type text,
  created_at timestamptz default now()
);

create table if not exists team_members (
  id bigint generated always as identity primary key,
  name text,
  email text unique,
  role text,
  status text,
  auth_user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table sales_entries;
alter publication supabase_realtime add table inventory;
alter publication supabase_realtime add table supplier_payments;
alter publication supabase_realtime add table receivables;
alter publication supabase_realtime add table fabric_orders;
alter publication supabase_realtime add table google_ads;
alter publication supabase_realtime add table meta_ads;
alter publication supabase_realtime add table communication_ads;
alter publication supabase_realtime add table team_members;

-- Disable RLS for all tables to allow public CRUD (for testing/development)
alter table sales_entries disable row level security;
alter table inventory disable row level security;
alter table supplier_payments disable row level security;
alter table receivables disable row level security;
alter table fabric_orders disable row level security;
alter table google_ads disable row level security;
alter table meta_ads disable row level security;
alter table communication_ads disable row level security;
alter table team_members disable row level security;
