import Link from 'next/link';
import { Target, Mail, Phone, MapPin, Twitter, Linkedin, Youtube, Instagram, Send, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get Trading Insights
              </h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for market analysis, trading tips, and exclusive indicator updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-72 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                <span>Subscribe</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 rounded-xl">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Market Sniper</span>
                <span className="text-xs text-cyan-400 font-medium">Pro Trading Signals</span>
              </div>
            </Link>
            <p className="text-gray-400 max-w-md">
              Professional trading indicators powered by advanced algorithms.
              Make smarter trading decisions with real-time signals for stocks, crypto, and commodities.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: '#', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                { icon: Linkedin, href: '#', color: 'hover:bg-blue-600/20 hover:text-blue-500' },
                { icon: Youtube, href: '#', color: 'hover:bg-red-500/20 hover:text-red-400' },
                { icon: Instagram, href: '#', color: 'hover:bg-pink-500/20 hover:text-pink-400' },
              ].map(({ icon: Icon, href, color }, index) => (
                <a
                  key={index}
                  href={href}
                  className={`p-3 bg-white/5 rounded-xl text-gray-400 transition-all ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Indicators
            </h3>
            <ul className="space-y-4">
              {[
                'Market Sniper Pro',
                'RSI Signals',
                'EMA Crossover',
                'MACD Analysis',
                'Volume Profile',
              ].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@marketsniper.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Mail className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span>support@marketsniper.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Phone className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span>Mumbai, Maharashtra<br />India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              &copy; {currentYear} Market Sniper. Made with
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              in India
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Refund Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-cyan-400 text-sm transition-colors"
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
