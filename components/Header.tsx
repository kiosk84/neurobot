// project/components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface HeaderProps {
  onMenuClick: (newState?: boolean) => void;
  isDrawerOpen: boolean;
}

export function Header({ onMenuClick, isDrawerOpen }: HeaderProps) {
  return (
    <div className="fixed top-4 left-0 right-0 z-30 flex items-center justify-between px-4 pointer-events-none">
      {/* Menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="p-2 rounded-md bg-gray-900/80 hover:bg-gray-700 pointer-events-auto"
        onClick={() => onMenuClick(!isDrawerOpen)}
        aria-label="Открыть меню"
      >
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDrawerOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </Button>

      {/* Chat title */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 pointer-events-auto">
        <Bot className="h-6 w-6 text-blue-400" />
        <h1 className="text-lg font-bold text-white">NEUROBOT</h1>
      </div>

      {/* Empty div for balance */}
      <div className="w-10"></div>
    </div>
  );
}
