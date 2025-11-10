// src/components/Quest/Button.tsx
import React from 'react';
import { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const buttonElement = e.currentTarget;

    if (buttonElement) {
      buttonElement.style.transform = 'scale(0.95)';
      buttonElement.style.transition = 'transform 0.15s ease';

      setTimeout(() => {
        if (buttonElement && buttonElement.style) {
          buttonElement.style.transform = '';
        }
      }, 150);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`modern-button modern-button-${variant} modern-button-${size} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
      <style jsx>{`
        .modern-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
        }

        .modern-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .modern-button:hover::before {
          transform: translateX(100%);
        }

        .modern-button-primary {
          background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
          color: white;
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        }

        .modern-button-primary:hover {
          background: linear-gradient(135deg, #1976d2 0%, #1cb5e0 100%);
          box-shadow: 0 8px 24px rgba(33, 150, 243, 0.25);
          transform: translateY(-2px);
        }

        .modern-button-secondary {
          background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
          color: #2196f3;
          border: 2px solid #e3f2fd;
          padding: 10px 22px;
          font-size: 16px;
          min-height: 48px;
        }

        .modern-button-secondary:hover {
          background: linear-gradient(135deg, #f8fdff 0%, #e3f2fd 100%);
          border-color: #2196f3;
          transform: translateY(-2px);
        }

        .modern-button-danger {
          background: linear-gradient(135deg, #f44336 0%, #ff6b6b 100%);
          color: white;
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        }

        .modern-button-danger:hover {
          background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
          box-shadow: 0 8px 24px rgba(244, 67, 54, 0.25);
          transform: translateY(-2px);
        }

        .modern-button-success {
          background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
          color: white;
          padding: 12px 24px;
          font-size: 16px;
          min-height: 48px;
        }

        .modern-button-success:hover {
          background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
          box-shadow: 0 8px 24px rgba(76, 175, 80, 0.25);
          transform: translateY(-2px);
        }

        .modern-button-small {
          padding: 8px 16px;
          font-size: 14px;
          min-height: 36px;
        }

        .modern-button-large {
          padding: 16px 32px;
          font-size: 18px;
          min-height: 56px;
        }

        .modern-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .modern-button:active {
          transform: scale(0.96);
        }
      `}</style>
    </button>
  );
};

export default Button;