import { AppCard } from "./AppCard.js";
import type { RegistryProps } from "./index.js";

export function FeaturedSection({ apps, section }: RegistryProps) {
  const maxItems = section.maxItems || 6;
  const featured = apps
    .filter((a: any) => a.featured)
    .slice(0, maxItems);

  if (featured.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">Featured</h2>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((app: any) => (
          <AppCard key={app.appId} app={app} />
        ))}
      </div>
    </div>
  );
}
