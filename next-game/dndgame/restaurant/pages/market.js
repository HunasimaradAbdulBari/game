// pages/market.js
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
import { getCurrentLevel, getBasket, setBasket } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

/* ---------- FIXED: getScrollableAncestors ---------- */
function getScrollableAncestors(element) {
  const ancestors = [];
  let current = element.parentElement;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (
      style.overflow === 'auto' ||
      style.overflow === 'scroll' ||
      style.overflowX === 'auto' ||
      style.overflowX === 'scroll' ||
      style.overflowY === 'auto' ||
      style.overflowY === 'scroll'
    ) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }
  return ancestors;
}

/* ---------- DRAGGABLE ---------- */
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

/* ---------- DROPPABLE ---------- */
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
        backgroundColor:
          isOverCurrent && canDrop ? 'rgba(16,185,129,0.1)' : 'transparent',
        borderRadius: '12px',
        border: isOverCurrent && canDrop
          ? '2px dashed #10b981'
          : '2px dashed transparent',
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
    const data = getLevelData(level);
    const storedBasket = getBasket();

    setCurrentLevel(level);
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

  /* ---------- SCROLL LOCK WHILE DRAG ---------- */
  useEffect(() => {
    if (!activeId) return;
    const handleMove = (e) => e.preventDefault();
    const scrollables = getScrollableAncestors(document.body);
    scrollables.forEach((el) => (el.style.overflow = 'hidden'));
    document.body.style.cssText =
      'overflow:hidden;position:fixed;width:100%;height:100%';
    document.addEventListener('touchmove', handleMove, { passive: false });
    return () => {
      scrollables.forEach((el) => (el.style.overflow = ''));
      document.body.style.cssText = '';
      document.removeEventListener('touchmove', handleMove);
    };
  }, [activeId]);

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

  if (!levelData) return null;

  /* ---------- JSX ---------- */
  return (
    <Layout scene="market">
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
            overflow: 'hidden', // FIXED: Prevent any scrolling
          }}
        >
          {/* ---------- BACKGROUND PARTICLES ---------- */}
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
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>

          {/* ---------- HEADER ---------- */}
          <div 
            className="header" 
            style={{ 
              textAlign: 'center', 
              marginBottom: 'clamp(8px, 2vw, 16px)',
              flexShrink: 0
            }}
          >
            <div
              style={{
                background: 'rgba(251,251,251,0.8)',
                borderRadius: 'clamp(8px, 2vw, 16px)',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 3vw, 24px)',
                display: 'inline-block',
                border: '1px solid #6366f1',
              }}
            >
              <h1
                style={{
                  fontSize: 'clamp(18px, 4vw, 26px)',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: 'clamp(2px, 0.5vw, 4px)',
                }}
              >
                🏪 Market Selection
              </h1>
              <p
                style={{
                  fontSize: 'clamp(10px, 2vw, 14px)',
                  fontWeight: '500',
                  color: '#475569',
                }}
              >
                Drag items to basket or tap to add them! 🎯
              </p>
            </div>
          </div>

          {/* ---------- STATUS BADGE ---------- */}
          {activeId && (
            <div
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(99,102,241,0.9)',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
              }}
            >
              Dragging: {activeId} 🎯
            </div>
          )}

          {/* ---------- INFO BAR ---------- */}
          <div
            className="info-bar"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 'clamp(8px, 2vw, 16px)',
              gap: '12px',
              flexShrink: 0
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '8px',
                padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 16px)',
                border: '1px solid #6366f1',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(8px, 1.5vw, 11px)',
                  fontWeight: '600',
                  color: '#1e293b',
                }}
              >
                Level {currentLevel}
              </span>
            </div>
          </div>

          {/* ---------- ITEMS GRID - FIXED: No overflow, proper fit ---------- */}
          <div
            className="items-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(80px, 12vw, 120px), 1fr))',
              gap: 'clamp(8px, 2vw, 16px)',
              flex: '1',
              padding: '0 clamp(8px, 2vw, 20px)',
              overflow: 'hidden', // FIXED: Remove scroll bar
              alignContent: 'start', // FIXED: Align content to top
              maxHeight: '100%', // FIXED: Ensure it doesn't exceed container
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

          {/* ---------- FLOATING BASKET ---------- */}
          <div
            className="floating-basket"
            style={{
              marginTop:'-100px',
              position: 'absolute',
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
              }}
              onMouseEnter={(e) => {
                if (basket.length) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <DroppableWrapper id="basket">
                <Basket items={basket} showItems={false} />
              </DroppableWrapper>
            </div>
          </div>

          {/* ---------- BOTTOM NAVIGATION ---------- */}
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
            {/* Back button */}
            <button
              className="hongbin-back"
              onClick={handleGoToMenu}
              type="button"
            >
              <svg
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
              </svg>
              <span>Back</span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    height="25"
                    width="25"
                    style={{ marginLeft: '4px' }}
                  >
                    <path
                      fill="#6361D9"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.788 5.039c.079-.078.185-.122.295-.122h2.333c.111 0 .217.044.295.122.079.079.123.185.123.295v.416H8.666v-.416c0-.111.044-.217.122-.295zM7.166 5.75v-.417c0-.509.202-.996.562-1.356.359-.36.847-.562 1.355-.562h2.334c.508 0 .996.202 1.355.562.36.36.562.847.562 1.356v.417h2.167c.414 0 .75.336.75.75s-.336.75-.75.75h-.489l-.761 7.46c-.012.492-.212.963-.562 1.312-.36.36-.847.562-1.355.562H8.166c-.508 0-.996-.202-1.355-.562-.35-.35-.55-.82-.562-1.312l-.761-7.46H5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h1.167zm.75 1.501h4.667l.92 7.341c.002.026.003.051.003.077 0 .11-.044.216-.122.294a.416.416 0 01-.294.122H8.166a.416.416 0 01-.295-.122.416.416 0 01-.122-.294c0-.026 0-.051.003-.077l.75-7.341z"
                    />
                  </svg>
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

          {/* ---------- BASKET POPUP ---------- */}
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
                    marginBottom: '20px',
                    fontSize: '20px',
                    fontWeight: '700',
                  }}
                >
                  🛒 Your Basket
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  {basket.map((item, idx) => (
                    <div key={`basket-${item}-${idx}`} className="basket-item">
                      <Basket
                        items={[item]}
                        showItems
                        onRemoveItem={() => handleRemoveItem(idx)}
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

        {/* ---------- DRAG OVERLAY ---------- */}
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

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
        /* Back button styles */
        .hongbin-back {
          display: flex;
          height: clamp(2.5em, 5vw, 3.45em);
          width: clamp(80px, 20vw, 120px);
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 10px;
          letter-spacing: 1px;
          transition: all 0.2s linear;
          cursor: pointer;
          border: none;
          background: red;
          font-size: clamp(10px, 2vw, 14px);
        }
        .hongbin-back > svg {
          margin: 0 5px;
          font-size: clamp(14px, 3vw, 20px);
          transition: all 0.4s ease-in;
        }
        .hongbin-back:hover > svg {
          font-size: 1.2em;
          transform: translateX(-5px);
        }
        .hongbin-back:hover {
          box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
          transform: translateY(-2px);
        }

        /* Responsive item styles */
        .item-slot {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 100%;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(-40px) translateX(20px);
          }
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
        
        /* Mobile specific adjustments */
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
          
          .market-scene {
            padding: clamp(8px, 2vw, 16px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .items-grid {
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)) !important;
            gap: 8px !important;
            padding: 0 4px !important;
          }
          
          .market-scene {
            padding: 8px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
