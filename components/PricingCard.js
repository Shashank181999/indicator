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
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`relative bg-card border rounded-xl p-8 transition-all hover:scale-105 ${
        isPopular ? 'border-accent scale-105' : 'border-border'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center space-x-1 bg-accent text-black px-4 py-1 rounded-full text-sm font-medium">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-white">{formatPrice(price)}</span>
          <span className="text-muted ml-2">/{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      {showButton && (
        onSelect ? (
          <button
            onClick={() => onSelect(plan)}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isPopular
                ? 'bg-accent hover:bg-accent/80 text-black'
                : 'bg-white/10 hover:bg-white/20 text-white border border-border'
            }`}
          >
            Subscribe Now
          </button>
        ) : (
          <Link
            href={`/register?plan=${plan}`}
            className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
              isPopular
                ? 'bg-accent hover:bg-accent/80 text-black'
                : 'bg-white/10 hover:bg-white/20 text-white border border-border'
            }`}
          >
            Get Started
          </Link>
        )
      )}
    </div>
  );
}
