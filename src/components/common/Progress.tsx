import React from 'react';
import clsx from 'clsx';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  className,
  showLabel = false,
  labelFormat,
}) => {
  const baseClasses = 'progress w-full';

  const variantClasses = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    accent: 'progress-accent',
    success: 'progress-success',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const progressClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const defaultLabelFormat = (val: number, maximum: number) =>
    `${Math.round((val / maximum) * 100)}%`;

  return (
    <div className="relative">
      <progress className={progressClasses} value={value} max={max} />
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {labelFormat ? labelFormat(value, max) : defaultLabelFormat(value, max)}
          </span>
        </div>
      )}
    </div>
  );
};
