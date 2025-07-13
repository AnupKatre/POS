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
        <DialogContent className="max-w-7xl w-full h-[95vh] flex flex-col p-0 gap-0 shadow-2xl rounded-3xl border-0 data-[state=open]:zoom-in-90">
            <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
            <div>
                <DialogTitle className="text-2xl font-bold font-headline">Order for Table {table.number}</DialogTitle>
                <DialogDescription>Add items to the order. Click confirm to send to kitchen.</DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10 flex-shrink-0">
                <X className="h-5 w-5"/>
            </Button>
            </DialogHeader>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden p-6 pt-0">
            {/* Menu List */}
            <div className="md:col-span-2 flex flex-col gap-4 h-full bg-background rounded-2xl p-4">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search menu items..."
                    className="pl-10 h-12 text-base rounded-xl bg-card"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
                <Tabs defaultValue="Starters" className="flex flex-col flex-1 overflow-hidden">
                <TabsList className="grid w-full grid-cols-3 bg-card rounded-xl h-12">
                    <TabsTrigger value="Starters" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Starters</TabsTrigger>
                    <TabsTrigger value="Mains" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Mains</TabsTrigger>
                    <TabsTrigger value="Drinks" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none">Drinks</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1 mt-4 -mx-2">
                    <div className="px-2">
                        {['Starters', 'Mains', 'Drinks'].map((category) => (
                        <TabsContent key={category} value={category} className="mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMenuItems
                                .filter((item) => item.category === category)
                                .map((item) => (
                                <div key={item.id} className="border rounded-2xl p-3 flex flex-col text-center bg-card hover:shadow-md transition-shadow">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={150}
                                        height={150}
                                        className="rounded-lg mx-auto aspect-square object-cover"
                                        data-ai-hint={`${item.category.toLowerCase()} food`}
                                    />
                                    <h4 className="font-semibold mt-3 flex-1 text-sm">{item.name}</h4>
                                    <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                                    <Button size="sm" className="mt-2 w-full rounded-lg" onClick={() => handleAddItem(item)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add
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
            <div className="md:col-span-1 bg-card rounded-2xl flex flex-col h-full border">
                <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                    <ShoppingCart className="mr-3 h-6 w-6 text-primary"/>
                    Current Order
                </h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {orderItems.length === 0 ? (
                            <p className="text-center text-muted-foreground mt-8">No items in order yet.</p>
                        ) : (
                            orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className='flex items-center gap-3'>
                                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg aspect-square object-cover" />
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className='font-medium w-4 text-center'>{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                {orderItems.length > 0 && (
                    <div className="p-4 mt-auto border-t">
                        <Separator className="my-4"/>
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-12 rounded-xl text-base" onClick={onClose}>Cancel</Button>
                            <Button className="h-12 rounded-xl text-base shadow-lg shadow-primary/30" onClick={handleConfirmOrder}>Confirm Order</Button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}
