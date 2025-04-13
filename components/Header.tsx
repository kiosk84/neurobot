// project/components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onMenuClick: (newState?: boolean) => void;
  isDrawerOpen: boolean;
}

export function Header({ onMenuClick, isDrawerOpen }: HeaderProps) {
  return (
    <div className="fixed top-2 sm:top-2 sm:top-2 sm:top-2 sm:top-4 left-0 right-0 z-[60] flex items-center justify-between px-2 sm:px-2 sm:px-2 sm:px-2 sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        data-menu-button
        className="w-9 h-9 sm:w-10 sm:h-9 sm:w-10 sm:h-9 sm:w-10 sm:h-9 sm:w-10 sm:h-10 rounded-md bg-gray-900/80 hover:bg-gray-800 hover:shadow-md hover:shadow-blue-900/20 relative backdrop-blur-sm transition-all duration-200"
        onClick={() => onMenuClick(!isDrawerOpen)}
        aria-label={isDrawerOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <AnimatePresence mode="wait">
          {isDrawerOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-5 text-gray-300" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-4 sm:w-5 sm:h-5 text-gray-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Chat title */}
      <motion.div 
        className="flex items-center gap-1 sm:gap-1 sm:gap-1 sm:gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:px-4 py-1.5 sm:px-4 py-1.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-800/70 backdrop-blur-sm pointer-events-auto shadow-[0_-2px_10px_-1px_rgba(59,130,246,0.4)]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 5
          }}
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-5 sm:h-6 sm:w-5 sm:h-6 sm:w-5 sm:h-6 sm:w-6 text-blue-400" />
        </motion.div>
        
        <h1 className="text-base sm:text-base sm:text-base sm:text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
          NEUROBOT
        </h1>
      </motion.div>

      {/* Empty div for balance */}
      <div className="w-9 sm:w-9 sm:w-9 sm:w-9 sm:w-10"></div>
    </div>
  );
}
