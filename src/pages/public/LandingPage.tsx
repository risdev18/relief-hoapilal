// Landing Page — streamlined, high-impact homepage with Patient Stories card at the start

import React from 'react';
import { HeroSection }           from '@/components/sections/HeroSection';
import { PatientStoriesSection } from '@/components/sections/PatientStoriesSection';
import { StatsSection }          from '@/components/sections/StatsSection';
import { DepartmentsSection }    from '@/components/sections/DepartmentsSection';
import { DoctorsSection }        from '@/components/sections/DoctorsSection';
import {
  CentresMapSection,
  ClosingCTASection,
} from '@/components/sections/CTASections';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <PatientStoriesSection />
      <StatsSection />
      <DepartmentsSection />
      <DoctorsSection />
      <CentresMapSection />
      <ClosingCTASection />
    </>
  );
}
