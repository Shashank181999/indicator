import PricingCard from '@/components/PricingCard';
import { Check, X, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Pricing - Market Sniper',
  description: 'Choose the perfect plan for your trading needs. Weekly, monthly, and yearly subscription options available.',
};

export default function PricingPage() {
  const plans = [
    {
      title: 'Weekly',
      price: 499,
      period: 'week',
      plan: 'weekly',
      isPopular: false,
      features: [
        'All trading indicators',
        'RSI & EMA signals',
        'Market Sniper indicator',
        'Real-time updates',
        'Email support',
        'Cancel anytime',
      ],
    },
    {
      title: 'Monthly',
      price: 1499,
      period: 'month',
      plan: 'monthly',
      isPopular: true,
      features: [
        'All trading indicators',
        'RSI & EMA signals',
        'Market Sniper indicator',
        'Real-time updates',
        'Priority support',
        'Trading education videos',
        'Cancel anytime',
      ],
    },
    {
      title: 'Yearly',
      price: 9999,
      period: 'year',
      plan: 'yearly',
      isPopular: false,
      features: [
        'All trading indicators',
        'RSI & EMA signals',
        'Market Sniper indicator',
        'Real-time updates',
        'Priority support',
        'Trading education videos',
        '1-on-1 onboarding call',
        'Save 45% vs monthly',
      ],
    },
  ];

  const comparison = [
    { feature: 'RSI Indicator', weekly: true, monthly: true, yearly: true },
    { feature: 'EMA Crossovers (9, 21, 50)', weekly: true, monthly: true, yearly: true },
    { feature: 'Market Sniper Signals', weekly: true, monthly: true, yearly: true },
    { feature: 'Real-time Updates', weekly: true, monthly: true, yearly: true },
    { feature: 'Email Support', weekly: true, monthly: true, yearly: true },
    { feature: 'Priority Support', weekly: false, monthly: true, yearly: true },
    { feature: 'Education Videos', weekly: false, monthly: true, yearly: true },
    { feature: '1-on-1 Onboarding', weekly: false, monthly: false, yearly: true },
    { feature: 'Custom Alerts', weekly: false, monthly: false, yearly: true },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted">
            Choose the plan that fits your trading style. All plans include
            access to our full suite of professional trading indicators.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Compare Plans
        </h2>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-white font-semibold">
                    Features
                  </th>
                  <th className="text-center py-4 px-6 text-white font-semibold">
                    Weekly
                  </th>
                  <th className="text-center py-4 px-6 text-accent font-semibold">
                    Monthly
                  </th>
                  <th className="text-center py-4 px-6 text-white font-semibold">
                    Yearly
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr
                    key={index}
                    className={index !== comparison.length - 1 ? 'border-b border-border' : ''}
                  >
                    <td className="py-4 px-6 text-gray-300">{item.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {item.weekly ? (
                        <Check className="h-5 w-5 text-accent mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-accent/5">
                      {item.monthly ? (
                        <Check className="h-5 w-5 text-accent mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.yearly ? (
                        <Check className="h-5 w-5 text-accent mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: 'Can I switch plans later?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. The change will take effect at the start of your next billing cycle.',
            },
            {
              q: 'Is there a free trial?',
              a: 'We offer a 7-day money-back guarantee. If you are not satisfied with our service, you can request a full refund within 7 days of purchase.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like PayTM and PhonePe.',
            },
            {
              q: 'Can I cancel my subscription?',
              a: 'Yes, you can cancel your subscription at any time from your dashboard. Your access will continue until the end of your billing period.',
            },
            {
              q: 'Do you offer discounts for long-term subscriptions?',
              a: 'Yes! Our yearly plan offers a 45% discount compared to monthly billing. This is our best value option for serious traders.',
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            7-Day Money-Back Guarantee
          </h3>
          <p className="text-muted max-w-2xl mx-auto">
            We are confident you will love Market Sniper. If for any reason you are
            not satisfied with our service, contact us within 7 days of purchase
            for a full refund. No questions asked.
          </p>
        </div>
      </section>
    </div>
  );
}
