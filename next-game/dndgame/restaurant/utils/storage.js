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
  return parseInt(localStorage.getItem('restaurant-level') || '1');
};

export const setCurrentLevel = (level) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('restaurant-level', level.toString());
  }
};

export const getMaxUnlockedLevel = () => {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem('max-unlocked-level') || '1');
};

export const resetProgress = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('max-unlocked-level');
    localStorage.setItem('restaurant-level', '1');
    sessionStorage.removeItem('basket');
  }
};
