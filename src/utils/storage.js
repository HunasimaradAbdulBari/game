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
  return parseInt(localStorage.getItem('science-lab-level') || '1');
};

export const setCurrentLevel = (level) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('science-lab-level', level.toString());
  }
};

export const getCurrentSubject = () => {
  if (typeof window === 'undefined') return 'physics';
  return localStorage.getItem('science-lab-subject') || 'physics';
};

export const setCurrentSubject = (subject) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('science-lab-subject', subject);
  }
};

export const getMaxUnlockedLevel = () => {
  if (typeof window === 'undefined') return 1;
  const subject = getCurrentSubject();
  return parseInt(localStorage.getItem(`max-unlocked-level-${subject}`) || '1');
};

export const setMaxUnlockedLevel = (level) => {
  if (typeof window !== 'undefined') {
    const subject = getCurrentSubject();
    localStorage.setItem(`max-unlocked-level-${subject}`, level.toString());
  }
};

export const resetProgress = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('max-unlocked-level-physics');
    localStorage.removeItem('max-unlocked-level-chemistry');
    localStorage.removeItem('max-unlocked-level-electronics');
    localStorage.setItem('science-lab-level', '1');
    localStorage.setItem('science-lab-subject', 'physics');
    sessionStorage.removeItem('basket');
  }
};