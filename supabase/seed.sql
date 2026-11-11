-- ============================================================================
-- Relif Care Multispecialty — Master Data Seed (NO Fake Patients/Bookings)
-- Seeds: 3 Branches, 8 Departments, 14 Doctors, Weekly Schedules & 14-day Slots
-- Run AFTER supabase-schema.sql in Supabase SQL Editor.
-- ============================================================================

-- ── 1. Branches (3 Hospital Centres) ─────────────────────────────────────────
INSERT INTO public.branches (slug, name, short_name, address, city, phone, emergency_phone, email, timings, lat, lng, is_main)
VALUES
  (
    'andheri',
    'Relif Care Flagship — Andheri West',
    'Andheri West',
    'Plot 42, Versova Link Road, Andheri West, Mumbai, Maharashtra 400053',
    'Mumbai',
    '+91 22 6900 1000',
    '+91 22 6900 1066',
    'andheri@relifcare.in',
    'Open 24/7 · OPD: 8:00 AM – 8:30 PM',
    19.136400, 72.829600, true
  ),
  (
    'thane',
    'Relif Care Specialty Centre — Thane West',
    'Thane West',
    'Majiwada Junction, Eastern Express Highway, Thane West, Maharashtra 400601',
    'Thane',
    '+91 22 6900 2000',
    '+91 22 6900 2066',
    'thane@relifcare.in',
    'Open 24/7 · OPD: 8:30 AM – 8:00 PM',
    19.218300, 72.978100, false
  ),
  (
    'pune',
    'Relif Care Multispecialty — Baner, Pune',
    'Baner, Pune',
    'Survey 118, Baner High Street, Pune, Maharashtra 411045',
    'Pune',
    '+91 20 6900 3000',
    '+91 20 6900 3066',
    'pune@relifcare.in',
    'Open 24/7 · OPD: 8:30 AM – 8:00 PM',
    18.559000, 73.786800, false
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  emergency_phone = EXCLUDED.emergency_phone;

-- ── 2. Departments (8 Core Multispecialty Departments) ────────────────────────
INSERT INTO public.departments (slug, name, name_hi, name_mr, description, icon, symptom_keywords, sort_order)
VALUES
  (
    'cardiology', 'Cardiology', 'हृदय रोग विभाग', 'हृदयरोग विभाग',
    'Comprehensive heart, rhythm, coronary care and preventive cardiac rehabilitation.',
    'Heart', ARRAY['chest pain', 'palpitation', 'heart', 'blood pressure', 'bp', 'angina', 'coronary', 'ecg'], 1
  ),
  (
    'neurology', 'Neurology', 'तंत्रिका विज्ञान', 'मज्जासंस्था विभाग',
    'Brain, spine, stroke unit, epilepsy, migraine and peripheral nerve specialists.',
    'Brain', ARRAY['headache', 'migraine', 'dizzy', 'dizziness', 'seizure', 'numbness', 'stroke', 'nerve', 'memory'], 2
  ),
  (
    'orthopedics', 'Orthopedics', 'अस्थि एवं जोड़ रोग', 'अस्थिरोग विभाग',
    'Robotic joint replacement, spine surgery, fracture care and sports rehabilitation.',
    'Bone', ARRAY['knee', 'back pain', 'joint', 'bone', 'fracture', 'shoulder', 'neck pain', 'arthritis', 'spine'], 3
  ),
  (
    'pediatrics', 'Pediatrics', 'बाल रोग विभाग', 'बालरोग विभाग',
    'Compassionate newborn NICU, child growth, immunizations and adolescent health.',
    'Baby', ARRAY['child', 'baby', 'kid', 'pediatric', 'infant', 'vaccination', 'child fever', 'cough'], 4
  ),
  (
    'gynecology', 'Gynecology & Obstetrics', 'स्त्री एवं प्रसूति रोग', 'स्त्रीरोग व प्रसूती',
    'High-risk obstetrics, minimally invasive gynaecology and holistic maternal care.',
    'HeartHandshake', ARRAY['pregnancy', 'period', 'pcod', 'pcos', 'gynae', 'maternity', 'women health', 'pelvic'], 5
  ),
  (
    'dermatology', 'Dermatology', 'त्वचा रोग विभाग', 'त्वचारोग विभाग',
    'Clinical dermatology, eczema, acne, allergy testing and aesthetic skin medicine.',
    'Sparkles', ARRAY['skin', 'rash', 'itching', 'acne', 'hair fall', 'allergy', 'pigmentation', 'eczema'], 6
  ),
  (
    'general-medicine', 'General Medicine', 'सामान्य चिकित्सा', 'सामान्य वैद्यकशास्त्र',
    'Primary adult physicians for fever, infections, diabetes, thyroid and annual checks.',
    'Stethoscope', ARRAY['fever', 'cold', 'cough', 'weakness', 'diabetes', 'thyroid', 'checkup', 'infection', 'fatigue'], 7
  ),
  (
    'ophthalmology', 'Ophthalmology', 'नेत्र रोग विभाग', 'नेत्ररोग विभाग',
    'Micro-incision cataract, LASIK, glaucoma, retina and paediatric vision care.',
    'Eye', ARRAY['eye', 'vision', 'blurry', 'cataract', 'red eye', 'glasses', 'retina', 'glaucoma'], 8
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_hi = EXCLUDED.name_hi,
  name_mr = EXCLUDED.name_mr,
  description = EXCLUDED.description,
  symptom_keywords = EXCLUDED.symptom_keywords;

-- ── 3. Doctors (14 Verified Specialists across 8 Departments & 3 Branches) ─────
WITH dept AS (SELECT id, slug FROM public.departments),
     br   AS (SELECT id, slug FROM public.branches)
INSERT INTO public.doctors (
  slug, name, designation, specialty, department_id, branch_id,
  bio, qualifications, specialities, languages, experience_years,
  photo_url, registration_number, fee_in_clinic, fee_video,
  consultation_types, availability, opd_timings, opd_days, rating, review_count
)
VALUES
  (
    'priya-sharma', 'Dr. Priya Sharma', 'Director & Senior Interventional Cardiologist', 'Interventional Cardiology',
    (SELECT id FROM dept WHERE slug='cardiology'), (SELECT id FROM br WHERE slug='andheri'),
    'Trained at AIIMS New Delhi and Mount Sinai, Dr. Priya Sharma leads complex coronary angioplasty, preventive cardiology and women''s heart health with calm clinical clarity.',
    ARRAY['MBBS', 'MD (Med)', 'DM (Cardiology)', 'FESC'],
    ARRAY['Coronary Angioplasty', 'Echocardiography', 'Hypertension & Lipid Clinic', 'Heart Failure Protocol'],
    ARRAY['English', 'Hindi', 'Marathi'], 15,
    '/images/doctors/dr-priya-sharma.jpg', 'MMC-2011/04/0982', 1200, 1000,
    ARRAY['in-person', 'video'], 'available', '09:30 AM – 01:30 PM', 'Mon – Sat', 4.9, 148
  ),
  (
    'vikram-rao', 'Dr. Vikram Rao', 'Senior Consultant Cardiologist & Electrophysiologist', 'Cardiac Electrophysiology',
    (SELECT id FROM dept WHERE slug='cardiology'), (SELECT id FROM br WHERE slug='thane'),
    'Specialises in cardiac rhythm disorders, pacemaker implantation and non-invasive stress imaging with transparent risk-benefit counselling.',
    ARRAY['MBBS', 'MD', 'DM (Cardiology)', 'FACC'],
    ARRAY['Arrhythmia & AFib', 'Pacemaker Clinic', '2D Echo & TMT', 'Preventive Cardiology'],
    ARRAY['English', 'Hindi', 'Marathi', 'Kannada'], 14,
    '/images/doctors/dr-vikram-rao.jpg', 'MMC-2012/07/1403', 1100, 900,
    ARRAY['in-person', 'video'], 'available', '10:00 AM – 02:00 PM', 'Mon – Sat', 4.8, 112
  ),
  (
    'sunita-desai', 'Dr. Sunita Desai', 'Head of Neurology & Stroke Unit', 'Neurology & Stroke',
    (SELECT id FROM dept WHERE slug='neurology'), (SELECT id FROM br WHERE slug='andheri'),
    'Leads acute stroke thrombolysis, intractable migraine management and neuromuscular diagnostics with an empathetic, unhurried approach.',
    ARRAY['MBBS', 'MD (Med)', 'DM (Neurology)'],
    ARRAY['Stroke & Neuro-ICU', 'Migraine & Headache', 'Epilepsy Clinic', 'Movement Disorders'],
    ARRAY['English', 'Hindi', 'Marathi', 'Gujarati'], 16,
    '/images/doctors/dr-sunita-desai.jpg', 'MMC-2010/02/0611', 1300, 1000,
    ARRAY['in-person', 'video'], 'available', '10:00 AM – 01:00 PM', 'Mon – Fri', 4.9, 96
  ),
  (
    'rohan-patwardhan', 'Dr. Rohan Patwardhan', 'Consultant Neurologist', 'Neuro-Rehab & Spine Neurology',
    (SELECT id FROM dept WHERE slug='neurology'), (SELECT id FROM br WHERE slug='pune'),
    'Focuses on vertigo, peripheral neuropathy, memory clinics and post-stroke recovery plans tailored for older adults.',
    ARRAY['MBBS', 'DNB (Neurology)', 'MNAMS'],
    ARRAY['Neuropathy & Nerve Conduction', 'Vertigo & Balance', 'Memory & Dementia', 'EEG Diagnostics'],
    ARRAY['English', 'Marathi', 'Hindi'], 11,
    '/images/doctors/dr-arun-nair.jpg', 'MMC-2015/09/3320', 950, 800,
    ARRAY['in-person', 'video'], 'soon', '04:00 PM – 07:00 PM', 'Mon – Sat', 4.8, 74
  ),
  (
    'rajesh-kulkarni', 'Dr. Rajesh Kulkarni', 'Chief of Joint Replacement & Orthopedics', 'Orthopedic Surgery',
    (SELECT id FROM dept WHERE slug='orthopedics'), (SELECT id FROM br WHERE slug='andheri'),
    'Over two decades performing robotic total knee and hip arthroplasty alongside conservative non-surgical joint preservation.',
    ARRAY['MBBS', 'MS (Ortho)', 'MCh (Ortho UK)'],
    ARRAY['Robotic Knee Replacement', 'Hip Arthroplasty', 'Sports ACL Reconstruction', 'Osteoarthritis Care'],
    ARRAY['English', 'Marathi', 'Hindi'], 20,
    '/images/doctors/dr-rajesh-kulkarni.jpg', 'MMC-2006/11/0249', 1100, 900,
    ARRAY['in-person', 'video'], 'available', '09:30 AM – 01:30 PM', 'Mon – Sat', 4.9, 184
  ),
  (
    'neha-bhatia', 'Dr. Neha Bhatia', 'Consultant Spine & Sports Orthopedic Specialist', 'Spine & Sports Medicine',
    (SELECT id FROM dept WHERE slug='orthopedics'), (SELECT id FROM br WHERE slug='thane'),
    'Treats cervical and lumbar disc disorders, scoliosis and athletic ligament injuries with structured physiotherapy-first protocols.',
    ARRAY['MBBS', 'MS (Ortho)', 'Fellowship Spine Surgery'],
    ARRAY['Slip Disc & Sciatica', 'Shoulder Arthroscopy', 'Fracture Trauma', 'Ergonomic Spine Rehab'],
    ARRAY['English', 'Hindi', 'Punjabi'], 11,
    '/images/doctors/dr-priya-sharma.jpg', 'MMC-2015/05/2118', 900, 750,
    ARRAY['in-person', 'video'], 'available', '11:00 AM – 03:00 PM', 'Mon – Sat', 4.8, 88
  ),
  (
    'ananya-joshi', 'Dr. Ananya Joshi', 'Senior Pediatrician & Neonatologist', 'Pediatrics & NICU',
    (SELECT id FROM dept WHERE slug='pediatrics'), (SELECT id FROM br WHERE slug='thane'),
    'Trusted by families across Thane and Mumbai for gentle paediatric assessments, lactation support, childhood allergies and immunization guidance.',
    ARRAY['MBBS', 'MD (Pediatrics)', 'DCH'],
    ARRAY['Newborn & NICU', 'Childhood Asthma & Allergy', 'Growth & Immunisation', 'Adolescent Nutrition'],
    ARRAY['English', 'Hindi', 'Marathi'], 12,
    '/images/doctors/dr-ananya-joshi.jpg', 'MMC-2014/03/1754', 800, 650,
    ARRAY['in-person', 'video'], 'available', '09:30 AM – 01:30 PM', 'Mon – Sat', 4.9, 165
  ),
  (
    'sameer-kamat', 'Dr. Sameer Kamat', 'Consultant Pediatrician', 'General & Developmental Pediatrics',
    (SELECT id FROM dept WHERE slug='pediatrics'), (SELECT id FROM br WHERE slug='andheri'),
    'Handles recurrent childhood fevers, respiratory infections and developmental milestone checks with clear home-care plans.',
    ARRAY['MBBS', 'DNB (Pediatrics)', 'IAP Fellow'],
    ARRAY['Pediatric Infections', 'Fever & Respiratory Care', 'Vaccination Schedules', 'School Readiness'],
    ARRAY['English', 'Hindi', 'Marathi', 'Konkani'], 9,
    '/images/doctors/dr-arun-nair.jpg', 'MMC-2017/08/4109', 750, 600,
    ARRAY['in-person', 'video'], 'available', '04:00 PM – 07:30 PM', 'Mon – Sat', 4.8, 92
  ),
  (
    'deepa-krishnan', 'Dr. Deepa Krishnan', 'Senior Obstetrician & Gynecologist', 'Obstetrics & Gynecology',
    (SELECT id FROM dept WHERE slug='gynecology'), (SELECT id FROM br WHERE slug='pune'),
    'Specialises in high-risk pregnancy management, painless delivery protocols, PCOS care and laparoscopic gynaecology.',
    ARRAY['MBBS', 'MS (OBGYN)', 'FICOG'],
    ARRAY['High-Risk Pregnancy', 'PCOS & Hormonal Balance', 'Laparoscopic Surgery', 'Menopause Clinic'],
    ARRAY['English', 'Hindi', 'Tamil', 'Marathi'], 14,
    '/images/doctors/dr-sunita-desai.jpg', 'MMC-2012/10/1988', 1000, 800,
    ARRAY['in-person', 'video'], 'available', '10:00 AM – 02:00 PM', 'Mon – Sat', 4.9, 137
  ),
  (
    'kavita-chavan', 'Dr. Kavita Chavan', 'Consultant Gynecologist', 'Maternal & Preventive Women Care',
    (SELECT id FROM dept WHERE slug='gynecology'), (SELECT id FROM br WHERE slug='andheri'),
    'Provides attentive antenatal checkups, adolescent menstrual guidance and minimally invasive cervical screening.',
    ARRAY['MBBS', 'DGO', 'DNB (OBGYN)'],
    ARRAY['Antenatal Care', 'Fertility Workup', 'Women Preventive Screening', 'Postnatal Recovery'],
    ARRAY['English', 'Marathi', 'Hindi'], 10,
    '/images/doctors/dr-ananya-joshi.jpg', 'MMC-2016/01/2741', 850, 700,
    ARRAY['in-person', 'video'], 'available', '04:00 PM – 07:00 PM', 'Mon – Sat', 4.8, 81
  ),
  (
    'meera-patel', 'Dr. Meera Patel', 'Senior Consultant Dermatologist', 'Clinical Dermatology',
    (SELECT id FROM dept WHERE slug='dermatology'), (SELECT id FROM br WHERE slug='andheri'),
    'Evidence-based management for chronic eczema, psoriasis, fungal infections, paediatric rashes and alopecia.',
    ARRAY['MBBS', 'MD (Dermatology)', 'DDVL'],
    ARRAY['Eczema & Psoriasis', 'Acne & Scar Protocol', 'Hair & Scalp Clinic', 'Patch Allergy Testing'],
    ARRAY['English', 'Gujarati', 'Hindi'], 10,
    '/images/doctors/dr-ananya-joshi.jpg', 'MMC-2016/06/2990', 850, 700,
    ARRAY['in-person', 'video'], 'available', '10:30 AM – 02:30 PM', 'Mon – Sat', 4.7, 108
  ),
  (
    'arun-nair', 'Dr. Arun Nair', 'Head of Internal Medicine', 'General & Preventive Medicine',
    (SELECT id FROM dept WHERE slug='general-medicine'), (SELECT id FROM br WHERE slug='pune'),
    'Co-ordinates complex fevers, metabolic disorders, diabetes, hypertension and executive health checks across age groups.',
    ARRAY['MBBS', 'MD (General Medicine)', 'FACP'],
    ARRAY['Diabetes & Thyroid', 'Acute Fever & Infections', 'Hypertension Care', 'Executive Health Audits'],
    ARRAY['English', 'Hindi', 'Malayalam'], 18,
    '/images/doctors/dr-arun-nair.jpg', 'MMC-2008/09/0512', 700, 550,
    ARRAY['in-person', 'video'], 'available', '09:30 AM – 01:30 PM', 'Mon – Sat', 4.9, 203
  ),
  (
    'sanjay-deshmukh', 'Dr. Sanjay Deshmukh', 'Consultant Internal Physician', 'Adult & Infectious Disease Medicine',
    (SELECT id FROM dept WHERE slug='general-medicine'), (SELECT id FROM br WHERE slug='andheri'),
    'Primary care physician focusing on dengue/malaria fever triage, post-viral recovery and comprehensive geriatric care.',
    ARRAY['MBBS', 'MD (Internal Medicine)'],
    ARRAY['Fever & Viral Triage', 'Geriatric Care', 'Preventive Immunisation', 'Chronic Disease Review'],
    ARRAY['English', 'Marathi', 'Hindi'], 13,
    '/images/doctors/dr-rajesh-kulkarni.jpg', 'MMC-2013/11/1644', 650, 500,
    ARRAY['in-person', 'video'], 'available', '04:00 PM – 08:00 PM', 'Mon – Sat', 4.8, 129
  ),
  (
    'aditi-gokhale', 'Dr. Aditi Gokhale', 'Senior Ophthalmologist & Cataract Surgeon', 'Ophthalmology & Retina',
    (SELECT id FROM dept WHERE slug='ophthalmology'), (SELECT id FROM br WHERE slug='thane'),
    'Micro-incision phaco cataract surgery, diabetic retinopathy screening, glaucoma monitoring and paediatric refraction.',
    ARRAY['MBBS', 'MS (Ophthalmology)', 'FVRS'],
    ARRAY['Painless Cataract Surgery', 'Diabetic Retina Care', 'Glaucoma Management', 'Dry Eye & Computer Vision'],
    ARRAY['English', 'Marathi', 'Hindi'], 13,
    '/images/doctors/dr-priya-sharma.jpg', 'MMC-2013/04/1825', 850, 650,
    ARRAY['in-person', 'video'], 'available', '10:00 AM – 02:00 PM', 'Mon – Sat', 4.9, 94
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  designation = EXCLUDED.designation,
  specialty = EXCLUDED.specialty,
  fee_in_clinic = EXCLUDED.fee_in_clinic,
  fee_video = EXCLUDED.fee_video,
  photo_url = EXCLUDED.photo_url,
  is_active = true;

-- ── 4. Weekly Schedules for All Active Doctors (Mon-Sat, In-Person & Video) ──
INSERT INTO public.doctor_schedules (doctor_id, branch_id, day_of_week, start_time, end_time, slot_duration_mins, consultation_type)
SELECT
  d.id,
  d.branch_id,
  dow,
  '09:30'::time,
  '13:00'::time,
  30,
  'in-person'
FROM public.doctors d
CROSS JOIN generate_series(1, 6) AS dow
ON CONFLICT (doctor_id, day_of_week, start_time, consultation_type) DO NOTHING;

INSERT INTO public.doctor_schedules (doctor_id, branch_id, day_of_week, start_time, end_time, slot_duration_mins, consultation_type)
SELECT
  d.id,
  d.branch_id,
  dow,
  '16:00'::time,
  '18:30'::time,
  30,
  'video'
FROM public.doctors d
CROSS JOIN generate_series(1, 6) AS dow
WHERE 'video' = ANY(d.consultation_types)
ON CONFLICT (doctor_id, day_of_week, start_time, consultation_type) DO NOTHING;

-- Generate slots for the next 14 days immediately
SELECT public.generate_doctor_slots(14);

