-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  role text check (role in ('student', 'faculty', 'admin')),
  email text,
  phone text,
  course text,
  academic_year text,
  department text,
  address text,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Optional: Create a procedure to handle new user signups via trigger (advanced)
-- For now, we are inserting the profile manually from the client side for simplicity
