import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';
import { Header } from "@/components/app/header";
import { Footer } from "@/components/app/footer";
import { SyncStoreGate } from "@/components/app/syncStoreGate";


export const metadata: Metadata = {
  title: 'FlowTime Focus',
  description: 'A simple, visually clean app to help manage work and rest intervals.',
};

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
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider> 
          {/* AuthProvider vẫn nên giữ nếu bạn dùng Firebase Auth trực tiếp */}
          <SyncStoreGate /> {/* <-- Thêm một "Cổng" điều phối Sync ở đây */}
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}


