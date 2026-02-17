'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import MarketSniperIndicator from '@/components/MarketSniperIndicator';
import PricingCard from '@/components/PricingCard';
import {
  User,
  CreditCard,
  Calendar,
  AlertCircle,
  Crown,
  Lock,
  X,
} from 'lucide-react';

function DashboardContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscribeParam = searchParams.get('subscribe');

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (subscribeParam) {
      setSelectedPlan(subscribeParam);
      setShowPayment(true);
    }
  }, [subscribeParam]);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handlePayment = async (plan) => {
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchSubscription();
        await update({ subscriptionStatus: 'active' });
        setShowPayment(false);
        setSelectedPlan(null);
        router.replace('/dashboard');
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const isSubscribed = subscription?.status === 'active' || session?.user?.subscriptionStatus === 'active';

  const plans = [
    {
      title: 'Weekly',
      price: 499,
      period: 'week',
      plan: 'weekly',
      features: ['Market Sniper Indicator', 'All Markets Access', 'Real-time Updates'],
    },
    {
      title: 'Monthly',
      price: 1499,
      period: 'month',
      plan: 'monthly',
      isPopular: true,
      features: ['Market Sniper Indicator', 'Priority Support', 'Trading Alerts'],
    },
    {
      title: 'Yearly',
      price: 9999,
      period: 'year',
      plan: 'yearly',
      features: ['Market Sniper Indicator', '1-on-1 Support', 'Save 45%'],
    },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-muted mt-1">Welcome back, {session.user.name}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {isSubscribed ? (
              <div className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-lg">
                <Crown className="h-5 w-5" />
                <span className="font-medium">Pro Member</span>
              </div>
            ) : (
              <button
                onClick={() => setShowPayment(true)}
                className="flex items-center space-x-2 bg-accent hover:bg-accent/80 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Crown className="h-5 w-5" />
                <span>Upgrade to Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <User className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-muted text-sm">Account</p>
                <p className="text-white font-semibold">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-muted text-sm">Subscription</p>
                <p className={`font-semibold ${isSubscribed ? 'text-accent' : 'text-muted'}`}>
                  {isSubscribed ? `${subscription?.plan?.toUpperCase() || 'Active'}` : 'No active plan'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-muted text-sm">Expires</p>
                <p className="text-white font-semibold">
                  {subscription?.endDate
                    ? new Date(subscription.endDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Warning */}
        {!isSubscribed && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-medium">Limited Access</p>
              <p className="text-muted text-sm mt-1">
                Subscribe to unlock Market Sniper indicator with real-time signals for all markets.
              </p>
            </div>
          </div>
        )}

        {/* Market Sniper Indicator */}
        {isSubscribed ? (
          <MarketSniperIndicator />
        ) : (
          <div className="bg-card border border-border rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center p-8">
                <Lock className="h-16 w-16 text-muted mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Market Sniper Locked</h3>
                <p className="text-muted mb-6 max-w-md">
                  Get access to real-time trading signals for Crypto, Nifty, Gold, Silver, and more.
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="bg-accent hover:bg-accent/80 text-black px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Subscribe to Unlock
                </button>
              </div>
            </div>
            <div className="opacity-20 pointer-events-none">
              <MarketSniperIndicator />
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setSelectedPlan(null);
                  }}
                  className="text-muted hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {selectedPlan ? (
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">
                      Complete Your Payment
                    </h3>
                    <div className="bg-black rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-muted">Plan</span>
                        <span className="text-white font-semibold capitalize">{selectedPlan}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Amount</span>
                        <span className="text-accent font-bold text-xl">
                          ₹{plans.find(p => p.plan === selectedPlan)?.price || 0}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted text-sm text-center mb-6">
                      This is a demo payment. Click the button below to activate your subscription.
                    </p>

                    <button
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={paymentLoading}
                      className="w-full bg-accent hover:bg-accent/80 text-black py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {paymentLoading ? 'Processing...' : 'Pay Now'}
                    </button>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full mt-4 text-muted hover:text-white transition-colors"
                    >
                      Choose Different Plan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <PricingCard
                        key={plan.plan}
                        {...plan}
                        onSelect={setSelectedPlan}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
