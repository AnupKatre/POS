'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from '@/components/ui/dialog';
import type { Table, OrderItem, MenuItem } from '@/lib/types';
import { menuItems } from '@/data/menu';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Minus, Search, ShoppingCart, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils';

interface OrderPopupProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  table: Table;
  onClose: () => void;
}

export default function OrderPopup({ isOpen, onOpenChange, table, onClose }: OrderPopupProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast()

  const handleAddItem = (itemToAdd: MenuItem) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } else {
      setOrderItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmOrder = () => {
    console.log('Order confirmed for table:', table.number, 'Items:', orderItems);
    toast({
        title: "Order Confirmed!",
        description: `Order for Table ${table.number} has been sent to the kitchen.`,
      })
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="max-w-screen-lg w-[95vw] h-[90vh] flex flex-col p-0 gap-0 shadow-2xl rounded-2xl border-0 data-[state=open]:zoom-in-90">
            <DialogHeader className="p-4 sm:p-6 pb-3 flex flex-row items-center justify-between flex-shrink-0">
            <div>
                <DialogTitle className="text-xl font-bold font-headline">Order for Table {table.number}</DialogTitle>
                <DialogDescription className="text-sm">Add items to the order. Click confirm to send to kitchen.</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 flex-shrink-0">
                <X className="h-5 w-5"/>
            </Button>
            </DialogHeader>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden p-4 sm:p-6 pt-0">
            {/* Menu List */}
            <div className="md:col-span-2 flex flex-col gap-3 h-full bg-background rounded-xl p-3 sm:p-4">
                <div className="relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search menu items..."
                    className="pl-9 h-10 text-sm rounded-lg bg-card"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <Tabs defaultValue="Starters" className="flex flex-col flex-1 overflow-hidden">
                <TabsList className="grid w-full grid-cols-3 bg-card rounded-lg h-10">
                    <TabsTrigger value="Starters" className="text-sm rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Starters</TabsTrigger>
                    <TabsTrigger value="Mains" className="text-sm rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Mains</TabsTrigger>
                    <TabsTrigger value="Drinks" className="text-sm rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Drinks</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1 mt-3 -mx-2">
                    <div className="px-2">
                        {['Starters', 'Mains', 'Drinks'].map((category) => (
                        <TabsContent key={category} value={category} className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredMenuItems
                                .filter((item) => item.category === category)
                                .map((item) => (
                                <div key={item.id} className="border rounded-xl p-2 flex flex-col text-center bg-card hover:shadow-md transition-shadow">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={150}
                                        height={150}
                                        className="rounded-md mx-auto aspect-square object-cover"
                                        data-ai-hint={`${item.category.toLowerCase()} food`}
                                    />
                                    <h4 className="font-semibold mt-2 flex-1 text-xs">{item.name}</h4>
                                    <p className="text-muted-foreground text-xs">${item.price.toFixed(2)}</p>
                                    <Button size="sm" className="mt-2 w-full rounded-md h-8 text-xs" onClick={() => handleAddItem(item)}>
                                    <Plus className="mr-1 h-4 w-4" /> Add
                                    </Button>
                                </div>
                                ))}
                            </div>
                        </TabsContent>
                        ))}
                    </div>
                </ScrollArea>
                </Tabs>
            </div>

            {/* Cart Summary */}
            <div className="md:col-span-1 bg-card rounded-xl flex flex-col h-full border">
                <div className="p-4 border-b flex-shrink-0">
                <h3 className="text-base font-semibold flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5 text-primary"/>
                    Current Order
                </h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-3">
                        {orderItems.length === 0 ? (
                            <p className="text-center text-muted-foreground mt-6 text-sm">No items in order yet.</p>
                        ) : (
                            orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-2">
                                <div className='flex items-center gap-2 overflow-hidden'>
                                    <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md aspect-square object-cover flex-shrink-0" />
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-xs truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className='font-medium w-4 text-center text-sm'>{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                {orderItems.length > 0 && (
                    <div className="p-4 mt-auto border-t flex-shrink-0">
                        <Separator className="my-3"/>
                        <div className="flex justify-between font-bold text-base mb-3">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-10 rounded-lg text-sm" onClick={onClose}>Cancel</Button>
                            <Button className="h-10 rounded-lg text-sm shadow-lg shadow-primary/30" onClick={handleConfirmOrder}>Confirm Order</Button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}
