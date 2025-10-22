import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorDisplayProps } from '../lib/types'; 

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-red-50 border border-red-200 rounded-xl shadow-sm text-red-800 max-w-md mx-auto">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-center">{message}</h3>
      <p className="text-sm text-red-600 text-center mb-4">
        {onRetry ? "Please try again or contact support if the issue persists." : "Please contact support if the issue persists."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
