'use client';

import { Hero } from '@/components/Hero/Hero';
import { About } from '@/components/About/About';
import { Projects } from '@/components/Projects/Projects';
import { CTA } from '@/components/CTA/CTA';
import Chat from '@/components/Chat';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <section id="chat">
        <Chat apiUrl={API_URL} />
      </section>
      <CTA />
    </>
  );
}
