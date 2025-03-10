import React from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  };

  return (
    <div className={clsx(
      'mx-auto px-4 w-full',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};
