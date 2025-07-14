'use client';
import Image from 'next/image';
import { staffMembers } from '@/data/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';

export default function StaffOnDuty() {
  const onDutyStaff = staffMembers.filter(member => member.status === 'On Shift');

  return (
    <div className="space-y-4">
      {onDutyStaff.map((member) => (
        <div key={member.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person portrait" />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant="outline">{member.shift}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
