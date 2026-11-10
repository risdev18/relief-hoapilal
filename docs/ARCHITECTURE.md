# RELIF HOSPITAL — Architecture

## Overview

RELIF HOSPITAL is a full-stack hospital management platform and public website. It is a portfolio demo showcasing premium design and working backend functionality.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React/Vite)                        │
│                                                                   │
│  Public Site    Patient Portal    Doctor Portal    Admin Portal   │
│  Reception Portal    Design System (/design-system)              │
│                                                                   │
│  ┌────────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Services  │  │ Context  │  │    Hooks     │  │  Utils   │  │
│  └────────────┘  └──────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                     Firebase SDK
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE BACKEND                            │
│                                                                   │
│  Auth    Firestore    Storage    Cloud Functions                  │
│  (Emulator Suite for local dev)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
relief-hospital/
├── src/
│   ├── components/
│   │   ├── ui/              # Design system components
│   │   ├── layout/          # Header, Footer, EmergencyStrip, etc.
│   │   ├── sections/        # Page sections (Hero, Departments, etc.)
│   │   ├── portals/         # Portal-specific components
│   │   └── shared/          # Cross-cutting components
│   ├── pages/
│   │   ├── public/          # Public-facing pages
│   │   ├── patient/         # Patient portal pages
│   │   ├── doctor/          # Doctor portal pages
│   │   ├── reception/       # Reception portal pages
│   │   ├── admin/           # Admin dashboard pages
│   │   └── design-system/   # Component showcase
│   ├── layouts/             # Page layout wrappers
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── services/            # Firebase service layer
│   ├── api/                 # API client (Cloud Functions)
│   ├── i18n/
│   │   └── locales/
│   │       ├── en/
│   │       ├── hi/
│   │       └── mr/
│   ├── types/               # TypeScript interfaces
│   ├── validation/          # Zod schemas
│   ├── utils/               # Helpers
│   ├── assets/              # Images, SVGs
│   ├── config/              # App config, constants
│   └── styles/
│       ├── tokens.css       # CSS custom properties
│       └── globals.css      # Global styles
├── functions/               # Firebase Cloud Functions
│   └── src/
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   └── firestore.indexes.json
├── scripts/
│   ├── seed.ts              # Demo data seeder
│   └── reset-demo.ts        # Demo data reset
├── docs/
│   ├── ARCHITECTURE.md      # This file
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── DECISIONS.md
│   └── PROGRESS.md
├── public/
└── ...config files
```

## Routing Structure

### Public Routes
- `/` — Landing page
- `/departments` — All departments index
- `/departments/:slug` — Department detail
- `/centres-of-excellence` — CoE index
- `/centres-of-excellence/:slug` — CoE detail
- `/doctors` — Doctor directory
- `/doctors/:slug` — Doctor profile
- `/treatments` — Treatments index
- `/treatments/:slug` — Treatment detail
- `/facilities` — Facilities page
- `/gallery` — Gallery & virtual tour
- `/branches` — Multi-branch page
- `/branches/:slug` — Branch detail
- `/emergency` — Emergency page
- `/insurance` — Insurance & billing
- `/diagnostics` — Diagnostics index
- `/diagnostics/book` — Diagnostics booking
- `/pharmacy` — Pharmacy page
- `/international` — International desk
- `/visitor-information` — Visitor info
- `/health-library` — Articles & resources
- `/health-library/:slug` — Article detail
- `/health-tools/:tool` — Health calculators
- `/about` — About page
- `/contact` — Contact page
- `/careers` — Careers index
- `/careers/:id` — Job detail
- `/legal/:page` — Privacy, terms, etc.
- `/faqs` — FAQs
- `/design-system` — Component showcase

### Auth Routes
- `/auth/login` — Login
- `/auth/register` — Registration
- `/auth/forgot-password` — Password reset
- `/auth/verify-otp` — OTP verification

### Patient Portal
- `/patient/dashboard` — Overview
- `/patient/appointments` — All appointments
- `/patient/records` — Medical records
- `/patient/billing` — Bills & payments
- `/patient/profile` — Profile management
- `/patient/family` — Family profiles
- `/patient/notifications` — Notifications

### Doctor Portal
- `/doctor/dashboard` — Day overview
- `/doctor/schedule` — Schedule management
- `/doctor/patients` — Patient records (authorized)
- `/doctor/appointments` — Appointment management
- `/doctor/leaves` — Leave requests

### Reception Portal
- `/reception/dashboard` — Queue & check-in
- `/reception/register` — Patient registration
- `/reception/appointments` — Appointment management
- `/reception/reports` — Daily reports

### Admin Dashboard
- `/admin/dashboard` — Overview
- `/admin/doctors` — Doctor management
- `/admin/departments` — Department management
- `/admin/appointments` — All appointments
- `/admin/patients` — Patient management
- `/admin/cms/*` — Content management
- `/admin/analytics` — Reports & analytics
- `/admin/settings/*` — System settings

### Booking
- `/book` — Multi-step booking wizard

## Data Flow

```
User Action → Service Layer → Firebase SDK → Firestore/Storage/Functions
                                   ↑
                           Firestore Security Rules
                                   ↑
                           Server-side validation
```

## Security Model

- Firebase Auth for identity
- Custom claims for roles (patient, doctor, receptionist, admin, super_admin)
- Firestore rules enforce access per collection
- Storage rules enforce access per path
- Cloud Functions validate all mutations
- Client-side route guards as UX convenience, NOT security

