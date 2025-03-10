import React from 'react';

interface NotificationProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Notification({
  children,
  variant = 'info',
  position = 'bottom-right',
  onClose,
  autoClose = true,
  duration = 3000
}: NotificationProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const variantClasses = {
    info: 'bg-info text-info-content',
    success: 'bg-success text-success-content',
    warning: 'bg-warning text-warning-content',
    error: 'bg-error text-error-content'
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div
      className={`
        fixed z-50 p-4 rounded-lg shadow-lg
        animate-fade-in-up
        ${variantClasses[variant]}
        ${positionClasses[position]}
      `}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:opacity-80 transition-opacity"
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
