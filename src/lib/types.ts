export type TableStatus = 'Free' | 'Occupied' | 'Serving' | 'Billing';

export interface Table {
  id: number;
  number: number;
  status: TableStatus;
  customerCount?: number;
}

export type MenuCategory = 'Starters' | 'Mains' | 'Drinks';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
  image: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export type StaffRole = 'Manager' | 'Head Waiter' | 'Waiter' | 'Chef' | 'Sous Chef' | 'Hostess';

export interface StaffMember {
    id: number;
    name: string;
    role: StaffRole;
    shift: string;
    status: 'On Shift' | 'Off Duty';
    avatar: string;
}
