'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal } from 'lucide-react';

import type { MenuItem } from '@/lib/types';
import { menuItems } from '@/data/menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function MenuManagementPage() {
  const [currentMenuItems, setCurrentMenuItems] = useState<MenuItem[]>(menuItems);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <header className="flex h-16 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-headline">
            Menu Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove menu items.
          </p>
        </div>
        <Button className="rounded-lg shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentMenuItems.map((item) => (
          <Card key={item.id} className="rounded-2xl shadow-sm border overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                  data-ai-hint={`${item.category.toLowerCase()} food`}
                />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                <Badge variant="outline" className="mt-2">{item.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
