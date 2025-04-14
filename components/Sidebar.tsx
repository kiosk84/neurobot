import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, MessageSquare, LineChart, Plus, Megaphone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatHistory, type Chat } from "@/components/ChatHistory";
import { ChatType } from "@/store/useChatStore";
import { MenuItem } from "@/components/ui/menu-item";

interface SidebarProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  chats: Chat[]; 
  activeChat: string | null;
  createNewChat: (chatType?: ChatType) => void;
  switchChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

const SidebarComponent = React.memo(({
  isDrawerOpen,
  onClose,
  chats,
  activeChat,
  createNewChat,
  switchChat,
  deleteChat,
  renameChat,
}: SidebarProps) => {
  const router = useRouter();
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'chat') router.push('/');
    if (tab === 'smm') router.push('/smm');
    if (tab === 'analysis') router.push('/analysis');
    onClose();
  }, [router, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  return (
    <>
      {isDrawerOpen && (
        <div 
          className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
            isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-gray-800 transition-all duration-300 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Основное меню"
      >
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-6" role="menu">
              <MenuItem
                icon={<MessageSquare className="h-5 w-5" />}
                label="Чат"
                onClick={() => {
                  handleTabChange("chat");
                  createNewChat('default');
                }}
              />

              <MenuItem
                icon={<Megaphone className="h-5 w-5" />}
                label="SMM Ассистент"
                isActive={false}
                onClick={() => {
                  handleTabChange("smm");
                  createNewChat('smm-assistant');
                }}
              />

              <MenuItem
                icon={<LineChart className="h-5 w-5" />}
                label="Анализ"
                onClick={() => {
                  handleTabChange("analysis");
                  createNewChat('analysis-assistant');
                }}
              />

              <div role="group" aria-label="Учетная запись">
                <Separator className="my-2 bg-gray-700" />
                <div className="space-y-1">
                  <MenuItem
                    icon={<User className="h-5 w-5" />}
                    label="Личный кабинет"
                    isActive={false}
                    onClick={onClose}
                  />
                  <MenuItem
                    icon={<Settings className="h-5 w-5" />}
                    label="Настройки"
                    isActive={false}
                    onClick={onClose}
                  />
                </div>
              </div>

              <div role="group" aria-label="История чатов">
                <Separator className="my-2 bg-gray-700" />
                <Button
                  onClick={() => {
                    createNewChat();
                    onClose();
                  }}
                  className="w-full gap-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white transition-colors"
                  aria-label="Создать новый чат"
                >
                  <Plus className="h-5 w-5" />
                  <span>Новый чат</span>
                </Button>
                <h3 className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  История чатов
                </h3>
                {activeChat && (
                  <p className="px-4 text-xs text-gray-500 mb-2">
                    {chats.find(c => c.id === activeChat)?.chatType === 'default' && 'Обычный чат'}
                    {chats.find(c => c.id === activeChat)?.chatType === 'smm-assistant' && 'SMM Ассистент'}
                    {chats.find(c => c.id === activeChat)?.chatType === 'analysis-assistant' && 'Анализ данных'}
                  </p>
                )}
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
