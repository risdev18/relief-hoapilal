-- ============================================================================
-- RELIF HOSPITAL — SUPABASE DATABASE SCHEMA INITIALIZATION
-- Run this script in your Supabase SQL Editor:
-- Dashboard > SQL Editor > New query > Paste & Run
-- ============================================================================

-- 1. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_id text unique not null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  doctor_name text not null,
  department_name text not null,
  branch_name text not null,
  appointment_date text not null,
  appointment_time text not null,
  consultation_type text not null default 'in-person',
  status text not null default 'confirmed',
  visit_reason text,
  is_new_patient boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PATIENTS TABLE (Master Patient Index)
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  uhid text unique not null,
  full_name text not null,
  phone text not null,
  email text,
  date_of_birth text,
  gender text,
  blood_group text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. DOCTORS TABLE
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  specialty text not null,
  department text not null,
  branch text not null,
  experience integer default 5,
  status text not null default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. INVOICES / BILLING TABLE
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  patient_name text not null,
  amount numeric not null default 0,
  status text not null default 'Paid',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ENQUIRIES / CONTACT TABLE
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable read & write for public demo mode
-- ============================================================================

alter table public.appointments enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.invoices enable row level security;
alter table public.enquiries enable row level security;

-- Public / Anonymous access policies (matching your anon/publishable key)
create policy "Allow anonymous read on appointments" on public.appointments for select using (true);
create policy "Allow anonymous insert on appointments" on public.appointments for insert with check (true);
create policy "Allow anonymous update on appointments" on public.appointments for update using (true);

create policy "Allow anonymous read on patients" on public.patients for select using (true);
create policy "Allow anonymous insert on patients" on public.patients for insert with check (true);

create policy "Allow anonymous read on doctors" on public.doctors for select using (true);
create policy "Allow anonymous read on invoices" on public.invoices for select using (true);
create policy "Allow anonymous insert on enquiries" on public.enquiries for insert with check (true);

