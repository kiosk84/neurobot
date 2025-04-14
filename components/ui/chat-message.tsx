"use client";

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { vscDarkPlus } from "@/lib/markdown-theme";
import { motion } from "framer-motion";

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

const components: Components = {
  code({ inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return (
        <div className="rounded-lg overflow-hidden my-2">
          <SyntaxHighlighter
            language={match[1]}
            style={vscDarkPlus}
            code={String(children).replace(/\n$/, '')}
            {...props}
          >
            {({className, style, tokens, getLineProps, getTokenProps}) => (
              <div className={className} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({line})}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({token})} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className={className} {...props}>
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-4 rounded-2xl max-w-[85%] relative",
        isUser 
          ? "ml-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          : isAnalysis
            ? "mr-auto bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            : "mr-auto bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-full",
          isUser 
            ? "bg-blue-400"
            : isAnalysis
              ? "bg-purple-400"
              : "bg-gray-600"
        )}>
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="prose prose-invert max-w-none">
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {typeof content === 'string' ? content : String(content)}
              </ReactMarkdown>
            </div>
          </div>
          {timestamp && (
            <div className="text-xs opacity-70 mt-2">
              {new Date(timestamp).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
