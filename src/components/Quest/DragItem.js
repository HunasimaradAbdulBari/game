import { useEffect, useRef } from 'react';
import { ITEM_ICONS } from '../Quest/utils/gameLogic';

export default function DragItem({ 
  item, 
  onDragStart, 
  onDragEnd, 
  dragManager, 
  disabled = false,
  inBasket = false,
  onTap 
}) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (!dragManager || !itemRef.current || disabled) return;

    const element = itemRef.current;
    const data = { item, type: 'ingredient' };

    dragManager.makeDraggable(element, data, {
      onDragStart: (el, data, e) => {
        if (onDragStart) onDragStart(data, el, e);
      },
      onDragEnd: (el, data, e) => {
        if (onDragEnd) onDragEnd(data, el, e);
      }
    });

    return () => {
      // Cleanup handled by dragManager
    };
  }, [dragManager, item, disabled, onDragStart, onDragEnd]);

  const handleClick = () => {
    if (disabled || !onTap) return;
    onTap(item);
  };

  const getItemColor = (item) => {
    const colors = {
      'bread': '#fbbf24', 'lettuce': '#10b981', 'tomato': '#f87171',
      'cheese': '#fde047', 'meat': '#a78bfa', 'onion': '#a8a29e',
      'pickle': '#84cc16', 'sauce': '#ff8500', 'mushroom': '#8b5cf6',
      'dough': '#fde047', 'pepperoni': '#f87171', 'olive': '#84cc16',
      'bell-pepper': '#ff8500', 'sausage': '#a78bfa', 'pineapple': '#fbbf24',
      'spinach': '#10b981'
    };
    return colors[item] || '#9ca3af';
  };

  return (
    <div
      ref={itemRef}
      className={`drag-item ${inBasket ? 'in-basket' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      style={{
        marginTop:'120px',
        '--item-color': getItemColor(item),
        opacity: disabled ? 0.5 : 1,
        transform: inBasket ? 'scale(0.9)' : 'scale(1)',
        border: `2px solid ${getItemColor(item)}40`,
        cursor: disabled ? 'default' : 'grab'
      }}
    >
      <div className="item-icon">
        {ITEM_ICONS[item] || '🍽️'}
      </div>
      <div className="item-name">
        {item.toUpperCase()}
      </div>
      {inBasket && (
        <div className="checkmark">✓</div>
      )}
    </div>
  );
}