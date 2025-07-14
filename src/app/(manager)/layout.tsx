'use client';

import type { PropsWithChildren } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';

export default function ManagerLayout({ children }: PropsWithChildren) {
    const { collapseSidebar } = useSidebar();
    return (
        <div className="flex-1 flex flex-col" onClick={collapseSidebar}>
            {children}
        </div>
    )
}
