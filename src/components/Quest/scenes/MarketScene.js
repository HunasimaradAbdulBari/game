'use client';
import { useState, useEffect, useRef } from 'react';
import {
  DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors, rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import { useRouter } from 'next/navigation';
import Layout from '../Layout';
import DragItem from '../DragItem';
import Button from '../Button';
import { gsap } from 'gsap';
import { getCurrentLevel, getBasket, setBasket } from '../utils/storage';
import { getCurrentExperiment, getRandomExperiment, setCurrentExperiment } from '../utils/gameLogic';

/* ---------- DRAGGABLE WRAPPER ---------- */
function DraggableWrapper({ id, children, isDisabled, isDragging }) {
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
function DroppableWrapper({ id, children }) {
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
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [itemsInBasket, setItemsInBasket] = useState([]);
  const [itemsOnBanner, setItemsOnBanner] = useState([]);
  const [showBasketPopup, setShowBasketPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const dropSoundRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const basketItemsContainerRef = useRef(null);

  /* ---------- MOBILE BANNER POSITIONS - TIGHTER GRID ---------- */
  const getMobileItemPosition = (item, index) => {
    const positions = [
      // TOP ROW (4 items) - Closer together for mobile
      { top: '21px', left: '25%' },
      { top: '20x', left: '38%' },
      { top: '21px', left: '52%' },
      { top: '21px', left: '65%' },
      
      // BOTTOM ROW (4 items) - Closer together for mobile
      { top: '100px', left: '25%' },
      { top: '100px', left: '38%' },
      { top: '100px', left: '52%' },
      { top: '100px', left: '65%' },
    ];
    
    return positions[index] || positions[0];
  };

  /* ---------- DESKTOP BANNER POSITIONS - SPACIOUS GRID ---------- */
  const getDesktopItemPosition = (item, index) => {
    const positions = [
      // TOP ROW (4 items) - Original spacious layout
      { top: '80px', left: '30%' },
      { top: '80px', left: '42%' },
      { top: '80px', left: '55%' },
      { top: '80px', left: '68%' },
      
      // BOTTOM ROW (4 items) - Original spacious layout
      { top: '180px', left: '30%' },
      { top: '180px', left: '42%' },
      { top: '180px', left: '55%' },
      { top: '180px', left: '68%' },
    ];
    
    return positions[index] || positions[0];
  };

  /* ---------- DEVICE-AWARE POSITION FUNCTION ---------- */
  const getItemPosition = (item, index) => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      return isMobile ? getMobileItemPosition(item, index) : getDesktopItemPosition(item, index);
    }
    return getDesktopItemPosition(item, index); // Fallback
  };

  /* ---------- ENHANCED HORIZONTAL SPREAD BASKET POSITIONS ---------- */
  const getBasketItemPosition = (item, index) => {
    const basePositions = [
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

  const getNextAvailablePosition = () => {
    for (let i = 0; i < 8; i++) {
      const item = levelData.answers[i];
      if (item && !itemsOnBanner.includes(item)) {
        return i;
      }
    }
    return 0;
  };

  const shuffleBasketItems = () => {
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

  const handleShuffleClick = () => {
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
    
    const limitedData = {
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

  const playDropSound = () => {
    if (dropSoundRef.current) { 
      dropSoundRef.current.currentTime = 0; 
      dropSoundRef.current.play().catch(() => {}); 
    }
  };

  const animateNewItem = () => {
    setTimeout(() => {
      const newItemElements = document.querySelectorAll('.animated-item');
      const lastItem = newItemElements[newItemElements.length - 1];
      if (lastItem) {
        gsap.fromTo(lastItem, { scale: 0, rotation: 360, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
      }
    }, 50);
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragCancel = () => setActiveId(null);
  const handleDragEnd = ({ active, over }) => {
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

  const handleItemTap = (item) => {
    if (itemsInBasket.includes(item)) {
      setItemsInBasket(prev => prev.filter(id => id !== item));
      setItemsOnBanner(prev => [...prev, item]);
    } else if (itemsOnBanner.includes(item)) {
      setItemsOnBanner(prev => prev.filter(id => id !== item));
      setItemsInBasket(prev => [...prev, item]);
    }
    animateNewItem();
  };

  const handleSubmitOrder = () => {
    setBasket(itemsOnBanner);
    router.push('/result');
  };
  
  const handleClearBasket = () => { 
    setItemsInBasket([...itemsInBasket, ...itemsOnBanner]);
    setItemsOnBanner([]);
  };

  const getItemDetails = (itemId) => {
    const { ITEM_ICONS } = require('../utils/gameLogic');
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

          {/* Banner Area with Drop Zones and Items */}
          <div className="banner-area" style={{
            position: 'relative',
            flex: '1',
            width: '100%',
            height: '100%',
            paddingBottom: 'clamp(130px, 20vh, 150px)',
            overflow: 'auto',
            borderRadius: '20px'
          }}>
            
            {/* LARGE BANNER DROP AREA - COVERS ENTIRE BANNER */}
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
            
            {/* Banner Drop Zones - INVISIBLE, NO "DROP HERE" TEXT */}
            {Array.from({ length: 8 }, (_, idx) => {
              const position = getItemPosition(null, idx);
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

            {/* Items on Banner - DEVICE-AWARE POSITIONING AND SIZING */}
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
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'grab',
                      userSelect: 'none',
                      backdropFilter: 'blur(2px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-6px) scale(1.03)';
                      e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.12), 0 6px 15px rgba(0, 0, 0, 0.06)';
                      e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04)';
                      e.target.style.borderColor = 'rgba(251, 191, 36, 0.3)';
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

          {/* Floating Basket - FIXED SIZE CONSISTENCY */}
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

                  {/* Items Inside Basket Container - ENHANCED HORIZONTAL SPREAD */}
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
                              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.06)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'grab',
                              userSelect: 'none',
                              backdropFilter: 'blur(1px)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-3px) scale(1.15) rotate(0deg)';
                              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.08)';
                              e.target.style.borderColor = 'rgba(251, 191, 36, 0.7)';
                              e.target.style.zIndex = '100';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = `translateY(0) scale(1) rotate(${randomRotation}deg)`;
                              e.target.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.06)';
                              e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                              e.target.style.zIndex = `${10 + idx}`;
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

                  {/* Improved Shuffle Button - BETTER POSITIONING ON RIGHT SIDE */}
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
                        className="transition-all duration-300 ease-out cursor-pointer"
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
                            ? '0 8px 24px rgba(59, 130, 246, 0.3), 0 0 0 4px rgba(191, 219, 254, 0.5)'
                            : '0 4px 12px rgba(148, 163, 184, 0.15)',
                          transform: isHovered
                            ? 'scale(1.15) translateY(-2px)'
                            : isClicked
                            ? 'scale(0.95)'
                            : 'scale(1)',
                          backfaceVisibility: 'hidden',
                        }}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <defs>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={isClicked ? '2.8' : '2.2'}
                          d="M13.484 9.166 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.577-2.253M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
                          style={{
                            filter: isClicked ? 'url(#glow)' : 'none',
                            transition: 'all 0.3s ease-out',
                          }}
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
              willChange: 'transform', 
              backfaceVisibility: 'hidden'
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
        /* MANDATORY FULLSCREEN FOR ALL DEVICES - SIMPLE CSS */
        
        /* Force fullscreen container on ALL devices */
        .main-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
        }

        /* Prevent any container scaling or windowing */
        * {
          box-sizing: border-box;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Force body and html to be fullscreen */
        :global(html),
        :global(body) {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }

        /* Disable any browser zooming or scaling */
        :global(body) {
          zoom: 1 !important;
          transform: scale(1) !important;
          -webkit-text-size-adjust: 100% !important;
          -moz-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
        }

        div::-webkit-scrollbar {
          display: none;
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

        /* BASKET SIZE CONSISTENCY FIX - BOTH MOBILE AND DESKTOP */
        .basket-image {
          width: 380px !important;
          min-width: 380px !important;
          max-width: 380px !important;
          height: auto !important;
          display: block !important;
          object-fit: contain !important;
        }

        .floating-basket-container {
          min-width: 100px !important;
        }

        .basket-container {
          transform: none !important;
          scale: 1 !important;
        }

        /* MOBILE-SPECIFIC BANNER ITEM SIZING - OPTIMIZED FOR PHONES */
        @media screen and (max-width: 480px) {
          .main-container {
            padding: clamp(4px, 1vw, 8px) !important;
          }

          /* Mobile banner items - Smaller but readable */
          .banner-item {
            min-width: 45px !important;
            min-height: 40px !important;
            padding: 6px !important;
            border-radius: 12px !important;
            gap: 2px !important;
          }
          
          .banner-item-emoji {
            font-size: 16px !important;
            margin-bottom: 1px !important;
          }
          
          .banner-item-name {
            font-size: 6px !important;
            line-height: 1.1 !important;
            letter-spacing: 0.2px !important;
          }

          /* Mobile drop zones - Smaller to match items */
          .drop-zone {
            width: 45px !important;
            height: 40px !important;
            border-radius: 12px !important;
          }

          /* FIXED: Force consistent basket size on mobile */
          .basket-image {
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
            margin-left: -60px !important;
            margin-bottom: -30px !important;
          }
          
          /* Stack navigation buttons on mobile */
          .bottom-navigation {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: center !important;
            padding: 0 clamp(12px, 3vw, 20px) !important;
          }
          
          .back-button,
          .submit-button {
            width: 100% !important;
            max-width: 300px !important;
            min-height: 44px !important;
          }
        }

        /* Extra Small Mobile phones (320px - 375px) */
        @media screen and (max-width: 375px) {
          .banner-item {
            min-width: 38px !important;
            min-height: 34px !important;
            padding: 4px !important;
            border-radius: 10px !important;
          }
          
          .banner-item-emoji {
            font-size: 14px !important;
            margin-bottom: 0px !important;
          }
          
          .banner-item-name {
            font-size: 5px !important;
            line-height: 1 !important;
          }

          .drop-zone {
            width: 38px !important;
            height: 34px !important;
            border-radius: 10px !important;
          }

          .basket-image {
            width: 260px !important;
            min-width: 260px !important;
            max-width: 260px !important;
            margin-left: -55px !important;
            margin-bottom: -25px !important;
          }
        }

        /* TABLET RESPONSIVE - MEDIUM SIZED ITEMS */
        @media screen and (min-width: 481px) and (max-width: 768px) {
          .banner-item {
            min-width: 55px !important;
            min-height: 50px !important;
            padding: 8px !important;
            border-radius: 14px !important;
          }
          
          .banner-item-emoji {
            font-size: 18px !important;
            margin-bottom: 1px !important;
          }
          
          .banner-item-name {
            font-size: 7px !important;
            line-height: 1.1 !important;
          }

          .drop-zone {
            width: 55px !important;
            height: 50px !important;
            border-radius: 14px !important;
          }

          .basket-image {
            width: 320px !important;
            min-width: 320px !important;
            max-width: 320px !important;
            margin-left: -65px !important;
            margin-bottom: -35px !important;
          }

          .bottom-navigation {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: clamp(8px, 2vw, 16px) !important;
          }
        }

        /* DESKTOP RESPONSIVE - ORIGINAL PERFECT SIZES */
        @media screen and (min-width: 769px) {
          .banner-item {
            min-width: clamp(65px, 13vw, 95px) !important;
            min-height: clamp(62px, 12.4vh, 88px) !important;
            padding: clamp(12px, 2.8vw, 16px) !important;
            border-radius: clamp(20px, 4.5vw, 28px) !important;
          }
          
          .banner-item-emoji {
            font-size: clamp(18px, 3.8vw, 26px) !important;
            margin-bottom: clamp(2px, 0.4vh, 3px) !important;
          }
          
          .banner-item-name {
            font-size: clamp(6px, 1.3vw, 9px) !important;
            line-height: 1.2 !important;
          }

          .drop-zone {
            width: clamp(65px, 13vw, 95px) !important;
            height: clamp(62px, 12.4vh, 88px) !important;
            border-radius: clamp(18px, 4vw, 26px) !important;
          }

          .basket-image {
            width: 380px !important;
            min-width: 380px !important;
            max-width: 380px !important;
            margin-left: -80px !important;
            margin-bottom: -40px !important;
          }

          .bottom-navigation {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
        }

        /* Landscape mode adjustments */
        @media screen and (orientation: landscape) and (max-height: 600px) {
          .banner-area {
            padding-bottom: clamp(80px, 15vh, 120px) !important;
          }
          
          .floating-basket-container {
            bottom: clamp(25px, 5vh, 40px) !important;
          }
          
          .basket-image {
            width: 300px !important;
            min-width: 300px !important;
            max-width: 300px !important;
            margin-left: -65px !important;
            margin-bottom: -30px !important;
          }
          
          .bottom-navigation {
            bottom: clamp(4px, 1vh, 8px) !important;
            padding-bottom: clamp(4px, 1vh, 8px) !important;
          }
          
          /* Landscape mobile banner items - Compact */
          @media screen and (max-width: 480px) {
            .banner-item {
              min-width: 35px !important;
              min-height: 32px !important;
              padding: 4px !important;
              border-radius: 8px !important;
            }
            
            .banner-item-emoji {
              font-size: 12px !important;
              margin-bottom: 0px !important;
            }
            
            .banner-item-name {
              font-size: 5px !important;
            }

            .drop-zone {
              width: 35px !important;
              height: 32px !important;
              border-radius: 8px !important;
            }
          }
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .main-container {
            height: -webkit-fill-available !important;
          }
          
          :global(body) {
            height: -webkit-fill-available !important;
          }
        }

        /* Android Chrome specific fixes */
        @media screen and (-webkit-min-device-pixel-ratio: 1) {
          .back-button,
          .submit-button {
            min-height: 48px !important;
            min-width: 48px !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          div[style*="cursor: grab"] {
            cursor: default !important;
          }
          
          .back-button,
          .submit-button {
            min-height: 44px !important;
            min-width: 88px !important;
            font-size: clamp(12px, 3vw, 16px) !important;
          }
        }

        /* High DPI displays */
        @media screen and (min-resolution: 2dppx) {
          .basket-image {
            image-rendering: -webkit-optimize-contrast !important;
          }
        }

        /* Prevent zoom on input focus (iOS) */
        :global(input),
        :global(select),
        :global(textarea) {
          font-size: 16px !important;
        }

        /* Smooth scrolling for all devices */
        * {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Disable text selection and context menus */
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -khtml-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }

        /* Prevent any scrolling or overflow */
        :global(html),
        :global(body),
        .main-container {
          overflow: hidden !important;
          overscroll-behavior: none !important;
        }

        /* Force hardware acceleration */
        .main-container,
        .banner-area,
        .floating-basket-container,
        .bottom-navigation {
          transform: translateZ(0) !important;
          will-change: transform !important;
          backface-visibility: hidden !important;
        }

        /* Force basket image consistency across all conditions */
        img[alt="Equipment Basket"] {
          transform: none !important;
          scale: 1 !important;
        }
      `}</style>
    </Layout>
  );
}
