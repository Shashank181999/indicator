'use client';

import Link from 'next/link';
import { Target, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black to-card">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Green Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-accent text-sm font-medium">Professional Trading Indicators</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Precision Trading with
          <span className="block text-accent mt-2">Market Sniper</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10">
          Advanced trading indicators powered by proven algorithms.
          Get real-time RSI, EMA, and custom signals to maximize your trading success.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            Start Free Trial
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto border border-border hover:border-accent text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            View Pricing
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
            <Target className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Precise Signals</h3>
            <p className="text-muted text-sm">
              Accurate buy/sell signals with 85%+ win rate
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
            <TrendingUp className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Real-Time Data</h3>
            <p className="text-muted text-sm">
              Live market analysis with instant updates
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-accent/50 transition-colors">
            <Shield className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Risk Management</h3>
            <p className="text-muted text-sm">
              Built-in stop-loss and take-profit levels
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">10K+</div>
            <div className="text-muted text-sm">Active Traders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">85%</div>
            <div className="text-muted text-sm">Signal Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
            <div className="text-muted text-sm">Market Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">3+</div>
            <div className="text-muted text-sm">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}
