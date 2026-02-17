'use client';

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function IndicatorCard({ title, value, signal, description, icon: Icon = Activity }) {
  const getSignalColor = () => {
    switch (signal) {
      case 'buy':
      case 'strong_buy':
        return 'text-accent';
      case 'sell':
      case 'strong_sell':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  };

  const getSignalText = () => {
    switch (signal) {
      case 'strong_buy':
        return 'Strong Buy';
      case 'buy':
        return 'Buy';
      case 'strong_sell':
        return 'Strong Sell';
      case 'sell':
        return 'Sell';
      default:
        return 'Hold';
    }
  };

  const getSignalIcon = () => {
    switch (signal) {
      case 'buy':
      case 'strong_buy':
        return TrendingUp;
      case 'sell':
      case 'strong_sell':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const SignalIcon = getSignalIcon();

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <div className={`flex items-center space-x-1 ${getSignalColor()}`}>
          <SignalIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{getSignalText()}</span>
        </div>
      </div>

      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <p className="text-muted text-sm">{description}</p>
    </div>
  );
}
