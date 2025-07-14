'use client';

import { useState } from 'react';
import type { Table, TableStatus } from '@/lib/types';
import TableGrid from '@/components/TableGrid';
import OrderPopup from '@/components/OrderPopup';
import NotificationBell from '@/components/NotificationBell';
import { tables } from '@/data/tables';
import { Button } from '@/components/ui/button';
import { ListFilter, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';

const ALL_STATUSES: TableStatus[] = ['Free', 'Occupied', 'Serving', 'Billing'];

export default function WaiterPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'All'>('All');

  const handleTableSelect = (table: Table) => {
    if (table.status !== 'Billing') {
      setSelectedTable(table);
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => {
      setSelectedTable(null);
    }, 300);
  };

  const filteredTables = activeFilter === 'All'
    ? tables
    : tables.filter((table) => table.status === activeFilter);

  return (
    <SidebarProvider>
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
            <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
            <div>
                <h1 className="text-lg font-bold text-foreground font-headline">
                Hi, James! 👋
                </h1>
                <p className="text-xs text-muted-foreground">Welcome back to the waiter panel.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <NotificationBell />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <UserCircle className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl font-semibold">Tables Overview</h2>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                    <ListFilter className="mr-2 h-4 w-4" />
                    <span className="text-sm">{activeFilter}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setActiveFilter('All')}>All</DropdownMenuItem>
                    {ALL_STATUSES.map(status => (
                    <DropdownMenuItem key={status} onSelect={() => setActiveFilter(status)}>
                        {status}
                    </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <TableGrid tables={filteredTables} onTableSelect={handleTableSelect} />
            </main>
        </div>
      </div>
      
      {selectedTable && (
        <OrderPopup
          isOpen={isPopupOpen}
          onOpenChange={setIsPopupOpen}
          table={selectedTable}
          onClose={handleClosePopup}
        />
      )}
    </div>
    </SidebarProvider>
  );
}
