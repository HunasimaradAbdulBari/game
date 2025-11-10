// src/components/Quest/utils/storage.ts

export const getBasket = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const basketData = sessionStorage.getItem('basket');
    return basketData ? JSON.parse(basketData) : [];
  } catch {
    return [];
  }
};

export const setBasket = (basket: string[]): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('basket', JSON.stringify(basket));
  }
};

export const clearBasket = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('basket');
  }
};

export const getCurrentLevel = (): number => {
  if (typeof window === 'undefined') return 1;
  const level = localStorage.getItem('current-level');
  return parseInt(level || '1', 10);
};

export const setCurrentLevel = (level: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current-level', level.toString());
  }
};

export const getMaxUnlockedLevel = (): number => {
  if (typeof window === 'undefined') return 1;
  const maxLevel = localStorage.getItem('max-unlocked-level');
  return parseInt(maxLevel || '1', 10);
};

export const setMaxUnlockedLevel = (level: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('max-unlocked-level', level.toString());
  }
};

export const resetProgress = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('max-unlocked-level');
    localStorage.setItem('current-level', '1');
    sessionStorage.removeItem('basket');
  }
};

export const getCurrentSubject = (): string => {
  if (typeof window === 'undefined') return 'physics';
  return localStorage.getItem('current-subject') || 'physics';
};

export const setCurrentSubject = (subject: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current-subject', subject);
  }
};