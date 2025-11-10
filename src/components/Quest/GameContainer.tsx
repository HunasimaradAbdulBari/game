// src/components/Quest/GameContainer.tsx
'use client';
import React, { useState } from 'react';
import RestaurantScene from './scenes/RestaurantScene';
import MarketScene from './scenes/MarketScene'; 
import ResultScene from './scenes/ResultScene';

type SceneType = 'restaurant' | 'market' | 'result';

export default function GameContainer(): JSX.Element {
  const [currentScene, setCurrentScene] = useState<SceneType>('restaurant');
  
  const renderScene = (): JSX.Element => {
    switch(currentScene) {
      case 'restaurant': 
        return <RestaurantScene />;
      case 'market': 
        return <MarketScene />;
      case 'result': 
        return <ResultScene />;
      default: 
        return <RestaurantScene />;
    }
  };
  
  return renderScene();
}