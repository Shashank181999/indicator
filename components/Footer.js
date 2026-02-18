'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030712] border-t border-cyan-500/10 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

      {/* Newsletter Section */}
      <div className="relative border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                Get Trading Insights
              </h3>
              <p className="text-gray-500 text-sm">
                Subscribe for market analysis and signals.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 sm:w-56 px-4 py-2.5 bg-white/5 border border-cyan-500/20 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Market Sniper"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  Market<span className="text-cyan-400">Sniper</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Precision trading signals powered by advanced algorithms.
            </p>
            <div className="flex gap-2">
              {['X', 'in', 'YT', 'IG'].map((label, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all text-xs font-medium"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Indicators</h3>
            <ul className="space-y-2.5">
              {[
                'Market Sniper',
                'RSI Signals',
                'EMA Crossover',
                'MACD',
              ].map((item) => (
                <li key={item}>
                  <span className="text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:support@marketsniper.com" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Email</span>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="text-gray-500 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Phone</span>
                </a>
              </li>
              <li>
                <span className="text-gray-500 text-sm flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Mumbai, India</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs flex items-center gap-1">
              &copy; {currentYear} Market Sniper. Made with
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              in India
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Privacy', 'Terms', 'Disclaimer'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-cyan-400 text-xs transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
