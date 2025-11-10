// src/components/Quest/scenes/MarketScene.tsx - COMPLETE
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors, rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import { useRouter } from 'next/navigation';
import Layout from '../Layout';
import Button from '../Button';
import { gsap } from 'gsap';
import { getCurrentLevel, getBasket, setBasket } from '../utils/storage';
import { getCurrentExperiment, getRandomExperiment, setCurrentExperiment, ITEM_ICONS } from '../utils/gameLogic';
import { Experiment } from '../../../types';

/* ---------- TYPES ---------- */
interface DraggableWrapperProps {
  id: string;
  children: React.ReactNode;
  isDisabled: boolean;
  isDragging: boolean;
}

interface DroppableWrapperProps {
  id: string;
  children: React.ReactNode;
}

interface ItemPosition {
  top: string;
  left: string;
}

/* ---------- DRAGGABLE WRAPPER ---------- */
function DraggableWrapper({ id, children, isDisabled, isDragging }: DraggableWrapperProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingHook } = useDraggable({
    id, disabled: isDisabled, data: { type: 'item', item: id }
  });
  return (
    <div ref={setNodeRef} style={{
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      opacity: isDragging ? 0.1 : 1, transition: isDraggingHook ? 'none' : 'all 0.2s ease',
      touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
      cursor: isDragging ? 'grabbing' : isDisabled ? 'not-allowed' : 'grab',
      filter: isDragging ? 'brightness(0.8)' : 'brightness(1)', willChange: isDraggingHook ? 'transform' : 'auto'
    }} {...listeners} {...attributes}>{children}</div>
  );
}

/* ---------- DROPPABLE WRAPPER ---------- */
function DroppableWrapper({ id, children }: DroppableWrapperProps) {
  const { isOver, setNodeRef, active, over } = useDroppable({
    id, data: { type: 'drop-zone', accepts: ['item'] }
  });
  const canDrop = active?.data.current?.type === 'item';
  const isOverCurrent = isOver && over?.id === id;
  return (
    <div ref={setNodeRef} style={{
      transform: isOverCurrent && canDrop ? 'scale(1.08)' : 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: isOverCurrent && canDrop ? 'brightness(1.2)' : 'brightness(1)'
    }}>{children}</div>
  );
}

