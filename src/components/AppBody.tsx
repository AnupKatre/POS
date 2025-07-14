
'use client';

import { useSidebar } from '@/hooks/use-sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from './ui/toaster';

export default function AppBody({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();
    return (
      <body className="font-body antialiased" data-sidebar-is-expanded={isExpanded}>
        <div className="flex flex-col h-screen w-full bg-secondary">
          <main className="flex-1 flex flex-col overflow-y-auto relative z-10 rounded-2xl bg-background shadow-lg m-4 transition-[margin] duration-300 ease-in-out group-data-[sidebar-is-expanded=true]:mb-24 group-data-[sidebar-is-expanded=false]:mb-4">
            {children}
          </main>
          <AppSidebar />
        </div>
        <Toaster />
      </body>
    );
  }
