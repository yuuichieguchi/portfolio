'use client';

import { Hero } from '@/components/Hero/Hero';
import { About } from '@/components/About/About';
import { Projects } from '@/components/Projects/Projects';
import { CTA } from '@/components/CTA/CTA';
import { BlobAnimation } from '@/components/Hero/BlobAnimation';

export default function Home() {
  return (
    <>
      {/* Background blobs container spanning Hero, About, and Projects */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          overflow: 'hidden',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <BlobAnimation variant="primary" size="large" duration={8} top="-20%" right="-10%" />
        <BlobAnimation variant="secondary" size="medium" duration={10} delay={2} top="10%" right="-5%" />
        <BlobAnimation variant="tertiary" size="small" duration={12} delay={4} top="30%" right="-15%" />
      </div>
      <div style={{ position: 'relative' }}>
        <Hero />
        <About />
        <Projects />
        <CTA />
      </div>
    </>
  );
}
