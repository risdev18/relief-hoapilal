// Landing Page — assembles all homepage sections

import React from 'react';
import { HeroSection }                  from '@/components/sections/HeroSection';
import { StatsSection }                 from '@/components/sections/StatsSection';
import { HowItWorksSection }            from '@/components/sections/HowItWorksSection';
import { DepartmentsSection }           from '@/components/sections/DepartmentsSection';
import { CoESection }                   from '@/components/sections/CoESection';
import { FacilitiesSection }            from '@/components/sections/FacilitiesSection';
import { DoctorsSection }               from '@/components/sections/DoctorsSection';
import {
  PatientServicesSection,
  TrustSection,
  ClosingCTASection,
} from '@/components/sections/CTASections';
import { HealthLibraryTeaser }          from '@/components/sections/HealthLibraryTeaser';

export function LandingPage() {
  return (
    <>
      {/* Hero — The Care Concierge & Luxury Proportions */}
      <HeroSection />

      {/* Hospital Key Clinical Statistics */}
      <StatsSection />

      {/* How it works — 4 calm steps */}
      <HowItWorksSection />

      {/* Departments — The Index */}
      <DepartmentsSection />

      {/* Centres of Excellence — 6 Pinnacle Disciplines */}
      <CoESection />

      {/* Hospital Facilities & Robotic Technology */}
      <FacilitiesSection />

      {/* Doctors — Meet the people with INR OPD Fees */}
      <DoctorsSection />

      {/* Patient services */}
      <PatientServicesSection />

      {/* Trust, Patient Testimonials & Accreditations */}
      <TrustSection />

      {/* Health Library teaser */}
      <HealthLibraryTeaser />

      {/* Closing CTA */}
      <ClosingCTASection />
    </>
  );
}

