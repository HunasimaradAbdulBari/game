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
import { getCurrentLevel, getBasket, setBasket, getCurrentSubject } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

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
    id, data: { type: 'basket', accepts: ['item'] }
  });
  const canDrop = active?.data.current?.type === 'item';
  const isOverCurrent = isOver && over?.id === id;
  return (
    <div ref={setNodeRef} style={{
      transform: isOverCurrent && canDrop ? 'scale(1.08)' : 'scale(1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: isOverCurrent && canDrop ? 'brightness(1.2)' : 'brightness(1)', borderRadius: '12px'
    }}>{children}</div>
  );
}

export default function MarketPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasketState] = useState([]);
  const [showBasketPopup, setShowBasketPopup] = useState(false);
  const dropSoundRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const basketItemsContainerRef = useRef(null);

  /* ---------- SENSORS ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 3 } })
  );

  /* ---------- INIT ---------- */
  useEffect(() => {
    const level = getCurrentLevel();
    const subject = getCurrentSubject();
    const data = getLevelData(level, subject);
    const storedBasket = getBasket();
    setCurrentLevel(level); setCurrentSubject(subject); setLevelData(data); setBasketState(storedBasket);
    if (typeof window !== 'undefined') {
      dropSoundRef.current = new Audio('/sounds/drop.mp3');
      dropSoundRef.current.volume = 0.4; dropSoundRef.current.preload = 'auto'; dropSoundRef.current.load();
    }
    return () => {
      if (dropSoundRef.current) { dropSoundRef.current.pause(); dropSoundRef.current = null; }
    };
  }, []);

  /* ---------- HELPERS ---------- */
  const playDropSound = () => {
    if (dropSoundRef.current) { dropSoundRef.current.currentTime = 0; dropSoundRef.current.play().catch(() => {}); }
  };

  const animateNewItem = () => {
    setTimeout(() => {
      if (basketItemsContainerRef.current) {
        const newItemElements = basketItemsContainerRef.current.querySelectorAll('.basket-mini-item');
        const lastItem = newItemElements[newItemElements.length - 1];
        if (lastItem) {
          gsap.fromTo(lastItem, { scale: 0, rotation: 360, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
        }
      }
    }, 50);
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragCancel = () => setActiveId(null);
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || over.id !== 'basket' || basket.includes(active.id)) return;
    const newBasket = [...basket, active.id];
    playDropSound(); setBasketState(newBasket); setBasket(newBasket); animateNewItem();
  };

  const handleItemTap = (item) => {
    if (basket.includes(item)) return;
    const newBasket = [...basket, item];
    setBasketState(newBasket); setBasket(newBasket); animateNewItem();
  };

  const handleRemoveItem = (idx) => {
    if (basketItemsContainerRef.current) {
      const itemElements = basketItemsContainerRef.current.querySelectorAll('.basket-mini-item');
      const itemToRemove = itemElements[idx];
      if (itemToRemove) {
        gsap.to(itemToRemove, {
          scale: 0, opacity: 0, rotation: -180, duration: 0.4, ease: "back.in(1.7)",
          onComplete: () => {
            const newBasket = basket.filter((_, i) => i !== idx);
            setBasketState(newBasket); setBasket(newBasket);
          }
        });
        return;
      }
    }
    const newBasket = basket.filter((_, i) => i !== idx);
    setBasketState(newBasket); setBasket(newBasket);
  };

  const handleSubmitOrder = () => router.push('/result');
  const handleClearBasket = () => { setBasketState([]); setBasket([]); };

  const getItemDetails = (itemId) => {
    const { ITEM_ICONS } = require('../utils/gameLogic');
    return {
      emoji: ITEM_ICONS[itemId] || '🔧',
      name: itemId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  };

  if (!levelData) return null;

  const backgroundImages = {
    physics: "/phy0.png",
    chemistry: "/che.png",
    electronics: "/electric1.png"
  };

  return (
    <Layout scene="market" subject={currentSubject}>
      {/* Subject-Specific Background */}
      <img style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        objectFit: 'cover', zIndex: -15, border: 'none'
      }} src={backgroundImages[currentSubject]} alt="background" />

      <DndContext sensors={sensors} collisionDetection={rectIntersection}
        onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges, snapCenterToCursor]}>

        <div className="market-scene" style={{
          display: 'flex', flexDirection: 'column', height: '100vh',
          padding: 'clamp(4px, 1vw, 8px)', position: 'relative',
          touchAction: activeId ? 'none' : 'pan-y', userSelect: 'none',
          WebkitUserSelect: 'none', WebkitTouchCallout: 'none', overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
          maxHeight: '100vh', minHeight: '100vh'
        }}>

          {/* Header */}
          <div className="header" style={{
            textAlign: 'center', marginBottom: 'clamp(4px, 1vh, 8px)', flexShrink: 0,
            paddingTop: 'clamp(2px, 0.5vh, 4px)'
          }}>
            <h1 style={{
              fontSize: 'clamp(16px, 3.5vw, 24px)', fontWeight: '700', color: '#1e293b',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              margin: 0, lineHeight: '1.2'
            }}>🔬 Lab Equipment Store</h1>
            <p style={{
              fontSize: 'clamp(10px, 2vw, 14px)', fontWeight: '500', color: '#64748b',
              margin: 0, lineHeight: '1.2'
            }}>
              {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} - Level {currentLevel}
            </p>
          </div>

          {/* Items Grid Container */}
          <div className="items-container" style={{
            flex: '1', display: 'flex', flexDirection: 'column',
            minHeight: 0, position: 'relative'
          }}>
            {/* Items Grid */}
            <div className="items-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(60px, 10vw, 90px), 1fr))',
              gap: 'clamp(4px, 1vw, 8px)', 
              flex: '1',
              padding: '0 clamp(4px, 1vw, 8px)',
              paddingBottom: 'clamp(80px, 15vh, 120px)',
              overflow: 'auto',
              alignContent: 'start',
              maxHeight: 'calc(100vh - 180px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {levelData.answers.filter(item => !basket.includes(item)).map((item, idx) => (
                <div key={`${item}-${idx}`} className="item-slot fade-in" style={{
                  animation: `fadeIn 0.6s ease-out ${idx * 0.05}s both`,
                  touchAction: 'none', userSelect: 'none', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <DraggableWrapper id={item} isDisabled={false} isDragging={activeId === item}>
                    <DragItem item={item} onTap={handleItemTap} inBasket={false} disabled={false} />
                  </DraggableWrapper>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Basket */}
          <div className="floating-basket" style={{
            position: 'absolute', 
            bottom: 'clamp(60px, 12vh, 90px)', 
            left: '50%',
            transform: 'translateX(-50%)', 
            width: 'clamp(100px, 18vw, 160px)', 
            touchAction: 'none',
            filter: activeId ? 'drop-shadow(0 0 20px rgba(16,185,129,0.5))' : 'none',
            transition: 'filter 0.3s ease', 
            zIndex: 100
          }}>
            <div onClick={() => basket.length && setShowBasketPopup(true)} style={{
              cursor: basket.length ? 'pointer' : 'default', transition: 'transform 0.3s ease',
              willChange: 'transform', position: 'relative'
            }}
              onMouseEnter={(e) => { if (basket.length) e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>

              <DroppableWrapper id="basket">
                <div style={{ position: 'relative' }}>
                  <img src="/basketbox.svg" style={{
                    marginLeft: 'clamp(-60px, -12vw, -80px)', 
                    marginBottom: 'clamp(-10px, -6vh, -20px)',
                    width: 'clamp(280px, 50vw, 380px)', 
                    height: 'auto', 
                    objectFit: 'contain'
                
                  }} alt="Equipment Basket" />

                  {/* Mini Items Inside Basket */}
                  <div ref={basketItemsContainerRef} style={{
                    position: 'absolute', 
                    top: '25%', 
                    left: '25%', 
                    width: '50%', 
                    height: '50%',
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: 'clamp(1px, 0.3vw, 2px)', 
                    pointerEvents: 'none'
                  }}>
                    {basket.slice(0, 8).map((item, idx) => {
                      const itemDetails = getItemDetails(item);
                      return (
                        <div key={`mini-${item}-${idx}`} className="basket-mini-item" style={{
                          fontSize: 'clamp(8px, 1.5vw, 12px)', 
                          background: 'rgba(255,255,255,0.9)',
                          borderRadius: '50%', 
                          padding: 'clamp(1px, 0.2vw, 2px)',
                          border: '1px solid rgba(0,0,0,0.1)', 
                          display: 'flex',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          minWidth: 'clamp(8px, 1.5vw, 12px)', 
                          minHeight: 'clamp(8px, 1.5vw, 12px)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}>{itemDetails.emoji}</div>
                      );
                    })}
                    {/* Overflow indicator */}
                    {basket.length > 8 && (
                      <div className="basket-mini-item" style={{
                        fontSize: 'clamp(6px, 0.8vw, 8px)', 
                        background: 'rgba(239,68,68,0.9)',
                        color: 'white', 
                        borderRadius: '50%', 
                        padding: 'clamp(1px, 0.2vw, 2px)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        minWidth: 'clamp(8px, 1.5vw, 12px)', 
                        minHeight: 'clamp(8px, 1.5vw, 12px)',
                        fontWeight: 'bold', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}>+{basket.length - 8}</div>
                    )}
                  </div>
                </div>

                {/* Item count badge */}
                {basket.length > 0 && (
                  <div style={{
                    position: 'absolute', 
                    top: 'clamp(-6px, -1vh, -4px)', 
                    right: 'clamp(-6px, -1vw, -4px)', 
                    background: '#ef4444',
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 'clamp(16px, 3vw, 22px)',
                    height: 'clamp(16px, 3vw, 22px)', 
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 'clamp(8px, 1.5vw, 12px)', 
                    fontWeight: '700',
                    border: '2px solid white', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>{basket.length}</div>
                )}

                {/* Delete Button */}
                {basket.length > 0 && (
                  <div onClick={(e) => { e.stopPropagation(); handleClearBasket(); }} style={{
                    position: 'absolute', 
                    top: 'clamp(-6px, -1vh, -4px)', 
                    left: 'clamp(140px, 28vw, 200px)',
                    background: '#f0e9eaff', 
                    borderRadius: '50%',
                    width: 'clamp(20px, 4vw, 28px)', 
                    height: 'clamp(20px, 4vw, 28px)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    <img style={{ 
                      height: 'clamp(16px, 3vw, 22px)', 
                      width: 'clamp(14px, 2.5vw, 18px)' 
                    }} src="/trash3.png" alt="" />
                  </div>
                )}
              </DroppableWrapper>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-nav" style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 8px)', 
            marginTop: 'auto',
            flexWrap: 'nowrap', 
            flexShrink: 0, 
            paddingBottom: 'clamp(4px, 1vh, 8px)',
            position: 'absolute',
            bottom: 'clamp(8px, 2vh, 16px)',
            left: 'clamp(4px, 1vw, 8px)',
            right: 'clamp(4px, 1vw, 8px)'
          }}>
            <button className="back-button" onClick={() => router.push('/restaurant')} style={{
              display: 'flex', 
              height: 'clamp(28px, 5vh, 40px)', 
              width: 'clamp(60px, 12vw, 90px)',
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#2563eb',
              color: 'white', 
              borderRadius: 'clamp(4px, 1vw, 6px)', 
              border: 'none', 
              fontWeight: '600',
              fontSize: 'clamp(8px, 1.5vw, 12px)', 
              cursor: 'pointer', 
              marginTop:'-140px',
              transition: 'all 0.2s ease'
            }}>← Back</button>
            
            <div style={{ flex: '1' }}></div>
            
            <Button 
              variant={basket.length ? 'primary' : 'secondary'} 
              disabled={!basket.length}
              onClick={handleSubmitOrder}
              style={{
                marginTop:'-170px',
                // marginLeft:'140px',
                height: 'clamp(28px, 5vh, 40px)',
                fontSize: 'clamp(8px, 1.5vw, 12px)',
                padding: '0 clamp(8px, 2vw, 16px)'
              }}
            >
              Submit ({basket.length})
            </Button>
          </div>

          {/* Basket Popup */}
          {showBasketPopup && (
            <div className="basket-popup-overlay" style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 2000,
              padding: 'clamp(8px, 2vw, 20px)'
            }} onClick={() => setShowBasketPopup(false)}>
              <div className="basket-popup" style={{
                backgroundColor: '#fff', 
                borderRadius: 'clamp(8px, 2vw, 16px)', 
                padding: 'clamp(12px, 3vw, 20px)',
                maxWidth: 'min(90vw, 350px)', 
                maxHeight: '80vh', 
                overflow: 'auto',
                border: '2px solid #10b981',
                width: '100%'
              }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{
                  color: '#1e293b', 
                  marginBottom: 'clamp(8px, 2vw, 12px)', 
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  fontWeight: '700', 
                  textAlign: 'center'
                }}>🧰 Your Equipment Basket ({basket.length})</h3>
                <div style={{ marginBottom: 'clamp(12px, 3vw, 16px)' }}>
                  {basket.map((item, idx) => {
                    const itemDetails = getItemDetails(item);
                    return (
                      <div key={`basket-${item}-${idx}`} style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: 'clamp(4px, 1vw, 6px) clamp(6px, 1.5vw, 8px)', 
                        marginBottom: 'clamp(3px, 0.8vw, 4px)', 
                        backgroundColor: '#f8f9fa',
                        borderRadius: 'clamp(4px, 1vw, 6px)', 
                        border: '1px solid #e9ecef'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'clamp(4px, 1vw, 6px)'
                        }}>
                          <span style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}>
                            {itemDetails.emoji}
                          </span>
                          <span style={{
                            fontSize: 'clamp(10px, 2vw, 12px)', 
                            fontWeight: '500', 
                            color: '#495057'
                          }}>{itemDetails.name}</span>
                        </div>
                        <button onClick={() => handleRemoveItem(idx)} style={{
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontSize: 'clamp(10px, 2vw, 14px)', 
                          color: '#dc3545', 
                          padding: 'clamp(2px, 0.5vw, 3px)',
                          borderRadius: 'clamp(2px, 0.5vw, 3px)', 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8d7da'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                          ❌
                        </button>
                      </div>
                    );
                  })}
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => setShowBasketPopup(false)}
                  style={{ 
                    width: '100%',
                    fontSize: 'clamp(10px, 2vw, 14px)',
                    height: 'clamp(32px, 6vh, 40px)'
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        <DragOverlay dropAnimation={{ duration: 400, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
          {activeId ? (
            <div style={{
              opacity: 0.95, 
              transform: 'rotate(8deg) scale(1.1)', 
              cursor: 'grabbing',
              pointerEvents: 'none', 
              zIndex: 9999,
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
              willChange: 'transform', 
              backfaceVisibility: 'hidden'
            }}>
              <DragItem item={activeId} disabled={false} inBasket={false} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style jsx>{`
        .items-grid::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .back-button:hover {
          background-color: #1d4ed8; 
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        @media (max-width: 480px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)) !important;
            gap: 3px !important;
            padding: 0 4px !important;
            paddingBottom: 70px !important;
          }
          
          .floating-basket {
            bottom: 50px !important;
            width: 80px !important;
          }
          
          .bottom-nav {
            bottom: 6px !important;
            left: 4px !important;
            right: 4px !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(65px, 1fr)) !important;
            gap: 6px !important;
            paddingBottom: 90px !important;
          }
        }
        
        @media (min-width: 769px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)) !important;
            gap: 8px !important;
            paddingBottom: 110px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
