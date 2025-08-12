export class DragDropManager {
  constructor() {
    this.draggedElement = null;
    this.draggedData = null;
    this.dropZones = new Map();
    this.activeTouches = new Map(); // Track active touch operations
  }

  makeDraggable(element, data, options = {}) {
    // FIXED: Add null check for element
    if (!element) {
      console.warn('DragDropManager: Cannot make null element draggable');
      return;
    }

    element.draggable = true;
    element.style.cursor = 'grab';
    
    element.addEventListener('dragstart', (e) => {
      this.draggedElement = element;
      this.draggedData = data;
      element.style.cursor = 'grabbing';
      element.style.opacity = '0.7';
      element.style.transform = 'scale(1.05)';
      
      // Set drag effect
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(data));
      
      if (options.onDragStart) {
        try {
          options.onDragStart(element, data, e);
        } catch (error) {
          console.error('DragStart callback error:', error);
        }
      }
    });

    element.addEventListener('dragend', (e) => {
      // FIXED: Add null check before style manipulation
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

    // Touch events for mobile
    this.addTouchSupport(element, data, options);
  }

  makeDropZone(element, onDrop, options = {}) {
    // FIXED: Add null check for element
    if (!element) {
      console.warn('DragDropManager: Cannot make null element a drop zone');
      return;
    }

    this.dropZones.set(element, { onDrop, options });

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      element.classList.add('drop-hover');
      
      if (options.onDragOver) {
        try {
          options.onDragOver(element, this.draggedData, e);
        } catch (error) {
          console.error('DragOver callback error:', error);
        }
      }
    });

    element.addEventListener('dragleave', (e) => {
      // FIXED: Add null check before class manipulation
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

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      
      // FIXED: Add null check before class manipulation
      if (element && element.classList) {
        element.classList.remove('drop-hover');
      }
      
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (onDrop) {
          onDrop(data, element, e);
        }
      } catch (error) {
        console.error('Drop error:', error);
      }
    });
  }

  addTouchSupport(element, data, options = {}) {
    // FIXED: Add null check for element
    if (!element) {
      console.warn('DragDropManager: Cannot add touch support to null element');
      return;
    }

    // Create unique touch session ID
    const touchSessionId = `touch_${Date.now()}_${Math.random()}`;
    
    let touchSession = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      dragClone: null,
      element: element,
      data: data,
      options: options
    };

    element.addEventListener('touchstart', (e) => {
      // FIXED: Prevent multiple simultaneous drags
      if (touchSession.isDragging) return;
      
      e.preventDefault(); // Prevent scrolling
      touchSession.isDragging = true;
      
      const touch = e.touches[0];
      if (!touch) return;
      
      touchSession.startX = touch.clientX;
      touchSession.startY = touch.clientY;
      touchSession.currentX = touch.clientX;
      touchSession.currentY = touch.clientY;
      
      // FIXED: Create drag clone with better error handling
      try {
        touchSession.dragClone = element.cloneNode(true);
        if (touchSession.dragClone) {
          touchSession.dragClone.style.position = 'fixed';
          touchSession.dragClone.style.pointerEvents = 'none';
          touchSession.dragClone.style.zIndex = '9999';
          touchSession.dragClone.style.opacity = '0.8';
          touchSession.dragClone.style.transform = 'scale(1.1)';
          touchSession.dragClone.style.left = `${touch.clientX - 25}px`;
          touchSession.dragClone.style.top = `${touch.clientY - 25}px`;
          
          // FIXED: Safe DOM manipulation
          if (document.body) {
            document.body.appendChild(touchSession.dragClone);
          }
        }
      } catch (error) {
        console.error('Error creating drag clone:', error);
        touchSession.dragClone = null;
      }
      
      // FIXED: Safe style manipulation
      if (element && element.style) {
        element.style.opacity = '0.5';
      }
      
      // Store active touch session
      this.activeTouches.set(touchSessionId, touchSession);
      
      if (options.onDragStart) {
        try {
          options.onDragStart(element, data, e);
        } catch (error) {
          console.error('TouchStart callback error:', error);
        }
      }
    });

    element.addEventListener('touchmove', (e) => {
      if (!touchSession.isDragging || !touchSession.dragClone) return;
      
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      if (!touch) return;
      
      touchSession.currentX = touch.clientX;
      touchSession.currentY = touch.clientY;
      
      // FIXED: Safe drag clone positioning
      if (touchSession.dragClone && touchSession.dragClone.style) {
        touchSession.dragClone.style.left = `${touch.clientX - 25}px`;
        touchSession.dragClone.style.top = `${touch.clientY - 25}px`;
      }
    });

    element.addEventListener('touchend', (e) => {
      if (!touchSession.isDragging) return;
      
      // FIXED: Reset dragging state immediately to prevent multiple executions
      touchSession.isDragging = false;
      
      // FIXED: Safe style reset
      if (element && element.style) {
        element.style.opacity = '1';
      }
      
      // FIXED: Safe drag clone cleanup with null checks
      if (touchSession.dragClone) {
        try {
          // Check if dragClone still exists in DOM before removing
          if (touchSession.dragClone.parentNode) {
            touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
          }
        } catch (error) {
          console.error('Error removing drag clone:', error);
        } finally {
          touchSession.dragClone = null;
        }
      }
      
      // FIXED: Safe drop zone detection
      let dropElement = null;
      if (touchSession.currentX && touchSession.currentY) {
        try {
          dropElement = document.elementFromPoint(touchSession.currentX, touchSession.currentY);
        } catch (error) {
          console.error('Error finding drop element:', error);
        }
      }
      
      if (dropElement) {
        const dropZone = this.findDropZone(dropElement);
        if (dropZone && dropZone.onDrop) {
          try {
            dropZone.onDrop(data, dropZone.element, e);
          } catch (error) {
            console.error('Drop callback error:', error);
          }
        }
      }
      
      if (options.onDragEnd) {
        try {
          options.onDragEnd(element, data, e);
        } catch (error) {
          console.error('TouchEnd callback error:', error);
        }
      }
      
      // Clean up touch session
      this.activeTouches.delete(touchSessionId);
    });

    // FIXED: Add touchcancel handler for better cleanup
    element.addEventListener('touchcancel', (e) => {
      if (!touchSession.isDragging) return;
      
      touchSession.isDragging = false;
      
      // Safe style reset
      if (element && element.style) {
        element.style.opacity = '1';
      }
      
      // Safe drag clone cleanup
      if (touchSession.dragClone) {
        try {
          if (touchSession.dragClone.parentNode) {
            touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
          }
        } catch (error) {
          console.error('Error removing drag clone on cancel:', error);
        } finally {
          touchSession.dragClone = null;
        }
      }
      
      if (options.onDragEnd) {
        try {
          options.onDragEnd(element, data, e);
        } catch (error) {
          console.error('TouchCancel callback error:', error);
        }
      }
      
      // Clean up touch session
      this.activeTouches.delete(touchSessionId);
    });
  }

  findDropZone(element) {
    // FIXED: Add null check for element
    if (!element) return null;
    
    let current = element;
    while (current) {
      if (this.dropZones.has(current)) {
        return { 
          element: current, 
          ...this.dropZones.get(current) 
        };
      }
      current = current.parentElement;
    }
    return null;
  }

  // FIXED: Enhanced destroy method with cleanup of active touches
  destroy() {
    // Clean up all active touch sessions
    this.activeTouches.forEach((touchSession, sessionId) => {
      if (touchSession.dragClone) {
        try {
          if (touchSession.dragClone.parentNode) {
            touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
          }
        } catch (error) {
          console.error('Error cleaning up touch session:', error);
        }
      }
      
      // Reset element opacity
      if (touchSession.element && touchSession.element.style) {
        touchSession.element.style.opacity = '1';
      }
    });
    
    this.activeTouches.clear();
    this.dropZones.clear();
    this.draggedElement = null;
    this.draggedData = null;
  }

  // FIXED: Add utility method to check if dragging is active
  isDraggingActive() {
    return this.draggedElement !== null || this.activeTouches.size > 0;
  }

  // FIXED: Add method to force cleanup of stuck drag operations
  forceCleanup() {
    console.warn('DragDropManager: Force cleanup initiated');
    
    // Clean up desktop drag
    if (this.draggedElement && this.draggedElement.style) {
      this.draggedElement.style.opacity = '1';
      this.draggedElement.style.transform = 'scale(1)';
      this.draggedElement.style.cursor = 'grab';
    }
    
    // Clean up all touch operations
    this.activeTouches.forEach((touchSession) => {
      if (touchSession.dragClone) {
        try {
          if (touchSession.dragClone.parentNode) {
            touchSession.dragClone.parentNode.removeChild(touchSession.dragClone);
          }
        } catch (error) {
          console.error('Error in force cleanup:', error);
        }
      }
      
      if (touchSession.element && touchSession.element.style) {
        touchSession.element.style.opacity = '1';
      }
    });
    
    // Reset all state
    this.activeTouches.clear();
    this.draggedElement = null;
    this.draggedData = null;
    
    // Remove any orphaned drag clones
    try {
      const orphanedClones = document.querySelectorAll('[style*="position: fixed"][style*="z-index: 9999"]');
      orphanedClones.forEach(clone => {
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
    } catch (error) {
      console.error('Error cleaning orphaned clones:', error);
    }
  }
}