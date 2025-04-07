import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MessageSquare, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
      toast({ description: "Чат удален", duration: 2000 });
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => editingChatId !== chat.id && switchChat(chat.id)}
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all",
            "border border-transparent hover:border-gray-600/50",
            activeChat === chat.id
              ? "bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-blue-500/30"
              : "bg-gray-800/40 hover:bg-gray-700/50"
          )}
        >
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {editingChatId === chat.id ? (
              <Input
                ref={editInputRef}
                value={newTitle}
                onChange={handleInputChange}
                onKeyDown={(e) => handleInputKeyDown(e, chat.id)}
                onBlur={() => handleRenameSubmit(chat.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-8 bg-gray-700 border-gray-600"
              />
            ) : (
              <div>
                <div className="text-sm font-medium text-white truncate">
                  {chat.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => startEditing(chat, e)}
                      className="p-0.5 text-white hover:bg-white/10 rounded"
                      title="Переименовать"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, chat)}
                      className="p-0.5 text-white hover:bg-white/10 rounded"
                      title="Удалить">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Удалить чат "${chatToDelete?.title}"?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
