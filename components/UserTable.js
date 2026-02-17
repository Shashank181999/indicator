'use client';

import { useState } from 'react';
import { Search, User, Crown, MoreVertical, Mail, Calendar } from 'lucide-react';

export default function UserTable({ users = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'subscribed' && user.subscriptionStatus === 'active') ||
      (filter === 'free' && user.subscriptionStatus !== 'active');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Users</h3>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black border border-border rounded-lg text-white placeholder-muted focus:outline-none focus:border-accent w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-black border border-border rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Subscribed</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">User</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Email</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Status</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Role</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium">Joined</th>
              <th className="text-left py-4 px-6 text-muted text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-t border-border hover:bg-black/30">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-muted text-sm">{user.provider}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                        user.subscriptionStatus === 'active'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-gray-500/10 text-muted'
                      }`}
                    >
                      {user.subscriptionStatus === 'active' && (
                        <Crown className="h-3 w-3" />
                      )}
                      <span className="capitalize">
                        {user.subscriptionStatus === 'active' ? 'Pro' : 'Free'}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-muted">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-muted hover:text-white p-2 rounded-lg hover:bg-black/50">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-sm text-muted">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
