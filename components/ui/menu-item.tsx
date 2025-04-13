import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  isActive: boolean;
  onClick: () => void;
  newWindow?: boolean;
  value?: string;
  badge?: string;
}

export const MenuItem = React.memo(({ 
  icon, 
  label,
  subtitle,
  isActive, 
  onClick,
  newWindow,
  value,
  badge
}: MenuItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick();
  };

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? "bg-blue-600/20 border border-blue-500/30 text-white shadow-sm shadow-blue-500/20" 
          : "text-gray-300 hover:bg-gray-700/70 hover:text-white"
      }`}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <div className={`relative ${isActive ? "text-blue-400" : "text-gray-400"}`}>
        {isActive && (
          <motion.div
            className="absolute -inset-1 rounded-full bg-blue-500/20"
            layoutId="activeMenuItemIndicator"
            transition={{ type: "spring", duration: 0.5 }}
          />
        )}
        {icon}
      </div>
      <div className="flex flex-col items-start flex-1">
        <span className="font-medium">{label}</span>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      {badge && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300">
          {badge}
        </span>
      )}
    </Button>
  );
});

MenuItem.displayName = "MenuItem";
