import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterState {
  search: string;
  pipeline: string;
  category: string;
}

interface FilterContext extends FilterState {
  setSearch: (s: string) => void;
  setPipeline: (p: string) => void;
  setCategory: (c: string) => void;
  filterApps: (apps: any[]) => any[];
}

const Ctx = createContext<FilterContext>(null!);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [pipeline, setPipeline] = useState("");
  const [category, setCategory] = useState("");

  const filterApps = (apps: any[]) => {
    let filtered = apps;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.appName?.toLowerCase().includes(q) ||
          a.prefix?.toLowerCase().includes(q) ||
          a.repo?.toLowerCase().includes(q)
      );
    }
    if (pipeline) {
      filtered = filtered.filter((a) => a.pipeline === pipeline);
    }
    if (category) {
      filtered = filtered.filter((a) => a.category === category);
    }
    return filtered;
  };

  return (
    <Ctx.Provider value={{ search, pipeline, category, setSearch, setPipeline, setCategory, filterApps }}>
      {children}
    </Ctx.Provider>
  );
}

export function useFilters() {
  return useContext(Ctx);
}
