'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminStats from '@/components/AdminStats';
import UserTable from '@/components/UserTable';
import PaymentTable from '@/components/PaymentTable';
import { Shield, RefreshCw, Download, Users, CreditCard } from 'lucide-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [usersRes, paymentsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/payments'),
      ]);

      const usersData = await usersRes.json();
      const paymentsData = await paymentsRes.json();

      setUsers(usersData.users || []);
      setPayments(paymentsData.payments || []);

      // Calculate stats
      const totalUsers = usersData.users?.length || 0;
      const activeSubscriptions = usersData.users?.filter(
        (u) => u.subscriptionStatus === 'active'
      ).length || 0;
      const completedPayments = paymentsData.payments?.filter(
        (p) => p.status === 'completed'
      ) || [];
      const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

      // Monthly revenue (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyRevenue = completedPayments
        .filter((p) => new Date(p.createdAt) >= startOfMonth)
        .reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    const data = type === 'users' ? users : payments;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-muted">Manage users, subscriptions, and payments</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 bg-card hover:bg-card/80 text-white px-4 py-2 rounded-lg border border-border transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => handleExport(activeTab)}
              className="flex items-center space-x-2 bg-accent hover:bg-accent/80 text-black px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <AdminStats stats={stats} />
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-accent text-black'
                : 'bg-card text-white hover:bg-card/80 border border-border'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-accent text-black'
                : 'bg-card text-white hover:bg-card/80 border border-border'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Payments ({payments.length})</span>
          </button>
        </div>

        {/* Table */}
        {activeTab === 'users' ? (
          <UserTable users={users} />
        ) : (
          <PaymentTable payments={payments} />
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Subscription Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted">Weekly Plans</span>
                <span className="text-white font-medium">
                  {payments.filter((p) => p.plan === 'weekly' && p.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Monthly Plans</span>
                <span className="text-white font-medium">
                  {payments.filter((p) => p.plan === 'monthly' && p.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Yearly Plans</span>
                <span className="text-white font-medium">
                  {payments.filter((p) => p.plan === 'yearly' && p.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">User Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted">Pro Users</span>
                <span className="text-accent font-medium">
                  {users.filter((u) => u.subscriptionStatus === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Free Users</span>
                <span className="text-white font-medium">
                  {users.filter((u) => u.subscriptionStatus !== 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Admins</span>
                <span className="text-purple-400 font-medium">
                  {users.filter((u) => u.role === 'admin').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted text-sm truncate max-w-[150px]">
                    {payment.userId?.name || 'User'}
                  </span>
                  <span className="text-accent font-medium">
                    ₹{payment.amount}
                  </span>
                </div>
              ))}
              {payments.length === 0 && (
                <p className="text-muted text-sm">No recent payments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
