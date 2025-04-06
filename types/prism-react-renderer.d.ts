declare module 'prism-react-renderer' {
  import React from 'react';

  export interface PrismTheme {
    plain: Record<string, string>;
    styles: Array<{
      types: string[];
      style: Record<string, string>;
    }>;
  }

  export interface Token {
    types: string[];
    content: string;
    empty?: boolean;
  }

  export interface RenderProps {
    tokens: Token[][];
    className: string;
    style: React.CSSProperties;
    getLineProps: (options: {line: Token[], className?: string}) => any;
    getTokenProps: (options: {token: Token, className?: string}) => any;
  }

  export interface SyntaxHighlighterProps {
    language: string;
    style: PrismTheme;
    PreTag?: React.ComponentType;
    children: string;
  }

  export const Prism: React.ComponentType<SyntaxHighlighterProps>;
  export const Highlight: React.ComponentType<SyntaxHighlighterProps>;
  export const defaultProps: {
    theme: PrismTheme;
  };
}
