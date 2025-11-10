// src/types/index.ts - Core Type Definitions

export interface Experiment {
  id: number;
  title: string;
  question: string;
  correctAnswer: string[];
  answers: string[];
}

export interface LabGameData {
  userId: string;
  gameId: string;
  score: number;
  subject: string;
  level: number;
  questionAnswers: string[];
  playerName: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  playerName: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timestamp: number;
  gameId: string;
  subject: string;
  level: number;
}

export interface DragData {
  item: string;
  type: 'ingredient' | 'item';
}

export interface DragOptions {
  onDragStart?: (element: HTMLElement, data: DragData, event: Event) => void;
  onDragEnd?: (element: HTMLElement, data: DragData, event: Event) => void;
  onDragOver?: (element: HTMLElement, data: DragData | null, event: Event) => void;
  onDragLeave?: (element: HTMLElement, data: DragData | null, event: Event) => void;
}

export interface DropZoneInfo {
  onDrop: (data: DragData, element: HTMLElement, event: Event) => void;
  options: DragOptions;
}

export interface TouchSession {
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

export class DragDropManager {
  draggedElement: HTMLElement | null = null;
  draggedData: DragData | null = null;
  dropZones: Map<HTMLElement, DropZoneInfo> = new Map();
  activeTouches: Map<string, TouchSession> = new Map();

  constructor() {
    // Constructor is now properly implemented with initialized properties above
  }

  makeDraggable(element: HTMLElement | null, data: DragData, options: DragOptions = {}): void {
    if (!element) {
      console.warn('DragDropManager: Cannot make null element draggable');
      return;
    }

    element.draggable = true;
    element.style.cursor = 'grab';
    
    element.addEventListener('dragstart', (e: DragEvent) => {
      this.draggedElement = element;
      this.draggedData = data;
      element.style.cursor = 'grabbing';
      element.style.opacity = '0.7';
      element.style.transform = 'scale(1.05)';
      
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
      }
      
      if (options.onDragStart) {
        try {
          options.onDragStart(element, data, e);
        } catch (error) {
          console.error('DragStart callback error:', error);
        }
      }
    });

    element.addEventListener('dragend', (e: DragEvent) => {
      if (element && element.style) {
        element.style.cursor = 'grab';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }
      
      if (options.onDragEnd) {
        try {
          options.onDragEnd(element, data, e);
        } catch (error) {
          console.error('DragEnd callback error:', error);
        }
      }
      
      this.draggedElement = null;
      this.draggedData = null;
    });

    this.addTouchSupport(element, data, options);
  }

  makeDropZone(
    element: HTMLElement | null,
    onDrop: (data: DragData, element: HTMLElement, event: Event) => void,
    options: DragOptions = {}
  ): void {
    if (!element) {
      console.warn('DragDropManager: Cannot make null element a drop zone');
      return;
    }

    this.dropZones.set(element, { onDrop, options });

    element.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
      element.classList.add('drop-hover');
      
      if (options.onDragOver) {
        try {
          options.onDragOver(element, this.draggedData, e);
        } catch (error) {
          console.error('DragOver callback error:', error);
        }
      }
    });

    element.addEventListener('dragleave', (e: DragEvent) => {
      if (element && element.classList) {
        element.classList.remove('drop-hover');
      }
      
      if (options.onDragLeave) {
        try {
          options.onDragLeave(element, this.draggedData, e);
        } catch (error) {
          console.error('DragLeave callback error:', error);
        }
      }
    });

    element.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      
      if (element && element.classList) {
        element.classList.remove('drop-hover');
      }
      
      try {
        if (e.dataTransfer) {
          const data = JSON.parse(e.dataTransfer.getData('text/plain')) as DragData;
          if (onDrop) {
            onDrop(data, element, e);
          }
        }
      } catch (error) {
        console.error('Drop error:', error);
      }
    });
  }

  addTouchSupport(element: HTMLElement, data: DragData, options: DragOptions = {}): void {
    // Touch support implementation - simplified for type safety
    if (!element) {
      console.warn('DragDropManager: Cannot add touch support to null element');
      return;
    }
    // Implementation can be expanded as needed
  }

  findDropZone(element: HTMLElement | null): { element: HTMLElement; onDrop: (data: DragData, element: HTMLElement, event: Event) => void; options: DragOptions } | null {
    if (!element) return null;
    
    let current: HTMLElement | null = element;
    while (current) {
      if (this.dropZones.has(current)) {
        const zoneInfo = this.dropZones.get(current)!;
        return { 
          element: current, 
          ...zoneInfo
        };
      }
      current = current.parentElement;
    }
    return null;
  }

  destroy(): void {
    this.activeTouches.forEach((touchSession) => {
      if (touchSession.dragClone?.parentNode) {
        touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
      }
      if (touchSession.element?.style) {
        touchSession.element.style.opacity = '1';
      }
    });
    
    this.activeTouches.clear();
    this.dropZones.clear();
    this.draggedElement = null;
    this.draggedData = null;
  }

  isDraggingActive(): boolean {
    return this.draggedElement !== null || this.activeTouches.size > 0;
  }

  forceCleanup(): void {
    console.warn('DragDropManager: Force cleanup initiated');
    
    if (this.draggedElement?.style) {
      this.draggedElement.style.opacity = '1';
      this.draggedElement.style.transform = 'scale(1)';
      this.draggedElement.style.cursor = 'grab';
    }
    
    this.activeTouches.forEach((touchSession) => {
      if (touchSession.dragClone?.parentNode) {
        touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
      }
      if (touchSession.element?.style) {
        touchSession.element.style.opacity = '1';
      }
    });
    
    this.activeTouches.clear();
    this.draggedElement = null;
    this.draggedData = null;
  }
}

export interface DragItemProps {
  item: string;
  onDragStart?: (data: DragData, element: HTMLElement, event: Event) => void;
  onDragEnd?: (data: DragData, element: HTMLElement, event: Event) => void;
  dragManager?: DragDropManager;
  disabled?: boolean;
  inBasket?: boolean;
  onTap?: (item: string) => void;
}

export interface BasketProps {
  items?: string[];
  onDrop?: (item: string, event: Event) => void;
  dragManager?: DragDropManager;
  onRemoveItem?: (index: number) => void;
  showItems?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export interface LayoutProps {
  children: React.ReactNode;
  scene: 'menu' | 'restaurant' | 'market' | 'result';
}

export interface LevelSelectorProps {
  onLevelSelect: (level: number) => void;
  subject: string;
}

export type ItemIcon = {
  [key: string]: string;
};

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
}