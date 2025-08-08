// pages/market.js - Lab Equipment Store with Subject Backgrounds
import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DragItem from '../components/DragItem';
import Basket from '../components/Basket';
import Button from '../components/Button';
import { getCurrentLevel, getBasket, setBasket, getCurrentSubject } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

/* ---------- DRAGGABLE WRAPPER ---------- */
function DraggableWrapper({ id, children, isDisabled, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingHook,
  } = useDraggable({
    id,
    disabled: isDisabled,
    data: { type: 'item', item: id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.1 : 1,
        transition: isDraggingHook ? 'none' : 'all 0.2s ease',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: isDragging ? 'grabbing' : isDisabled ? 'not-allowed' : 'grab',
        filter: isDragging ? 'brightness(0.8)' : 'brightness(1)',
        willChange: isDraggingHook ? 'transform' : 'auto',
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

/* ---------- DROPPABLE WRAPPER ---------- */
function DroppableWrapper({ id, children }) {
  const { isOver, setNodeRef, active, over } = useDroppable({
    id,
    data: { type: 'basket', accepts: ['item'] },
  });

  const canDrop = active?.data.current?.type === 'item';
  const isOverCurrent = isOver && over?.id === id;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: isOverCurrent && canDrop ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isOverCurrent && canDrop ? 'brightness(1.2)' : 'brightness(1)',
        // Removed backgroundColor and border styles for the basketbox.png
        borderRadius: '12px',
      }}
    >
      {children}
    </div>
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

  /* ---------- SENSORS ---------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 3 },
    })
  );

  /* ---------- INIT ---------- */
  useEffect(() => {
    const level = getCurrentLevel();
    const subject = getCurrentSubject();
    const data = getLevelData(level, subject);
    const storedBasket = getBasket();

    setCurrentLevel(level);
    setCurrentSubject(subject);
    setLevelData(data);
    setBasketState(storedBasket);

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

  const handleDragStart = ({ active }) => setActiveId(active.id);
  const handleDragCancel = () => setActiveId(null);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || over.id !== 'basket' || basket.includes(active.id)) return;
    const newBasket = [...basket, active.id];
    playDropSound();
    setBasketState(newBasket);
    setBasket(newBasket);
  };

  const handleItemTap = (item) => {
    if (basket.includes(item)) return;
    const newBasket = [...basket, item];
    setBasketState(newBasket);
    setBasket(newBasket);
  };

  const handleRemoveItem = (idx) => {
    const newBasket = basket.filter((_, i) => i !== idx);
    setBasketState(newBasket);
    setBasket(newBasket);
  };

  const handleSubmitOrder = () => router.push('/result');
  const handleClearBasket = () => {
    setBasketState([]);
    setBasket([]);
  };
  const handleGoToMenu = () => router.push('/');

  // Helper function to get item emoji and name
  const getItemDetails = (itemId) => {
    const { ITEM_ICONS } = require('../utils/gameLogic');
    return {
      emoji: ITEM_ICONS[itemId] || '🔧',
      name: itemId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  };

  if (!levelData) return null;

  return (
    <Layout scene="market" subject={currentSubject}>
      {/* Subject-Specific Background */}
      {currentSubject === 'physics' && (
        <img
          style={{
            position: 'fixed',
            // marginLeft:'250px',
            // marginTop:'50px',
            top: 0,
            left: 0,
            // marginLeft:'160px',
            // marginTop:'px',
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            border:'none',
            // filter: 'blur(2px)',
            // opacity: 3.9,
          }}
        
           src="/phy0.png" type="img/jpg" />
      )}

      

      {currentSubject === 'chemistry' && (
         <img
          style={{
            position: 'fixed',
            // marginLeft:'250px',
            // marginTop:'50px',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            border:'none',
            // filter: 'blur(2px)',
            // opacity: 3.9,
          }}
        
           src="/che.png" type="img/png" />
      )}

      {currentSubject === 'electronics' && (
        <img
          style={{
            position: 'fixed',
            // marginLeft:'250px',
            // marginTop:'50px',
            top: 0,
            left: 0,
            // marginLeft:'160px',
            // marginTop:'px',
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            border:'none',
            // filter: 'blur(2px)',
            // opacity: 3.9,
          }}
        
           src="/electric1.png" type="img/jpg" />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges, snapCenterToCursor]}
      >
        <div
          className="market-scene"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: 'clamp(12px, 2vw, 20px)',
            position: 'relative',
            touchAction: activeId ? 'none' : 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* REMOVED: Shiny Animated Bubble Background */}

          {/* Header */}
          <div className="header" style={{ textAlign: 'center', marginBottom: 'clamp(8px, 2vw, 16px)', flexShrink: 0 }}>
            <h1
              style={{
                fontSize: 'clamp(18px, 4vw, 28px)',
                fontWeight: '700',
                color: '#1e293b',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🔬 Lab Equipment Store
            </h1>
            <p style={{
              fontSize: 'clamp(12px, 2.5vw, 16px)',
              fontWeight: '500',
              color: '#64748b',
            }}>
              {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} - Level {currentLevel}
            </p>
          </div>

          {/* Items Grid */}
          <div
            className="items-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(80px, 12vw, 120px), 1fr))',
              gap: 'clamp(8px, 2vw, 16px)',
              flex: '1',
              padding: '0 clamp(8px, 2vw, 20px)',
              overflow: 'hidden',
              alignContent: 'start',
              maxHeight: '100%',
            }}
          >
            {levelData.available.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                className="item-slot fade-in"
                style={{
                  animation: `fadeIn 0.6s ease-out ${idx * 0.1}s both`,
                  touchAction: 'none',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DraggableWrapper
                  id={item}
                  isDisabled={basket.includes(item)}
                  isDragging={activeId === item}
                >
                  <DragItem
                    item={item}
                    onTap={handleItemTap}
                    inBasket={basket.includes(item)}
                    disabled={basket.includes(item)}
                  />
                </DraggableWrapper>
              </div>
            ))}
          </div>

          {/* Floating Basket - REPLACED with basketbox.png */}
          <div
            className="floating-basket"
            style={{
              position: 'absolute',
              marginTop:'-90px',
              top: 'clamp(60px, 15vw, 120px)',
              right: 'clamp(8px, 2vw, 20px)',
              width: 'clamp(100px, 15vw, 180px)',
              touchAction: 'none',
              filter: activeId
                ? 'drop-shadow(0 0 20px rgba(16,185,129,0.5))'
                : 'none',
              transition: 'filter 0.3s ease',
              zIndex: 100,
            }}
          >
            <div
              onClick={() => basket.length && setShowBasketPopup(true)}
              style={{
                cursor: basket.length ? 'pointer' : 'default',
                transition: 'transform 0.3s ease',
                willChange: 'transform',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (basket.length) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <DroppableWrapper id="basket">
                {/* REPLACED: basketbox.png instead of Basket component */}
                <img 
                  src="/basketbox.png" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  alt="Equipment Basket" 
                />
                {/* Item count badge */}
                {basket.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: 'clamp(20px, 4vw, 28px)',
                      height: 'clamp(20px, 4vw, 28px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(10px, 2vw, 14px)',
                      fontWeight: '700',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    {basket.length}
                  </div>
                )}
              </DroppableWrapper>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div
            className="bottom-nav"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'clamp(6px, 1.5vw, 12px)',
              marginTop: 'clamp(8px, 2vw, 16px)',
              flexWrap: 'wrap',
              flexShrink: 0,
            }}
          >
            <button
              className="back-button"
              onClick={() => router.push('/restaurant')}
              style={{
                display: 'flex',
                height: 'clamp(32px, 5vw, 48px)',
                width: 'clamp(80px, 15vw, 120px)',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                fontSize: 'clamp(10px, 2vw, 14px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ← Back
            </button>

            <div
              style={{
                display: 'flex',
                gap: 'clamp(6px, 1.5vw, 12px)',
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {basket.length > 0 && (
                <Button variant="secondary" onClick={handleClearBasket}>
                  Clear Basket
                </Button>
              )}
            </div>

            <Button
              variant={basket.length ? 'primary' : 'secondary'}
              disabled={!basket.length}
              onClick={handleSubmitOrder}
            >
              Submit ({basket.length})
            </Button>
          </div>

          {/* Basket Popup */}
          {showBasketPopup && (
            <div
              className="basket-popup-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
              }}
              onClick={() => setShowBasketPopup(false)}
            >
              <div
                className="basket-popup"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  padding: '24px',
                  maxWidth: '400px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  margin: '20px',
                  border: '2px solid #10b981',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  style={{
                    color: '#1e293b',
                    marginBottom: '16px',
                    fontSize: '20px',
                    fontWeight: '700',
                    textAlign: 'center'
                  }}
                >
                  🧰 Your Equipment Basket ({basket.length})
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  {basket.map((item, idx) => {
                    const itemDetails = getItemDetails(item);
                    return (
                      <div 
                        key={`basket-${item}-${idx}`} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          marginBottom: '6px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{itemDetails.emoji}</span>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: '#495057'
                          }}>
                            {itemDetails.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#dc3545',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8d7da'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          ❌
                        </button>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="primary"
                  onClick={() => setShowBasketPopup(false)}
                  style={{ width: '100%' }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay
          dropAnimation={{
            duration: 400,
            easing: 'cubic-bezier(0.18,0.67,0.6,1.22)',
          }}
        >
          {activeId ? (
            <div
              style={{
                opacity: 0.95,
                transform: 'rotate(8deg) scale(1.1)',
                cursor: 'grabbing',
                pointerEvents: 'none',
                zIndex: 9999,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            >
              <DragItem item={activeId} disabled={false} inBasket={false} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Enhanced Styles - REMOVED BUBBLE STYLES */}
      <style jsx>{`
        @keyframes electronics-charge {
          100% { background-size: 120% 100%; }
        }

        .loader::before {
          content: "";
          position: absolute;
          top: -2px;
          bottom: -2px;
          left: 100%;
          width: 8px;
          background: linear-gradient(#0000 calc(50% - 5px), #22f49e 0 calc(50% - 3px), #0000 0 calc(50% + 3px), #22f49e 0 calc(50% + 5px), #0000 0) left / 100% 100%,
            linear-gradient(#22f49e calc(50% - 3px), #0000 0 calc(50% + 3px), #22f49e 0) left / 2px 100%,
            linear-gradient(#0000 calc(50% - 3px), #22f49e 0 calc(50% + 3px), #0000 0) right/2px 100%;
          background-repeat: no-repeat;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .back-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        @media (max-width: 768px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(clamp(70px, 15vw, 100px), 1fr)) !important;
            gap: clamp(6px, 2vw, 12px) !important;
            padding: 0 clamp(4px, 1vw, 8px) !important;
          }
          
          .floating-basket {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            width: 100% !important;
            margin: clamp(8px, 2vw, 16px) 0 !important;
            order: -1;
          }
          
          .bottom-nav {
            flex-direction: column !important;
            gap: clamp(6px, 2vw, 12px) !important;
          }
        }
      `}</style>
    </Layout>
  );
}
