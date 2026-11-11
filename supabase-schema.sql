-- ============================================================================
-- Relif Care Multispecialty — Production Supabase Schema, RLS, Storage & RPCs
-- Execute in Supabase SQL Editor (Dashboard -> SQL Editor -> New query -> Run)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. Helper Role & Auth Functions ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.generate_uhid()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  candidate text;
BEGIN
  candidate := 'RH' || to_char(now(), 'YY') || '-' || lpad((floor(random() * 90000) + 10000)::int::text, 5, '0');
  RETURN candidate;
END;
$$;

-- ── 2. Profiles (Patients, Doctors, Reception, Admins) ───────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id                uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             text UNIQUE,
  phone             text,
  full_name         text NOT NULL DEFAULT '',
  uhid              text UNIQUE NOT NULL DEFAULT public.generate_uhid(),
  abha_id           text,
  dob               text,
  gender            text,
  blood_group       text,
  emergency_contact text,
  address           text,
  city              text DEFAULT 'Mumbai',
  role              text NOT NULL DEFAULT 'patient'
                    CHECK (role IN ('patient', 'admin', 'doctor', 'reception')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Auto-create profile when user signs up via Supabase Auth (Password or OTP)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_phone text;
  v_uhid text;
BEGIN
  v_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(COALESCE(new.email, 'patient'), '@', 1)
  );
  v_phone := COALESCE(new.raw_user_meta_data->>'phone', new.phone);
  v_uhid := COALESCE(new.raw_user_meta_data->>'uhid', public.generate_uhid());

  INSERT INTO public.profiles (id, email, phone, full_name, uhid, abha_id, dob, gender, blood_group, role)
  VALUES (
    new.id,
    new.email,
    v_phone,
    v_name,
    v_uhid,
    new.raw_user_meta_data->>'abha_id',
    new.raw_user_meta_data->>'dob',
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'blood_group',
    'patient'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Prevent client-side role self-escalation (only SQL Editor / service_role or existing admins can assign roles)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.role := 'patient';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_trigger ON public.profiles;
CREATE TRIGGER protect_profile_role_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ── 3. Master Hospital Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.branches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  short_name  text NOT NULL,
  address     text NOT NULL,
  city        text NOT NULL,
  phone       text NOT NULL,
  emergency_phone text NOT NULL,
  email       text NOT NULL,
  timings     text NOT NULL DEFAULT 'Open 24/7 (OPD: 8:00 AM – 8:00 PM)',
  lat         numeric(9,6) NOT NULL,
  lng         numeric(9,6) NOT NULL,
  is_main     boolean NOT NULL DEFAULT false,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name             text NOT NULL,
  name_hi          text,
  name_mr          text,
  description      text NOT NULL,
  icon             text NOT NULL DEFAULT 'Heart',
  symptom_keywords text[] NOT NULL DEFAULT '{}',
  sort_order       int NOT NULL DEFAULT 1,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text UNIQUE NOT NULL,
  name                text NOT NULL,
  designation         text NOT NULL,
  specialty           text NOT NULL,
  department_id       uuid NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  branch_id           uuid NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
  bio                 text NOT NULL,
  qualifications      text[] NOT NULL DEFAULT '{}',
  specialities        text[] NOT NULL DEFAULT '{}',
  languages           text[] NOT NULL DEFAULT ARRAY['English', 'Hindi'],
  experience_years    int NOT NULL DEFAULT 10,
  photo_url           text,
  registration_number text NOT NULL,
  fee_in_clinic       int NOT NULL CHECK (fee_in_clinic >= 0),
  fee_video           int NOT NULL CHECK (fee_video >= 0),
  consultation_types  text[] NOT NULL DEFAULT ARRAY['in-person', 'video'],
  availability        text NOT NULL DEFAULT 'available'
                      CHECK (availability IN ('available', 'soon', 'away')),
  opd_timings         text NOT NULL DEFAULT '10:00 AM – 02:00 PM',
  opd_days            text NOT NULL DEFAULT 'Mon – Sat',
  rating              numeric(2,1) NOT NULL DEFAULT 4.8,
  review_count        int NOT NULL DEFAULT 0,
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_schedules (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id          uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  branch_id          uuid NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  day_of_week        int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time         time NOT NULL,
  end_time           time NOT NULL,
  slot_duration_mins int NOT NULL DEFAULT 30,
  consultation_type  text NOT NULL DEFAULT 'in-person'
                     CHECK (consultation_type IN ('in-person', 'video')),
  is_active          boolean NOT NULL DEFAULT true,
  UNIQUE (doctor_id, day_of_week, start_time, consultation_type)
);

CREATE TABLE IF NOT EXISTS public.slots (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id         uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  branch_id         uuid NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  slot_date         date NOT NULL,
  slot_time         text NOT NULL,
  consultation_type text NOT NULL DEFAULT 'in-person'
                    CHECK (consultation_type IN ('in-person', 'video')),
  is_booked         boolean NOT NULL DEFAULT false,
  is_blocked        boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (doctor_id, slot_date, slot_time, consultation_type)
);

-- ── 4. Transactional Tables (Appointments, Payments, Cancellations) ─────────

CREATE TABLE IF NOT EXISTS public.appointments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref       text UNIQUE NOT NULL,
  patient_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name      text NOT NULL,
  patient_email     text,
  patient_phone     text NOT NULL,
  doctor_id         uuid NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
  department_id     uuid NOT NULL REFERENCES public.departments(id) ON DELETE RESTRICT,
  branch_id         uuid NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
  slot_id           uuid REFERENCES public.slots(id) ON DELETE SET NULL,
  appointment_date  date NOT NULL,
  appointment_time  text NOT NULL,
  consultation_type text NOT NULL CHECK (consultation_type IN ('in-person', 'video')),
  symptoms          text,
  status            text NOT NULL DEFAULT 'confirmed'
                    CHECK (status IN ('booked', 'confirmed', 'checked_in', 'completed', 'cancelled', 'rescheduled')),
  consultation_fee  int NOT NULL CHECK (consultation_fee >= 0),
  tax_amount        int NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount      int NOT NULL CHECK (total_amount >= 0),
  payment_mode      text NOT NULL CHECK (payment_mode IN ('online', 'pay_at_hospital')),
  payment_status    text NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending', 'paid', 'refund_pending', 'refunded', 'not_required')),
  cancel_reason     text,
  cancelled_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Bulletproof Double-Booking Prevention Index
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_doctor_slot
  ON public.appointments (doctor_id, appointment_date, appointment_time, consultation_type)
  WHERE status NOT IN ('cancelled', 'rescheduled');

CREATE TABLE IF NOT EXISTS public.payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id      uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gateway             text NOT NULL CHECK (gateway IN ('razorpay', 'pay_at_hospital')),
  razorpay_order_id   text,
  razorpay_payment_id text,
  razorpay_signature  text,
  receipt_number      text UNIQUE NOT NULL,
  consultation_fee    int NOT NULL,
  tax_amount          int NOT NULL DEFAULT 0,
  amount              int NOT NULL,
  currency            text NOT NULL DEFAULT 'INR',
  status              text NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'paid', 'refund_pending', 'refunded', 'failed')),
  refund_amount       int NOT NULL DEFAULT 0,
  refund_status       text NOT NULL DEFAULT 'none'
                      CHECK (refund_status IN ('none', 'pending', 'refunded')),
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cancellations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id    uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  payment_id        uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  patient_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason            text NOT NULL,
  hours_before      numeric(8,2) NOT NULL DEFAULT 0,
  refund_percentage int NOT NULL DEFAULT 0,
  refund_amount     int NOT NULL DEFAULT 0,
  refund_status     text NOT NULL DEFAULT 'none'
                    CHECK (refund_status IN ('none', 'pending', 'refunded')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Verified Reviews (only patients with completed appointments can submit)
CREATE TABLE IF NOT EXISTS public.reviews (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id            uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id           uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id       uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE UNIQUE,
  patient_display_name text NOT NULL,
  rating               int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment              text NOT NULL,
  is_verified          boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Digital Reports & Prescriptions (patient portal reads strictly own records)
CREATE TABLE IF NOT EXISTS public.reports (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id  uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  title           text NOT NULL,
  report_type     text NOT NULL CHECK (report_type IN ('lab', 'prescription', 'discharge', 'imaging')),
  doctor_name     text NOT NULL,
  department_name text NOT NULL,
  status          text NOT NULL DEFAULT 'ready' CHECK (status IN ('processing', 'ready')),
  summary         jsonb NOT NULL DEFAULT '{}'::jsonb,
  file_url        text,
  issued_at       timestamptz NOT NULL DEFAULT now()
);

-- Public Contact Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text,
  phone      text,
  subject    text,
  message    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 5. Row Level Security (RLS) ──────────────────────────────────────────────

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries        ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- Master catalog read policies (public) + admin write policies
DROP POLICY IF EXISTS "branches_public_read" ON public.branches;
CREATE POLICY "branches_public_read" ON public.branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "branches_admin_write" ON public.branches;
CREATE POLICY "branches_admin_write" ON public.branches FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "departments_public_read" ON public.departments;
CREATE POLICY "departments_public_read" ON public.departments FOR SELECT USING (true);
DROP POLICY IF EXISTS "departments_admin_write" ON public.departments;
CREATE POLICY "departments_admin_write" ON public.departments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "doctors_public_read" ON public.doctors;
CREATE POLICY "doctors_public_read" ON public.doctors FOR SELECT USING (true);
DROP POLICY IF EXISTS "doctors_admin_write" ON public.doctors;
CREATE POLICY "doctors_admin_write" ON public.doctors FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "schedules_public_read" ON public.doctor_schedules;
CREATE POLICY "schedules_public_read" ON public.doctor_schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "schedules_admin_write" ON public.doctor_schedules;
CREATE POLICY "schedules_admin_write" ON public.doctor_schedules FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "slots_public_read" ON public.slots;
CREATE POLICY "slots_public_read" ON public.slots FOR SELECT USING (true);
DROP POLICY IF EXISTS "slots_admin_write" ON public.slots;
CREATE POLICY "slots_admin_write" ON public.slots FOR ALL USING (public.is_admin());

-- Appointments policies (patient sees strictly own rows; admin sees all)
DROP POLICY IF EXISTS "appointments_select_own_or_admin" ON public.appointments;
CREATE POLICY "appointments_select_own_or_admin" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id OR public.is_admin());

DROP POLICY IF EXISTS "appointments_insert_own" ON public.appointments;
CREATE POLICY "appointments_insert_own" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id OR public.is_admin());

