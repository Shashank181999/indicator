'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  BarChart2,
  Target,
  Bell,
  Clock,
  ChevronRight,
  Shield,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Activity,
  TrendingUp,
  ChevronDown,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    // Use requestIdleCallback for non-critical animation setup
    const setupObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set([...prev, entry.target.id]));
              // Unobserve after first intersection for better performance
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
    };

    // Delay observer setup to prioritize page render
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(setupObserver);
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(setupObserver, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const features = [
    {
      icon: Target,
      title: 'Precision Signals',
      description: 'AI-powered algorithms deliver accurate buy/sell signals with 85%+ accuracy.',
    },
    {
      icon: Activity,
      title: 'Live Market Data',
      description: 'Real-time WebSocket feeds for crypto, stocks, indices and commodities.',
    },
    {
      icon: BarChart2,
      title: 'Technical Indicators',
      description: 'RSI, MACD, EMA crossovers, Bollinger Bands calculated automatically.',
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'Get notified instantly when trading opportunities arise.',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in stop-loss suggestions and position sizing tools.',
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Our system monitors markets around the clock.',
    },
  ];

  return (
    <div className="bg-[#030712] overflow-hidden">
      {/* Hero Section */}
      <section
        id="hero"
        data-animate
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/95 to-[#030712]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/80" />
        </div>

        {/* Glow effects - reduced blur for better performance */}
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[60px]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left - Text Content */}
            <div className={`transition-all duration-1000 ${isVisible('hero') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-sm font-medium">Live Signals Active</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
                Trade Smarter with
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI-Powered Signals
                </span>
              </h1>

              <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
                Get precise buy/sell signals for <span className="text-cyan-400 font-medium">Bitcoin</span>,
                <span className="text-orange-400 font-medium"> Nifty</span>,
                <span className="text-yellow-400 font-medium"> Gold</span> and 50+ assets.
                Join 10,000+ profitable traders today.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Target, text: '85% Accuracy' },
                  { icon: Zap, text: 'Real-time Alerts' },
                  { icon: Shield, text: 'Risk Management' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/register"
                  className="group relative overflow-hidden px-8 py-4 rounded-xl font-normal text-white transition-all hover:scale-105 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <span className="relative flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-normal rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <Play className="h-4 w-4 text-cyan-400" />
                  Watch Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right - Trading Card Visual */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible('hero') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl scale-90" />

              {/* Main Trading Card */}
              <div className="relative bg-[#0a1628]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-normal">₿</div>
                    <div>
                      <div className="text-white font-normal">BTC/USDT</div>
                      <div className="text-xs text-gray-500">Bitcoin</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-normal text-emerald-400">$98,432.50</div>
                    <div className="text-xs text-emerald-400">+2.34%</div>
                  </div>
                </div>

                {/* Chart Image */}
                <div className="relative h-48">
                  <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-60" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />

                  {/* Signal overlay */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-normal px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                    <TrendingUp className="h-3.5 w-3.5" />
                    BUY SIGNAL
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-px bg-white/5">
                  {[
                    { label: 'RSI', value: '68.5', color: 'text-cyan-400' },
                    { label: 'MACD', value: '+245', color: 'text-emerald-400' },
                    { label: 'EMA', value: 'Bullish', color: 'text-orange-400' },
                    { label: 'Signal', value: 'Strong', color: 'text-emerald-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#0a1628] p-3 text-center">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className={`font-normal ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -left-4 top-1/4 bg-[#0a1628]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                    <div className="text-lg font-normal text-emerald-400">85%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-[#0a1628]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Traders</div>
                    <div className="text-lg font-normal text-cyan-400">10K+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => document.getElementById('ticker')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-cyan-400 transition-all cursor-pointer"
        >
          <span className="text-xs tracking-wider uppercase">Explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </section>

      {/* Live Market Ticker */}
      <section id="ticker" className="relative py-6 overflow-hidden border-y border-white/5 bg-[#030712]/80 backdrop-blur-sm">
        <div className="flex animate-scroll">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-8 px-4">
              {[
                { symbol: 'BTC/USDT', price: '$98,432.50', change: '+2.34%', up: true },
                { symbol: 'ETH/USDT', price: '$3,245.80', change: '+1.87%', up: true },
                { symbol: 'NIFTY 50', price: '₹24,680.25', change: '-0.45%', up: false },
                { symbol: 'GOLD', price: '$2,048.30', change: '+0.92%', up: true },
                { symbol: 'SOL/USDT', price: '$187.45', change: '+5.23%', up: true },
                { symbol: 'BANK NIFTY', price: '₹51,234.50', change: '+0.78%', up: true },
              ].map((ticker, index) => (
                <div key={`${setIndex}-${index}`} className="flex items-center gap-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${ticker.up ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-white font-medium">{ticker.symbol}</span>
                  </div>
                  <span className="text-gray-400">{ticker.price}</span>
                  <span className={ticker.up ? 'text-emerald-400' : 'text-red-400'}>{ticker.change}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-animate
        className="relative py-20 sm:py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />
        {/* Chart image decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 overflow-hidden">
          <img
            loading="lazy" src="https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-4">
              Everything You Need to
              <span className="block sm:inline bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent"> Trade Smarter</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools designed to give you the edge in any market condition.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-normal text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section
        id="video-showcase"
        data-animate
        className="relative py-20 sm:py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#030712]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Video Player */}
            <div className={`relative transition-all duration-1000 ${isVisible('video-showcase') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl scale-95" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a1628]">
                <div className="relative aspect-video overflow-hidden">
                  {/* Local Video */}
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster="/dashboard-chart.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/trading-video.mp4" type="video/mp4" />
                  </video>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-70" />

                  {/* Live indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-white text-xs font-medium">LIVE TRADING</span>
                  </div>

                  {/* Price display */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-xs text-gray-400">BTC/USDT</div>
                    <div className="text-xl font-normal text-emerald-400">$98,432.50</div>
                  </div>

                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">24h Change</div>
                      <div className="text-lg font-normal text-emerald-400">+2.34%</div>
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Signal</div>
                      <div className="text-lg font-normal text-cyan-400">BUY</div>
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">RSI</div>
                      <div className="text-lg font-normal text-orange-400">68.5</div>
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Volume</div>
                      <div className="text-lg font-normal text-purple-400">2.4B</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible('video-showcase') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
                <Play className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">See It In Action</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-4 leading-tight">
                Watch How Traders
                <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Make Profits Daily
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mb-6 leading-relaxed">
                See real traders using Market Sniper to identify winning trades.
                Our signals help you enter at the right time and exit with profits.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Watch live trading sessions',
                  'Learn signal interpretation',
                  'Understand risk management',
                  'See real profit examples',
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 text-gray-300 transition-all duration-500 ${isVisible('video-showcase') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        data-animate
        className="relative py-20 sm:py-28 bg-gradient-to-b from-[#030712] via-[#0a1020] to-[#030712]"
      >
        {/* Chart background */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <img
            loading="lazy" src="https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Trusted by Traders</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-4">
              What Our <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Traders Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Crypto Trader',
                avatar: 'RK',
                color: 'from-cyan-500 to-blue-500',
                quote: 'Market Sniper signals helped me achieve consistent profits. The RSI alerts are incredibly accurate!',
                profit: '+₹2.4L',
              },
              {
                name: 'Priya Sharma',
                role: 'Options Trader',
                avatar: 'PS',
                color: 'from-orange-500 to-yellow-500',
                quote: 'Finally found a reliable indicator for Nifty options. The Sniper Oscillator is a game changer.',
                profit: '+₹1.8L',
              },
              {
                name: 'Amit Patel',
                role: 'Day Trader',
                avatar: 'AP',
                color: 'from-emerald-500 to-cyan-500',
                quote: 'Real-time signals and accurate entry points. This tool paid for itself in the first week.',
                profit: '+₹3.2L',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/5 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white font-normal text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                  <div className="ml-auto bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1">
                    <span className="text-emerald-400 font-normal text-sm">{testimonial.profit}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section
        id="dashboard"
        data-animate
        className="relative py-20 sm:py-28"
      >
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[60px] -translate-y-1/2" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible('dashboard') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
                <BarChart2 className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-medium">Live Dashboard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-4 leading-tight">
                Real-Time Charts &
                <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                  Professional Indicators
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mb-6 leading-relaxed">
                Monitor multiple markets with our advanced TradingView-style charting.
                Candlestick patterns, volume analysis, and custom indicators.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Live WebSocket feeds for instant updates',
                  'RSI, MACD, EMA indicators auto-calculated',
                  'Buy/Sell signals overlaid on charts',
                  'Multi-timeframe analysis (1m to 1W)',
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 text-gray-300 transition-all duration-500 ${isVisible('dashboard') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-normal rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105 group"
              >
                Try Live Dashboard
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Dashboard Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible('dashboard') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl scale-95" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a1628] shadow-2xl">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0f1f38] border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white/5 rounded-lg px-4 py-1.5 text-xs text-gray-500 text-center">
                      marketsniper.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Trading Chart Image */}
                <div className="relative aspect-[4/3] bg-[#0a1628] overflow-hidden">
                  {/* Chart Image */}
                  <img
                    src="/dashboard-chart.jpg"
                    alt="Trading Chart"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />

                  {/* Overlay stats */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">BTC/USDT</div>
                      <div className="text-lg font-normal text-emerald-400">$98,432.50</div>
                      <div className="text-xs text-emerald-400">+2.34%</div>
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-xs text-gray-400 mb-1">Signal</div>
                      <div className="text-lg font-normal text-cyan-400">BUY</div>
                      <div className="text-xs text-gray-400">Strong</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        data-animate
        className="relative py-20 sm:py-28"
      >
        {/* Chart background */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <img
            loading="lazy" src="https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#071020]/90 to-[#030712]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-4">
              Start Trading in
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent"> 3 Simple Steps</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Get started in minutes and receive your first trading signal today.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                desc: 'Sign up free in 30 seconds. No credit card required.',
                icon: '🚀',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                step: '02',
                title: 'Choose Markets',
                desc: 'Select Bitcoin, Nifty, Gold, or any market you want to trade.',
                icon: '📊',
                color: 'from-blue-500 to-purple-500'
              },
              {
                step: '03',
                title: 'Start Trading',
                desc: 'Follow our signals and make profitable trades.',
                icon: '💰',
                color: 'from-orange-500 to-yellow-500'
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-700 ${isVisible('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {index < 2 && (
                  <div className="hidden sm:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}

                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 text-center hover:border-cyan-500/30 transition-all duration-500 group-hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/5">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white text-lg font-normal mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    {item.step}
                  </div>
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                  <h3 className="text-xl font-normal text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        data-animate
        className="relative py-24 sm:py-32"
      >
        {/* Chart background */}
        <div className="absolute inset-0 opacity-15 overflow-hidden">
          <img
            loading="lazy" src="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[200px] animate-pulse-slow" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[60px] animate-pulse-slow animation-delay-2000" />
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible('cta') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 leading-tight">
            Ready to Become a
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-orange-400 bg-clip-text text-transparent">
              Profitable Trader?
            </span>
          </h2>

          <p className={`text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-200 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join 10,000+ traders who trust Market Sniper for precision trading signals.
            Start your free trial today - no credit card required.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 transition-all duration-1000 delay-400 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              href="/register"
              className="group relative w-full sm:w-auto overflow-hidden px-10 py-4 rounded-xl font-normal text-white transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-[length:200%_100%] animate-gradient" />
              <span className="relative flex items-center justify-center gap-2 text-lg">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-normal rounded-xl hover:bg-white/10 hover:scale-105 transition-all"
            >
              View Pricing Plans
            </Link>
          </div>

          <div className={`flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm transition-all duration-1000 delay-600 ${isVisible('cta') ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>85% Win Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes float-candle {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scaleY(1.2); opacity: 0.5; }
        }

        @keyframes grow-bar {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes draw-line {
          0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          100% { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }

        @keyframes draw {
          0% { stroke-dasharray: 2000; stroke-dashoffset: 2000; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dasharray: 2000; stroke-dashoffset: 0; opacity: 1; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-float-candle {
          animation: float-candle 3s ease-in-out infinite;
        }

        .animate-grow-bar {
          animation: grow-bar 1s ease-out forwards;
          transform-origin: bottom;
        }

        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }

        .animate-draw {
          animation: draw 4s ease-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
