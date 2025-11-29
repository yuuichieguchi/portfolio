import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Portfolio - Developer & Engineer',
  description: 'Personal portfolio showcasing projects and skills. Features a real-time chat powered by FastAPI WebSocket Stabilizer.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
