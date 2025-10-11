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
  const [itemsInBasket, setItemsInBasket] = useState([]); // Items currently in basket
  const [itemsOnBanner, setItemsOnBanner] = useState([]); // Items currently on banner - SEQUENTIAL ORDER
  const [showBasketPopup, setShowBasketPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const dropSoundRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const basketItemsContainerRef = useRef(null);

  /* ---------- BANNER 4x2 GRID POSITIONS ---------- */
  const getItemPosition = (item, index) => {
    // PERFECT 4x2 GRID ON BANNER AREA ONLY
    const positions = [
      // TOP ROW (4 items)
      { top: '80px', left: '30%' },   // Position 1
      { top: '80px', left: '42%' },   // Position 2  
      { top: '80px', left: '55%' },   // Position 3
      { top: '80px', left: '68%' },   // Position 4
      
      // BOTTOM ROW (4 items)
      { top: '180px', left: '30%' },   // Position 5
      { top: '180px', left: '42%' },   // Position 6
      { top: '180px', left: '55%' },   // Position 7
      { top: '180px', left: '68%' },   // Position 8
    ];
    
    // Return position for index (max 8 items in 4x2 grid)
    return positions[index] || positions[0];
  };

  /* ---------- ENHANCED HORIZONTAL SPREAD BASKET POSITIONS ---------- */
  const getBasketItemPosition = (item, index) => {
    // ENHANCED HORIZONTAL SPREAD TO FILL COMPLETE BASKET WIDTH
    const basePositions = [
      // MAXIMUM HORIZONTAL SPREAD ACROSS ENTIRE BASKET WIDTH
      { top: '40%', left: '10%' },    // Far left top
      { top: '35%', left: '30%' },   // Left-center top
      { top: '38%', left: '45%' },   // Center-left top
      { top: '45%', left: '60%' },   // Center top
      { top: '40%', left: '85%' },   // Center-right top
      { top: '32%', left: '100%' },   // Right-center top
      { top: '40%', left: '117%' },   // Far right top
      { top: '35%', left: '150%' },   // Bottom center
    ];
    
    // Smaller random variations to maintain horizontal spread
    const basePos = basePositions[index] || basePositions[0];
    const randomOffsetX = (Math.random() - 0.5) * 8; // Reduced: -4% to +4%
    const randomOffsetY = (Math.random() - 0.5) * 6; // Reduced: -3% to +3%
    
    return {
      top: `${parseFloat(basePos.top) + randomOffsetY}%`,
      left: `${parseFloat(basePos.left) + randomOffsetX}%`
    };
  };

  /* ---------- GET NEXT AVAILABLE POSITION ---------- */
  const getNextAvailablePosition = () => {
    // Find the first available position (0-7) based on items already on banner
    for (let i = 0; i < 8; i++) {
      const item = levelData.answers[i];
      if (item && !itemsOnBanner.includes(item)) {
        return i;
      }
    }
    return 0; // Fallback to first position
  };

  /* ---------- SHUFFLE BASKET ITEMS FUNCTION ---------- */
  const shuffleBasketItems = () => {
    if (itemsInBasket.length === 0) return;
    
    // Create a copy of the basket items array
    const shuffledItems = [...itemsInBasket];
    
    // Fisher-Yates shuffle algorithm (same as Math.random logic used in dice)
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
    }
    
    // Update the basket with shuffled items
    setItemsInBasket(shuffledItems);
    
    // Enhanced card-swapping shuffle animation
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
                rotation: (Math.random() - 0.5) * 15, // Slight random tilt for card effect
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

  /* ---------- SENSORS ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 3 } })
  );

  /* ---------- INIT ---------- */
  useEffect(() => {
    const level = getCurrentLevel();
    
    // Get the same experiment as Restaurant Scene
    let data = getCurrentExperiment();
    if (!data) {
      data = getRandomExperiment();
      setCurrentExperiment(data);
    }
    
    // LIMIT TO EXACTLY 8 ITEMS FOR 4x2 GRID
    const limitedData = {
      ...data,
      answers: data.answers.slice(0, 8)
    };
    
    // REVERSED LOGIC: All items start in basket
    setCurrentLevel(level); 
    setLevelData(limitedData); 
    setItemsInBasket(limitedData.answers); // All items start in basket
    setItemsOnBanner([]); // No items on banner initially
    
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

  /* ---------- HELPERS ---------- */
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
    
    // Handle dropping on banner positions OR general banner area
    if (over.id.startsWith('banner-position-') || over.id === 'banner-area') {
      if (itemsInBasket.includes(itemId)) {
        // Move from basket to banner - ADD TO END OF ARRAY FOR SEQUENTIAL PLACEMENT
        setItemsInBasket(prev => prev.filter(id => id !== itemId));
        setItemsOnBanner(prev => [...prev, itemId]); // ADD TO END - SEQUENTIAL ORDER
        playDropSound();
        animateNewItem();
      }
    }
    
    // Handle dropping back into basket
    if (over.id === 'basket') {
      if (itemsOnBanner.includes(itemId)) {
        // Move from banner to basket
        setItemsOnBanner(prev => prev.filter(id => id !== itemId));
        setItemsInBasket(prev => [...prev, itemId]);
        playDropSound();
        animateNewItem();
      }
    }
  };

  const handleItemTap = (item) => {
    // Handle tap for moving items between basket and banner
    if (itemsInBasket.includes(item)) {
      // Move from basket to banner - ADD TO END FOR SEQUENTIAL PLACEMENT
      setItemsInBasket(prev => prev.filter(id => id !== item));
      setItemsOnBanner(prev => [...prev, item]); // ADD TO END - SEQUENTIAL ORDER
    } else if (itemsOnBanner.includes(item)) {
      // Move from banner to basket
      setItemsOnBanner(prev => prev.filter(id => id !== item));
      setItemsInBasket(prev => [...prev, item]);
    }
    animateNewItem();
  };

  const handleSubmitOrder = () => {
    // Update basket state for result scene with items on banner
    setBasket(itemsOnBanner);
    router.push('/result');
  };
  
  const handleClearBasket = () => { 
    // Move all items back to basket
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

        <div style={{
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
          <div style={{
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
          <div style={{
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
                  display: hasItemAtPosition ? 'none' : 'block' // HIDE when position is occupied
                }}>
                  <DroppableWrapper id={`banner-position-${idx}`}>
                    <div style={{
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
                      {/* NO "DROP HERE" TEXT */}
                    </div>
                  </DroppableWrapper>
                </div>
              );
            })}

            {/* Items on Banner - SEQUENTIAL PLACEMENT */}
            {itemsOnBanner.map((item, idx) => {
              // SEQUENTIAL POSITIONING: Use idx (order of placement) instead of item's original index
              const position = getItemPosition(item, idx); // idx = 0,1,2,3,4,5,6,7 in sequence
              return (
                <div key={`banner-item-${item}-${idx}`} style={{
                  position: 'absolute',
                  top: position.top,
                  left: position.left,
                  transform: 'translateX(-50%)',
                  animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both`,
                  touchAction: 'none', 
                  userSelect: 'none',
                  zIndex: 5,
                  borderRadius: '20px'
                }} className="animated-item">
                  <DraggableWrapper id={item} isDisabled={false} isDragging={activeId === item}>
                    {/* BANNER ITEMS - UNIFORM SIZE */}
                    <div style={{
                      background: 'linear-gradient(135deg, #fef7ed 0%, #fdf4e6 100%)',
                      borderRadius: 'clamp(20px, 4.5vw, 28px)', 
                      padding: 'clamp(12px, 2.8vw, 16px)', 
                      minWidth: 'clamp(65px, 13vw, 95px)', // UNIFORM SIZE
                      minHeight: 'clamp(62px, 12.4vh, 88px)', // UNIFORM SIZE
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
                      
                      {/* Item Emoji/Icon - UNIFORM SIZE */}
                      <div style={{
                        fontSize: 'clamp(18px, 3.8vw, 26px)', // UNIFORM SIZE
                        marginBottom: 'clamp(2px, 0.4vh, 3px)', 
                        lineHeight: '1'
                      }}>
                        {getItemDetails(item).emoji}
                      </div>
                      
                      {/* Item Name - UNIFORM SIZE */}
                      <div style={{
                        fontSize: 'clamp(6px, 1.3vw, 9px)', // UNIFORM SIZE
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

          {/* Floating Basket - MOVED DOWNWARDS */}
          <div style={{
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
            {/* REMOVED ONCLICK HANDLER - NO MORE BASKET POPUP */}
            <div style={{
              cursor: 'default', // Changed from conditional cursor
              transition: 'transform 0.3s ease',
              willChange: 'transform', 
              position: 'relative'
            }}>

              <DroppableWrapper id="basket">
                <div style={{ position: 'relative' }}>
                  <img src="/basket(cart).png" style={{
                    marginLeft: '-80px',  // FIXED SIZE: Removed clamp()
                    marginBottom: '-40px',  // FIXED SIZE: Removed clamp()
                    width: '380px',  // FIXED SIZE: Removed clamp()
                    height: 'auto', 
                    objectFit: 'contain'
                  }} alt="Equipment Basket" />

                  {/* Items Inside Basket Container - ENHANCED HORIZONTAL SPREAD */}
                  <div ref={basketItemsContainerRef} style={{
                    position: 'absolute', 
                    top: '22%', // Adjusted to cover more area
                    left: '50%', 
                    width: '85%', // WIDER to accommodate horizontal spread
                    height: '60%', // Much taller to cover complete basket height
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto'
                  }}>
                    {itemsInBasket.map((item, idx) => {
                      const position = getBasketItemPosition(item, idx);
                      const randomRotation = (Math.random() - 0.5) * 20; // Random tilt -10° to +10°
                      return (
                        <div key={`basket-item-${item}-${idx}`} style={{
                          position: 'absolute',
                          top: position.top,
                          left: position.left,
                          transform: `translate(-50%, -50%) rotate(${randomRotation}deg)`,
                          touchAction: 'none',
                          userSelect: 'none',
                          zIndex: 10 + idx
                        }} className="animated-item">
                          <DraggableWrapper id={item} isDisabled={false} isDragging={activeId === item}>
                            {/* BASKET ITEMS - 15% LARGER, CARD-LIKE */}
                            <div style={{
                              background: 'linear-gradient(135deg, #fef7ed 0%, #fdf4e6 100%)',
                              borderRadius: 'clamp(12px, 3vw, 18px)', // 15% larger: was 10px/2.5vw/15px
                              padding: 'clamp(5px, 1.4vw, 7px)', // 15% larger: was 4px/1.2vw/6px
                              minWidth: 'clamp(37px, 7.4vw, 53px)', // 15% larger: was 32px/6.4vw/46px
                              minHeight: 'clamp(35px, 7vh, 48px)', // 15% larger: was 30px/6vh/42px
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 'clamp(1.2px, 0.35vw, 2.3px)', // 15% larger: was 1px/0.3vw/2px
                              border: '1px solid rgba(251, 191, 36, 0.5)', 
                              boxShadow: '0 3px 12px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.06)', // Enhanced shadow for cards
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'grab',
                              userSelect: 'none',
                              backdropFilter: 'blur(1px)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-3px) scale(1.15) rotate(0deg)'; // Remove rotation on hover
                              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.08)';
                              e.target.style.borderColor = 'rgba(251, 191, 36, 0.7)';
                              e.target.style.zIndex = '100'; // Bring to front
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = `translateY(0) scale(1) rotate(${randomRotation}deg)`; // Restore rotation
                              e.target.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.06)';
                              e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                              e.target.style.zIndex = `${10 + idx}`;
                            }}
                            onClick={() => handleItemTap(item)}>
                            
                              {/* Item Emoji/Icon - 15% LARGER */}
                              <div style={{
                                fontSize: 'clamp(9.2px, 2.1vw, 14px)', // 15% larger: was 8px/1.8vw/12px
                                marginBottom: 'clamp(0.6px, 0.12vh, 1.2px)', // 15% larger: was 0.5px/0.1vh/1px
                                lineHeight: '1'
                              }}>
                                {getItemDetails(item).emoji}
                              </div>
                              
                              {/* Item Name - 15% LARGER */}
                              <div style={{
                                fontSize: 'clamp(2.9px, 0.7vw, 4.6px)', // 15% larger: was 2.5px/0.6vw/4px
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
                      style={{
                        position: 'absolute', 
                        top: 'clamp(82px, 3.5vh, 76px)',
                        right: 'clamp(-152px, -2.5vw, -158px)', // Better right positioning
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 100,
                      }}
                    >
                      {/* Enhanced Shuffle SVG Icon */}
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
          <div style={{
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
            <button onClick={() => router.push('/restaurant')} style={{
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

          {/* BASKET POPUP COMPLETELY REMOVED */}

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
              {/* Drag overlay with uniform size */}
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
        div::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px) scale(0.85); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        button:hover {
          background-color: #1d4ed8; 
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }
      `}</style>
    </Layout>
  );
}
