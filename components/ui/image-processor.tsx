"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { AlertCircle, Upload, X, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { validateAndProcessImage } from "@/lib/image-utils"; // Assuming this path is correct

interface ImageProcessorProps {
  onImageAnalyzed?: (result: any) => void; // Callback for analysis result
  // Add other props as needed
}

export function ImageProcessor({ onImageAnalyzed }: ImageProcessorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);
    setPreviewUrl(null); // Clear previous preview
    setSelectedFile(null); // Clear previous file

    try {
      const result = await validateAndProcessImage(file);
      if (result.isValid && result.dataUrl) {
        setSelectedFile(file);
        setPreviewUrl(result.dataUrl);
      } else {
        // If validateAndProcessImage throws or returns !isValid, it's caught below
        // or handled if it returns isValid=false without throwing.
         setError(result.error || "Недопустимый файл изображения.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка обработки изображения.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: message,
      });
    } finally {
      setIsLoading(false);
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };

  const handleAnalyzeImage = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      // --- Placeholder for API call ---
      console.log("Анализ изображения:", previewUrl.substring(0, 50) + "...");
      // Example API call structure based on user's Python example
      // const response = await fetch('/api/analyze-image', { // Your API endpoint
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ imageUrl: previewUrl }) // Or send the file itself if needed
      // });
      // if (!response.ok) throw new Error('Ошибка анализа изображения');
      // const analysisResult = await response.json();
      // onImageAnalyzed?.(analysisResult); // Pass result back up
      // --- End Placeholder ---

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({ title: "Анализ", description: "Изображение проанализировано (симуляция)." });
      // handleRemoveImage(); // Optionally remove image after analysis

    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка анализа изображения.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Ошибка анализа",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-sm border-dashed border-gray-600 bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {!previewUrl && !isLoading && (
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            onClick={triggerFileInput}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">Нажмите или перетащите изображение</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-6">
            <svg className="animate-spin h-8 w-8 text-blue-400 mb-2" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
            <p className="text-sm text-gray-400">Обработка...</p>
          </div>
        )}

        {previewUrl && !isLoading && (
          <div className="relative group">
            <Image
              src={previewUrl}
              alt="Предпросмотр"
              width={300}
              height={200}
              className="rounded-md w-full h-auto object-contain max-h-48"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/75"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-2 text-red-500 text-xs flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </CardContent>
      {previewUrl && !isLoading && (
        <CardFooter className="p-2 border-t border-gray-700">
          <Button
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleAnalyzeImage}
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
            Анализировать изображение
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}