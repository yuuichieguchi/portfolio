'use client';

import { BlobAnimation } from '@/components/Hero/BlobAnimation';
import { CapsuleRscDemo } from '@/components/CapsuleRscDemo/CapsuleRscDemo';

export default function CapsuleRscPage() {
  return (
    <>
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
        <CapsuleRscDemo />
      </div>
    </>
  );
}
