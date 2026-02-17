'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      description: 'Mon-Fri from 9am to 6pm IST',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Mumbai, Maharashtra',
      description: 'Visit us at our office',
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24 hours',
      description: 'We respond quickly',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
            <MessageSquare className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm font-medium">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-muted">
            Have questions about Market Sniper? We&apos;re here to help.
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <info.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-white font-semibold mb-1">{info.title}</h3>
              <p className="text-accent font-medium mb-1">{info.value}</p>
              <p className="text-muted text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
              <p className="text-muted mb-6">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-accent hover:text-accent/80 font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
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
                    className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
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
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted"
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
                  className="w-full px-4 py-3 bg-black border border-border rounded-lg focus:outline-none focus:border-accent text-white placeholder-muted resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/80 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </section>

      {/* FAQ Preview */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Frequently Asked Questions
        </h2>
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
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