export default function MarketPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelData, setLevelData] = useState<Experiment | null>(null);
  const [itemsInBasket, setItemsInBasket] = useState<string[]>([]);
  const [itemsOnBanner, setItemsOnBanner] = useState<string[]>([]);
  const [showBasketPopup, setShowBasketPopup] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const dropSoundRef = useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const basketItemsContainerRef = useRef<HTMLDivElement | null>(null);

  /* ---------- MOBILE BANNER POSITIONS ---------- */
  const getMobileItemPosition = (item: string, index: number): ItemPosition => {
    const positions: ItemPosition[] = [
      { top: '21px', left: '25%' },
      { top: '20px', left: '38%' },
      { top: '21px', left: '52%' },
      { top: '21px', left: '65%' },
      { top: '100px', left: '25%' },
      { top: '100px', left: '38%' },
      { top: '100px', left: '52%' },
      { top: '100px', left: '65%' },
    ];
    return positions[index] || positions[0];
  };

  /* ---------- DESKTOP BANNER POSITIONS ---------- */
  const getDesktopItemPosition = (item: string, index: number): ItemPosition => {
    const positions: ItemPosition[] = [
      { top: '80px', left: '30%' },
      { top: '80px', left: '42%' },
      { top: '80px', left: '55%' },
      { top: '80px', left: '68%' },
      { top: '180px', left: '30%' },
      { top: '180px', left: '42%' },
      { top: '180px', left: '55%' },
      { top: '180px', left: '68%' },
    ];
    return positions[index] || positions[0];
  };

  /* ---------- DEVICE-AWARE POSITION FUNCTION ---------- */
  const getItemPosition = (item: string, index: number): ItemPosition => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      return isMobile ? getMobileItemPosition(item, index) : getDesktopItemPosition(item, index);
    }
    return getDesktopItemPosition(item, index);
  };

  /* ---------- BASKET ITEM POSITIONS ---------- */
  const getBasketItemPosition = (item: string, index: number): ItemPosition => {
    const basePositions: ItemPosition[] = [
      { top: '40%', left: '-2%' },
      { top: '35%', left: '22%' },
      { top: '38%', left: '35%' },
      { top: '45%', left: '50%' },
      { top: '40%', left: '65%' },
      { top: '32%', left: '80%' },
      { top: '40%', left: '95%' },
      { top: '35%', left: '115%' },
    ];
    
    const basePos = basePositions[index] || basePositions[0];
    const randomOffsetX = (Math.random() - 0.5) * 8;
    const randomOffsetY = (Math.random() - 0.5) * 6;
    
    return {
      top: `${parseFloat(basePos.top) + randomOffsetY}%`,
      left: `${parseFloat(basePos.left) + randomOffsetX}%`
    };
  };

  const shuffleBasketItems = (): void => {
    if (itemsInBasket.length === 0) return;
    
    const shuffledItems = [...itemsInBasket];
    
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
    }
    
    setItemsInBasket(shuffledItems);
    
    if (basketItemsContainerRef.current) {
      const basketItems = basketItemsContainerRef.current.querySelectorAll('.animated-item');
      basketItems.forEach((item, idx) => {
        const randomDelay = Math.random() * 0.3;
        const randomDirection = Math.random() > 0.5 ? 1 : -1;
        const randomDistance = 20 + Math.random() * 30;
        
        gsap.fromTo(item, 
          { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1 },
          { 
            scale: 0.9, 
            rotation: randomDirection * (180 + Math.random() * 180), 
            x: randomDirection * randomDistance,
            y: (Math.random() - 0.5) * 40,
            opacity: 0.8, 
            duration: 0.4,
            delay: randomDelay,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(item, {
                scale: 1,
                rotation: (Math.random() - 0.5) * 15,
                x: 0,
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
              });
            }
          }
        );
      });
    }
  };

  const handleShuffleClick = (): void => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    shuffleBasketItems();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 3 } })
  );

  useEffect(() => {
    const level = getCurrentLevel();
    
    let data = getCurrentExperiment();
    if (!data) {
      data = getRandomExperiment();
      setCurrentExperiment(data);
    }
    
    const limitedData: Experiment = {
      ...data,
      answers: data.answers.slice(0, 8)
    };
    
    setCurrentLevel(level); 
    setLevelData(limitedData); 
    setItemsInBasket(limitedData.answers);
    setItemsOnBanner([]);
    
    if (typeof window !== 'undefined') {
      dropSoundRef.current = new Audio('/sounds/drop.mp3');
      dropSoundRef.current.volume = 0.4; 
      dropSoundRef.current.preload = 'auto'; 
      dropSoundRef.current.load();
    }
    return () => {
      if (dropSoundRef.current) { 
        dropSoundRef.current.pause(); 
        dropSoundRef.current = null; 
      }
    };
  }, []);

  const playDropSound = (): void => {
    if (dropSoundRef.current) { 
      dropSoundRef.current.currentTime = 0; 
      dropSoundRef.current.play().catch(() => {}); 
    }
  };

  const animateNewItem = (): void => {
    setTimeout(() => {
      const newItemElements = document.querySelectorAll('.animated-item');
      const lastItem = newItemElements[newItemElements.length - 1];
      if (lastItem) {
        gsap.fromTo(lastItem, { scale: 0, rotation: 360, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
      }
    }, 50);
  };

  const handleDragStart = ({ active }: any): void => setActiveId(active.id);
  const handleDragCancel = (): void => setActiveId(null);
  const handleDragEnd = ({ active, over }: any): void => {
    setActiveId(null);
    if (!over) return;

    const itemId = active.id;
    
    if (over.id.startsWith('banner-position-') || over.id === 'banner-area') {
      if (itemsInBasket.includes(itemId)) {
        setItemsInBasket(prev => prev.filter(id => id !== itemId));
        setItemsOnBanner(prev => [...prev, itemId]);
        playDropSound();
        animateNewItem();
      }
    }
    
    if (over.id === 'basket') {
      if (itemsOnBanner.includes(itemId)) {
        setItemsOnBanner(prev => prev.filter(id => id !== itemId));
        setItemsInBasket(prev => [...prev, itemId]);
        playDropSound();
        animateNewItem();
      }
    }
  };

  const handleItemTap = (item: string): void => {
    if (itemsInBasket.includes(item)) {
      setItemsInBasket(prev => prev.filter(id => id !== item));
      setItemsOnBanner(prev => [...prev, item]);
    } else if (itemsOnBanner.includes(item)) {
      setItemsOnBanner(prev => prev.filter(id => id !== item));
      setItemsInBasket(prev => [...prev, item]);
    }
    animateNewItem();
  };

  const handleSubmitOrder = (): void => {
    setBasket(itemsOnBanner);
    router.push('/result');
  };

  const getItemDetails = (itemId: string): { emoji: string; name: string } => {
    return {
      emoji: ITEM_ICONS[itemId] || '🔧',
      name: itemId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  };

  if (!levelData) return null;

  return (
    <Layout scene="market">
      <DndContext sensors={sensors} collisionDetection={rectIntersection}
        onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges, snapCenterToCursor]}>

        <div className="main-container" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex', 
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          touchAction: activeId ? 'none' : 'pan-y', 
          userSelect: 'none',
          WebkitUserSelect: 'none', 
          WebkitTouchCallout: 'none', 
          overflow: 'hidden',
          backgroundColor: 'transparent',
          zIndex: 1
        }}>

          {/* Header */}
          <div className="header-section" style={{
            textAlign: 'center', 
            marginBottom: 'clamp(4px, 1vh, 8px)', 
            flexShrink: 0,
            paddingTop: 'clamp(8px, 2vh, 16px)',
            paddingLeft: 'clamp(8px, 2vw, 16px)',
            paddingRight: 'clamp(8px, 2vw, 16px)',
            zIndex: 10
          }}>
            <h1 style={{
              fontSize: 'clamp(16px, 3.5vw, 24px)', 
              fontWeight: '700', 
              color: '#1e293b',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text',
              margin: 0, 
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(255,255,255,0.8)'
            }}></h1>
          </div>

          {/* Banner Area */}
          <div className="banner-area" style={{
            position: 'relative',
            flex: '1',
            width: '100%',
            height: '100%',
            paddingBottom: 'clamp(130px, 20vh, 150px)',
            overflow: 'auto',
            borderRadius: '20px'
          }}>
            
            <DroppableWrapper id="banner-area">
              <div style={{
                position: 'absolute',
                top: '60px',
                left: '25%',
                width: '50%',
                height: '200px',
                zIndex: 2,
                backgroundColor: 'transparent',
                borderRadius: '20px'
              }} />
            </DroppableWrapper>
            
            {/* Banner Drop Zones */}
            {Array.from({ length: 8 }, (_, idx) => {
              const position = getItemPosition('', idx);
              const hasItemAtPosition = itemsOnBanner.length > idx;
              
              return (
                <div key={`banner-zone-${idx}`} style={{
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  transform: 'translateX(-50%)',
                  zIndex: 3,
                  display: hasItemAtPosition ? 'none' : 'block'
                }}>
                  <DroppableWrapper id={`banner-position-${idx}`}>
                    <div className="drop-zone" style={{
                      width: 'clamp(65px, 13vw, 95px)',
                      height: 'clamp(62px, 12.4vh, 88px)',
                      borderRadius: 'clamp(18px, 4vw, 26px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}>
                    </div>
                  </DroppableWrapper>
                </div>
              );
            })}

            {/* Items on Banner */}
            {itemsOnBanner.map((item, idx) => {
              const position = getItemPosition(item, idx);
              return (
                <div key={`banner-item-${item}-${idx}`} className="banner-item-container animated-item" style={{
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  transform: 'translateX(-50%)',
                  animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both`,
                  touchAction: 'none', 
                  userSelect: 'none',
                  zIndex: 5,
                  borderRadius: '20px'
                }}>
                  <DraggableWrapper id={item} isDisabled={false} isDragging={activeId === item}>
                    <div className="banner-item" style={{
                      background: 'linear-gradient(135deg, #fef7ed 0%, #fdf4e6 100%)',
                      borderRadius: 'clamp(20px, 4.5vw, 28px)', 
                      padding: 'clamp(12px, 2.8vw, 16px)', 
                      minWidth: 'clamp(65px, 13vw, 95px)',
                      minHeight: 'clamp(62px, 12.4vh, 88px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(4px, 1vw, 6px)',
                      border: '2px solid rgba(251, 191, 36, 0.3)',
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'grab',
                      userSelect: 'none',
                      backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => handleItemTap(item)}>
                      
                      <div className="banner-item-emoji" style={{
                        fontSize: 'clamp(18px, 3.8vw, 26px)',
                        marginBottom: 'clamp(2px, 0.4vh, 3px)', 
                        lineHeight: '1'
                      }}>
                        {getItemDetails(item).emoji}
                      </div>
                      
                      <div className="banner-item-name" style={{
                        fontSize: 'clamp(6px, 1.3vw, 9px)',
                        fontWeight: '700',
                        color: '#92400e',
                        textAlign: 'center',
                        lineHeight: '1.2',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: 'Inter, -apple-system, sans-serif'
                      }}>
                        {getItemDetails(item).name}
                      </div>
                    </div>
                  </DraggableWrapper>
                </div>
              );
            })}
          </div>

          {/* Floating Basket */}
          <div className="floating-basket-container" style={{
            position: 'absolute', 
            bottom: 'clamp(40px, 8vh, 60px)',
            left: '50%',
            transform: 'translateX(-50%)', 
            width: 'clamp(100px, 18vw, 160px)', 
            touchAction: 'none',
            filter: activeId ? 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' : 'none',
            transition: 'filter 0.3s ease', 
            zIndex: 100
          }}>
            <div style={{
              cursor: 'default',
              transition: 'transform 0.3s ease',
              willChange: 'transform', 
              position: 'relative'
            }}>

              <DroppableWrapper id="basket">
                <div className="basket-container" style={{ position: 'relative' }}>
                  <img src="/basket(cart).png" className="basket-image" style={{
                    marginLeft: '-80px',
                    marginBottom: '-40px',
                    width: '380px',
                    height: 'auto', 
                    objectFit: 'contain',
                    display: 'block',
                    minWidth: '380px',
                    maxWidth: '380px'
                  }} alt="Equipment Basket" />

                  {/* Items Inside Basket */}
                  <div ref={basketItemsContainerRef} style={{
                    position: 'absolute', 
                    top: '22%',
                    left: '50%', 
                    width: '85%',
                    height: '60%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto'
                  }}>
                    {itemsInBasket.map((item, idx) => {
                      const position = getBasketItemPosition(item, idx);
                      const randomRotation = (Math.random() - 0.5) * 20;
                      return (
                        <div key={`basket-item-${item}-${idx}`} className="animated-item" style={{
                          position: 'absolute',
                          top: position.top,
                          left: position.left,
                          transform: `translate(-50%, -50%) rotate(${randomRotation}deg)`,
                          touchAction: 'none',
                          userSelect: 'none',
                          zIndex: 10 + idx
                        }}>
                          <DraggableWrapper id={item} isDisabled={false} isDragging={activeId === item}>
                            <div style={{
                              background: 'linear-gradient(135deg, #fef7ed 0%, #fdf4e6 100%)',
                              borderRadius: 'clamp(12px, 3vw, 18px)',
                              padding: 'clamp(5px, 1.4vw, 7px)',
                              minWidth: 'clamp(37px, 7.4vw, 53px)',
                              minHeight: 'clamp(35px, 7vh, 48px)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 'clamp(1.2px, 0.35vw, 2.3px)',
                              border: '1px solid rgba(251, 191, 36, 0.5)', 
                              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'grab',
                              userSelect: 'none',
                            }}
                            onClick={() => handleItemTap(item)}>
                            
                              <div style={{
                                fontSize: 'clamp(9.2px, 2.1vw, 14px)',
                                marginBottom: 'clamp(0.6px, 0.12vh, 1.2px)',
                                lineHeight: '1'
                              }}>
                                {getItemDetails(item).emoji}
                              </div>
                              
                              <div style={{
                                fontSize: 'clamp(2.9px, 0.7vw, 4.6px)',
                                fontWeight: '700',
                                color: '#92400e',
                                textAlign: 'center',
                                lineHeight: '1.2',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1px',
                              }}>
                                {getItemDetails(item).name}
                              </div>
                            </div>
                          </DraggableWrapper>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shuffle Button */}
                  {itemsInBasket.length > 0 && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleShuffleClick(); }} 
                      className="shuffle-button"
                      style={{
                        position: 'absolute', 
                        top: 'clamp(82px, 3.5vh, 76px)',
                        right: 'clamp(-102px, -2.5vw, -158px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 100,
                      }}
                    >
                      <svg
                        style={{
                          borderRadius: '50%',
                          width: 'clamp(38px, 8vw, 44px)',
                          height: 'clamp(38px, 8vw, 44px)',
                          color: isClicked ? '#0f172a' : '#334155',
                          background: isHovered
                            ? 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)'
                            : 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                          padding: '12px',
                          boxShadow: isHovered
                            ? '0 8px 24px rgba(59, 130, 246, 0.3)'
                            : '0 4px 12px rgba(148, 163, 184, 0.15)',
                          transform: isHovered
                            ? 'scale(1.15) translateY(-2px)'
                            : isClicked
                            ? 'scale(0.95)'
                            : 'scale(1)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={isClicked ? '2.8' : '2.2'}
                          d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </DroppableWrapper>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-navigation" style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 8px)', 
            marginTop: 'auto',
            flexWrap: 'nowrap', 
            flexShrink: 0, 
            paddingBottom: 'clamp(8px, 2vh, 16px)',
            position: 'absolute',
            bottom: 'clamp(8px, 2vh, 16px)',
            left: 'clamp(8px, 2vw, 16px)',
            right: 'clamp(8px, 2vw, 16px)'
          }}>
            <button onClick={() => router.push('/restaurant')} className="back-button" style={{
              display: 'flex', 
              height: 'clamp(34px, 7vh, 50px)', 
              width: 'clamp(75px, 15vw, 105px)',
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#2563eb',
              color: 'white', 
              borderRadius: 'clamp(8px, 2vw, 12px)', 
              border: 'none', 
              fontWeight: '600',
              fontSize: 'clamp(11px, 2.2vw, 15px)', 
              cursor: 'pointer', 
              transition: 'all 0.2s ease',
              boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)'
            }}>← Back</button>
            
            <div style={{ flex: '1' }}></div>
            
            <Button 
              variant={itemsOnBanner.length ? 'primary' : 'secondary'} 
              disabled={!itemsOnBanner.length}
              onClick={handleSubmitOrder}
              className="submit-button"
              style={{
                height: 'clamp(34px, 7vh, 50px)',
                fontSize: 'clamp(11px, 2.2vw, 15px)',
                padding: '0 clamp(14px, 3.5vw, 22px)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                boxShadow: itemsOnBanner.length ? '0 3px 10px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              Submit ({itemsOnBanner.length})
            </Button>
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 400, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
          {activeId ? (
            <div style={{
              opacity: 0.95, 
              transform: 'rotate(8deg) scale(1.12)', 
              cursor: 'grabbing',
              pointerEvents: 'none', 
              zIndex: 9999,
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #fef7ed 0%, #fdf4e6 100%)',
                borderRadius: 'clamp(20px, 4.5vw, 28px)',
                padding: 'clamp(12px, 2.8vw, 16px)',
                minWidth: 'clamp(65px, 13vw, 95px)',
                minHeight: 'clamp(62px, 12.4vh, 88px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                border: '2px solid rgba(251, 191, 36, 0.5)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: 'clamp(18px, 3.8vw, 26px)' }}>
                  {getItemDetails(activeId).emoji}
                </div>
                <div style={{
                  fontSize: 'clamp(6px, 1.3vw, 9px)',
                  fontWeight: '700',
                  color: '#92400e',
                  textAlign: 'center',
                  textTransform: 'uppercase'
                }}>
                  {getItemDetails(activeId).name}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style jsx>{`
        .main-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }

        * {
          box-sizing: border-box;
          -webkit-user-select: none;
          user-select: none;
        }

        :global(html),
        :global(body) {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px) scale(0.85); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .back-button:hover,
        .submit-button:hover {
          background-color: #1d4ed8; 
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }
      `}</style>
    </Layout>
  );
}