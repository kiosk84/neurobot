// project/components/MessageInput.tsx
import React, { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SendIcon } from "./ui/SendIcon";
import { UploadIcon } from "./ui/UploadIcon";

interface MessageInputProps {
  message: string;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onMessageChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void; // Changed type to FormEvent for form submission
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function MessageInput({
  message,
  loading,
  fileInputRef,
  onMessageChange,
  onSubmit,
  onImageUpload
}: MessageInputProps) {

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // We need to cast the event to FormEvent or create a synthetic one
      // For simplicity, let's assume onSubmit can handle the event source if needed,
      // or we pass necessary data directly. Here, we just call onSubmit.
      // A more robust way might involve passing the form element itself or specific data.
      onSubmit(e as unknown as FormEvent); // Cast event type, might need adjustment based on onSubmit's needs
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto'; // Reset height to recalculate
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`; // Set new height, capped at 200px
    onMessageChange(target.value); // Update message state in parent
  };

  const handleSubmit = (e: FormEvent) => {
    onSubmit(e);
    // Reset textarea height after submit
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };


  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent z-10">
      <div className="relative max-w-4xl mx-auto flex items-end gap-2">
        {/* File Upload Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 rounded-xl bg-gray-800 hover:bg-gray-600 text-gray-300 transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-3 focus:ring-blue-300/50 disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Прикрепить файл"
                disabled={loading}
              >
                <UploadIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Прикрепить файл</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
          disabled={loading} // Disable upload when loading
        />

        {/* Textarea with animated border wrapper */}
        <div className="flex-1 relative group"> {/* group остается для hover эффекта */}
          {/* Постоянная синяя рамка с усилением при наведении */}
          <div className="absolute -inset-0.5 bg-blue-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
          {/* Относительное позиционирование для textarea */}
          <div className="relative"> 
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)} // Use direct onChange for state update
            onInput={handleTextareaInput} // Use onInput for auto-resize
              placeholder="Напишите сообщение..."
              className="relative w-full min-h-[44px] max-h-[200px] bg-gray-800/90 backdrop-blur-sm text-white rounded-xl pl-4 pr-4 py-2.5 text-sm leading-snug focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent transition-all resize-none shadow-md overflow-y-auto placeholder:text-gray-500" // Убрали border-[0.5px] и hover:border
              rows={1}
              onKeyDown={handleTextareaKeyDown}
            style={{ 
              height: 'auto', 
              overflowY: 'hidden',
              lineHeight: '1.5rem' // Better line height for alignment
            }}
            disabled={loading} // Disable textarea when loading
          />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 rounded-xl bg-gray-600 hover:bg-gray-400 text-white transition-all duration-200 ease-in-out flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-3 focus:ring-blue-460/50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          disabled={!message.trim() || loading}
          aria-label="Отправить сообщение"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
}