DROP POLICY IF EXISTS "appointments_update_own_or_admin" ON public.appointments;
CREATE POLICY "appointments_update_own_or_admin" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id OR public.is_admin());

-- Payments policies
DROP POLICY IF EXISTS "payments_select_own_or_admin" ON public.payments;
CREATE POLICY "payments_select_own_or_admin" ON public.payments
  FOR SELECT USING (auth.uid() = patient_id OR public.is_admin());

DROP POLICY IF EXISTS "payments_insert_own" ON public.payments;
CREATE POLICY "payments_insert_own" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = patient_id OR public.is_admin());

DROP POLICY IF EXISTS "payments_update_admin" ON public.payments;
CREATE POLICY "payments_update_admin" ON public.payments
  FOR UPDATE USING (public.is_admin());

-- Cancellations policies
DROP POLICY IF EXISTS "cancellations_select_own_or_admin" ON public.cancellations;
CREATE POLICY "cancellations_select_own_or_admin" ON public.cancellations
  FOR SELECT USING (auth.uid() = patient_id OR public.is_admin());

DROP POLICY IF EXISTS "cancellations_insert_own" ON public.cancellations;
CREATE POLICY "cancellations_insert_own" ON public.cancellations
  FOR INSERT WITH CHECK (auth.uid() = patient_id OR public.is_admin());

