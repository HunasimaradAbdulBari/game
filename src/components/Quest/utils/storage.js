export const getBasket = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(sessionStorage.getItem('basket') || '[]');
  } catch {
    return [];
  }
};

export const setBasket = (basket) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('basket', JSON.stringify(basket));
  }
};

export const clearBasket = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('basket');
  }
};

export const getCurrentLevel = () => {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem('current-level') || '1');
};

export const setCurrentLevel = (level) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current-level', level.toString());
  }
};

export const getMaxUnlockedLevel = () => {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem('max-unlocked-level') || '1');
};

export const setMaxUnlockedLevel = (level) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('max-unlocked-level', level.toString());
  }
};

export const resetProgress = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('max-unlocked-level');
    localStorage.setItem('current-level', '1');
    sessionStorage.removeItem('basket');
  }
};
