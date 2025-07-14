import type { PropsWithChildren } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-accent">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background rounded-tl-2xl rounded-bl-2xl">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
