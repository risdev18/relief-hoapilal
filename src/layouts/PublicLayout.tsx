// Public layout — Header + Footer + Emergency Strip + Mobile bar + Assistant

import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { EmergencyStrip } from '@/components/layout/EmergencyStrip';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomBar, AskRelifBubble } from '@/components/layout/MobileBar';
import { RelifSpinner } from '@/components/ui';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Emergency strip — ALWAYS at top, never hidden */}
      <EmergencyStrip />
      
      {/* Sticky header */}
      <Header />
      
      {/* Page content */}
      <main id="main-content" className="flex-1 pb-16 md:pb-0" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center bg-paper">
              <RelifSpinner size="lg" className="text-verdigris" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
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

