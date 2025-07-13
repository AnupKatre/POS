'use client';

import { useState } from 'react';
import type { Table } from '@/lib/types';
import TableGrid from '@/components/TableGrid';
import OrderPopup from '@/components/OrderPopup';
import NotificationBell from '@/components/NotificationBell';

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleTableSelect = (table: Table) => {
    if (table.status !== 'Billing') {
      setSelectedTable(table);
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Give time for the sheet to animate out before clearing the table
    setTimeout(() => {
      setSelectedTable(null);
    }, 300);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background font-body">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 sticky top-0 z-30">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          DineFlow
        </h1>
        <NotificationBell />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <TableGrid onTableSelect={handleTableSelect} />
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
