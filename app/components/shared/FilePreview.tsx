import React from 'react';
import { X } from 'lucide-react';
import { FileTypeIcon, getFileTypeColor, getFileTypeName } from './FileTypeIcon';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  imagePreview?: string | null;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  imagePreview,
  className = ''
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = file.type.startsWith('image/');
  const colorClasses = getFileTypeColor(file.type);

  return (
    <div className={`relative group ${className}`}>
      {isImage && imagePreview ? (
        // Image Preview
        <div className="relative">
          <img
            src={imagePreview}
            alt={`Preview of ${file.name}`}
            className="w-full max-h-64 object-contain rounded-xl border border-gray-700 bg-gray-900"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg opacity-90 hover:opacity-100"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Document Preview
        <div className={`border-2 border-dashed rounded-xl p-6 ${colorClasses} dark:bg-gray-800 dark:border-gray-600`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <FileTypeIcon mimeType={file.type} size="lg" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getFileTypeName(file.type)} • {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex-shrink-0 ml-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors opacity-80 hover:opacity-100"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
