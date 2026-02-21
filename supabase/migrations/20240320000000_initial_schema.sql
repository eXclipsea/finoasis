-- Create a trigger function that automatically creates a profile for new users
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

  insert into public.cities (user_id, name, population, happiness, funds)
  values (new.id, 'New Metropolis', 100, 100, 0);

  return new;
end;
$$;

-- Create users profile table
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  level integer default 1,
  current_xp integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pets table (Tamagotchi model)
create table public.pets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  stage text check (stage in ('egg', 'baby', 'teen', 'adult', 'mythical')) default 'egg',
  happiness integer default 100 check (happiness >= 0 and happiness <= 100),
  health integer default 100 check (health >= 0 and health <= 100),
  last_fed_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create cities table (Base Builder model)
create table public.cities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  population integer default 100,
  happiness integer default 100 check (happiness >= 0 and happiness <= 100),
  funds numeric(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create buildings table (Unlocked buildings in the city)
create table public.buildings (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references public.cities(id) on delete cascade not null,
  building_type text not null,
  level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.cities enable row level security;
alter table public.buildings enable row level security;

-- Create policies
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Users can view own pet." on pets for select using (auth.uid() = user_id);
create policy "Users can update own pet." on pets for update using (auth.uid() = user_id);

create policy "Users can view own city." on cities for select using (auth.uid() = user_id);
create policy "Users can update own city." on cities for update using (auth.uid() = user_id);

create policy "Users can view own buildings." on buildings for select using (
  exists (select 1 from cities where cities.id = buildings.city_id and cities.user_id = auth.uid())
);
