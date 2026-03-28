import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm">
                PC
              </div>
              <span className="text-lg font-bold text-white">Showroom</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Showcasing apps built by the Paperclip platform. AI-powered generation,
              automated deployment, scaling to hundreds of production applications.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Navigation</h4>
            <div className="space-y-2">
              {['Gallery', 'Stats', 'About', 'Roadmap', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">Links</h4>
            <div className="space-y-2">
              <a
                href="https://github.com/devopseng99"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/devopseng99/pc-showroom"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-sm text-gray-600">
          Built with Paperclip &mdash; AI-Powered App Generation at Scale
        </div>
      </div>
    </footer>
  );
}
