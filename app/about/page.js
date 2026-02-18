'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target, Users, Award, Shield, Globe, Heart, Rocket,
  Eye, Brain, ArrowRight, Zap
} from 'lucide-react';

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const team = [
    {
      name: 'Vikram Singh',
      role: 'Founder & CEO',
      initials: 'VS',
      color: 'from-cyan-500 to-blue-500',
      description: 'Former quant trader with 15+ years in algorithmic trading.',
    },
    {
      name: 'Anjali Mehta',
      role: 'Head of Research',
      initials: 'AM',
      color: 'from-orange-500 to-yellow-500',
      description: 'Ph.D. in Financial Mathematics, ML specialist.',
    },
    {
      name: 'Ravi Kumar',
      role: 'Lead Developer',
      initials: 'RK',
      color: 'from-emerald-500 to-cyan-500',
      description: 'Expert in real-time trading systems and data pipelines.',
    },
    {
      name: 'Neha Patel',
      role: 'Customer Success',
      initials: 'NP',
      color: 'from-purple-500 to-pink-500',
      description: 'Dedicated to helping traders maximize their potential.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Accurate, reliable signals traders can trust for consistent results.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'No black boxes. We explain how our indicators work.',
    },
    {
      icon: Brain,
      title: 'Innovation',
      description: 'Constantly improving algorithms based on market evolution.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a community of successful traders together.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Traders', icon: Users },
    { value: '85%', label: 'Signal Accuracy', icon: Target },
    { value: '3+', label: 'Years Experience', icon: Award },
    { value: '24/7', label: 'Live Support', icon: Globe },
  ];

  const milestones = [
    { year: '2021', title: 'Founded', description: 'Market Sniper was born with a vision to democratize trading' },
    { year: '2022', title: '5K Users', description: 'Reached our first 5,000 active traders milestone' },
    { year: '2023', title: 'Multi-Market', description: 'Expanded to crypto, forex, and commodities markets' },
    { year: '2024', title: '10K Users', description: 'Crossed 10,000 traders with 85% satisfaction rate' },
  ];

  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Hero Section */}
      <section
        id="about-hero"
        data-animate
        className="relative py-32 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/about-hero.jpg" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/80 to-[#030712]" />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[50px]" />

        <div className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible('about-hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <Target className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">About Market Sniper</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Empowering Traders with
            <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Precision Signals
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We give retail traders access to the same professional-grade indicators
            used by institutional players. Our mission is to level the playing field.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all">
                <stat.icon className="h-6 w-6 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-normal bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        id="story"
        data-animate
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible('story') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
                <Rocket className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">Our Story</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-normal text-white mb-6 leading-tight">
                From Wall Street
                <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                  to Your Screen
                </span>
              </h2>

              <div className="space-y-4 text-gray-400">
                <p>
                  Market Sniper began in 2021 when our founder noticed that retail traders
                  lacked access to the sophisticated tools used by institutional traders.
                </p>
                <p>
                  After years of developing proprietary trading algorithms for hedge funds,
                  we decided to level the playing field by assembling a team of experienced
                  traders, quantitative analysts, and software engineers.
                </p>
                <p>
                  Today, we serve over 10,000 traders across India and beyond, providing
                  institutional-grade indicators at an affordable price.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-normal rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Join Our Community
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white font-normal rounded-xl hover:bg-white/10 transition-all"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* Trading Visual */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible('story') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl scale-90" />
              <div className="relative bg-[#0a1628]/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
                <img src="/about-story.jpg" alt="Trading" className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />

                {/* Overlay card */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Total Signals Delivered</div>
                      <div className="text-2xl font-normal text-cyan-400">1.2M+</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Avg. Accuracy</div>
                      <div className="text-2xl font-normal text-emerald-400">85%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        data-animate
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-4">
              What We <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Stand For</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`group bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 ${isVisible('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-normal text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        id="timeline"
        data-animate
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-4">
              Our <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Journey</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-orange-500 hidden sm:block" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex gap-6 transition-all duration-700 ${isVisible('timeline') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Dot */}
                  <div className="hidden sm:flex items-center justify-center w-16 flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-cyan-400 font-normal">{milestone.year}</span>
                      <span className="text-white font-normal">{milestone.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team"
        data-animate
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[60px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('team') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Our Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal text-white mb-4">
              Meet the <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Experts</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              The brilliant minds behind Market Sniper&apos;s powerful trading indicators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className={`group bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 ${isVisible('team') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Avatar */}
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-white text-2xl font-normal mb-4 group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-normal text-white">{member.name}</h3>
                <div className="text-cyan-400 text-sm mb-3">{member.role}</div>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        data-animate
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[200px]" />
        </div>

        <div className={`relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex p-4 bg-gradient-to-r from-cyan-500/20 to-orange-500/20 rounded-2xl mb-6">
            <Zap className="h-10 w-10 text-cyan-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mb-4">
            Ready to Start
            <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
              Your Trading Journey?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join 10,000+ traders who trust Market Sniper for precision trading signals.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-normal rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-normal rounded-xl hover:bg-white/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
