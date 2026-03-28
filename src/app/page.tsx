'use client';

import { useState } from 'react';
import { apps, categories } from '@/data/apps';
import AppCard from '@/components/AppCard';

const stats = [
  { label: 'Apps Deployed', value: '14+', color: 'text-primary' },
  { label: 'In Pipeline', value: '200+', color: 'text-secondary' },
  { label: 'Categories', value: '4', color: 'text-accent' },
  { label: 'Uptime', value: '99.9%', color: 'text-yellow-400' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? apps
    : apps.filter((a) => a.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Portfolio
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Paperclip</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Showroom
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Apps built at scale with AI-powered generation and automated deployment.
              From concept to production in minutes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`glass-card p-5 text-center animate-fade-in-up stagger-${i + 1}`}
                style={{ opacity: 0 }}
              >
                <div className={`text-3xl font-bold ${stat.color} animate-count-up`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter + Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No apps found in this category.
          </div>
        )}
      </section>
    </div>
  );
}
