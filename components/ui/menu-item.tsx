import React from 'react';
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  isActive: boolean;
  onClick: () => void;
  newWindow?: boolean;
  value?: string;
}

export const MenuItem = React.memo(({ 
  icon, 
  label,
  subtitle,
  isActive, 
  onClick,
  newWindow,
  value
}: MenuItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick();
  };

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 px-4 py-3 rounded-xl ${
        isActive ? "bg-blue-600/20 border border-blue-500/30 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </Button>
  );
});

MenuItem.displayName = "MenuItem";