-- Reviews policies (public read, insert ONLY for verified completed appointment owner)
DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_verified_patient" ON public.reviews;
CREATE POLICY "reviews_insert_verified_patient" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = patient_id
    AND EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id
        AND a.patient_id = auth.uid()
        AND a.doctor_id = reviews.doctor_id
        AND a.status = 'completed'
    )
  );

-- Reports policies
DROP POLICY IF EXISTS "reports_select_own_or_admin" ON public.reports;
CREATE POLICY "reports_select_own_or_admin" ON public.reports
  FOR SELECT USING (auth.uid() = patient_id OR public.is_admin());
DROP POLICY IF EXISTS "reports_admin_write" ON public.reports;
CREATE POLICY "reports_admin_write" ON public.reports
  FOR ALL USING (public.is_admin());

-- Enquiries policies
DROP POLICY IF EXISTS "enquiries_public_insert" ON public.enquiries;
CREATE POLICY "enquiries_public_insert" ON public.enquiries
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "enquiries_admin_read" ON public.enquiries;
CREATE POLICY "enquiries_admin_read" ON public.enquiries
  FOR SELECT USING (public.is_admin());

-- ── 6. Storage Bucket for Doctor Photos ──────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-photos', 'doctor-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "doctor_photos_public_read" ON storage.objects;
CREATE POLICY "doctor_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'doctor-photos');

