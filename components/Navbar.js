'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Shield, Zap } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
        ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Market Sniper"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                Market<span className="text-cyan-400">Sniper</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-orange-400/80 font-medium tracking-[0.2em] uppercase -mt-0.5">
                Indicator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-colors text-sm"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="bg-[#030712]/98 backdrop-blur-xl border-t border-cyan-500/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5 space-y-2">
            {session ? (
              <>
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors text-sm"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg text-sm"
                >
                  <Zap className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg text-sm"
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
