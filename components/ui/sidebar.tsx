"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LineChart, Megaphone, Plus, MessageSquare, Trash2, Pencil } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ChatItem {
  id: number;
  title: string;
  date: string;
}

export function Sidebar() {
  const [chatHistory, setChatHistory] = useLocalStorage<ChatItem[]>("chatHistory", []);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingChatId !== null && inputRef.current) {
      inputRef.current.focus();
      // Select text in input when editing starts
      inputRef.current.select();
    }
  }, [editingChatId]);

  const handleNewChat = () => {
    const newChat: ChatItem = {
      id: Date.now(),
      title: `Новый чат ${chatHistory.length + 1}`,
      date: new Date().toLocaleString()
    };
    setChatHistory([newChat, ...chatHistory]); // Add new chat to the beginning
  };

  const handleDeleteChat = (idToDelete: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click event
    setChatHistory(chatHistory.filter(chat => chat.id !== idToDelete));
  };

  const handleRenameChat = (idToRename: number) => {
    if (newTitle.trim() === "") return; // Prevent renaming to empty string
    setChatHistory(chatHistory.map(chat =>
      chat.id === idToRename ? { ...chat, title: newTitle.trim() } : chat
    ));
    setEditingChatId(null);
    setNewTitle("");
  };

  const startEditing = (chat: ChatItem, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click event
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (event.key === 'Enter') {
      handleRenameChat(id);
    } else if (event.key === 'Escape') {
      setEditingChatId(null);
      setNewTitle("");
    }
  };

  const handleInputBlur = (id: number) => {
    // Timeout to allow click on save/delete buttons if needed, otherwise save on blur
    setTimeout(() => {
      // Check if still editing the same chat before saving on blur
      if (editingChatId === id) {
         handleRenameChat(id);
      }
    }, 100);
  };

  // Sort chat history by date, newest first
  const sortedChatHistory = [...chatHistory].sort((a, b) => b.id - a.id);

  return (
    <div className="w-72 h-full flex flex-col border-r border-gray-700 bg-gray-900/50">
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          Новый чат
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        {/* Chat History */}
        <div className="space-y-1 mb-4">
          {sortedChatHistory.map((chat: ChatItem) => (
            <Card
              key={chat.id}
              className="p-2 hover:bg-gray-800 cursor-pointer transition-colors flex items-center justify-between group"
              // onClick={() => console.log("Load chat:", chat.id)} // Placeholder for loading chat
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  {editingChatId === chat.id ? (
                    <Input
                      ref={inputRef}
                      type="text"
                      value={newTitle}
                      onChange={handleInputChange}
                      onKeyDown={(e) => handleInputKeyDown(e, chat.id)}
                      onBlur={() => handleInputBlur(chat.id)}
                      className="h-7 text-sm bg-gray-700 border-gray-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking input
                    />
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate" title={chat.title}>{chat.title}</p>
                      <p className="text-xs text-gray-500">{chat.date}</p>
                    </>
                  )}
                </div>
              </div>
              {/* Action Icons */}
              <div className="flex items-center gap-1 transition-opacity">
                 {editingChatId !== chat.id && (
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-6 w-6 text-gray-400 hover:text-white"
                     onClick={(e) => startEditing(chat, e)}
                     title="Переименовать"
                   >
                     <Pencil className="h-3.5 w-3.5" />
                   </Button>
                 )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  title="Удалить"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs orientation="vertical" className="mt-6">
          <TabsList className="flex-col items-start h-auto bg-transparent gap-1">
            <TabsTrigger 
              value="analysis" 
              className="w-full justify-start gap-2 data-[state=active]:bg-blue-600/20"
            >
              <LineChart className="h-4 w-4" />
              Анализ графиков
            </TabsTrigger>
            <TabsTrigger 
              value="smm" 
              className="w-full justify-start gap-2 data-[state=active]:bg-blue-600/20"
            >
              <Megaphone className="h-4 w-4" />
              SMM Ассистент
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
