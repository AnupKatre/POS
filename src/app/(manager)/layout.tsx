
'use client';

import { useSidebar } from '@/hooks/use-sidebar';
import type { PropsWithChildren } from 'react';

function ManagerLayoutContent({ children }: PropsWithChildren) {
    const { collapseSidebar } = useSidebar();
    return (
        <div className="flex-1 flex flex-col" onClick={collapseSidebar}>
            {children}
        </div>
    )
}

export default function ManagerLayout({ children }: PropsWithChildren) {
    return <ManagerLayoutContent>{children}</ManagerLayoutContent>;
}
