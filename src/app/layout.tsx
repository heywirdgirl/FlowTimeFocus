// src/app/layout.tsx - PERFECT VERSION (Oct 24, 2025)
// 🔥 SERVER META + CLIENT PROVIDERS + HEADER/FOOTER = BUILD 100%!

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// 🔥 SERVER METADATA
export const metadata: Metadata = {
  title: 'FlowTime Focus',
  description: 'A simple, visually clean app to help manage work and rest intervals.',
  keywords: 'pomodoro, timer, focus, productivity',
  openGraph: {
    title: 'FlowTime Focus',
    description: 'Pomodoro & Breathing Timer',
    url: 'https://v1timecycle.vercel.app',
    images: '/og-image.png',
  },
};

// 🔥 CLIENT PROVIDERS - SEPARATE FILE
import ClientProviders from './providers';
import { Header } from "@/components/app/Header"; // Thêm Header
import { Footer } from "@/components/app/Footer"; // Thêm Footer

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-body antialiased">
        <ClientProviders>
          <Header /> {/* Thêm Header cố định */}
          {children}
          <Footer /> {/* Thêm Footer cố định */}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}