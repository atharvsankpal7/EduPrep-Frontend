import type { Metadata } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import './bg-styles.css'; 

const fontHeading = DM_Serif_Display({
  weight: ['400'], // DM Serif only has 400 and 400-italic
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const fontBody = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EduPrep | The Future of Learning',
  description: 'A data-driven learning platform for the modern era.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${fontHeading.variable} ${fontBody.variable} font-body bg-[#030712] text-slate-200 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden`}>
      {children}
    </div>
  );
}
