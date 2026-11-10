// Landing Page — assembles all homepage sections

import React from 'react';
import { HeroSection }                  from '@/components/sections/HeroSection';
import { HowItWorksSection }            from '@/components/sections/HowItWorksSection';
import { DepartmentsSection }           from '@/components/sections/DepartmentsSection';
import { DoctorsSection }               from '@/components/sections/DoctorsSection';
import {
  PatientServicesSection,
  TrustSection,
  ClosingCTASection,
} from '@/components/sections/CTASections';
import { CoESection }                   from '@/components/sections/CoESection';
import { HealthLibraryTeaser }          from '@/components/sections/HealthLibraryTeaser';

export function LandingPage() {
  return (
    <>
      {/* Hero — The Care Concierge */}
      <HeroSection />

      {/* How it works — 4 calm steps */}
      <HowItWorksSection />

      {/* Departments — The Index */}
      <DepartmentsSection />

      {/* Centres of Excellence — horizontal cinematic scroll */}
      <CoESection />

      {/* Doctors — Meet the people */}
      <DoctorsSection />

      {/* Patient services */}
      <PatientServicesSection />

      {/* Trust, honestly */}
      <TrustSection />

      {/* Health Library teaser */}
      <HealthLibraryTeaser />

      {/* Closing CTA */}
      <ClosingCTASection />
    </>
  );
}

