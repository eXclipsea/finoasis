import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinOasis - Gamified Student Savings',
  description: 'Turn saving money into a city-building adventure with your own financial pet companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
