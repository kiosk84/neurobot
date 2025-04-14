'use client';

import { useCallback, useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { validateAndProcessImage } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';

export interface FileWithPreview {
  file: File;
  preview: string;
  uploadProgress: number;
}

export function ImageUploader({
  onUploadCompleteAction,
  maxFiles = 5,
}: {
  onUploadCompleteAction: (files: FileWithPreview[]) => void;
  maxFiles?: number;
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (newFiles: FileList) => {
    const filesArray = Array.from(newFiles).slice(0, maxFiles - files.length);

    if (filesArray.length + files.length > maxFiles) {
      toast({
        title: 'Превышен лимит файлов',
        description: `Максимум ${maxFiles} изображений`,
        variant: 'destructive',
      });
      return;
    }

    const processedFiles: FileWithPreview[] = [];

    for (const file of filesArray) {
      const result = await validateAndProcessImage(file);
      if (result.isValid && result.dataUrl) {
        processedFiles.push({
          file,
          preview: result.dataUrl,
          uploadProgress: 0,
        });
      } else {
        toast({
          title: 'Ошибка загрузки',
          description: result.error || 'Не удалось обработать файл',
          variant: 'destructive',
        });
      }
    }

    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          uploadProgress: Math.min(file.uploadProgress + 10, 100),
        }))
      );
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      onUploadCompleteAction(files);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-muted'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Перетащите изображения сюда или кликните для выбора
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                      <Image
                        src={file.preview}
                        alt={file.file.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover rounded"
                      />
                <Progress value={file.uploadProgress} className="flex-1" />
              </div>
            </div>
          ))}

          <Button className="w-full" onClick={handleUpload}>
            Загрузить
          </Button>
        </div>
      )}
    </div>
  );
}
