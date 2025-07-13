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
  Free: 'bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30',
  Occupied: 'bg-primary/20 text-primary-foreground border-primary/30 hover:bg-primary/30',
  Serving: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  Billing: 'bg-destructive/20 text-destructive-foreground border-destructive/30',
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
        table.status === 'Billing' && 'cursor-not-allowed opacity-60 hover:transform-none'
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
