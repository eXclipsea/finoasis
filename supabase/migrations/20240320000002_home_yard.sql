-- Drop old city theme tables
drop table if exists public.buildings;
drop table if exists public.cities;

-- Create yards table
create table public.yards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'My Cozy Oasis',
  coins numeric(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create furniture table (items bought and placed in the yard)
create table public.furniture (
  id uuid default uuid_generate_v4() primary key,
  yard_id uuid references public.yards(id) on delete cascade not null,
  item_type text not null, -- e.g., 'bench', 'fountain', 'lantern'
  position_x integer default 0,
  position_y integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create plants table
create table public.plants (
  id uuid default uuid_generate_v4() primary key,
  yard_id uuid references public.yards(id) on delete cascade not null,
  plant_type text not null, -- e.g., 'sunflower', 'bonsai', 'oak_tree'
  stage text check (stage in ('seed', 'sprout', 'growing', 'blooming')) default 'seed',
  position_x integer default 0,
  position_y integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Update the handle_new_user trigger to create a yard instead of a city
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, level, current_xp)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url', 1, 0);

  insert into public.pets (user_id, name, stage, happiness, health)
  values (new.id, 'Coin Critter', 'egg', 100, 100);

  insert into public.yards (user_id, name, coins)
  values (new.id, 'My Cozy Oasis', 0);

  return new;
end;
$$;

-- Enable RLS
alter table public.yards enable row level security;
alter table public.furniture enable row level security;
alter table public.plants enable row level security;

-- Create policies
create policy "Users can view own yard." on yards for select using (auth.uid() = user_id);
create policy "Users can update own yard." on yards for update using (auth.uid() = user_id);

create policy "Users can view own furniture." on furniture for select using (
  exists (select 1 from yards where yards.id = furniture.yard_id and yards.user_id = auth.uid())
);
create policy "Users can insert own furniture." on furniture for insert with check (
  exists (select 1 from yards where yards.id = yard_id and yards.user_id = auth.uid())
);
create policy "Users can update own furniture." on furniture for update using (
  exists (select 1 from yards where yards.id = furniture.yard_id and yards.user_id = auth.uid())
);

create policy "Users can view own plants." on plants for select using (
  exists (select 1 from yards where yards.id = plants.yard_id and yards.user_id = auth.uid())
);
create policy "Users can insert own plants." on plants for insert with check (
  exists (select 1 from yards where yards.id = yard_id and yards.user_id = auth.uid())
);
create policy "Users can update own plants." on plants for update using (
  exists (select 1 from yards where yards.id = plants.yard_id and yards.user_id = auth.uid())
);
