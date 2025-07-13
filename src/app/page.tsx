'use client';

import { useState } from 'react';
import type { Table, TableStatus } from '@/lib/types';
import TableGrid from '@/components/TableGrid';
import OrderPopup from '@/components/OrderPopup';
import NotificationBell from '@/components/NotificationBell';
import { tables } from '@/data/tables';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutGrid, ListFilter, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ALL_STATUSES: TableStatus[] = ['Free', 'Occupied', 'Serving', 'Billing'];

export default function Home() {
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
    <div className="flex min-h-screen w-full flex-col bg-background font-body">
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="hidden w-16 flex-shrink-0 bg-card border-r md:flex flex-col items-center py-4">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg mb-8">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <nav className="flex flex-col items-center gap-4">
            {/* Add more nav items here if needed */}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground font-headline">
                Hi, James! 👋
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back to DineFlow.</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                    <UserCircle className="h-6 w-6" />
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
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">Tables Overview</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter ({activeFilter})
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
  );
}
