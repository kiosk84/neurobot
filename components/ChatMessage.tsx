import { Bot, User, AlertCircle, Copy } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logger from "@/lib/logger";
import { cn } from '@/lib/utils';

type MessageRole = 'user' | 'assistant' | 'system' | 'bot';

export type Message = {
  role: MessageRole;
  content: string;
};

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: (...args: unknown[]) => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const { toast } = useToast();
  logger.error({
    event: 'error_boundary_triggered',
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Произошла ошибка: {error.message}
        <Button
          variant="outline"
          className="ml-2"
          onClick={resetErrorBoundary}
        >
          Попробовать снова
        </Button>
      </AlertDescription>
    </Alert>
  );
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const { role, content } = message;
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const isBot = role === 'assistant' || role === 'bot';

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(content);
    toast({
      description: "Текст скопирован",
      duration: 1500
    });
  };

  return (
    <div className={`
      p-4 rounded-xl mb-4 w-full mx-auto
      ${
        isUser
          ? 'bg-blue-600/10 text-right'
          : isSystem 
            ? 'bg-gray-900/80 text-left'
            : 'bg-gray-800/60 text-left'
      }
    `}>
      <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`p-1 rounded-lg ${isUser ? 'bg-blue-500/20 order-2' : 'bg-gray-700/50 order-1'}`}>
          {isUser ? (
            <User className="h-4 w-4 text-blue-400" />
          ) : isSystem ? (
            <AlertCircle className="h-4 w-4 text-yellow-400" />
          ) : (
            <Bot className="h-4 w-4 text-blue-400" />
          )}
        </div>
        <span className={`text-xs font-medium text-gray-400 ${isUser ? 'order-1' : 'order-2'}`}>
          {isUser ? 'Вы' : (isSystem ? 'Система' : 'Neurobot')}
        </span>
      </div>
      
      <MarkdownRenderer 
        content={content} 
        className="prose prose-sm prose-invert max-w-none break-words
        [&_pre]:bg-gray-800/80 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto
        [&_pre]:border border-gray-700/50
        [&_code]:text-sm [&_pre_code]:bg-transparent"
      />

      <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        {isBot && (
          <button
            onClick={handleCopy}
            className="p-1 rounded-lg hover:bg-gray-700/30 text-gray-400 hover:text-blue-400 
              transition-all duration-200 active:scale-90"
            aria-label="Копировать сообщение"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
