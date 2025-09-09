import React from 'react';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
  className?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress,
  status,
  message,
  className = ''
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'uploading':
        return `Uploading... ${Math.round(progress)}%`;
      case 'processing':
        return 'Processing document...';
      case 'completed':
        return 'Upload completed successfully';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-out ${getStatusColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {/* Status Message */}
      <div className="flex items-center space-x-2 text-sm">
        {getStatusIcon()}
        <span className="text-gray-600 dark:text-gray-300">
          {getStatusMessage()}
        </span>
      </div>
    </div>
  );
};
