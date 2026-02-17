'use client';

import { useState } from 'react';
import { Search, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentTable({ payments = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-accent',
          bg: 'bg-accent/10',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-danger',
          bg: 'bg-danger/10',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
        };
      default:
        return {
          icon: Clock,
          color: 'text-muted',
          bg: 'bg-muted/10',
        };
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Payment History</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:border-accent w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-black border border-border rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">
                Transaction ID
              </th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">User</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Plan</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Amount</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Status</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={payment._id}
                    className="border-t border-border hover:bg-black/30"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-muted" />
                        <code className="text-accent text-sm">
                          {payment.transactionId}
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-white">
                          {payment.userId?.name || 'Unknown'}
                        </div>
                        <div className="text-muted text-sm">
                          {payment.userId?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm capitalize">
                        {payment.plan}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-medium">
                        {formatAmount(payment.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-muted">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted">
          Showing {filteredPayments.length} of {payments.length} payments
        </span>
        <span className="text-accent font-medium">
          Total: {formatAmount(filteredPayments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0))}
        </span>
      </div>
    </div>
  );
}
