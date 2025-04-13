import { cn } from '@/lib/utils';
import React, { useCallback, useState, useEffect } from 'react';
import { User, Settings, MessageSquare, Plus, Heart, Info, Megaphone, ChevronLeft, ChevronRight, Sparkles, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatHistory, type Chat } from "@/components/ChatHistory";
import { MenuItem } from "@/components/ui/menu-item";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(true);

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

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const toggleChatHistory = useCallback(() => {
    setShowChatHistory(prev => !prev);
  }, []);

  // Подсчет чатов по типам
  const chatCount = chats.filter(chat => chat.type === activeTab).length;

  // Функция для открытия меню (используется в обработчике свайпов)
  const onMenuClick = useCallback(() => {
    // Если меню закрыто, открываем его
    if (!isDrawerOpen) {
      // Здесь должен быть код для открытия меню
      // Но так как у нас есть только функция закрытия, мы не можем его открыть
      // Возможно, вам нужно добавить функцию открытия в родительском компоненте
      console.log('Попытка открыть меню');
    }
  }, [isDrawerOpen]);

  // Реализация свайпов без использования react-swipeable
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Минимальное расстояние для свайпа
  const minSwipeDistance = 50;

  // Добавляем обработчики свайпов на документ
  useEffect(() => {
    const handleTouchStart = (e: any) => {
      if (e.touches && e.touches[0]) {
        setTouchEnd({ x: 0, y: 0 });
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchMove = (e: any) => {
      if (e.touches && e.touches[0]) {
        setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleTouchEnd = () => {
      if (!touchStart.x || !touchEnd.x) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

      if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          // Свайп влево
          if (isDrawerOpen) {
            onClose();
          }
        } else {
          // Свайп вправо
          if (!isDrawerOpen) {
            onMenuClick();
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart as EventListener);
    document.addEventListener('touchmove', handleTouchMove as EventListener);
    document.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart as EventListener);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [isDrawerOpen, onClose, touchStart, touchEnd, minSwipeDistance, onMenuClick]);



  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-gray-900/95 border-r border-gray-800 transition-all duration-300 ease-in-out pt-14 sm:pt-16 backdrop-blur-sm",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-[85vw] xs:w-[320px] sm:w-72"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-4 bg-gray-800 text-gray-300 hover:text-white p-1 rounded-full border border-gray-700 shadow-md z-50 hidden lg:flex"
            aria-label={isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="mb-2">
              <div className="space-y-2">
                <MenuItem
                  icon={<MessageSquare className="h-5 w-5" />}
                  label="Чат"
                  subtitle={isCollapsed ? undefined : "Общение с нейросетью"}
                  isActive={activeTab === "chat"}
                  badge={isCollapsed ? `${chatCount}` : undefined}
                  onClick={() => {
                    handleTabChange("chat");
                    onClose();
                  }}
                />

                <MenuItem
                  icon={<Megaphone className="h-5 w-5" />}
                  label="SMM Ассистент"
                  subtitle={isCollapsed ? undefined : "Помощь с контентом"}
                  isActive={activeTab === "smm"}
                  onClick={() => {
                    handleTabChange("smm");
                    onClose();
                  }}
                />
              </div>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div role="group" aria-label="Учетная запись">
                      <Separator className="my-4 bg-gray-700" />
                      <div className="space-y-2">
                        <Link href="/account" className="block text-gray-300 hover:bg-gray-700/70 hover:text-white rounded-xl transition-colors duration-150">
                          <MenuItem
                            icon={<User className="h-5 w-5" />}
                            label="Личный кабинет"
                            isActive={false}
                            onClick={onClose}
                          />
                        </Link>
                        <Link href="/settings" className="block text-gray-300 hover:bg-gray-700/70 hover:text-white rounded-xl transition-colors duration-150">
                          <MenuItem
                            icon={<Settings className="h-5 w-5" />}
                            label="Настройки"
                            isActive={false}
                            onClick={onClose}
                          />
                        </Link>
                        <a href="/info" onClick={onClose} className="block text-gray-300 hover:bg-gray-700/70 hover:text-white rounded-xl transition-colors duration-150">
                          <MenuItem
                            icon={<Info className="h-5 w-5" />}
                            label="Информация"
                            isActive={false}
                            onClick={onClose}
                          />
                        </a>
                        <a href="/support" onClick={onClose} className="block text-gray-300 hover:bg-gray-700/70 hover:text-white rounded-xl transition-colors duration-150">
                          <MenuItem
                            icon={<Heart className="h-5 w-5" />}
                            label="Поддержать проект"
                            isActive={false}
                            onClick={onClose}
                          />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div role="group" aria-label="История чатов">
                <Separator className="my-4 bg-gray-700" />
                <Button
                  onClick={handleCreateNewChat}
                  className={cn(
                    "gap-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white transition-all shadow-md shadow-blue-900/20 hover:shadow-blue-800/30",
                    isCollapsed ? "w-14 h-14 p-0 mx-auto" : "w-full"
                  )}
                  aria-label="Создать новый чат"
                >
                  <Plus className={cn("h-5 w-5", isCollapsed && "h-6 w-6")} />
                  {!isCollapsed && <span>Новый чат</span>}
                </Button>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mt-6 mb-2">
                        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <History className="h-3.5 w-3.5" />
                          История чатов
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                          onClick={toggleChatHistory}
                        >
                          {showChatHistory ? "Скрыть" : "Показать"}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showChatHistory && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChatHistory
                              chats={chats}
                              activeChat={activeChat}
                              switchChat={switchChat}
                              deleteChat={deleteChat}
                              renameChat={renameChat}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/80">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>Neurobot v1.0</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});

SidebarComponent.displayName = "Sidebar";

export const Sidebar = SidebarComponent;
export default SidebarComponent;
