declare module 'prism-react-renderer' {
  import React from 'react';

  export interface PrismTheme {
    plain: {
      color?: string;
      backgroundColor?: string;
    };
    styles: Array<{
      types: string[];
      style: {
        color?: string;
        backgroundColor?: string;
        fontStyle?: 'normal' | 'italic';
        fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
      };
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
    getLineProps: (input: {key?: string | number; line: Token[]; className?: string}) => any;
    getTokenProps: (input: {key?: string | number; token: Token; className?: string}) => any;
  }

  export interface PrismProps {
    language: string;
    code: string;
    theme?: PrismTheme;
    children: (props: RenderProps) => React.ReactNode;
  }

  export const Prism: React.ComponentType<PrismProps>;
  export const Highlight: React.ComponentType<PrismProps>;
}
