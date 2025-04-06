'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  React.useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className={cn('prose prose-invert max-w-none text-white', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match?.[1] || 'text';
            const codeContent = children ? 
              (Array.isArray(children) ? children.join('') : String(children)) : '';

            return match ? (
              <pre className={className}>
                <code className={`language-${language}`}>
                  {codeContent}
                </code>
              </pre>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
