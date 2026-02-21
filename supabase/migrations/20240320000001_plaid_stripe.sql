-- Create table for storing bank accounts linked via Plaid
create table public.bank_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plaid_item_id text unique not null,
  plaid_access_token text not null, -- Consider encrypting this in production!
  institution_name text not null,
  status text default 'active' check (status in ('active', 'error', 'disconnected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for storing Plaid transactions (quests/xp events)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.bank_accounts(id) on delete cascade not null,
  plaid_transaction_id text unique not null,
  amount numeric(10, 2) not null,
  date date not null,
  name text not null,
  merchant_name text,
  category text[],
  pending boolean default false,
  xp_awarded integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add Stripe customer ID and subscription status to profiles
alter table public.profiles
add column stripe_customer_id text unique,
add column subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
add column subscription_tier text default 'free';

-- RLS for Bank Accounts
alter table public.bank_accounts enable row level security;
create policy "Users can view own bank accounts." on bank_accounts for select using (auth.uid() = user_id);
create policy "Users can update own bank accounts." on bank_accounts for update using (auth.uid() = user_id);
create policy "Users can insert own bank accounts." on bank_accounts for insert with check (auth.uid() = user_id);

-- RLS for Transactions
alter table public.transactions enable row level security;
create policy "Users can view own transactions." on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions." on transactions for insert with check (auth.uid() = user_id);
