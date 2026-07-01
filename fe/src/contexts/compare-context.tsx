"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/api";

const MAX_COMPARE = 3;

type CompareContextType = {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
};

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("compare");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(items));
  }, [items]);

  const add = (product: Product) => {
    if (items.length >= MAX_COMPARE) return;
    if (items.some((p) => p.id === product.id)) return;
    setItems((prev) => [...prev, product]);
  };

  const remove = (productId: string) =>
    setItems((prev) => prev.filter((p) => p.id !== productId));

  const clear = () => setItems([]);
  const has = (productId: string) => items.some((p) => p.id === productId);

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, has }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
