export interface AppData {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  gradient: string;
}

export const apps: AppData[] = [
  {
    id: 16,
    name: 'Sweet Crumble Bakery',
    url: 'https://sweet-crumble-bakery.pages.dev',
    category: 'Local Business',
    description: 'Artisan bakery storefront with online ordering and menu showcase.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 78,
    name: 'Prestige Auto Detailing',
    url: 'https://prestige-auto-detail.pages.dev',
    category: 'Local Business',
    description: 'Premium auto detailing service with booking and package selection.',
    gradient: 'from-slate-500 to-zinc-700',
  },
  {
    id: 79,
    name: 'Metro Express Car Wash',
    url: 'https://metro-express-carwash.pages.dev',
    category: 'Local Business',
    description: 'Express car wash chain with location finder and membership plans.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 191,
    name: 'ChartGen AI',
    url: 'https://chartgen-ai-viz.pages.dev',
    category: 'AI/Analytics',
    description: 'AI-powered chart and data visualization generator from raw datasets.',
    gradient: 'from-violet-500 to-purple-700',
  },
  {
    id: 192,
    name: 'AnomalyWatch',
    url: 'https://anomalywatch-timeseries.pages.dev',
    category: 'AI/Analytics',
    description: 'Time-series anomaly detection dashboard with real-time alerts.',
    gradient: 'from-red-500 to-rose-700',
  },
  {
    id: 193,
    name: 'TipJar Live',
    url: 'https://tipjar-live-platform.pages.dev',
    category: 'Creator Platform',
    description: 'Live streaming tip platform with real-time donations and overlays.',
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    id: 194,
    name: 'CourseForge',
    url: 'https://courseforge-platform.pages.dev',
    category: 'Creator Platform',
    description: 'Online course builder with modules, quizzes, and student tracking.',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 195,
    name: 'MerchDrop AI',
    url: 'https://merchdrop-ai-pod.pages.dev',
    category: 'Creator Platform',
    description: 'AI-generated merchandise with print-on-demand fulfillment.',
    gradient: 'from-pink-500 to-fuchsia-700',
  },
  {
    id: 196,
    name: 'FanGate',
    url: 'https://fangate-exclusive.pages.dev',
    category: 'Creator Platform',
    description: 'Exclusive content gating platform for creators and fan communities.',
    gradient: 'from-yellow-400 to-amber-600',
  },
  {
    id: 197,
    name: 'ClipCommerce',
    url: 'https://clipcommerce-shoppable.pages.dev',
    category: 'Creator Platform',
    description: 'Shoppable video clips platform linking products to short-form content.',
    gradient: 'from-teal-400 to-cyan-600',
  },
  {
    id: 198,
    name: 'NewsletterForge',
    url: 'https://newsletterforge-platform.pages.dev',
    category: 'Creator Platform',
    description: 'Newsletter creation and distribution platform with analytics.',
    gradient: 'from-orange-400 to-red-600',
  },
  {
    id: 199,
    name: 'EventPass Creator',
    url: 'https://eventpass-creator.pages.dev',
    category: 'Creator Platform',
    description: 'Event ticketing and pass management for creators and organizers.',
    gradient: 'from-indigo-400 to-blue-600',
  },
  {
    id: 200,
    name: 'CollabBoard',
    url: 'https://collabboard-marketplace.pages.dev',
    category: 'Creator Platform',
    description: 'Creator collaboration marketplace for cross-promotion and partnerships.',
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    id: 1001,
    name: 'ChildArt Storybook Maker',
    url: 'https://childart-storybook.pages.dev',
    category: 'AI/Creative',
    description: 'AI-powered children\'s storybook creator with custom illustrations.',
    gradient: 'from-fuchsia-400 to-pink-600',
  },
];

export const categories = ['All', 'Local Business', 'AI/Analytics', 'Creator Platform', 'AI/Creative'];

export const categoryColors: Record<string, string> = {
  'Local Business': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'AI/Analytics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Creator Platform': 'bg-green-500/20 text-green-400 border-green-500/30',
  'AI/Creative': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};
