// project/components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface HeaderProps {
  onMenuClick: (newState?: boolean) => void;
  isDrawerOpen: boolean;
}

export function Header({ onMenuClick, isDrawerOpen }: HeaderProps) {  return (
    <div className="fixed top-4 left-0 right-0 z-[60] flex items-center justify-between px-4">      <Button
        variant="ghost"
        size="icon"
        data-menu-button
        className="w-10 h-10 rounded-md bg-gray-900/80 hover:bg-gray-700 relative"
        onClick={() => onMenuClick(!isDrawerOpen)}
        aria-label={isDrawerOpen ? "Закрыть меню" : "Открыть меню"}
      >
        {isDrawerOpen ? (
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>

      {/* Chat title */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 pointer-events-auto shadow-[0_-2px_10px_-1px_rgba(59,130,246,0.4)]"> {/* Custom shadow for higher glow */}
        <Bot className="h-6 w-6 text-blue-400" />
        {/* Добавляем классы для анимированного градиента */}
        <h1 className="text-lg font-bold text-white">
          NEUROBOT
        </h1>
      </div>

      {/* Empty div for balance */}
      <div className="w-10"></div>
    </div>
  );
}
