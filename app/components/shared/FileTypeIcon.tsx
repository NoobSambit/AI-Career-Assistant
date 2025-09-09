import React from 'react';
import { FileText, Image, File } from 'lucide-react';

interface FileTypeIconProps {
  mimeType: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ 
  mimeType, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconClass = `${sizeClasses[size]} ${className}`;

  if (mimeType === 'application/pdf') {
    return <FileText className={`${iconClass} text-red-500`} />;
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return <FileText className={`${iconClass} text-blue-500`} />;
  }

  if (mimeType.startsWith('image/')) {
    return <Image className={`${iconClass} text-green-500`} />;
  }

  return <File className={`${iconClass} text-gray-500`} />;
};

export const getFileTypeColor = (mimeType: string): string => {
  if (mimeType === 'application/pdf') return 'text-red-500 bg-red-50 border-red-200';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'text-blue-500 bg-blue-50 border-blue-200';
  if (mimeType.startsWith('image/')) return 'text-green-500 bg-green-50 border-green-200';
  return 'text-gray-500 bg-gray-50 border-gray-200';
};

export const getFileTypeName = (mimeType: string): string => {
  switch (mimeType) {
    case 'application/pdf':
      return 'PDF';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX';
    case 'image/png':
      return 'PNG';
    case 'image/jpeg':
    case 'image/jpg':
      return 'JPG';
    case 'image/webp':
      return 'WebP';
    case 'image/gif':
      return 'GIF';
    default:
      return 'File';
  }
};
