'use client';

import { Bell, BellRing } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const notifications = [
  { id: 1, message: 'Order ready for Table 5', icon: <BellRing className="h-4 w-4 text-accent" /> },
  { id: 2, message: 'Customer from Table 3 called waiter', icon: <Bell className="h-4 w-4 text-primary" /> },
];

export default function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-6 w-6" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {notifications.length}
          </span>
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">You have {notifications.length} new messages.</p>
          </div>
          <div className="mt-2 flex flex-col gap-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3">
                <div className='flex-shrink-0'>{notification.icon}</div>
                <p className="text-sm text-foreground">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
