import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Penniply - Grow Your Wealth',
  description: 'Turn saving money into a thriving garden sanctuary with your own financial pet companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
