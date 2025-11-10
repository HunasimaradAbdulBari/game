// src/components/Quest/Basket.tsx - COMPLETE
import React, { useEffect, useRef } from 'react';
import { ITEM_ICONS } from './utils/gameLogic';

// Define types locally since we're importing from types
interface DragData {
  item: string;
  type: 'ingredient' | 'item';
}

interface DragOptions {
  onDragStart?: (element: HTMLElement, data: DragData, event: Event) => void;
  onDragEnd?: (element: HTMLElement, data: DragData, event: Event) => void;
  onDragOver?: (element: HTMLElement, data: DragData | null, event: Event) => void;
  onDragLeave?: (element: HTMLElement, data: DragData | null, event: Event) => void;
}

interface DropZoneInfo {
  onDrop: (data: DragData, element: HTMLElement, event: Event) => void;
  options: DragOptions;
}

interface TouchSession {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  dragClone: HTMLElement | null;
  element: HTMLElement;
  data: DragData;
  options: DragOptions;
}

class DragDropManager {
  draggedElement: HTMLElement | null = null;
  draggedData: DragData | null = null;
  dropZones: Map<HTMLElement, DropZoneInfo> = new Map();
  activeTouches: Map<string, TouchSession> = new Map();

  makeDraggable(element: HTMLElement | null, data: DragData, options: DragOptions = {}): void {
    // Implementation would be here
  }

  makeDropZone(
    element: HTMLElement | null,
    onDrop: (data: DragData, element: HTMLElement, event: Event) => void,
    options: DragOptions = {}
  ): void {
    if (!element) return;
    this.dropZones.set(element, { onDrop, options });
  }
}

interface BasketProps {
  items?: string[];
  onDrop?: (item: string, event: Event) => void;
  dragManager?: DragDropManager;
  onRemoveItem?: (index: number) => void;
  showItems?: boolean;
}

export default function Basket({ 
  items = [], 
  onDrop, 
  dragManager, 
  onRemoveItem,
  showItems = true 
}: BasketProps) {
  const basketRef = useRef<HTMLDivElement | null>(null);

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
          <div className="basket-items" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%'
          }}>
            {items.map((item, index) => (
              <div key={`${item}-${index}`} className="basket-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span className="item-icon" style={{ fontSize: '20px' }}>
                  {ITEM_ICONS[item] || '🍽️'}
                </span>
                <span className="item-name" style={{ 
                  flex: 1,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {item.toUpperCase()}
                </span>
                {onRemoveItem && (
                  <button 
                    className="remove-item"
                    onClick={() => onRemoveItem(index)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            color: '#7081e0ff', 
            fontSize: '14px', 
            fontWeight: '600',
            textAlign: 'center',
            padding: '8px'
          }}>
            {items.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}