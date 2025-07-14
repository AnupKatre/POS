'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: '9am', sales: Math.floor(Math.random() * 200) + 50 },
  { name: '10am', sales: Math.floor(Math.random() * 200) + 50 },
  { name: '11am', sales: Math.floor(Math.random() * 200) + 50 },
  { name: '12pm', sales: Math.floor(Math.random() * 400) + 100 },
  { name: '1pm', sales: Math.floor(Math.random() * 400) + 100 },
  { name: '2pm', sales: Math.floor(Math.random() * 400) + 100 },
  { name: '3pm', sales: Math.floor(Math.random() * 200) + 50 },
  { name: '4pm', sales: Math.floor(Math.random() * 200) + 50 },
  { name: '5pm', sales: Math.floor(Math.random() * 300) + 50 },
  { name: '6pm', sales: Math.floor(Math.random() * 500) + 100 },
  { name: '7pm', sales: Math.floor(Math.random() * 500) + 100 },
  { name: '8pm', sales: Math.floor(Math.random() * 500) + 100 },
];

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
        />
        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