DROP POLICY IF EXISTS "doctor_photos_admin_write" ON storage.objects;
CREATE POLICY "doctor_photos_admin_write" ON storage.objects
  FOR ALL USING (bucket_id = 'doctor-photos' AND public.is_admin());

-- ── 7. Server-Side Pricing, Slot Generation & Atomic Booking RPCs ────────────

-- Generate concrete time slots from weekly doctor_schedules
CREATE OR REPLACE FUNCTION public.generate_doctor_slots(days_ahead int DEFAULT 14)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec record;
  d date;
  cur_t time;
  inserted_count int := 0;
BEGIN
  FOR d IN SELECT generate_series(current_date, current_date + days_ahead - 1, interval '1 day')::date LOOP
    FOR rec IN
      SELECT ds.*
      FROM public.doctor_schedules ds
      JOIN public.doctors doc ON doc.id = ds.doctor_id
      WHERE ds.is_active = true
        AND doc.is_active = true
        AND ds.day_of_week = EXTRACT(DOW FROM d)::int
    LOOP
      cur_t := rec.start_time;
      WHILE cur_t < rec.end_time LOOP
        INSERT INTO public.slots (doctor_id, branch_id, slot_date, slot_time, consultation_type)
        VALUES (
          rec.doctor_id,
          rec.branch_id,
          d,
          to_char(cur_t, 'HH12:MI AM'),
          rec.consultation_type
        )
        ON CONFLICT (doctor_id, slot_date, slot_time, consultation_type) DO NOTHING;

        IF FOUND THEN
          inserted_count := inserted_count + 1;
        END IF;

        cur_t := cur_t + (rec.slot_duration_mins || ' minutes')::interval;
      END LOOP;
    END LOOP;
  END LOOP;
  RETURN inserted_count;
END;
$$;

