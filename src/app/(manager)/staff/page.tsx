'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { staffMembers } from '@/data/staff';
import type { StaffMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StaffManagementPage() {
  const [team, setTeam] = useState<StaffMember[]>(staffMembers);

  const getStatusColor = (status: 'On Shift' | 'Off Duty') => {
    return status === 'On Shift' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
      <header className="flex h-16 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-headline">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <Button className="rounded-lg shadow-sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <Card key={member.id} className="rounded-2xl shadow-sm border text-center">
            <CardContent className="p-6 flex flex-col items-center">
               <div className="relative">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="rounded-full mb-4"
                  data-ai-hint="person portrait"
                />
                 <span className={`absolute bottom-4 right-1 block h-3 w-3 rounded-full ${getStatusColor(member.status)} border-2 border-card`} />
               </div>
              <h3 className="text-md font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              
              <div className="mt-4">
                <Badge variant={member.status === 'On Shift' ? 'default' : 'secondary'} className="capitalize">
                    {member.status}
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
