import type { PropsWithChildren } from 'react';
import AppSidebar from '@/components/AppSidebar';

export default function ManagerLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
