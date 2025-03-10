import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'achievement' | 'reading';
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  hoverable = false,
}) => {
  const baseClasses = 'card bg-base-100 shadow-lg';
  const variantClasses = {
    default: '',
    achievement: 'border-t-4 border-accent',
    reading: 'border-t-4 border-secondary',
  };

  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    hoverable && 'hover:shadow-xl transition-shadow duration-200',
    className
  );

  return <div className={cardClasses}>{children}</div>;
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={clsx('card-body', className)}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <h2 className={clsx('card-title', className)}>{children}</h2>;
};
