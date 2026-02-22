import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BudgetFriend - Your Financial Companion',
  description: 'Turn saving money into a cozy room decoration game. Connect your bank, track your budget, and grow your virtual home!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <main className="min-h-screen bg-[#E8F4F8] flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
