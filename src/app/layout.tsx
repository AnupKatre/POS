
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
import { SidebarProvider } from '@/hooks/use-sidebar';
import AppSidebar from '@/components/AppSidebar';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'DineFlow',
  description: 'Restaurant POS Interface',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-body antialiased">
        <SidebarProvider>
            <div className="flex flex-col h-screen w-full bg-card">
              <main className="flex-1 flex flex-col overflow-y-auto bg-background rounded-b-3xl shadow-lg relative z-10">
                {children}
              </main>
              <AppSidebar />
            </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
