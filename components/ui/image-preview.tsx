'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from './button';
import logger from '@/lib/logger';

interface ImagePreviewProps {
  imageUrl: string;
  onRemoveAction: () => void;
  className?: string;
}

export function ImagePreview({ imageUrl, onRemoveAction, className = '' }: ImagePreviewProps) {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    logger.error({
      event: 'image_load_error',
      imageUrl,
      timestamp: new Date().toISOString(),
    });
    setError(true);
  };

  if (error) {
    return (
      <div className="p-2 bg-red-50 text-red-900 rounded-lg">
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
        <Image
          src={imageUrl}
          alt="Preview"
          width={300}
          height={200}
          className="max-w-full h-auto rounded-lg"
          onError={handleImageError}
        />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            logger.info({
              event: 'image_removed',
              timestamp: new Date().toISOString(),
            });
            onRemoveAction();
          }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
