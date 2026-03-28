export default function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Define',
      desc: 'Specify the app type, category, and target audience. The platform generates a complete specification.',
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
    },
    {
      num: '02',
      title: 'Generate',
      desc: 'AI generates the full codebase including components, styling, content, and configuration.',
      icon: '⚡',
      color: 'from-purple-500 to-purple-600',
    },
    {
      num: '03',
      title: 'Build',
      desc: 'Automated build pipeline compiles, optimizes, and validates the application.',
      icon: '🔨',
      color: 'from-green-500 to-green-600',
    },
    {
      num: '04',
      title: 'Deploy',
      desc: 'One-click deployment to Cloudflare Pages with global CDN distribution and instant availability.',
      icon: '🚀',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const features = [
    {
      title: 'AI-Powered Generation',
      desc: 'Every app is generated using advanced AI models, producing production-quality code with modern best practices.',
    },
    {
      title: 'Template-Driven Architecture',
      desc: 'Battle-tested templates ensure consistency, quality, and rapid iteration across all generated applications.',
    },
    {
      title: 'Automated Pipeline',
      desc: 'From specification to deployment, the entire pipeline runs autonomously with built-in quality checks.',
    },
    {
      title: 'Scalable Infrastructure',
      desc: 'Built on Kubernetes with Cloudflare Pages, enabling deployment of hundreds of apps with zero downtime.',
    },
    {
      title: 'Static Export',
      desc: 'All apps are statically exported for maximum performance, security, and global edge distribution.',
    },
    {
      title: 'Batch Processing',
      desc: 'Deploy multiple apps in parallel batches, scaling from single apps to hundreds in a single pipeline run.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Paperclip</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          An AI-powered platform that generates, builds, and deploys production web applications at unprecedented scale.
        </p>
      </div>

      {/* How it Works */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="glass-card p-6 text-center relative group">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-2xl mb-4`}>
                {step.icon}
              </div>
              <div className="text-xs text-gray-600 font-mono mb-1">STEP {step.num}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">Platform Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className="glass-card p-6 hover:border-gray-700/80 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech */}
      <div className="glass-card p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages', 'Kubernetes', 'Claude AI', 'GitHub Actions'].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
