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
  pointerWithin
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DragItem from '../components/DragItem';
import Basket from '../components/Basket';
import Button from '../components/Button';
import { getCurrentLevel, getBasket, setBasket } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

// FIXED: Mobile-optimized draggable wrapper with proper offset handling
function DraggableWrapper({ id, children, isDisabled, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: id,
    disabled: isDisabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.1 : 1, // Almost invisible when dragging
        transition: 'opacity 0.2s ease',
        touchAction: 'none', // CRITICAL for mobile
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}

// FIXED: Mobile-optimized droppable wrapper
function DroppableWrapper({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: isOver ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: isOver ? 'brightness(1.2)' : 'brightness(1)',
      }}
    >
      {children}
    </div>
  );
}

export default function MarketPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasketState] = useState([]);
  const [showBasketPopup, setShowBasketPopup] = useState(false);
  const dropSoundRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  // FIXED: Store the element center for perfect finger tracking
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // FIXED: Enhanced sensors with perfect touch handling
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0, // Instant response for touch
        tolerance: 0, // Zero tolerance for immediate activation
      },
    })
  );

  useEffect(() => {
    const level = getCurrentLevel();
    const data = getLevelData(level);
    const currentBasket = getBasket();

    setCurrentLevel(level);
    setLevelData(data);
    setBasketState(currentBasket);

    // Initialize drop sound
    if (typeof window !== 'undefined') {
      dropSoundRef.current = new Audio('/sounds/drop.mp3');
      dropSoundRef.current.volume = 0.4;
      dropSoundRef.current.preload = 'auto';
      dropSoundRef.current.load();

      // ADDED: Prevent default touch behaviors globally
      document.addEventListener('touchmove', (e) => {
        // Only prevent default if we're dragging
        if (activeId) {
          e.preventDefault();
        }
      }, { passive: false });
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
      try {
        dropSoundRef.current.currentTime = 0;
        dropSoundRef.current.play().catch(() => {
          // Silent fail if audio blocked
        });
      } catch (error) {
        // Silent fail
      }
    }
  };

  // FIXED: Perfect touch offset calculation for exact finger following
  function handleDragStart(event) {
    setActiveId(event.active.id);
    console.log('🎯 Drag started:', event.active.id);
    
    // FIXED: Use initial rect instead of translated rect for consistent positioning
    const elementRect = event.active.rect.initial;
    const activatorEvent = event.activatorEvent;
    
    if (activatorEvent && elementRect) {
      let pointerX, pointerY;
      
      // Handle both touch and mouse events
      if (activatorEvent.touches && activatorEvent.touches[0]) {
        // Touch event - use the first touch point
        pointerX = activatorEvent.touches[0].clientX;
        pointerY = activatorEvent.touches[0].clientY;
      } else if (activatorEvent.changedTouches && activatorEvent.changedTouches[0]) {
        // Touch end event - use the first changed touch
        pointerX = activatorEvent.changedTouches[0].clientX;
        pointerY = activatorEvent.changedTouches[0].clientY;
      } else {
        // Mouse event
        pointerX = activatorEvent.clientX;
        pointerY = activatorEvent.clientY;
      }
      
      // FIXED: Calculate offset from element center to pointer for better tracking
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const elementCenterY = elementRect.top + elementRect.height / 2;
      
      // Store the offset from center to touch point
      const offsetX = pointerX - elementCenterX;
      const offsetY = pointerY - elementCenterY;
      
      setDragOffset({ x: offsetX, y: offsetY });
      
      console.log('📍 Touch offset calculated:', { 
        offsetX, 
        offsetY, 
        elementCenter: { x: elementCenterX, y: elementCenterY },
        pointer: { x: pointerX, y: pointerY }
      });
    } else {
      // Fallback - no offset (center positioning)
      setDragOffset({ x: 0, y: 0 });
    }
    
    // Prevent scrolling during drag
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  // ADDED: Handle drag over for better feedback
  function handleDragOver(event) {
    const { over } = event;
    console.log('🎯 Drag over:', over?.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    
    console.log('🏁 Drag ended:', active.id, 'over:', over?.id);
    
    setActiveId(null);
    setDragOffset({ x: 0, y: 0 });
    
    // Re-enable scrolling
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';

    if (over && over.id === 'basket') {
      const item = active.id;
      
      if (!basket.includes(item)) {
        console.log('✅ Item dropped successfully:', item);
        playDropSound();
        const newBasket = [...basket, item];
        setBasketState(newBasket);
        setBasket(newBasket);
      } else {
        console.log('❌ Item already in basket:', item);
      }
    } else {
      console.log('❌ Dropped outside basket');
    }
  }

  const handleItemTap = (item) => {
    console.log('👆 Item tapped:', item);
    if (!basket.includes(item)) {
      const newBasket = [...basket, item];
      setBasketState(newBasket);
      setBasket(newBasket);
    }
  };

  const handleRemoveItem = (index) => {
    const newBasket = basket.filter((_, i) => i !== index);
    setBasketState(newBasket);
    setBasket(newBasket);
  };

  const handleSubmitOrder = () => {
    router.push('/result');
  };

  const handleClearBasket = () => {
    setBasketState([]);
    setBasket([]);
  };

  const handleGoToMenu = () => {
    router.push('/');
  };

  if (!levelData) return null;

  return (
    <Layout scene="market">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="market-scene" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '20px',
          position: 'relative',
          touchAction: 'pan-y', // Allow vertical scrolling but prevent horizontal pan
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none', // Disable iOS callout
          WebkitTapHighlightColor: 'transparent', // Remove tap highlight
        }}>
          {/* Background Effects */}
          <div className="floating-elements">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="floating-particle"
                style={{
                  position: 'absolute',
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  backgroundColor: '#090dfeff',
                  borderRadius: '50%',
                  opacity: Math.random() * 0.2 + 0.1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 12 + 8}s ease-in-out infinite alternate`,
                  animationDelay: `${Math.random() * 4}s`,
                  pointerEvents: 'none'
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="header" style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <div style={{
              background: 'rgba(251, 251, 251, 0.8)',
              borderRadius: '16px',
              padding: '12px 24px',
              marginLeft:'-150px',
              display: 'inline-block',
              border: '1px solid #6366f1'
            }}>
              <h1 style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '4px',
              }}>
                🏪 Market Selection
              </h1>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#475569'
              }}>
                Drag items to basket or tap to add them! 🎯
              </p>
            </div>
          </div>

          {/* Level and Basket Info */}
          <div className="info-bar" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '8px 16px',
              border: '1px solid #6366f1'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Level {currentLevel}
              </span>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '8px 16px',
              border: '1px solid #10b981'
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Items: {basket.length}
              </span>
            </div>
          </div>

          {/* Items Grid */}
          <div className="items-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            flex: '1',
            padding: '0 20px',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {levelData.available.map((item, index) => (
              <div key={`${item}-${index}`} className="item-slot fade-in" style={{
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                touchAction: 'none', // CRITICAL for mobile drag
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}>
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

          {/* Floating Basket */}
          <div className="floating-basket" style={{
            position: 'absolute',
            top: '10px',
            right: '100px',
            width: '180px',
            touchAction: 'none', // CRITICAL for mobile
          }}>
            <div 
              onClick={() => basket.length > 0 && setShowBasketPopup(true)}
              style={{
                cursor: basket.length > 0 ? 'pointer' : 'default',
                transition: 'transform 0.3s ease',
                willChange: 'transform'
              }}
              onMouseEnter={(e) => {
                if (basket.length > 0) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <DroppableWrapper id="basket">
                <Basket
                  items={basket}
                  showItems={false}
                />
              </DroppableWrapper>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bottom-nav" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
            flexWrap: 'wrap'
          }}>
            <Button variant="danger" onClick={handleGoToMenu}>
              Back
            </Button>

            <div style={{ display: 'flex', gap: '12px', flex: '1', justifyContent: 'center' }}>
              {basket.length > 0 && (
                <Button variant="secondary" onClick={handleClearBasket}>
                  Clear Basket
                </Button>
              )}
            </div>

            <Button 
              variant={basket.length > 0 ? "primary" : "secondary"}
              disabled={basket.length === 0}
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
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
              }}
              onClick={() => setShowBasketPopup(false)}
            >
              <div 
                className="basket-popup"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px',
                  maxWidth: '400px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  margin: '20px',
                  border: '2px solid #10b981'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{
                  color: '#1e293b',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  🛒 Your Basket
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  {basket.map((item, index) => (
                    <div key={`basket-${item}-${index}`} className="basket-item">
                      <Basket
                        items={[item]}
                        onRemoveItem={() => handleRemoveItem(index)}
                        showItems={true}
                      />
                    </div>
                  ))}
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

        {/* FIXED: Perfect DragOverlay with exact finger positioning */}
        <DragOverlay
          style={{ cursor: 'grabbing' }}
          dropAnimation={{
            duration: 400,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId ? (
            <div style={{
              opacity: 0.95,
              // FIXED: Use the stored offset to position the overlay relative to finger
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(8deg) scale(1.1)`,
              cursor: 'grabbing',
              pointerEvents: 'none',
              zIndex: 9999,
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
              // FIXED: Transform origin at center for consistent rotation
              transformOrigin: 'center',
              // Ensure smooth movement on all devices
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              perspective: 1000,
            }}>
              <DragItem
                item={activeId}
                inBasket={false}
                disabled={false}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <style jsx>{`
        .item-slot {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drag-item {
          width: 100px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          position: relative;
        }

        .item-icon {
          font-size: 28px;
          margin-bottom: 4px;
        }

        .item-name {
          font-size: 9px;
          font-weight: 600;
          color: #334155;
          text-align: center;
          line-height: 1.1;
        }

        .checkmark {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .drag-item.in-basket {
          opacity: 0.5;
          transform: scale(0.9);
        }

        .drag-item.disabled {
          cursor: not-allowed;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-40px) translateX(20px); }
        }

        @media (max-width: 768px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 12px;
            padding: 0 10px;
          }
          
          .floating-basket {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            margin: 16px 0;
          }
          
          .drag-item {
            width: 80px;
            height: 80px;
          }
          
          .item-icon {
            font-size: 24px;
          }
          
          .item-name {
            font-size: 8px;
          }
        }
      `}</style>
    </Layout>
  );
}
