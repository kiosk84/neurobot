import { cn } from '@/lib/utils';
import React, { useCallback } from 'react';
import { User, Settings, MessageSquare, Plus, Heart, Info, Megaphone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatHistory, type Chat } from "@/components/ChatHistory";
import { MenuItem } from "@/components/ui/menu-item";
import Link from 'next/link';

interface SidebarProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chats: Chat[];
  activeChat: string | null;
  createNewChat: (type: 'chat' | 'smm') => void;
  switchChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

const SidebarComponent = React.memo(({
  isDrawerOpen,
  onClose,
  activeTab,
  setActiveTab,
  chats,
  activeChat,
  createNewChat,
  switchChat,
  deleteChat,
  renameChat,
}: SidebarProps) => {
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, [setActiveTab]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleCreateNewChat = useCallback(() => {
    createNewChat(activeTab as 'chat' | 'smm');
    onClose();
  }, [createNewChat, activeTab, onClose]);

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}      <aside
        data-sidebar
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out pt-16",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      ><div className="flex flex-col h-full">
          <ScrollArea className="flex-1 px-3 py-2">
            <div className="mb-2">
              <MenuItem
                icon={<MessageSquare className="h-5 w-5" />}
                label="Чат"
                subtitle="Общение с нейросетью"
                isActive={activeTab === "chat"}
                onClick={() => {
                  handleTabChange("chat");
                  onClose();
                }}
              />

              <MenuItem
                icon={<Megaphone className="h-5 w-5" />}
                label="SMM Ассистент"
                subtitle="Помощь с контентом"
                isActive={activeTab === "smm"}
                onClick={() => {
                  handleTabChange("smm");
                  onClose();
                }}
              />              <div role="group" aria-label="Учетная запись">
                <Separator className="my-2 bg-gray-700" />
                <div className="space-y-1">
                  <Link href="/account" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150">
                    <MenuItem
                      icon={<User className="h-5 w-5" />}
                      label="Личный кабинет"
                      isActive={false}
                      onClick={onClose}
                    />
                  </Link>
                  <MenuItem
                    icon={<Settings className="h-5 w-5" />}
                    label="Настройки"
                    isActive={false}
                    onClick={onClose}
                  />
                  <a href="/info" onClick={onClose} className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150">
                    <MenuItem
                      icon={<Info className="h-5 w-5" />}
                      label="Информация"
                      isActive={false}
                      onClick={onClose}
                    />
                  </a>
                  <a href="/support" onClick={onClose} className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-150">
                    <MenuItem
                      icon={<Heart className="h-5 w-5" />}
                      label="Поддержать проект"
                      isActive={false}
                      onClick={onClose}
                    />
                  </a>
                </div>
              </div>

              <div role="group" aria-label="История чатов">
                <Separator className="my-2 bg-gray-700" />
                <Button
                  onClick={handleCreateNewChat}
                  className="w-full gap-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white transition-colors"
                  aria-label="Создать новый чат"
                >
                  <Plus className="h-5 w-5" />
                  <span>Новый чат</span>
                </Button>
                <h3 className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  История чатов
                </h3>
                <ChatHistory
                  chats={chats}
                  activeChat={activeChat}
                  switchChat={switchChat}
                  deleteChat={deleteChat}
                  renameChat={renameChat}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
});

SidebarComponent.displayName = "Sidebar";

export const Sidebar = SidebarComponent;
export default SidebarComponent;
