import React, { useEffect } from 'react';
import clsx from 'clsx';

export interface ToastProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  children,
  variant = 'success',
  position = 'bottom-right',
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const baseClasses = 'alert shadow-lg max-w-sm';

  const variantClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  const positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
  };

  const toastClasses = clsx(baseClasses, variantClasses[variant], positionClasses[position]);

  return (
    <div className={toastClasses}>
      <div>
        {children}
      </div>
      {onClose && (
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};
