import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'achievement' | 'progress' | 'reading';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  onClick,
  hoverable = false,
  bordered = true,
  compact = false,
}) => {
  const baseClasses = 'card bg-base-100 shadow-lg';

  const variantClasses = {
    default: '',
    achievement: 'border-t-4 border-accent',
    progress: 'border-t-4 border-primary',
    reading: 'border-t-4 border-secondary',
  };

  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    hoverable && 'hover:shadow-xl transition-shadow duration-200',
    bordered && 'border',
    compact && 'card-compact',
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Subcomponents for better organization
export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('card-body', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h2 className={clsx('card-title', className)}>
    {children}
  </h2>
);

export const CardActions: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={clsx('card-actions justify-end', className)}>
    {children}
  </div>
);
