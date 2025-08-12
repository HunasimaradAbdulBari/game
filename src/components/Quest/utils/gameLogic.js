// utils/gameLogic.js - Science Lab Quest Data
export const EXPERIMENTS = {
  physics: [
    {
      id: 1,
      title: "Simple Pendulum Experiment",
      question: "I need equipment to measure the period of a simple pendulum and analyze its motion patterns.",
      // answers: ['pendulum', 'stopwatch', 'protractor'],
      correctAnswer: ['pendulum', 'stopwatch', 'protractor'],
      answers: ['pendulum', 'stopwatch', 'protractor', 'scale', 'spring', 'weights', 'ruler', , 'incline']
    },
    {
      id: 2,
      title: "Ohm's Law Verification",
      question: "Help me gather instruments to verify the relationship between current, voltage, and resistance in electrical circuits.",
      // answers: ['resistor', 'voltmeter', 'ammeter', 'battery'],
      correctAnswer: ['resistor', 'voltmeter', 'ammeter', 'battery'],
      answers: ['resistor', 'voltmeter', 'ammeter', 'battery', 'wires', 'switch', 'bulb', 'capacitor']
    },
    {
      id: 3,
      title: "Young's Modulus Measurement",
      question: "I need precision equipment to calculate the elasticity and stress-strain relationship of different materials.",
      // answers: ['wire', 'weights', 'scale', 'clamp', 'meter-rule'],
      correctAnswer: ['wire', 'weights', 'scale', 'clamp', 'meter-rule'],
      answers: ['wire', 'weights', 'scale', 'clamp', 'meter-rule', 'micrometer', 'caliper', 'pulley']
    }
  ],
  chemistry: [
    {
      id: 1,
      title: "Acid-Base Titration",
      question: "Prepare equipment for determining the concentration of an unknown acid using standardized base solution.",
      // answers: ['burette', 'acid', 'base', 'indicator'],
      correctAnswer: ['burette', 'acid', 'base', 'indicator'],
      answers: ['burette', 'acid', 'base', 'indicator', 'beaker', 'pipette', 'flask', 'stirrer']
    },
    {
      id: 2,
      title: "Salt Crystallization Process",
      question: "Set up apparatus for growing pure crystals from saturated salt solutions using controlled evaporation.",
      // answers: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper'],
      correctAnswer: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper'],
      answers: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper', 'tripod', 'wire-gauze', 'funnel', 'watch-glass', 'stirring-rod']
    },
    {
      id: 3,
      title: "Organic Compound Synthesis",
      question: "Assemble advanced equipment for synthesizing organic compounds with precise temperature control and purification.",
      // answers: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer'],
      correctAnswer: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer'],
      answers: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer', 'heating-mantle', 'separatory-funnel', 'rotary-evaporator']
    }
  ],
  electronics: [
    {
      id: 1,
      title: "Basic LED Circuit",
      question: "Build a simple LED circuit to understand current limiting and basic electronic component behavior.",
      // answers: ['led', 'resistor', 'battery', 'wires'],
      correctAnswer: ['led', 'resistor', 'battery', 'wires'],
      answers: ['led', 'resistor', 'battery', 'wires', 'switch', 'breadboard', 'potentiometer', 'capacitor']
    },
    {
      id: 2,
      title: "Transistor Amplifier Circuit",
      question: "Construct an amplifier circuit to study signal amplification and transistor characteristics using measurement tools.",
      // answers: ['transistor', 'capacitor', 'resistor', 'oscilloscope'],
      correctAnswer: ['transistor', 'capacitor', 'resistor', 'oscilloscope'],
      answers: ['transistor', 'capacitor', 'resistor', 'oscilloscope', 'signal-generator', 'multimeter', 'inductor', 'transformer']
    },
    {
      id: 3,
      title: "Digital Logic Circuit",
      question: "Design and test digital logic circuits using gates and measurement equipment to verify truth tables.",
      // answers: ['and-gate', 'or-gate', 'input-switches', 'logic-probe'],
      correctAnswer: ['and-gate', 'or-gate', 'input-switches', 'logic-probe'],
      answers: ['and-gate', 'or-gate', 'input-switches', 'logic-probe', 'not-gate', 'nand-gate', 'xor-gate', 'flip-flop']
    }
  ]
};

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

export const getLevelData = (level, subject = 'physics') => {
  const experiments = EXPERIMENTS[subject] || EXPERIMENTS.physics;
  return experiments.find(exp => exp.id === level) || experiments[0];
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

export const updateProgress = (currentLevel, subject = 'physics') => {
  const maxUnlockedKey = `max-unlocked-level-${subject}`;
  const maxUnlocked = parseInt(localStorage.getItem(maxUnlockedKey) || '1');
  const nextLevel = currentLevel + 1;
  
  if (nextLevel > maxUnlocked && nextLevel <= 3) {
    localStorage.setItem(maxUnlockedKey, nextLevel.toString());
  }
};