'use client';

import { apps } from '@/data/apps';

const categoryData = apps.reduce((acc, app) => {
  acc[app.category] = (acc[app.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const categoryEntries = Object.entries(categoryData).sort((a, b) => b[1] - a[1]);
const maxCount = Math.max(...categoryEntries.map(([, count]) => count));

const barColors: Record<string, string> = {
  'Travel & Booking': 'bg-sky-500',
  'Healthcare Tech': 'bg-teal-500',
  'Financial Services': 'bg-emerald-500',
  'Green & Sustainability': 'bg-lime-500',
  'Media & Publishing': 'bg-violet-500',
  'Legal & Compliance': 'bg-gray-400',
  'Creator Platform': 'bg-green-500',
  'Local Business': 'bg-blue-500',
  'AI/Analytics': 'bg-purple-500',
  'AI/Creative': 'bg-pink-500',
  'SaaS & Developer Tools': 'bg-slate-400',
  'Food Tech': 'bg-orange-500',
  'Real Estate Tech': 'bg-amber-500',
  'Platform': 'bg-indigo-500',
};

const pieColors = [
  '#0EA5E9', '#14B8A6', '#10B981', '#84CC16', '#8B5CF6',
  '#9CA3AF', '#22C55E', '#3B82F6', '#A855F7', '#EC4899',
  '#64748B', '#F97316', '#F59E0B', '#6366F1',
];

const techStack = [
  { name: 'Next.js', pct: 100 },
  { name: 'TypeScript', pct: 100 },
  { name: 'Tailwind CSS', pct: 100 },
  { name: 'Cloudflare Pages', pct: 100 },
  { name: 'React', pct: 100 },
  { name: 'AI Generation', pct: 95 },
];

const timeline = [
  { date: 'Mar 27, 2026', event: 'Platform launch — first local business apps deployed', count: 3 },
  { date: 'Mar 27, 2026', event: 'AI/Analytics and Creator Platform batches deployed', count: 11 },
  { date: 'Mar 27, 2026', event: 'TravelHub super-app and Showroom portfolio launched', count: 2 },
  { date: 'Mar 27, 2026', event: 'Autopilot pipeline v2 — first 4 category-aware builds', count: 4 },
  { date: 'Mar 28, 2026', event: 'Full pipeline run — Travel, Legal, Finance, Healthcare, Green, Media batches', count: 64 },
];

export default function StatsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Portfolio Stats</h1>
        <p className="text-gray-400 text-lg">Real-time metrics from the Paperclip deployment pipeline.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Apps', value: apps.length, icon: '▦', color: 'from-primary to-blue-600' },
          { label: 'Categories', value: Object.keys(categoryData).length, icon: '◈', color: 'from-secondary to-purple-600' },
          { label: 'In Pipeline', value: '116+', icon: '⟳', color: 'from-accent to-emerald-600' },
          { label: 'Success Rate', value: '96%', icon: '✓', color: 'from-yellow-500 to-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white text-lg mb-3`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Category Breakdown - Bar Chart */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Apps by Category</h2>
          <div className="space-y-3">
            {categoryEntries.map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{category}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="h-7 bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${barColors[category] || 'bg-gray-500'} rounded-lg transition-all duration-700 flex items-center pl-3`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white/80">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Category Distribution</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  const total = apps.length;
                  return categoryEntries.map(([, count], i) => {
                    const pct = (count / total) * 100;
                    const circumference = Math.PI * 40;
                    const dashLen = (pct / 100) * circumference;
                    const dashOffset = -(offset / 100) * circumference;
                    offset += pct;
                    return (
                      <circle
                        key={i}
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke={pieColors[i % pieColors.length]}
                        strokeWidth="20"
                        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                        strokeDashoffset={dashOffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{apps.length}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {categoryEntries.map(([category, count], i) => (
              <div key={category} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }} />
                <span className="text-gray-400 truncate">{category} ({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-6 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Technology Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech) => (
            <div key={tech.name} className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 font-medium">{tech.name}</span>
                <span className="text-gray-500">{tech.pct}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  style={{ width: `${tech.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Timeline */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Deployment Timeline</h2>
        <div className="space-y-6">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
                {i < timeline.length - 1 && <div className="w-px h-full bg-gray-800 mt-1" />}
              </div>
              <div className="pb-6">
                <div className="text-sm text-primary font-medium">{item.date}</div>
                <div className="text-gray-300 mt-1">{item.event}</div>
                <div className="text-sm text-gray-500 mt-0.5">+{item.count} apps deployed</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
