export const LEVELS = [
  {
    id: 1,
    request: "I need a simple sandwich: Bread, Lettuce, Tomato",
    required: ['bread', 'lettuce', 'tomato'],
    available: ['bread', 'lettuce', 'tomato', 'cheese', 'meat', 'onion']
  },
  {
    id: 2,
    request: "Make me a burger: Bread, Meat, Cheese, Lettuce, Tomato",
    required: ['bread', 'meat', 'cheese', 'lettuce', 'tomato'],
    available: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'onion', 'pickle', 'sauce', 'mushroom']
  },
  {
    id: 3,
    request: "Pizza ingredients needed: Dough, Sauce, Cheese, Pepperoni, Mushroom",
    required: ['dough', 'sauce', 'cheese', 'pepperoni', 'mushroom'],
    available: ['dough', 'sauce', 'cheese', 'pepperoni', 'mushroom', 'olive', 'bell-pepper', 'sausage', 'pineapple', 'spinach']
  }
];

export const ITEM_ICONS = {
  'bread': '🍞', 'lettuce': '🥬', 'tomato': '🍅', 'cheese': '🧀',
  'meat': '🥩', 'onion': '🧅', 'pickle': '🥒', 'sauce': '🍅',
  'mushroom': '🍄', 'dough': '🥖', 'pepperoni': '🍕', 'olive': '🫒',
  'bell-pepper': '🫑', 'sausage': '🌭', 'pineapple': '🍍', 'spinach': '🥬'
};

export const getLevelData = (level) => {
  return LEVELS.find(l => l.id === level) || LEVELS[0];
};

export const checkWin = (basket, levelData) => {
  if (!levelData || !levelData.required || !Array.isArray(basket)) {
    return false;
  }

  const required = [...levelData.required].sort();
  const selected = [...basket].sort();

  return required.length === selected.length &&
         required.every((item, i) => item === selected[i]);
};

export const updateProgress = (currentLevel) => {
  const maxUnlocked = parseInt(localStorage.getItem('max-unlocked-level') || '1');
  const nextLevel = currentLevel + 1;
  
  if (nextLevel > maxUnlocked && nextLevel <= 3) {
    localStorage.setItem('max-unlocked-level', nextLevel.toString());
  }
};
