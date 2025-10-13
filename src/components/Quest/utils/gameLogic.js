// utils/gameLogic.js - Simplified Game Data
export const EXPERIMENTS = [
  {
    id: 1,
    title: "Simple Pendulum Experiment",
    question: "I need equipment to measure the period of a simple pendulum and analyze its motion patterns.",
    correctAnswer: ['pendulum', 'stopwatch', 'protractor'],
    answers: ['pendulum', 'stopwatch', 'protractor', 'scale', 'spring', 'weights', 'ruler', 'compass']
  },
  {
    id: 2,
    title: "Ohm's Law Verification",
    question: "Help me gather instruments to verify the relationship between current, voltage, and resistance in electrical circuits.",
    correctAnswer: ['resistor', 'voltmeter', 'ammeter', 'battery'],
    answers: ['resistor', 'voltmeter', 'ammeter', 'battery', 'wires', 'switch', 'bulb', 'capacitor']
  },
  {
    id: 3,
    title: "Young's Modulus Measurement",
    question: "I need precision equipment to calculate the elasticity and stress-strain relationship of different materials.",
    correctAnswer: ['wire', 'weights', 'scale', 'clamp', 'meter-rule'],
    answers: ['wire', 'weights', 'scale', 'clamp', 'meter-rule', 'micrometer', 'caliper', 'pulley']
  },
  {
    id: 4,
    title: "Acid-Base Titration",
    question: "Prepare equipment for determining the concentration of an unknown acid using standardized base solution.",
    correctAnswer: ['burette', 'acid', 'base', 'indicator'],
    answers: ['burette', 'acid', 'base', 'indicator', 'beaker', 'pipette', 'flask', 'stirrer']
  },
  {
    id: 5,
    title: "Salt Crystallization Process",
    question: "Set up apparatus for growing pure crystals from saturated salt solutions using controlled evaporation.",
    correctAnswer: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper'],
    answers: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper', 'tripod', 'wire-gauze', 'funnel', 'watch-glass']
  },
  {
    id: 6,
    title: "Organic Compound Synthesis",
    question: "Assemble advanced equipment for synthesizing organic compounds with precise temperature control and purification.",
    correctAnswer: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer'],
    answers: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer', 'heating-mantle', 'separatory-funnel', 'rotary-evaporator']
  },
  {
    id: 7,
    title: "Basic LED Circuit",
    question: "Build a simple LED circuit to understand current limiting and basic electronic component behavior.",
    correctAnswer: ['led', 'resistor', 'battery', 'wires'],
    answers: ['led', 'resistor', 'battery', 'wires', 'switch', 'breadboard', 'potentiometer', 'capacitor']
  },
  {
    id: 8,
    title: "Tranistor Amplifier Circuit",
    question: "Construct an amplifier circuit to study signal amplification and transistor characteristics using measurement tools.",
    correctAnswer: ['transistor', 'capacitor', 'resistor', 'oscilloscope'],
    answers: ['transistor', 'capacitor', 'resistor', 'oscilloscope', 'signal-generator', 'multimeter', 'inductor', 'transformer']
  },
  {
    id: 9,
    title: "Digital Logic Circuit",
    question: "Design and test digital logic circuits using gates and measurement equipment to verify truth tables.",
    correctAnswer: ['and-gate', 'or-gate', 'input-switches', 'logic-probe'],
    answers: ['and-gate', 'or-gate', 'input-switches', 'logic-probe', 'not-gate', 'nand-gate', 'xor-gate', 'flip-flop']
  }
];

export const ITEM_ICONS = {
  // Physics Equipment
  'pendulum': '⚖️', 'stopwatch': '⏱️', 'protractor': '📐', 'scale': '⚖️', 'spring': '🏹',
  'weights': '🏋️', 'ruler': '📏', 'compass': '🧭', 'incline': '📐',
  'resistor': '🔌', 'voltmeter': '⚡', 'ammeter': '🔋', 'battery': '🔋', 'wires': '🔗',
  'switch': '🔘', 'bulb': '💡', 'capacitor': '🔲', 'diode': '🔺', 'transformer': '⚡',
  'wire': '🔗', 'clamp': '🗜️', 'meter-rule': '📏', 'micrometer': '🔬', 'caliper': '📏',
  'pulley': '⚙️', 'stand': '🏛️', 'lever': '⚖️',
  
  // Chemistry Equipment
  'burette': '🧪', 'acid': '🧪', 'base': '🧪', 'indicator': '🌈', 'beaker': '🥤',
  'pipette': '💉', 'flask': '🧪', 'stirrer': '🥄', 'dropper': '💧',
  'salt-solution': '🧂', 'bunsen-burner': '🔥', 'filter-paper': '📄', 'tripod': '🏛️',
  'wire-gauze': '🕸️', 'funnel': '📯', 'watch-glass': '⌚', 'stirring-rod': '🥢',
  'condenser': '❄️', 'round-flask': '🧪', 'catalyst': '⚗️', 'solvent': '💧', 'thermometer': '🌡️',
  'heating-mantle': '🔥', 'separatory-funnel': '📯', 'rotary-evaporator': '🌪️', 'distillation-column': '🏗️',
  
  // Electronics Equipment
  'led': '💡', 'breadboard': '⬛', 'potentiometer': '🎛️',
  'transistor': '🔺', 'oscilloscope': '📺', 'signal-generator': '📡', 'multimeter': '📊',
  'inductor': '🌀', 'speaker': '🔊',
  'and-gate': '🚪', 'or-gate': '🚪', 'input-switches': '🔘', 'logic-probe': '🔍',
  'not-gate': '❌', 'nand-gate': '🚫', 'xor-gate': '⚡', 'flip-flop': '🔄', 'counter': '🔢', 'decoder': '🔓'
};

export const getLevelData = (level) => {
  const experiment = EXPERIMENTS.find(exp => exp.id === level);
  return experiment || EXPERIMENTS[0];
};

export const getRandomExperiment = () => {
  const randomIndex = Math.floor(Math.random() * EXPERIMENTS.length);
  return EXPERIMENTS[randomIndex];
};

// NEW: Shared experiment storage functions
export const setCurrentExperiment = (experiment) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current-experiment', JSON.stringify(experiment));
  }
};

export const getCurrentExperiment = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('current-experiment');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored experiment:', e);
      }
    }
  }
  return null;
};

export const clearCurrentExperiment = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current-experiment');
  }
};

export const checkWin = (basket, levelData) => {
  if (!levelData || !levelData.correctAnswer || !Array.isArray(basket)) {
    return false;
  }
  
  const required = [...levelData.correctAnswer].sort();
  const selected = [...basket].sort();
  
  return required.length === selected.length &&
    required.every((item, i) => item === selected[i]);
};

export const updateProgress = (currentLevel) => {
  if (typeof window !== 'undefined') {
    const maxUnlocked = parseInt(localStorage.getItem('max-unlocked-level') || '1');
    const nextLevel = currentLevel + 1;
    
    if (nextLevel > maxUnlocked && nextLevel <= EXPERIMENTS.length) {
      localStorage.setItem('max-unlocked-level', nextLevel.toString());
    }
  }
};
