
import type {Metadata} from 'next';
import './globals.css';

import { Toaster } from "@/shared/components/ui/toaster";
import { Header, Footer } from "@/shared/components/layout";
import { SyncStoreGate } from "@/components/app/syncStoreGate";
import { ThemeProvider } from '@/shared/components/theme';
import { ClientInitializer } from '@/components/app/client-initializer'; // Import the new client component

export const metadata: Metadata = {
  title: 'FlowTime Focus',
  description: 'A simple, visually clean app to help manage work and rest intervals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body>
          <ClientInitializer /> {/* Add the initializer here */}
          <ThemeProvider>
            {/* SyncStoreGate handles auth and data synchronization */}
            <SyncStoreGate /> 
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
    </html>
  );
}
