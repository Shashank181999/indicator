'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import PricingCard from '@/components/PricingCard';

// Lazy load the heavy chart component - only loads when needed
const MarketSniperIndicator = dynamic(
  () => import('@/components/MarketSniperIndicator'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] flex items-center justify-center bg-[#131722] rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading chart...</span>
        </div>
      </div>
    ),
  }
);
import {
  User,
  CreditCard,
  Calendar,
  AlertCircle,
  Crown,
  Lock,
  X,
  Zap,
  TrendingUp,
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
      price: 6,
      period: 'week',
      plan: 'weekly',
      features: ['Market Sniper Indicator', 'All Markets Access', 'Real-time Updates'],
    },
    {
      title: 'Monthly',
      price: 18,
      period: 'month',
      plan: 'monthly',
      isPopular: true,
      features: ['Market Sniper Indicator', 'Priority Support', 'Trading Alerts'],
    },
    {
      title: 'Yearly',
      price: 99,
      period: 'year',
      plan: 'yearly',
      features: ['Market Sniper Indicator', '1-on-1 Support', 'Save 55%'],
    },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-orange-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Subtle background effects - optimized for performance */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[50px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-normal text-white">Dashboard</h1>
              {isSubscribed && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Pro</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">Welcome back, {session.user.name?.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            {!isSubscribed && (
              <button
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-normal transition-all hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <Zap className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* Account Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0a1628]/60 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
                <User className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Account</p>
                <p className="text-white text-sm font-medium truncate">{session.user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a1628]/60 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl">
                <CreditCard className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Plan</p>
                <p className={`text-sm font-normal ${isSubscribed ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' : 'text-gray-500'}`}>
                  {isSubscribed ? `${subscription?.plan?.toUpperCase() || 'PRO'}` : 'Free Plan'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a1628]/60 backdrop-blur border border-white/5 rounded-2xl p-5 hover:border-cyan-500/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <Calendar className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Expires</p>
                <p className="text-white text-sm font-medium">
                  {subscription?.endDate
                    ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Warning */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-amber-400 text-sm font-medium">Unlock Premium Features</p>
              <p className="text-amber-500/70 text-xs mt-0.5">Subscribe to access real-time trading signals and advanced indicators</p>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="hidden sm:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              <span>View Plans</span>
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Market Sniper Indicator - Full width */}
        {isSubscribed ? (
          <div className="bg-[#0a1628]/40 backdrop-blur border border-white/5 rounded-2xl overflow-hidden">
            <MarketSniperIndicator />
          </div>
        ) : (
          <div className="bg-[#0a1628]/40 backdrop-blur border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center p-8 max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Lock className="h-10 w-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-normal text-white mb-3">Market Sniper Locked</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Get real-time trading signals for Crypto, Nifty, Gold & more with our advanced Market Sniper indicator
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-xl font-normal transition-all hover:shadow-lg hover:shadow-cyan-500/25 text-sm"
                >
                  Subscribe to Unlock
                </button>
              </div>
            </div>
            <div className="opacity-10 pointer-events-none">
              <MarketSniperIndicator />
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-[#030712]/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a1628] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-normal text-white">Choose Your Plan</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Select a plan to unlock all features</p>
                </div>
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setSelectedPlan(null);
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {selectedPlan ? (
                  <div className="max-w-sm mx-auto">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <CreditCard className="h-8 w-8 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-normal text-white">Complete Payment</h3>
                    </div>

                    <div className="bg-[#030712]/50 rounded-2xl p-6 mb-6 border border-white/5">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                        <span className="text-gray-500 text-sm">Plan</span>
                        <span className="text-white font-normal capitalize">{selectedPlan}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Amount</span>
                        <span className="text-2xl font-normal bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          ${plans.find(p => p.plan === selectedPlan)?.price || 0}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-xs text-center mb-6">
                      Demo payment - Click to activate subscription
                    </p>

                    <button
                      onClick={() => handlePayment(selectedPlan)}
                      disabled={paymentLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-xl font-normal transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/25"
                    >
                      {paymentLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : 'Pay Now'}
                    </button>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full mt-4 text-gray-500 hover:text-white transition-colors text-sm"
                    >
                      Choose Different Plan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-orange-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
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
