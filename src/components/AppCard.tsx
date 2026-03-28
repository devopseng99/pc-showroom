import { AppData, categoryColors } from '@/data/apps';

export default function AppCard({ app }: { app: AppData }) {
  return (
    <div className="glass-card overflow-hidden group hover:border-gray-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className={`h-40 bg-gradient-to-br ${app.gradient} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <span className="text-4xl font-bold text-white/30 select-none">#{app.id}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white text-lg leading-tight">{app.name}</h3>
        </div>
        <span className={`inline-block text-xs px-2.5 py-1 rounded-full border mb-3 ${categoryColors[app.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {app.category}
        </span>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{app.description}</p>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          Visit Site
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
