'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, Target, User, LogOut, Shield, Zap } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 rounded-xl">
                <Target className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">Market Sniper</span>
              <span className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">Pro Trading Signals</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center ring-2 ring-cyan-500/30">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-white text-sm font-medium">{session.user.name}</div>
                    <div className="text-gray-500 text-xs">{session.user.email}</div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="relative group px-6 py-2.5 rounded-lg font-semibold overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-white">Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {session ? (
              <>
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg"
                >
                  <Zap className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-gray-300 hover:text-white border border-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
