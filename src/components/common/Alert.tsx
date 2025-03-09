import React from 'react';
import clsx from 'clsx';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  icon,
  className,
  onClose,
}) => {
  const baseClasses = 'alert shadow-lg';

  const variantClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  const alertClasses = clsx(
    baseClasses,
    variantClasses[variant],
    className
  );

  return (
    <div className={alertClasses} role="alert">
      <div className="flex-1">
        {icon && <span className="mr-2">{icon}</span>}
        <div>
          {title && <h3 className="font-bold">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
      {onClose && (
        <div className="flex-none">
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close alert"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Toast component built on top of Alert
export interface ToastProps extends Omit<AlertProps, 'className'> {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  position = 'top-right',
  autoClose = true,
  duration = 3000,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        props.onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, props.onClose]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'toast-top toast-end',
    'top-left': 'toast-top toast-start',
    'bottom-right': 'toast-bottom toast-end',
    'bottom-left': 'toast-bottom toast-start',
  };

  return (
    <div className={clsx('toast', positionClasses[position])}>
      <Alert {...props} />
    </div>
  );
};
