import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/nav-bar';

export const metadata: Metadata = {
  title: 'RuleMaster',
  description: 'Answer board game rule questions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
