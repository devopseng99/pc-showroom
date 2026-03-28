'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Interested in the Paperclip platform? Get in touch or explore the source code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Send a Message</h2>
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">&#10003;</div>
              <h3 className="text-lg font-semibold text-white mb-2">Message Received</h3>
              <p className="text-gray-400 text-sm">Thank you for reaching out. We will get back to you soon.</p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
                className="mt-6 btn-outline text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Links & Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Links</h3>
            <div className="space-y-3">
              {[
                { label: 'Showroom Source', url: 'https://github.com/devopseng99/pc-showroom', desc: 'This portfolio app' },
                { label: 'GitHub Profile', url: 'https://github.com/devopseng99', desc: 'All Paperclip repositories' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{link.label}</div>
                    <div className="text-xs text-gray-500">{link.desc}</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Platform Info</h3>
            <dl className="space-y-3">
              {[
                { label: 'Stack', value: 'Next.js, TypeScript, Tailwind CSS' },
                { label: 'Hosting', value: 'Cloudflare Pages (Global CDN)' },
                { label: 'Infrastructure', value: 'Kubernetes on RKE2' },
                { label: 'AI Engine', value: 'Claude by Anthropic' },
                { label: 'Current Apps', value: '14 deployed, 200+ in pipeline' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-800/50 last:border-0">
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="text-sm text-gray-300">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
