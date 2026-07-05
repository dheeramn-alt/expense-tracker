-- House Building Income & Expense Tracker
-- Initial production migration.

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.persons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('person', 'bank', 'vendor', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(name, type)
);

create table public.payment_modes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null,
  type text not null check (type in ('income', 'expense')),
  category_id uuid not null references public.categories(id),
  amount numeric(14,2) not null check (amount > 0),
  person_id uuid not null references public.persons(id),
  counterparty text not null,
  payment_mode_id uuid references public.payment_modes(id),
  description text,
  attachment_url text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_date_idx on public.transactions(transaction_date desc);
create index transactions_type_idx on public.transactions(type);
create index transactions_category_idx on public.transactions(category_id);
create index transactions_person_idx on public.transactions(person_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger persons_updated_at before update on public.persons
for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger transactions_updated_at before update on public.transactions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.persons enable row level security;
alter table public.categories enable row level security;
alter table public.payment_modes enable row level security;
alter table public.transactions enable row level security;

create policy "Authenticated users can read profiles" on public.profiles for select to authenticated using (true);
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Authenticated users manage persons" on public.persons for all to authenticated using (true) with check (true);
create policy "Authenticated users manage categories" on public.categories for all to authenticated using (true) with check (true);
create policy "Authenticated users manage payment modes" on public.payment_modes for all to authenticated using (true) with check (true);
create policy "Authenticated users manage transactions" on public.transactions for all to authenticated using (true) with check (true);

insert into public.persons (name, type) values
  ('Dheeraj', 'person'), ('Deepika', 'person'), ('Bank', 'bank'), ('Other', 'other')
on conflict do nothing;

insert into public.payment_modes (name) values
  ('Cash'), ('UPI'), ('Bank Transfer'), ('Cheque'), ('Loan'), ('Other')
on conflict do nothing;

insert into public.categories (name, type) values
  ('Land', 'expense'), ('Foundation', 'expense'), ('Cement', 'expense'),
  ('Sand', 'expense'), ('Metal', 'expense'), ('Steel', 'expense'),
  ('Bricks / Blocks', 'expense'), ('Labour', 'expense'), ('Mason', 'expense'),
  ('Carpenter', 'expense'), ('Electrician', 'expense'), ('Plumbing', 'expense'),
  ('Tiles', 'expense'), ('Paint', 'expense'), ('Wood', 'expense'),
  ('Doors & Windows', 'expense'), ('Roofing', 'expense'),
  ('Electrical Materials', 'expense'), ('Plumbing Materials', 'expense'),
  ('Transport', 'expense'), ('Food / Tea / Daily Site Expense', 'expense'),
  ('Permit / Legal', 'expense'), ('Other', 'expense'),
  ('Bank Loan', 'income'), ('Personal Savings', 'income'),
  ('Family Support', 'income'), ('Other Income', 'income')
on conflict do nothing;
