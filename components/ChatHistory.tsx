import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MessageSquare, Trash2, Pencil, Check, X, MessageCircle, Megaphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Chat as ChatType } from "@/store/useChatStore";

export type Chat = ChatType;

interface ChatHistoryProps {
  chats: Chat[];
  activeChat: string | null;
  switchChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

export function ChatHistory({
  chats,
  activeChat,
  switchChat,
  deleteChat,
  renameChat
}: ChatHistoryProps) {
  const { toast } = useToast();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  useEffect(() => {
    if (editingChatId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChatId]);

  const startEditing = (chat: Chat, event: MouseEvent) => {
    event.stopPropagation();
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleRenameSubmit = (chatId: string) => {
    if (newTitle.trim() === "") {
      setEditingChatId(null);
      setNewTitle("");
      return;
    }
    renameChat(chatId, newTitle.trim());
    setEditingChatId(null);
    setNewTitle("");
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>, chatId: string) => {
    if (event.key === 'Enter') handleRenameSubmit(chatId);
    else if (event.key === 'Escape') {
      setEditingChatId(null);
      setNewTitle("");
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  const handleDeleteClick = (e: MouseEvent, chat: Chat) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(chat);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete.id);
      toast({ 
        description: "Чат удален", 
        duration: 1000, // Уменьшаем время отображения до 1 секунды // Уменьшаем время отображения до 1 секунды // Уменьшаем время отображения до 1 секунды // Уменьшаем время отображения до 1 секунды // Уменьшаем время отображения до 1 секунды // Уменьшаем время отображения до 1 секунды
        variant: "default" 
      });
      setDeleteDialogOpen(false);
    }
  };

  const cancelEditing = (e: MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
    setNewTitle("");
  };

  const confirmEditing = (e: MouseEvent, chatId: string) => {
    e.stopPropagation();
    handleRenameSubmit(chatId);
  };

  // Группируем чаты по типу
  const chatsByType = chats.reduce((acc, chat) => {
    const type = chat.type || 'chat';
    if (!acc[type]) acc[type] = [];
    acc[type].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);

  // Сортируем чаты по дате создания (новые сверху)
  Object.keys(chatsByType).forEach(type => {
    chatsByType[type].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  // Получаем типы чатов в порядке: сначала 'chat', затем 'smm', затем остальные
  const chatTypes = Object.keys(chatsByType).sort((a, b) => {
    if (a === 'chat') return -1;
    if (b === 'chat') return 1;
    if (a === 'smm') return -1;
    if (b === 'smm') return 1;
    return a.localeCompare(b);
  });

  const getChatTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageCircle className="h-3.5 w-3.5" />;
      case 'smm': return <Megaphone className="h-3.5 w-3.5" />;
      default: return <MessageSquare className="h-3.5 w-3.5" />;
    }
  };

  const getChatTypeName = (type: string) => {
    switch (type) {
      case 'chat': return 'Обычные чаты';
      case 'smm': return 'SMM чаты';
      default: return `${type.charAt(0).toUpperCase()}${type.slice(1)} чаты`;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      <AnimatePresence>
        {chatTypes.map(type => (
          <motion.div 
            key={type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {chatsByType[type].length > 0 && (
              <div className="px-2 py-1 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                {getChatTypeIcon(type)}
                <span>{getChatTypeName(type)}</span>
              </div>
            )}
            
            {chatsByType[type].map((chat) => (
              <motion.div
                key={chat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => editingChatId !== chat.id && switchChat(chat.id)}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all",
                  "border border-transparent hover:border-gray-600/50",
                  activeChat === chat.id
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-700/10 border-blue-500/30 shadow-sm shadow-blue-500/10"
                    : "bg-gray-800/40 hover:bg-gray-700/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl text-blue-400 transition-colors",
                  activeChat === chat.id ? "bg-blue-500/30" : "bg-blue-500/10"
                )}>
                  <MessageSquare className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  {editingChatId === chat.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        ref={editInputRef}
                        value={newTitle}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleInputKeyDown(e, chat.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => confirmEditing(e, chat.id)}
                          className="p-1 text-green-400 hover:bg-green-500/20 rounded-md"
                          title="Сохранить"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded-md"
                          title="Отменить"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm font-medium text-white truncate">
                        {chat.title}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-400">
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </span>
                        
                        <AnimatePresence>
                          {(hoveredChatId === chat.id || activeChat === chat.id) && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.1 }}
                              className="flex gap-1"
                            >
                              <button
                                onClick={(e) => startEditing(chat, e)}
                                className="p-0.5 text-gray-300 hover:bg-white/10 rounded"
                                title="Переименовать"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteClick(e, chat)}
                                className="p-0.5 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded"
                                title="Удалить"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {chats.length === 0 && (
        <div className="text-center py-4 px-2">
          <p className="text-sm text-gray-400">История чатов пуста</p>
          <p className="text-xs text-gray-500 mt-1">Создайте новый чат, нажав на кнопку выше</p>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Удалить чат "${chatToDelete?.title}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
