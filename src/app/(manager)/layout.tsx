'use client';

import type { PropsWithChildren } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, useSidebar } from '@/hooks/use-sidebar';

function ManagerLayoutContent({ children }: PropsWithChildren) {
    const { collapseSidebar } = useSidebar();
    return (
        <div className="flex min-h-screen w-full bg-card">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-background rounded-tl-3xl rounded-bl-3xl" onClick={collapseSidebar}>
                {children}
            </main>
        </div>
    )
}

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <ManagerLayoutContent>{children}</ManagerLayoutContent>
    </SidebarProvider>
  );
}
