import React from 'react';
import { Button } from "@/components/ui/button";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const MenuItem = React.memo(({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: MenuItemProps) => (
  <Button
    variant="ghost"
    className={`w-full justify-start gap-3 px-4 py-3 rounded-xl ${
      isActive ? "bg-blue-600/20 border border-blue-500/30 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
    onClick={onClick}
    aria-current={isActive ? "page" : undefined}
  >
    {icon}
    <span>{label}</span>
  </Button>
));

MenuItem.displayName = "MenuItem";
