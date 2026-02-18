'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, X, HelpCircle, Zap, Shield, Star, ChevronDown, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const plans = [
    {
      title: 'Weekly',
      price: 6,
      period: 'week',
      description: 'Perfect for trying out',
      isPopular: false,
      color: 'from-gray-500 to-gray-600',
      features: [
        { text: 'All trading indicators', included: true },
        { text: 'RSI & EMA signals', included: true },
        { text: 'Market Sniper indicator', included: true },
        { text: 'Real-time updates', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: false },
        { text: 'Education videos', included: false },
      ],
    },
    {
      title: 'Monthly',
      price: 18,
      period: 'month',
      description: 'Most popular choice',
      isPopular: true,
      color: 'from-cyan-500 to-blue-600',
      features: [
        { text: 'All trading indicators', included: true },
        { text: 'RSI & EMA signals', included: true },
        { text: 'Market Sniper indicator', included: true },
        { text: 'Real-time updates', included: true },
        { text: 'Priority support', included: true },
        { text: 'Education videos', included: true },
        { text: '1-on-1 onboarding', included: false },
      ],
    },
    {
      title: 'Yearly',
      price: 99,
      period: 'year',
      description: 'Best value - Save 55%',
      isPopular: false,
      color: 'from-orange-500 to-yellow-500',
      features: [
        { text: 'All trading indicators', included: true },
        { text: 'RSI & EMA signals', included: true },
        { text: 'Market Sniper indicator', included: true },
        { text: 'Real-time updates', included: true },
        { text: 'Priority support', included: true },
        { text: 'Education videos', included: true },
        { text: '1-on-1 onboarding', included: true },
      ],
    },
  ];

  const faqs = [
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
      a: 'We accept all major credit/debit cards, PayPal, Apple Pay, Google Pay, and bank transfers.',
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, you can cancel your subscription at any time from your dashboard. Your access will continue until the end of your billing period.',
    },
    {
      q: 'Do you offer discounts for long-term subscriptions?',
      a: 'Yes! Our yearly plan offers a 45% discount compared to monthly billing. This is our best value option for serious traders.',
    },
  ];

  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Hero Section */}
      <section
        id="pricing-hero"
        data-animate
        className="relative py-24 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/90 to-[#030712]" />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[50px]" />

        <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible('pricing-hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Simple Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Choose Your
            <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Trading Plan
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            All plans include access to our full suite of professional trading indicators.
            Start with any plan and upgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        id="plans"
        data-animate
        className="relative py-12 -mt-8"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.title}
                className={`relative bg-[#0a1628]/80 backdrop-blur border rounded-2xl overflow-hidden transition-all duration-700 hover:-translate-y-2 ${
                  plan.isPopular
                    ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                    : 'border-white/10 hover:border-cyan-500/30'
                } ${isVisible('plans') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="h-4 w-4 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <div className={`p-6 ${plan.isPopular ? 'pt-14' : ''}`}>
                  {/* Plan header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-normal text-white mb-1">{plan.title}</h3>
                    <p className="text-gray-500 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-gray-400 text-lg">$</span>
                      <span className={`text-5xl font-normal bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                        {plan.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">per {plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/register"
                    className={`block w-full py-3 rounded-xl font-normal text-center transition-all mb-6 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    Get Started
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                            <X className="h-3 w-3 text-gray-500" />
                          </div>
                        )}
                        <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-400" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              <span>7-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        data-animate
        className="relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
              <HelpCircle className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-white">
              Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-gray-400">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section
        id="guarantee"
        data-animate
        className="relative py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-r from-cyan-500/10 to-orange-500/10 border border-cyan-500/20 rounded-2xl p-8 sm:p-12 text-center transition-all duration-1000 ${isVisible('guarantee') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-2xl mb-6">
              <Shield className="h-10 w-10 text-cyan-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-normal text-white mb-4">
              7-Day Money-Back Guarantee
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              We're confident you'll love Market Sniper. If for any reason you're
              not satisfied with our service, contact us within 7 days for a full refund.
              No questions asked.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-normal rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Start Risk-Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
