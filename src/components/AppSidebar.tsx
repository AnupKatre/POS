
// src/components/AppSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  ClipboardList,
  Users,
  Archive,
  Settings,
  Utensils,
  ChefHat,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';

const navItems = [
  { href: '/', label: 'Waiter', icon: Utensils },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/orders', label: 'Orders', icon: ClipboardList, comingSoon: true },
  { href: '/menu', label: 'Menu', icon: ChefHat },
  { href: '/staff', label: 'Staff', icon: Users },
  { href: '/inventory', label: 'Inventory', comingSoon: true, icon: Archive },
  { href: '/settings', label: 'Settings', comingSoon: true, icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, expandSidebar } = useSidebar();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        onClick={(e) => {
          e.stopPropagation();
          expandSidebar();
        }}
        className={cn(
          'sticky bottom-0 left-0 w-full flex flex-col items-center bg-card text-card-foreground px-4 transition-all duration-300 ease-in-out cursor-pointer z-20',
          isExpanded ? 'h-40' : 'h-20'
        )}
      >
        <div className={cn('flex items-center justify-center py-2', isExpanded ? 'w-full' : 'w-auto')}>
            <Link href="/dashboard" className="flex flex-col items-center gap-1">
                <Home className="h-6 w-6 text-primary flex-shrink-0" />
                <span className={cn('font-bold text-xs transition-opacity', isExpanded ? 'opacity-100' : 'opacity-0 h-0')}>DineFlow</span>
            </Link>
        </div>

        <nav className="flex items-center justify-center gap-2 w-full">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/' && pathname === '/') ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.comingSoon ? '#' : item.href}
                    className={cn(
                      'flex flex-col items-center w-20 h-16 justify-center rounded-lg transition-colors overflow-hidden py-2',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      item.comingSoon && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className={cn('font-medium text-xs whitespace-nowrap transition-opacity', isExpanded ? 'opacity-100' : 'opacity-0 h-0')}>
                        {item.label}
                      </span>
                    </div>
                     {item.comingSoon && !isExpanded && (
                       <span className="absolute bottom-2 text-[8px] bg-muted text-muted-foreground px-1 py-0 rounded-sm">Soon</span>
                     )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.label}{item.comingSoon && ' (Coming Soon)'}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
