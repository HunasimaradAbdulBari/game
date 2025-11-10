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
  draggedElement: HTMLElement | null;
  draggedData: DragData | null;
  dropZones: Map<HTMLElement, DropZoneInfo>;
  activeTouches: Map<string, TouchSession>;

  constructor();
  makeDraggable(element: HTMLElement, data: DragData, options?: DragOptions): void;
  makeDropZone(element: HTMLElement, onDrop: (data: DragData, element: HTMLElement, event: Event) => void, options?: DragOptions): void;
  addTouchSupport(element: HTMLElement, data: DragData, options?: DragOptions): void;
  findDropZone(element: HTMLElement): { element: HTMLElement; onDrop: (data: DragData, element: HTMLElement, event: Event) => void; options: DragOptions } | null;
  destroy(): void;
  isDraggingActive(): boolean;
  forceCleanup(): void;
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