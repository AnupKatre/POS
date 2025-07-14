
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
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
            <div className="flex flex-col h-screen w-full bg-secondary">
              <main className="flex-1 flex flex-col overflow-y-auto relative z-10 rounded-2xl bg-background shadow-lg m-4 mb-24">
                {children}
              </main>
              <AppSidebar />
            </div>
        <Toaster />
      </body>
    </html>
  );
}
