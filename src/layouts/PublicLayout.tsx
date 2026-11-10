// Public layout — Header + Footer + Emergency Strip + Mobile bar + Assistant

import React from 'react';
import { Outlet } from 'react-router-dom';
import { EmergencyStrip } from '@/components/layout/EmergencyStrip';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomBar, AskRelifBubble } from '@/components/layout/MobileBar';
import { DemoBanner } from '@/components/layout/DemoBanner';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Demo banner — always visible in demo mode */}
      <DemoBanner />
      
      {/* Emergency strip — ALWAYS at top, never hidden */}
      <EmergencyStrip />
      
      {/* Sticky header */}
      <Header />
      
      {/* Page content */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile sticky bottom bar */}
      <MobileBottomBar />
      
      {/* Floating AI assistant */}
      <AskRelifBubble />
    </div>
  );
}

