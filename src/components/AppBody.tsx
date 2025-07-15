
'use client';

import AppSidebar from '@/components/AppSidebar';
import { Toaster } from './ui/toaster';

export default function AppBody({ children }: { children: React.ReactNode }) {
    return (
      <div className="font-body antialiased">
        <div className="flex flex-col h-screen w-full bg-secondary">
          <main className="flex-1 flex flex-col overflow-y-auto relative z-10 rounded-2xl bg-background shadow-lg m-4 mb-24">
            {children}
          </main>
          <AppSidebar />
        </div>
        <Toaster />
      </div>
    );
  }
