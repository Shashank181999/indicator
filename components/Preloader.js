'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show preloader on initial page load (not client-side navigation)
    // Check if this is a fresh page load vs SPA navigation
    const isInitialLoad = !sessionStorage.getItem('app_loaded');

    if (!isInitialLoad) {
      // Skip preloader for client-side navigation
      setLoading(false);
      return;
    }

    // Mark that app has loaded
    sessionStorage.setItem('app_loaded', 'true');

    // Fast preloader - only 200ms wait + 300ms fade
    const handleLoad = () => {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setLoading(false), 300);
      }, 200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#030712] flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Logo animation */}
        <div className="relative w-16 h-16 mb-6">
          {/* Spinning ring */}
          <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-cyan-500 rounded-full animate-spin" />

          {/* Inner pulse */}
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full animate-pulse" />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-xl font-light text-white tracking-wide">
            Market<span className="text-cyan-400">Sniper</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Loading</p>
        </div>

        {/* Loading bar */}
        <div className="mt-6 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-loading-bar" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0;
          }
          50% {
            width: 70%;
            margin-left: 0;
          }
          100% {
            width: 100%;
            margin-left: 0;
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
