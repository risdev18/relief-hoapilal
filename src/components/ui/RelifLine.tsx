// The Relif Line — Signature animated SVG element
// Part pulse trace, part breath, part hand-drawn stroke
// Scroll-driven morphing via Framer Motion useScroll

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/utils';

// ── Path definitions: jagged → calm ──────────────────────────────────────
// These are designed paths — jagged at top (stress), calming toward footer
const LINE_PATHS = {
  // Tight, jagged, fast — homepage hero
  jagged: 'M0,30 C8,30 10,10 20,10 C30,10 32,45 42,45 C52,45 54,8 64,8 C74,8 76,38 86,38 C96,38 98,15 108,15 C118,15 120,30 128,30',
  
  // Moderate — mid page
  middle: 'M0,25 C15,25 18,12 32,12 C46,12 48,38 62,38 C76,38 78,15 92,15 C106,15 108,30 122,30 C136,30 138,22 152,22 C166,22 168,30 182,30',
  
  // Wide, calm, slow wave — footer
  calm:   'M0,25 C30,25 40,15 70,15 C100,15 110,35 140,35 C170,35 180,20 210,20 C240,20 250,28 280,28 C310,28 320,25 350,25',
};

interface RelifLineProps {
  variant?: 'hero' | 'section' | 'cta' | 'footer' | 'scroll-driven';
  className?: string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
}

export function RelifLine({
  variant = 'section',
  className,
  color = 'var(--verdigris)',
  strokeWidth = 2,
  animated = true,
}: RelifLineProps) {
  const path = {
    hero:    LINE_PATHS.jagged,
    section: LINE_PATHS.middle,
    cta:     LINE_PATHS.calm,
    footer:  LINE_PATHS.calm,
    'scroll-driven': LINE_PATHS.middle,
  }[variant];

  const totalLength = 300;

  if (!animated) {
    return (
      <svg
        viewBox="0 0 350 50"
        fill="none"
        className={cn('w-full', className)}
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d={path} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 350 50"
      fill="none"
      className={cn('w-full', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
          opacity:    { duration: 0.3 },
        }}
      />
    </svg>
  );
}

// ── Scroll-driven Relif Line ──────────────────────────────────────────────
// Morphs from jagged to calm as the user scrolls down the page

interface ScrollRelifLineProps {
  className?: string;
  height?: number;
}

export function ScrollRelifLine({ className, height = 60 }: ScrollRelifLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Map scroll progress to path morph and stroke properties
  const strokeColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['var(--verdigris)', 'var(--verdigris)', 'var(--sage)']
  );
  
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const smoothProgress = useSpring(pathProgress, { stiffness: 100, damping: 30 });
  
  // Interpolate d attribute between jagged and calm
  // We use opacity fade as a simplified morph (true SVG morphing needs same point count)
  const jaggedOpacity = useTransform(smoothProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const calmOpacity   = useTransform(smoothProgress, [0.4, 0.6, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={cn('pointer-events-none', className)} style={{ height }}>
      <svg
        viewBox="0 0 350 50"
        fill="none"
        className="w-full h-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {/* Jagged line — fades out as user scrolls */}
        <motion.path
          d={LINE_PATHS.jagged}
          stroke="var(--verdigris)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: jaggedOpacity }}
        />
        {/* Calm line — fades in as user scrolls */}
        <motion.path
          d={LINE_PATHS.calm}
          stroke="var(--sage)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: calmOpacity }}
        />
      </svg>
    </div>
  );
}

// ── Relif Line Divider ────────────────────────────────────────────────────
interface RelifDividerProps {
  variant?: 'jagged' | 'calm';
  color?: string;
  className?: string;
}

export function RelifDivider({ variant = 'calm', color = 'var(--sage-light)', className }: RelifDividerProps) {
  return (
    <div className={cn('w-full overflow-hidden', className)} aria-hidden="true">
      <svg viewBox="0 0 350 20" fill="none" className="w-full h-5" preserveAspectRatio="none">
        <path
          d={variant === 'jagged' ? LINE_PATHS.jagged : LINE_PATHS.calm}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ── Success Line (appointment confirmed) ─────────────────────────────────
export function SuccessRelifLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 350 50"
      fill="none"
      className={cn('w-full', className)}
      aria-hidden="true"
    >
      <motion.path
        d={LINE_PATHS.calm}
        stroke="var(--verdigris)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

