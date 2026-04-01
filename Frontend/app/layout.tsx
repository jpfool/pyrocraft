import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from './components/ToastProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { Outfit, Jost, Cinzel } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
});

const jost = Jost({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost'
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel'
});

export const metadata: Metadata = {
  title: 'PYROCRAFT — Premium Crackers',
  description: 'Handcrafted premium crackers for the discerning connoisseur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${outfit.variable} ${jost.variable} ${cinzel.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="bg-zinc-50 dark:bg-[#08080a] text-zinc-900 dark:text-[#f0ead6] font-outfit font-light overflow-x-hidden transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
