'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Table } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Utensils } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick: () => void;
}

const statusStyles: { [key in Table['status']]: string } = {
  Free: 'bg-green-100/50 border-green-400/50 hover:bg-green-100 dark:bg-green-900/30 dark:border-green-800/50 dark:hover:bg-green-900/50',
  Occupied: 'bg-orange-100/50 border-orange-400/50 hover:bg-orange-100 dark:bg-orange-900/30 dark:border-orange-800/50 dark:hover:bg-orange-900/50',
  Serving: 'bg-blue-100/50 border-blue-400/50 hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-800/50 dark:hover:bg-blue-900/50',
  Billing: 'bg-red-100/50 border-red-400/50 dark:bg-red-900/30 dark:border-red-800/50',
};

const badgeVariants = {
    Free: "secondary",
    Occupied: "default",
    Serving: "outline",
    Billing: "destructive"
} as const;


export default function TableCard({ table, onClick }: TableCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        statusStyles[table.status],
        table.status === 'Billing' && 'cursor-not-allowed opacity-70 hover:transform-none'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Table {table.number}</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">T-{table.number}</div>
        <Badge variant={badgeVariants[table.status]} className="mt-2 text-xs">
          {table.status}
        </Badge>
      </CardContent>
    </Card>
  );
}
