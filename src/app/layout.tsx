
import type {Metadata} from 'next';
import './globals.css';
import { Poppins } from 'next/font/google'
import { SidebarProvider } from '@/hooks/use-sidebar';
import AppBody from '@/components/AppBody';

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
        <SidebarProvider>
          <AppBody>{children}</AppBody>
        </SidebarProvider>
    </html>
  );
}
