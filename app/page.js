import Link from 'next/link';
import {
  TrendingUp,
  BarChart2,
  Target,
  Bell,
  Clock,
  Users,
  ChevronRight,
  Star,
  Shield,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Activity,
} from 'lucide-react';

export const metadata = {
  title: 'Market Sniper - Professional Trading Signals & Indicators',
  description: 'Get real-time trading signals for stocks, crypto, and commodities. Professional indicators powered by advanced algorithms.',
};

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: 'Precision Signals',
      description: 'Our advanced algorithms analyze market data to deliver accurate buy/sell signals in real-time.',
    },
    {
      icon: Activity,
      title: 'Live Market Data',
      description: 'Real-time WebSocket feeds for crypto, live updates for stocks, indices and commodities.',
    },
    {
      icon: BarChart2,
      title: 'Technical Indicators',
      description: 'RSI, MACD, EMA crossovers, Bollinger Bands and more - all calculated automatically.',
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'Get notified immediately when trading opportunities arise in your chosen markets.',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in stop-loss suggestions and position sizing to protect your capital.',
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Our system never sleeps - monitoring markets around the clock for opportunities.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Traders' },
    { value: '85%', label: 'Signal Accuracy' },
    { value: '24/7', label: 'Live Support' },
    { value: '5+', label: 'Markets Covered' },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Day Trader',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      text: 'Market Sniper has transformed my trading. The real-time signals are incredibly accurate and the interface is intuitive.',
    },
    {
      name: 'Priya Patel',
      role: 'Crypto Investor',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      text: 'Finally a platform that delivers on its promises. The live Bitcoin feed is exactly what I needed for scalping.',
    },
    {
      name: 'Amit Kumar',
      role: 'Swing Trader',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      text: 'The RSI and MACD indicators have helped me time my entries perfectly. My win rate has improved significantly.',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80"
            alt="Trading Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        </div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 text-sm font-medium">Live Trading Signals Active</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Trade Smarter with
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              AI-Powered Signals
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            Real-time trading signals for crypto, stocks, and commodities.
            Make informed decisions with professional-grade indicators.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all text-lg"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              <Play className="h-5 w-5" />
              View Live Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Trade Better</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Professional-grade tools and indicators designed to give you an edge in the market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
                <BarChart2 className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Live Dashboard</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Real-Time Charts &
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Professional Indicators
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Monitor multiple markets simultaneously with our advanced charting system.
                Candlestick charts, volume analysis, RSI, MACD, and more - all updating in real-time.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Live WebSocket feed for crypto markets',
                  'Technical indicators calculated automatically',
                  'Buy/Sell signals overlaid on charts',
                  'Multi-timeframe analysis support',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Explore Dashboard
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80"
                  alt="Trading Dashboard"
                  className="w-full rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Trading in
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> 3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and get instant access to our trading platform.' },
              { step: '02', title: 'Choose Markets', desc: 'Select from crypto, stocks, indices, commodities, or forex markets.' },
              { step: '03', title: 'Start Trading', desc: 'Follow our signals and make informed trading decisions.' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-8xl font-bold text-white/5 absolute -top-4 left-0">{item.step}</div>
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> 10,000+ Traders</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-cyan-400 fill-cyan-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-black/80 to-cyan-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of traders who trust Market Sniper for their trading decisions.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all text-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-lg"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
