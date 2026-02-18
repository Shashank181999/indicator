'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@marketsniper.com',
      description: 'Send us an email anytime',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      description: 'Mon-Fri from 9am to 6pm IST',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Mumbai, Maharashtra',
      description: 'Visit us at our office',
      color: 'from-emerald-500 to-cyan-500',
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'We respond quickly',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Hero Section */}
      <section
        id="contact-hero"
        data-animate
        className="relative py-24 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img src="/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/90 to-[#030712]" />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[60px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[50px]" />

        <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible('contact-hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Contact Us</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Get in
            <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent"> Touch</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions about Market Sniper? We&apos;re here to help.
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section
        id="contact-info"
        data-animate
        className="relative py-12 -mt-8"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 ${isVisible('contact-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${info.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-normal mb-1">{info.title}</h3>
                <p className="text-cyan-400 font-medium mb-1">{info.value}</p>
                <p className="text-gray-500 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        id="contact-form"
        data-animate
        className="relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Info */}
            <div className={`transition-all duration-1000 ${isVisible('contact-form') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <h2 className="text-3xl sm:text-4xl font-normal text-white mb-6">
                Let&apos;s Start a
                <span className="block bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                  Conversation
                </span>
              </h2>
              <p className="text-gray-400 mb-8">
                Whether you have questions about our trading indicators, need help with your
                subscription, or want to provide feedback - we&apos;d love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Quick Response</h4>
                    <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Expert Support</h4>
                    <p className="text-gray-500 text-sm">Our team knows trading inside out</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Helpful Resources</h4>
                    <p className="text-gray-500 text-sm">We&apos;ll guide you to the right solution</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible('contact-form') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="bg-[#0a1628]/80 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-normal text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-500 transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-500 resize-none transition-colors"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-xl font-normal transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        data-animate
        className="relative py-20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-3xl font-normal text-white mb-4">
              Quick <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Answers</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How accurate are Market Sniper signals?',
                a: 'Our signals have an accuracy rate of 85%+ based on historical backtesting and real-time performance.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of the billing period.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee for all new subscriptions if you are not satisfied.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-500 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-white font-normal mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-orange-500/10 border border-cyan-500/20 rounded-2xl p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-normal text-white mb-4">
              Ready to Start Trading?
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of traders using Market Sniper for precision signals.
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-normal rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
