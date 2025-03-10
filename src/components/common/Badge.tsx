import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  outline = false,
  className,
  icon,
}) => {
  const baseClasses = 'badge font-medium';

  const variantClasses = {
    default: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  };

  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    outline && 'badge-outline',
    className
  );

  return (
    <div className={badgeClasses}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
};
