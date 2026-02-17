import { Target, Users, Award, TrendingUp, Shield, CheckCircle, Globe, Heart, Rocket, Eye, Brain } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Market Sniper',
  description: 'Learn about Market Sniper, our mission, and the team behind the trading indicators.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Vikram Singh',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      description: 'Former quant trader with 15+ years of experience in algorithmic trading at Goldman Sachs.',
    },
    {
      name: 'Anjali Mehta',
      role: 'Head of Research',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      description: 'Ph.D. in Financial Mathematics from IIT, specializing in technical analysis and ML.',
    },
    {
      name: 'Ravi Kumar',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
      description: 'Full-stack developer with expertise in real-time trading systems and data pipelines.',
    },
    {
      name: 'Neha Patel',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      description: 'Dedicated to helping traders maximize their potential with our trading tools.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'We provide accurate, reliable signals that traders can trust for consistent results.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'No black boxes. We explain exactly how our indicators work and why they work.',
    },
    {
      icon: Brain,
      title: 'Innovation',
      description: 'Constantly improving our algorithms based on market evolution and trader feedback.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a community of successful traders who learn and grow together.',
    },
  ];

  const milestones = [
    { year: '2021', title: 'Founded', description: 'Market Sniper was born with a vision to democratize trading' },
    { year: '2022', title: '5K Users', description: 'Reached our first 5,000 active traders milestone' },
    { year: '2023', title: 'Multi-Market', description: 'Expanded to crypto, forex, and commodities markets' },
    { year: '2024', title: '10K Users', description: 'Crossed 10,000 traders with 85% satisfaction rate' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1920&q=80"
            alt="About Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
        </div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-5 py-2 mb-8">
              <Target className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">About Market Sniper</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Empowering Traders with
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Precision Signals
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We started with a simple mission: to give retail traders access to the same
              professional-grade indicators used by institutional players on Wall Street.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Rocket className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                From Wall Street
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  to Your Screen
                </span>
              </h2>
              <div className="space-y-6 text-gray-400 text-lg">
                <p>
                  Market Sniper began in 2021 when our founder, Vikram Singh, noticed
                  that retail traders lacked access to the sophisticated tools
                  used by institutional traders.
                </p>
                <p>
                  After years of developing proprietary trading algorithms for hedge
                  funds, Vikram decided to level the playing field. He assembled a team
                  of experienced traders, quantitative analysts, and software engineers.
                </p>
                <p>
                  Today, Market Sniper serves over 10,000 traders across India and beyond,
                  providing institutional-grade indicators at an affordable price.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Join Our Community
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Trading Analytics"
                  className="w-full rounded-2xl border border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10K+', label: 'Active Traders', icon: Users },
              { value: '85%', label: 'Signal Accuracy', icon: Target },
              { value: '3+', label: 'Years Experience', icon: Award },
              { value: '24/7', label: 'Live Support', icon: Globe },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-colors">
                  <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Journey</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-cyan-500 to-transparent hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 transition-colors">
                      <div className="text-cyan-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full z-10">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Our Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What We
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Stand For</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/30 transition-all hover:-translate-y-1"
              >
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Experts</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              The brilliant minds behind Market Sniper&apos;s powerful trading indicators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <div className="text-cyan-400 text-sm mb-3">{member.role}</div>
                  <p className="text-gray-400 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
            alt="Mission Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-8">
            <Award className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 mb-10">
            To empower every trader with the tools and knowledge they need to
            succeed in the financial markets. We believe that with the right
            indicators and education, anyone can become a profitable trader.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-white text-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all"
          >
            Start Your Journey
            <TrendingUp className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
