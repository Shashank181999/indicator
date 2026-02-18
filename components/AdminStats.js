'use client';

import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminStats({ stats }) {
  const statItems = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      icon: CreditCard,
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+23%',
      changeType: 'positive',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <item.icon className="h-6 w-6 text-accent" />
            </div>
            <span
              className={`text-sm font-medium ${
                item.changeType === 'positive' ? 'text-accent' : 'text-danger'
              }`}
            >
              {item.change}
            </span>
          </div>
          <p className="text-muted text-sm">{item.title}</p>
          <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
