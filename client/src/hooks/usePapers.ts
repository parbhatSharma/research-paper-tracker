import { useState, useEffect } from 'react';
import type { Paper } from '../types';
import { SAMPLE_PAPERS } from '../data/sampleData';

const STORAGE_KEY = 'research-tracker-papers';

export function usePapers() {
  const [papers, setPapers] = useState<Paper[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SAMPLE_PAPERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  }, [papers]);

  const addPaper = (paper: Omit<Paper, 'id'>) => {
    const newPaper: Paper = { ...paper, id: crypto.randomUUID() };
    setPapers((prev) => [newPaper, ...prev]);
  };

  const deletePaper = (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePaper = (updated: Paper) => {
    setPapers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return { papers, addPaper, deletePaper, updatePaper };
}
