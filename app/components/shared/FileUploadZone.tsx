import React, { useRef, useState, useCallback } from 'react';
import { Upload, FileText, Image } from 'lucide-react';
import { FilePreview } from './FilePreview';
import { UploadProgress } from './UploadProgress';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  imagePreview?: string | null;
  onRemoveFile: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
  uploadProgress?: {
    progress: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    message?: string;
  };
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  selectedFile,
  imagePreview,
  onRemoveFile,
  accept = '.pdf,.docx,.png,.jpg,.jpeg,.gif,.webp',
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className = '',
  title = 'Upload Document or Image',
  description = 'PDF, DOCX, PNG, JPG, GIF up to 10MB',
  uploadProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`;
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return `File type "${file.type}" is not supported. Please upload PDF, DOCX, or image files.`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, maxSize]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      {!selectedFile && (
        <div
          onClick={handleClick}
          onDrag={handleDrag}
          onDragStart={handleDrag}
          onDragEnd={handleDrag}
          onDragOver={handleDrag}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30' 
              : 'border-gray-600 hover:border-gray-500 bg-gray-900 hover:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={title}
          onKeyDown={(e) => {
            if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <FileText className="h-8 w-8 text-blue-400" />
              <Image className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <p className="text-gray-100 font-medium mb-2">{title}</p>
              <p className="text-sm text-gray-400">{description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Click to browse or drag and drop files here
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onRemove={onRemoveFile}
          imagePreview={imagePreview}
        />
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <UploadProgress
          progress={uploadProgress.progress}
          status={uploadProgress.status}
          message={uploadProgress.message}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-950/30 border border-red-800 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />
    </div>
  );
};
