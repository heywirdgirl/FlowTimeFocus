
import type {Metadata} from 'next';
import './globals.css';

import { Toaster } from "@/shared/components/ui/toaster";
import { Header, Footer } from "@/shared/components/layout";
import { SyncStoreGate } from "@/core/sync-store-gate";
import { ThemeProvider } from '@/features/theme';
import { ClientInitializer } from '@/core/client-initializer';

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
          <ThemeProvider>
            <SyncStoreGate /> 
            <ClientInitializer>
              <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
              </div>
              <Toaster />
            </ClientInitializer>
          </ThemeProvider>
        </body>
    </html>
  );
}
