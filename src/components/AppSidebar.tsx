// src/components/AppSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
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
import { Button } from './ui/button';
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
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'sticky top-0 left-0 h-screen flex flex-col items-center border-r bg-card text-card-foreground py-4 transition-all duration-300 ease-in-out',
          isExpanded ? 'w-56' : 'w-20'
        )}
      >
        <div className={cn('flex items-center justify-center', isExpanded ? 'w-full px-4' : 'w-auto')}>
            <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-7 w-7 text-primary flex-shrink-0" />
                <span className={cn('font-bold text-lg transition-opacity', isExpanded ? 'opacity-100' : 'opacity-0 w-0')}>DineFlow</span>
            </Link>
        </div>
        
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 z-10 p-1 bg-background border rounded-full text-muted-foreground hover:text-foreground transition-transform duration-300"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <nav className="flex flex-col items-start gap-2 mt-10 w-full px-4">
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
                      'flex items-center w-full h-11 justify-start rounded-lg transition-colors overflow-hidden',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      item.comingSoon && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div className="flex items-center gap-4 px-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className={cn('font-medium whitespace-nowrap transition-opacity', isExpanded ? 'opacity-100' : 'opacity-0 w-0')}>
                        {item.label}
                      </span>
                    </div>
                     {item.comingSoon && isExpanded && (
                       <span className="ml-auto mr-3 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">Soon</span>
                     )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
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
