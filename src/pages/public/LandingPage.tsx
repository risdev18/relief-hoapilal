// Landing Page — assembles all homepage sections cleanly with zero demo data

import React from 'react';
import { HeroSection }                  from '@/components/sections/HeroSection';
import { StatsSection }                 from '@/components/sections/StatsSection';
import { HowItWorksSection }            from '@/components/sections/HowItWorksSection';
import { DepartmentsSection }           from '@/components/sections/DepartmentsSection';
import { CoESection }                   from '@/components/sections/CoESection';
import { FacilitiesSection }            from '@/components/sections/FacilitiesSection';
import { DoctorsSection }               from '@/components/sections/DoctorsSection';
import { PatientStoriesSection }        from '@/components/sections/PatientStoriesSection';
import {
  PatientServicesSection,
  CentresMapSection,
  FAQSection,
  ClosingCTASection,
} from '@/components/sections/CTASections';
import { HealthLibraryTeaser }          from '@/components/sections/HealthLibraryTeaser';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <DepartmentsSection />
      <CoESection />
      <FacilitiesSection />
      <DoctorsSection />
      <PatientStoriesSection />
      <PatientServicesSection />
      <CentresMapSection />
      <HealthLibraryTeaser />
      <FAQSection />
      <ClosingCTASection />
    </>
  );
}
