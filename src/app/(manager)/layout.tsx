import type { PropsWithChildren } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-card">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background rounded-tl-3xl rounded-bl-3xl">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
