"use client";

import React, { useState, useCallback } from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighterComponent } from "prism-react-renderer"; // Renamed static import for types
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
// import dynamic from 'next/dynamic'; // Temporarily commented out
import { vscDarkPlus } from "@/lib/markdown-theme"; // Keep theme import for now

// Dynamically import SyntaxHighlighter
const SyntaxHighlighter = dynamic(() =>
  import('prism-react-renderer').then(mod => mod.Highlight), // Import the Highlight component specifically
  { ssr: false }
);

interface ChatMessageProps {
  role: "user" | "assistant";
  content: React.ReactNode;
  timestamp?: number;
  isAnalysis?: boolean;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Markdown components configuration (unchanged)
const components: Components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || '');
    // Check if SyntaxHighlighter is loaded (it should be due to dynamic import)
    if (!inline && match && SyntaxHighlighter) {
      const codeContent = String(children).replace(/\n$/, '');
      return (
        // @ts-ignore // Ignore potential type mismatch due to dynamic import
        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus} // Keep original style import
          code={codeContent}
          {...props}
        >
          {({ className: hlClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={cn("p-4 rounded-md overflow-x-auto", hlClassName)} style={style}>
              {tokens.map((line, i) => (
                // Явно передаем key={i} вместе с остальными пропами из getLineProps
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, innerKey) => { // Используем другое имя переменной для ясности
                    const tokenProps = getTokenProps({ token, key: innerKey });
                    // Явно передаем key, остальные пропсы разворачиваем
                    return <span key={innerKey} {...tokenProps} />;
                  })}
                </div>
              ))}
            </pre>
          )}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)} {...props}>
        {children}
      </code>
    );
  }
};

export const ChatMessage = ({
  role,
  content,
  timestamp,
  isAnalysis = false
}: ChatMessageProps) => {
  const isUser = role === "user";
  const [isCopied, setIsCopied] = useState(false);

  // Callback for copying message content
  const handleCopy = useCallback(() => {
    const textToCopy = typeof content === 'string' ? content : String(content);
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }, [content]);

  return (
    // Outer container for alignment and animation
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col gap-1 w-full", // Use full width for alignment container
        isUser ? "items-end" : "items-start" // Align content right for user, left for others
      )}
    >
      {/* Avatar positioned above */}
      <div className={cn(
        "p-1.5 rounded-full flex-shrink-0 mb-1", // Smaller padding, bottom margin
        isUser
          ? "bg-gray-500" // Dark gray avatar background for user
          : isAnalysis
            ? "bg-purple-400"
            : "bg-gray-600"
      )}>
        {isUser ? (
          <User className="h-3 w-3" /> // Smallest avatar size
        ) : (
          <Bot className="h-3 w-3" /> // Smallest avatar size
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "p-4 rounded-2xl max-w-[90%] relative group", // Padding back to p-4, keep max-width and group
          isUser
            ? "bg-gray-800/80 text-gray-100" // Use AI background for user
            : isAnalysis
              ? "bg-purple-800/80 text-white" // Added /80 for opacity
              : "bg-gray-800/80 text-gray-100" // Added /80 for opacity
        )}
        style={{ // Keep existing box-shadow logic
          boxShadow: isUser
            ? '0 0 15px 3px rgba(156, 163, 175, 0.5)' // Use AI shadow for user
            : isAnalysis
              ? '0 0 15px 3px rgba(168, 85, 247, 0.4)'
              : '0 0 15px 3px rgba(156, 163, 175, 0.5)'
        }}
      >
        {/* Message Content and Timestamp */}
        <div className="min-w-0"> {/* Removed flex-1 as it's inside the bubble now */}
          <div className="prose prose-invert max-w-none mb-1">
            <div className="markdown-content break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {typeof content === 'string' ? content : String(content)}
              </ReactMarkdown>
            </div>
          </div>
          {/* Timestamp and Copy Button Container */}
          <div className="flex items-center justify-start mt-3 text-xs opacity-70">
            {timestamp && (
              <span>
                {new Date(timestamp).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })} {new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {/* Copy Button - Conditionally render for non-user messages */}
            {!isUser && ( // Temporarily removed clipboard check for debugging
              <button
                onClick={handleCopy}
                className="ml-2 p-0.5 rounded bg-gray-700/50 text-gray-400 hover:bg-gray-600/70 hover:text-gray-200 transition-colors duration-200 flex-shrink-0" // Reduced padding, added flex-shrink-0
                aria-label="Скопировать сообщение"
                title="Скопировать сообщение"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div> {/* Closing tag for the message bubble div */}
    </motion.div>
  );
};
