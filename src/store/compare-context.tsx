"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "@/types";

const MAX_COMPARE = 3;

interface CompareContextType {
  items: Product[];
  add: (product: Product) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
  isComparing: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const add = useCallback((product: Product): boolean => {
    if (items.length >= MAX_COMPARE) return false;
    if (items.find((i) => i.id === product.id)) return true;
    setItems((prev) => [...prev, product]);
    return true;
  }, [items]);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isComparing = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items]
  );

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, isComparing }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
