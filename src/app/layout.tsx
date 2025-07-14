import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
import { SidebarProvider } from '@/hooks/use-sidebar';
import AppSidebar from '@/components/AppSidebar';

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
            <div className="flex min-h-screen w-full bg-card">
              <AppSidebar />
              <main className="flex-1 flex flex-col overflow-y-auto bg-background rounded-tl-3xl rounded-bl-3xl">
                {children}
              </main>
            </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
