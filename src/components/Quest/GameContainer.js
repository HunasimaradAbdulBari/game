'use client';
import { useState } from 'react';
import RestaurantScene from './scenes/RestaurantScene';
import MarketScene from './scenes/MarketScene'; 
import ResultScene from './scenes/ResultScene';

export default function GameContainer() {
  const [currentScene, setCurrentScene] = useState('restaurant');
  
  const renderScene = () => {
    switch(currentScene) {
      case 'restaurant': return <RestaurantScene onNavigate={setCurrentScene} />;
      case 'market': return <MarketScene onNavigate={setCurrentScene} />;
      case 'result': return <ResultScene onNavigate={setCurrentScene} />;
      default: return <RestaurantScene onNavigate={setCurrentScene} />;
    }
  };
  
  return renderScene();
}