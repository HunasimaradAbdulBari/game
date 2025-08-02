export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = '',
  ...props 
}) {
  const handleClick = (e) => {
    if (disabled) return;
    
    // FIXED: Store reference to current target before async operations
    const buttonElement = e.currentTarget;
    
    // FIXED: Check if element exists before manipulating style
    if (buttonElement) {
      // Add click animation
      buttonElement.style.transform = 'scale(0.95)';
      buttonElement.style.transition = 'transform 0.15s ease';
      
      // Reset animation
      setTimeout(() => {
        if (buttonElement && buttonElement.style) {
          buttonElement.style.transform = '';
        }
      }, 150);
    }

    // FIXED: Execute onClick immediately instead of using setTimeout
    if (onClick) {
      // Prevent event pooling issues by persisting the event
      e.persist && e.persist();
      onClick(e);
    }
  };

  return (
    <button
      className={`game-button ${variant} ${size} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
