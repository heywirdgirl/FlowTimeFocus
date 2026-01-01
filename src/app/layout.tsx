
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/app/header";
import { Footer } from "@/components/app/footer";
import { SyncStoreGate } from "@/components/app/syncStoreGate";
import { ThemeProvider } from '@/components/app/theme-provider';


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
