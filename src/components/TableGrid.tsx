'use client';

import type { Table } from '@/lib/types';
import TableCard from './TableCard';

interface TableGridProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
}

export default function TableGrid({ tables, onTableSelect }: TableGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onClick={() => onTableSelect(table)} />
      ))}
    </div>
  );
}
