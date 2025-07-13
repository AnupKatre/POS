'use client';

import { useState } from 'react';
import type { Table, TableStatus } from '@/lib/types';
import TableGrid from '@/components/TableGrid';
import OrderPopup from '@/components/OrderPopup';
import NotificationBell from '@/components/NotificationBell';
import { tables } from '@/data/tables';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    // Give time for animation before clearing the table
    setTimeout(() => {
      setSelectedTable(null);
    }, 300);
  };

  const filteredTables = activeFilter === 'All'
    ? tables
    : tables.filter((table) => table.status === activeFilter);

  return (
    <div className="flex h-screen w-full flex-col bg-background font-body">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 sticky top-0 z-30">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          DineFlow
        </h1>
        <NotificationBell />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'All' ? 'default' : 'outline'}
            onClick={() => setActiveFilter('All')}
          >
            All
          </Button>
          {ALL_STATUSES.map(status => (
            <Button
              key={status}
              variant={activeFilter === status ? 'default' : 'outline'}
              onClick={() => setActiveFilter(status)}
              className={cn({
                'bg-accent/80 border-accent text-accent-foreground': activeFilter === status && status === 'Free',
                'bg-primary/80 border-primary text-primary-foreground': activeFilter === status && status === 'Occupied',
                'bg-blue-500/80 border-blue-500 text-white': activeFilter === status && status === 'Serving',
                'bg-destructive/80 border-destructive text-destructive-foreground': activeFilter === status && status === 'Billing',
              })}
            >
              {status}
            </Button>
          ))}
        </div>
        <TableGrid tables={filteredTables} onTableSelect={handleTableSelect} />
      </main>
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
