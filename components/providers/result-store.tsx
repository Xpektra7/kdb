"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { ResultContextValue } from '@/lib/definitions';

const ResultContext = createContext<ResultContextValue | null>(null);

export function ResultProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<unknown>(null);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
}

export function useResultStore() {
  const ctx = useContext(ResultContext);

  if (!ctx) {
    throw new Error("useResultStore must be used within a ResultProvider");
  }

  return ctx;
}
