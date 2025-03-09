import React from 'react';
import clsx from 'clsx';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  labelFormat?: (value: number, max: number) => string;
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  className,
  showLabel = false,
  labelFormat,
  animated = false,
}) => {
  const baseClasses = 'progress w-full';

  const variantClasses = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    accent: 'progress-accent',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error',
  };

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const progressClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    animated && 'progress-animated',
    className
  );

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const defaultLabelFormat = (val: number, maximum: number) =>
    `${Math.round((val / maximum) * 100)}%`;

  return (
    <div className="relative">
      <progress
        className={progressClasses}
        value={value}
        max={max}
      />
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

// Timer specific progress component
export interface TimerProgressProps extends Omit<ProgressProps, 'value' | 'max' | 'labelFormat'> {
  duration: number; // Duration in seconds
  onComplete?: () => void;
  autoStart?: boolean;
}

export const TimerProgress: React.FC<TimerProgressProps> = ({
  duration,
  onComplete,
  autoStart = true,
  ...props
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(autoStart);

  React.useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Progress
      {...props}
      value={timeLeft}
      max={duration}
      labelFormat={(value) => formatTime(value)}
      showLabel
    />
  );
};
