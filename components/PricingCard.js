'use client';

import Link from 'next/link';
import { Check, Star } from 'lucide-react';

export default function PricingCard({
  title,
  price,
  period,
  features,
  isPopular,
  plan,
  onSelect,
  showButton = true,
}) {
  const getGradient = () => {
    if (title === 'Weekly') return 'from-gray-500 to-gray-600';
    if (title === 'Monthly') return 'from-cyan-500 to-blue-600';
    if (title === 'Yearly') return 'from-orange-500 to-yellow-500';
    return 'from-cyan-500 to-blue-600';
  };

  return (
    <div
      className={`relative bg-[#030712]/50 backdrop-blur border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
        isPopular
          ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
          : 'border-white/10 hover:border-cyan-500/30'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-cyan-500/25">
            <Star className="h-3.5 w-3.5" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className={`text-center ${isPopular ? 'pt-4' : ''} mb-6`}>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-gray-400">₹</span>
          <span className={`text-4xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}>
            {price.toLocaleString()}
          </span>
        </div>
        <span className="text-gray-500 text-sm">per {period}</span>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-emerald-400" />
            </div>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {showButton && (
        onSelect ? (
          <button
            onClick={() => onSelect(plan)}
            className={`w-full py-3 rounded-xl font-semibold transition-all text-sm ${
              isPopular
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            Subscribe Now
          </button>
        ) : (
          <Link
            href={`/register?plan=${plan}`}
            className={`block w-full py-3 rounded-xl font-semibold text-center transition-all text-sm ${
              isPopular
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            Get Started
          </Link>
        )
      )}
    </div>
  );
}
