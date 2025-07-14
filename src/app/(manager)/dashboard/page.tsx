'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Utensils, Users, ShoppingCart } from "lucide-react";
import SalesChart from '@/components/manager/SalesChart';
import StaffOnDuty from '@/components/manager/StaffOnDuty';

const kpiData = [
    { title: "Today's Sales", value: "$1,250", icon: <DollarSign className="h-5 w-5 text-muted-foreground" />, change: "+12%" },
    { title: "Active Tables", value: "8", icon: <Utensils className="h-5 w-5 text-muted-foreground" />, change: "-2" },
    { title: "Staff on Duty", value: "6", icon: <Users className="h-5 w-5 text-muted-foreground" />, change: "+1" },
    { title: "Total Orders", value: "124", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />, change: "+20" },
]

export default function ManagerDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6">
        <header className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-headline">
                Manager Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back, Admin!</p>
            </div>
        </header>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map(kpi => (
                <Card key={kpi.title} className="rounded-2xl shadow-sm border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        {kpi.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.change} from last hour</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <SalesChart />
                </CardContent>
            </Card>
            <Card className="col-span-4 lg:col-span-3 rounded-2xl shadow-sm border">
                <CardHeader>
                    <CardTitle>Staff on Duty</CardTitle>
                </CardHeader>
                <CardContent>
                    <StaffOnDuty />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
