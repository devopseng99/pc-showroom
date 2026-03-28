export default function RoadmapPage() {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      status: 'completed',
      period: 'Mar 2026',
      items: [
        'Platform architecture and K8s deployment',
        'Spec-ingestion plugin for automated app generation',
        'First 3 local business apps deployed',
        'Client onboarding pipeline established',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Scale to 14',
      status: 'completed',
      period: 'Mar 2026',
      items: [
        'AI/Analytics apps: ChartGen AI, AnomalyWatch',
        'Creator Platform batch: 8 apps deployed',
        'AI/Creative: ChildArt Storybook Maker',
        'Batch deployment pipeline (2 concurrent builds)',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Pipeline Automation',
      status: 'in-progress',
      period: 'Q2 2026',
      items: [
        'Apps 15-50: Expand into 8 new categories',
        'Automated quality assurance checks',
        'Performance monitoring dashboard',
        'Template library expansion',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'Scale to 200',
      status: 'planned',
      period: 'Q2-Q3 2026',
      items: [
        'Apps 51-200: Full category coverage',
        'E-commerce, SaaS, Portfolio, Education templates',
        'Health & Fitness, Food & Beverage verticals',
        'Multi-language support',
      ],
    },
    {
      phase: 'Phase 5',
      title: 'Scale to 400',
      status: 'planned',
      period: 'Q3-Q4 2026',
      items: [
        'Apps 201-400: Enterprise-scale deployment',
        'Advanced AI personalization per app',
        'Custom domain automation',
        'Real-time analytics integration',
      ],
    },
    {
      phase: 'Phase 6',
      title: 'Platform Maturity',
      status: 'planned',
      period: '2027',
      items: [
        'Self-service app generation portal',
        'Marketplace for templates and plugins',
        'xMemory plugin for intelligent caching',
        'Multi-cloud deployment support',
      ],
    },
  ];

  const upcomingCategories = [
    'E-commerce', 'SaaS Tools', 'Portfolio Sites', 'Education',
    'Health & Fitness', 'Food & Beverage', 'Real Estate', 'Travel',
    'Finance', 'Entertainment', 'Non-Profit', 'Photography',
  ];

  const statusColor: Record<string, string> = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500 animate-pulse',
    planned: 'bg-gray-600',
  };

  const statusLabel: Record<string, string> = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    planned: 'Planned',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Roadmap</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The journey from 14 apps to 400+. Here is what is next for the Paperclip platform.
        </p>
      </div>

      {/* Pipeline Counter */}
      <div className="glass-card p-8 text-center mb-12">
        <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          200+
        </div>
        <div className="text-gray-400 mt-2">Apps in the deployment pipeline (IDs 201-400)</div>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <div className="text-2xl font-bold text-accent">14</div>
            <div className="text-xs text-gray-500">Deployed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">36</div>
            <div className="text-xs text-gray-500">Building</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400">350</div>
            <div className="text-xs text-gray-500">Queued</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6 mb-16">
        {phases.map((phase, i) => (
          <div key={phase.phase} className="glass-card p-6 relative overflow-hidden">
            {phase.status === 'in-progress' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />
            )}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <div className={`w-3 h-3 rounded-full ${statusColor[phase.status]}`} />
                <div>
                  <div className="font-semibold text-white">{phase.phase}</div>
                  <div className="text-xs text-gray-500">{phase.period}</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    phase.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    phase.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {statusLabel[phase.status]}
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                        phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-600'
                      }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Categories */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Upcoming Categories</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {upcomingCategories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-300 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
