'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Target, Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Passwords match', met: formData.password === formData.confirmPassword && formData.confirmPassword !== '' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(plan ? `/dashboard?subscribe=${plan}` : '/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: plan ? `/dashboard?subscribe=${plan}` : '/dashboard' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Subtitle with plan info */}
      <p className="text-muted mt-2 text-center mb-8">
        {plan
          ? `Start your ${plan} subscription`
          : 'Join thousands of successful traders'}
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-danger/10 border border-danger/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {/* Register Form */}
      <div className="bg-card border border-border rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            {passwordRequirements.map((req, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 text-sm ${
                  req.met ? 'text-accent' : 'text-muted'
                }`}
              >
                <Check className={`h-4 w-4 ${req.met ? 'opacity-100' : 'opacity-30'}`} />
                <span>{req.text}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-black py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-6 w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-muted text-center">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-accent hover:text-accent/80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-accent hover:text-accent/80">
            Privacy Policy
          </a>
        </p>
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="animate-pulse space-y-5">
        <div className="h-12 bg-black/50 rounded-lg"></div>
        <div className="h-12 bg-black/50 rounded-lg"></div>
        <div className="h-12 bg-black/50 rounded-lg"></div>
        <div className="h-12 bg-black/50 rounded-lg"></div>
        <div className="h-12 bg-accent/20 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Target className="h-10 w-10 text-accent" />
            <span className="text-2xl font-bold text-white">Market Sniper</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Create Account</h1>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <RegisterForm />
        </Suspense>

        {/* Login Link */}
        <p className="text-center mt-8 text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-accent/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
