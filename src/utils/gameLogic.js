// utils/gameLogic.js - Science Lab Quest Data
export const EXPERIMENTS = {
  physics: [
    {
      id: 1,
      title: "Simple Pendulum Experiment",
      request: "I need equipment to measure the period of a simple pendulum and analyze its motion patterns.",
      required: ['pendulum', 'stopwatch', 'protractor'],
      available: ['pendulum', 'stopwatch', 'protractor', 'scale', 'spring', 'weights', 'ruler', 'compass', 'incline']
    },
    {
      id: 2,
      title: "Ohm's Law Verification",
      request: "Help me gather instruments to verify the relationship between current, voltage, and resistance in electrical circuits.",
      required: ['resistor', 'voltmeter', 'ammeter', 'battery'],
      available: ['resistor', 'voltmeter', 'ammeter', 'battery', 'wires', 'switch', 'bulb', 'capacitor', 'diode', 'transformer']
    },
    {
      id: 3,
      title: "Young's Modulus Measurement",
      request: "I need precision equipment to calculate the elasticity and stress-strain relationship of different materials.",
      required: ['wire', 'weights', 'scale', 'clamp', 'meter-rule'],
      available: ['wire', 'weights', 'scale', 'clamp', 'meter-rule', 'micrometer', 'caliper', 'pulley', 'stand', 'lever']
    }
  ],
  chemistry: [
    {
      id: 1,
      title: "Acid-Base Titration",
      request: "Prepare equipment for determining the concentration of an unknown acid using standardized base solution.",
      required: ['burette', 'acid', 'base', 'indicator'],
      available: ['burette', 'acid', 'base', 'indicator', 'beaker', 'pipette', 'flask', 'stirrer', 'dropper']
    },
    {
      id: 2,
      title: "Salt Crystallization Process",
      request: "Set up apparatus for growing pure crystals from saturated salt solutions using controlled evaporation.",
      required: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper'],
      available: ['beaker', 'salt-solution', 'bunsen-burner', 'filter-paper', 'tripod', 'wire-gauze', 'funnel', 'watch-glass', 'stirring-rod']
    },
    {
      id: 3,
      title: "Organic Compound Synthesis",
      request: "Assemble advanced equipment for synthesizing organic compounds with precise temperature control and purification.",
      required: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer'],
      available: ['condenser', 'round-flask', 'catalyst', 'solvent', 'thermometer', 'heating-mantle', 'separatory-funnel', 'rotary-evaporator', 'distillation-column']
    }
  ],
  electronics: [
    {
      id: 1,
      title: "Basic LED Circuit",
      request: "Build a simple LED circuit to understand current limiting and basic electronic component behavior.",
      required: ['led', 'resistor', 'battery', 'wires'],
      available: ['led', 'resistor', 'battery', 'wires', 'switch', 'breadboard', 'potentiometer', 'capacitor']
    },
    {
      id: 2,
      title: "Transistor Amplifier Circuit",
      request: "Construct an amplifier circuit to study signal amplification and transistor characteristics using measurement tools.",
      required: ['transistor', 'capacitor', 'resistor', 'oscilloscope'],
      available: ['transistor', 'capacitor', 'resistor', 'oscilloscope', 'signal-generator', 'multimeter', 'inductor', 'transformer', 'speaker']
    },
    {
      id: 3,
      title: "Digital Logic Circuit",
      request: "Design and test digital logic circuits using gates and measurement equipment to verify truth tables.",
      required: ['and-gate', 'or-gate', 'input-switches', 'logic-probe'],
      available: ['and-gate', 'or-gate', 'input-switches', 'logic-probe', 'not-gate', 'nand-gate', 'xor-gate', 'flip-flop', 'counter', 'decoder']
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
  if (!levelData || !levelData.required || !Array.isArray(basket)) {
    return false;
  }
  
  const required = [...levelData.required].sort();
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