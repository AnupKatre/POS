'use client';

import { tables } from '@/data/tables';
import type { Table } from '@/lib/types';
import TableCard from './TableCard';

interface TableGridProps {
  onTableSelect: (table: Table) => void;
}

export default function TableGrid({ onTableSelect }: TableGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onClick={() => onTableSelect(table)} />
      ))}
    </div>
  );
}