-- Server-side quote calculation (never trusts client amounts)
CREATE OR REPLACE FUNCTION public.calculate_booking_quote(
  p_doctor_id uuid,
  p_consultation_type text
)
RETURNS TABLE (
  consultation_fee int,
  tax_amount int,
  total_amount int
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_doc public.doctors%ROWTYPE;
  v_fee int;
BEGIN
  SELECT * INTO v_doc FROM public.doctors WHERE id = p_doctor_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Selected doctor is not available';
  END IF;

  v_fee := CASE WHEN p_consultation_type = 'video' THEN v_doc.fee_video ELSE v_doc.fee_in_clinic END;
  -- Healthcare consultation in India is GST-exempt (0%), video tele-platform convenience/tax 0% or explicit breakdown
  consultation_fee := v_fee;
  tax_amount := 0;
  total_amount := v_fee;
  RETURN NEXT;
END;
$$;

-- Atomic Booking RPC: validates auth user, locks slot, prevents double booking, computes fee server-side
CREATE OR REPLACE FUNCTION public.create_booking_atomic(
  p_doctor_id uuid,
  p_branch_id uuid,
  p_slot_date date,
  p_slot_time text,
  p_consultation_type text,
  p_patient_name text,
  p_patient_email text,
  p_patient_phone text,
  p_symptoms text,
  p_payment_mode text,
  p_razorpay_order_id text DEFAULT NULL,
  p_razorpay_payment_id text DEFAULT NULL,
  p_razorpay_signature text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_doc public.doctors%ROWTYPE;
  v_slot_id uuid;
  v_fee int;
  v_tax int := 0;
  v_total int;
  v_booking_ref text;
  v_receipt_no text;
  v_appt_id uuid;
  v_pay_status text;
  v_appt_status text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required to book an appointment';
  END IF;

  SELECT * INTO v_doc FROM public.doctors WHERE id = p_doctor_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Doctor not found or inactive';
  END IF;

  -- Upsert profile safety in case user signed up externally
  INSERT INTO public.profiles (id, email, phone, full_name)
  VALUES (v_uid, NULLIF(p_patient_email, ''), p_patient_phone, p_patient_name)
  ON CONFLICT (id) DO UPDATE SET
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    phone = COALESCE(public.profiles.phone, EXCLUDED.phone);

  -- Check & lock slot if it exists in slots table
  SELECT id INTO v_slot_id
  FROM public.slots
  WHERE doctor_id = p_doctor_id
    AND slot_date = p_slot_date
    AND slot_time = p_slot_time
    AND consultation_type = p_consultation_type
  FOR UPDATE;

  IF FOUND THEN
    IF EXISTS (SELECT 1 FROM public.slots WHERE id = v_slot_id AND (is_booked = true OR is_blocked = true)) THEN
      RAISE EXCEPTION 'This time slot has already been booked. Please select another slot.';
    END IF;
    UPDATE public.slots SET is_booked = true WHERE id = v_slot_id;
  ELSE
    INSERT INTO public.slots (doctor_id, branch_id, slot_date, slot_time, consultation_type, is_booked)
    VALUES (p_doctor_id, p_branch_id, p_slot_date, p_slot_time, p_consultation_type, true)
    RETURNING id INTO v_slot_id;
  END IF;

  -- Double check active appointments table
  IF EXISTS (
    SELECT 1 FROM public.appointments
    WHERE doctor_id = p_doctor_id
      AND appointment_date = p_slot_date
      AND appointment_time = p_slot_time
      AND consultation_type = p_consultation_type
      AND status NOT IN ('cancelled', 'rescheduled')
  ) THEN
    RAISE EXCEPTION 'Slot unavailable: another booking already exists for this time.';
  END IF;

  v_fee := CASE WHEN p_consultation_type = 'video' THEN v_doc.fee_video ELSE v_doc.fee_in_clinic END;
  v_total := v_fee + v_tax;
  v_booking_ref := 'REL-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
  v_receipt_no := 'RCPT-' || to_char(now(), 'YYMMDD') || '-' || lpad((floor(random() * 90000) + 10000)::int::text, 5, '0');

  IF p_payment_mode = 'online' AND p_razorpay_payment_id IS NOT NULL THEN
    v_pay_status := 'paid';
    v_appt_status := 'confirmed';
  ELSIF p_payment_mode = 'online' THEN
    v_pay_status := 'pending';
    v_appt_status := 'booked';
  ELSE
    v_pay_status := 'pending';
    v_appt_status := 'confirmed';
  END IF;

  INSERT INTO public.appointments (
    booking_ref, patient_id, patient_name, patient_email, patient_phone,
    doctor_id, department_id, branch_id, slot_id,
    appointment_date, appointment_time, consultation_type, symptoms,
    status, consultation_fee, tax_amount, total_amount,
    payment_mode, payment_status
  ) VALUES (
    v_booking_ref, v_uid, p_patient_name, NULLIF(p_patient_email, ''), p_patient_phone,
    p_doctor_id, v_doc.department_id, p_branch_id, v_slot_id,
    p_slot_date, p_slot_time, p_consultation_type, NULLIF(p_symptoms, ''),
    v_appt_status, v_fee, v_tax, v_total,
    p_payment_mode, v_pay_status
  )
  RETURNING id INTO v_appt_id;

  INSERT INTO public.payments (
    appointment_id, patient_id, gateway,
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    receipt_number, consultation_fee, tax_amount, amount, status,
    paid_at
  ) VALUES (
    v_appt_id, v_uid,
    CASE WHEN p_payment_mode = 'online' THEN 'razorpay' ELSE 'pay_at_hospital' END,
    p_razorpay_order_id, p_razorpay_payment_id, p_razorpay_signature,
    v_receipt_no, v_fee, v_tax, v_total, v_pay_status,
    CASE WHEN v_pay_status = 'paid' THEN now() ELSE NULL END
  );

  RETURN jsonb_build_object(
    'appointment_id', v_appt_id,
    'booking_ref', v_booking_ref,
    'receipt_number', v_receipt_no,
    'consultation_fee', v_fee,
    'tax_amount', v_tax,
    'total_amount', v_total,
    'payment_status', v_pay_status,
    'status', v_appt_status
  );
END;
$$;

-- Cancel appointment RPC with server-side refund rule (24h+ => 100%, 2-24h => 50%, <2h => 0%)
CREATE OR REPLACE FUNCTION public.cancel_appointment_atomic(
  p_appointment_id uuid,
  p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_appt public.appointments%ROWTYPE;
  v_pay public.payments%ROWTYPE;
  v_appt_ts timestamptz;
  v_hours_before numeric;
  v_refund_pct int;
  v_refund_amt int;
  v_refund_status text;
BEGIN
  SELECT * INTO v_appt FROM public.appointments WHERE id = p_appointment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  IF v_appt.patient_id <> v_uid AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  IF v_appt.status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Appointment cannot be cancelled in status: %', v_appt.status;
  END IF;

  -- Compute hours until appointment
  BEGIN
    v_appt_ts := (v_appt.appointment_date::text || ' ' || v_appt.appointment_time)::timestamp AT TIME ZONE 'Asia/Kolkata';
  EXCEPTION WHEN OTHERS THEN
    v_appt_ts := v_appt.appointment_date::timestamp AT TIME ZONE 'Asia/Kolkata';
  END;

  v_hours_before := GREATEST(0, EXTRACT(EPOCH FROM (v_appt_ts - now())) / 3600.0);

  IF v_hours_before >= 24 THEN
    v_refund_pct := 100;
  ELSIF v_hours_before >= 2 THEN
    v_refund_pct := 50;
  ELSE
    v_refund_pct := 0;
  END IF;

  SELECT * INTO v_pay FROM public.payments WHERE appointment_id = p_appointment_id ORDER BY created_at DESC LIMIT 1;

  IF v_pay.id IS NOT NULL AND v_pay.status = 'paid' AND v_refund_pct > 0 THEN
    v_refund_amt := ROUND((v_pay.amount * v_refund_pct) / 100.0);
    v_refund_status := 'pending';
    UPDATE public.payments
      SET status = 'refund_pending', refund_amount = v_refund_amt, refund_status = 'pending'
      WHERE id = v_pay.id;
  ELSE
    v_refund_amt := 0;
    v_refund_status := 'none';
  END IF;

  UPDATE public.appointments
    SET status = 'cancelled',
        cancel_reason = p_reason,
        cancelled_at = now(),
        payment_status = CASE WHEN v_refund_status = 'pending' THEN 'refund_pending' ELSE v_appt.payment_status END,
        updated_at = now()
    WHERE id = p_appointment_id;

  -- Immediately free slot for other patients
  IF v_appt.slot_id IS NOT NULL THEN
    UPDATE public.slots SET is_booked = false WHERE id = v_appt.slot_id;
  END IF;

  INSERT INTO public.cancellations (
    appointment_id, payment_id, patient_id, reason,
    hours_before, refund_percentage, refund_amount, refund_status
  ) VALUES (
    p_appointment_id, v_pay.id, v_appt.patient_id, p_reason,
    ROUND(v_hours_before, 2), v_refund_pct, v_refund_amt, v_refund_status
  );

  RETURN jsonb_build_object(
    'appointment_id', p_appointment_id,
    'status', 'cancelled',
    'hours_before', ROUND(v_hours_before, 2),
    'refund_percentage', v_refund_pct,
    'refund_amount', v_refund_amt,
    'refund_status', v_refund_status
  );
END;
$$;

-- Reschedule appointment RPC (same doctor, swaps locked slot cleanly, preserves paid status)
CREATE OR REPLACE FUNCTION public.reschedule_appointment_atomic(
  p_appointment_id uuid,
  p_new_date date,
  p_new_time text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_appt public.appointments%ROWTYPE;
  v_new_slot_id uuid;
BEGIN
  SELECT * INTO v_appt FROM public.appointments WHERE id = p_appointment_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  IF v_appt.patient_id <> v_uid AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  IF v_appt.status IN ('cancelled', 'completed') THEN
    RAISE EXCEPTION 'Cannot reschedule a % appointment', v_appt.status;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.appointments
    WHERE doctor_id = v_appt.doctor_id
      AND appointment_date = p_new_date
      AND appointment_time = p_new_time
      AND consultation_type = v_appt.consultation_type
      AND status NOT IN ('cancelled', 'rescheduled')
      AND id <> p_appointment_id
  ) THEN
    RAISE EXCEPTION 'Requested slot is already booked.';
  END IF;

  -- Free old slot
  IF v_appt.slot_id IS NOT NULL THEN
    UPDATE public.slots SET is_booked = false WHERE id = v_appt.slot_id;
  END IF;

  -- Claim or create new slot
  SELECT id INTO v_new_slot_id
  FROM public.slots
  WHERE doctor_id = v_appt.doctor_id
    AND slot_date = p_new_date
    AND slot_time = p_new_time
    AND consultation_type = v_appt.consultation_type
  FOR UPDATE;

  IF FOUND THEN
    UPDATE public.slots SET is_booked = true WHERE id = v_new_slot_id;
  ELSE
    INSERT INTO public.slots (doctor_id, branch_id, slot_date, slot_time, consultation_type, is_booked)
    VALUES (v_appt.doctor_id, v_appt.branch_id, p_new_date, p_new_time, v_appt.consultation_type, true)
    RETURNING id INTO v_new_slot_id;
  END IF;

  UPDATE public.appointments
    SET appointment_date = p_new_date,
        appointment_time = p_new_time,
        slot_id = v_new_slot_id,
        status = 'confirmed',
        updated_at = now()
    WHERE id = p_appointment_id;

  RETURN jsonb_build_object(
    'appointment_id', p_appointment_id,
    'appointment_date', p_new_date,
    'appointment_time', p_new_time,
    'status', 'confirmed'
  );
END;
$$;
