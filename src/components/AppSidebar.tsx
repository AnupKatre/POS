'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutGrid,
  ClipboardList,
  Users,
  Archive,
  Settings,
  Utensils,
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Waiter View', icon: Utensils },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/menu', label: 'Menu', icon: ChefHat },
  { href: '/staff', label: 'Staff', icon: Users },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="sticky top-0 left-0 h-screen w-16 flex flex-col items-center border-r bg-card text-card-foreground py-4">
        <Link href="/dashboard" className="mb-6">
          <Home className="h-7 w-7 text-primary" />
        </Link>
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Tooltip key={item.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
