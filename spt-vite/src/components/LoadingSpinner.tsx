import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary ${className || ''}`}></div>
  );
};

export default LoadingSpinner;
