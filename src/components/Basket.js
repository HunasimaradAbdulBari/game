import { useEffect, useRef } from 'react';
import { ITEM_ICONS } from '../utils/gameLogic';

export default function Basket({ 
  items = [], 
  onDrop, 
  dragManager, 
  onRemoveItem,
  showItems = true 
}) {
  const basketRef = useRef(null);

  useEffect(() => {
    if (!dragManager || !basketRef.current) return;

    const element = basketRef.current;
    
    dragManager.makeDropZone(element, (data, dropElement, e) => {
      if (data.type === 'ingredient' && onDrop) {
        onDrop(data.item, e);
      }
    }, {
      onDragOver: (element) => {
        element.style.transform = 'scale(1.05)';
      },
      onDragLeave: (element) => {
        element.style.transform = 'scale(1)';
      }
    });

    return () => {
      // Cleanup handled by dragManager
    };
  }, [dragManager, onDrop]);

  return (
    <div className="basket-container">
      <div 
        ref={basketRef}
        className="drop-zone basket-drop-zone"
        style={{
          minHeight: '120px',
          padding: '16px',
          border: '2px dashed #10b981',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="basket-icon" style={{ fontSize: '32px', marginBottom: '8px' }}>
          🛒
        </div>
        <div className="basket-label" style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          BASKET ({items.length} items)
        </div>
        {items.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center' }}>
            Drag items here or tap to add them
          </div>
        ) : showItems ? (
          <div className="basket-items">
            {items.map((item, index) => (
              <div key={`${item}-${index}`} className="basket-item">
                <span className="item-icon">{ITEM_ICONS[item] || '🍽️'}</span>
                <span className="item-name">{item.toUpperCase()}</span>
                {onRemoveItem && (
                  <button 
                    className="remove-item"
                    onClick={() => onRemoveItem(index)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#7081e0ff', fontSize: '14px', fontWeight: '600' }}>
            {items.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
