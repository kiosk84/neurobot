"use client";

import { useState, useRef, useEffect } from "react";
import { nanoid } from 'nanoid';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useChatStore } from "@/store/useChatStore";
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { PublishDialog } from "@/components/PublishDialog";
import type { Message } from "@/store/useChatStore";

export default function SmmPage() {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    chats,
    activeChat,
    messages,
    setMessages,
    createNewChat,
    switchChat,
    deleteChat,
    renameChat
  } = useChatStore();

  const [message, setMessage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [postToPublish, setPostToPublish] = useState<Message | null>(null);
  const [channels] = useState([
    'Мой Telegram-канал',
    'Instagram Бизнес',
    'Twitter Аккаунт'
  ]);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const newMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString()
    };

    // Если сообщение содержит команду публикации
    if (message.toLowerCase().includes('опубликовать')) {
      setPostToPublish(newMessage);
      setPublishDialogOpen(true);
      return;
    }
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'Ты SMM ассистент, помогающий с маркетингом в соцсетях. Отвечай кратко, креативно, с эмодзи. Предлагай идеи постов, хэштеги, стратегии продвижения.'
            },
            ...updatedMessages
          ]
        }),
      });

      if (!response.ok) throw new Error('Ошибка при получении ответа');

      const data = await response.json();
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'Не удалось получить ответ',
        createdAt: new Date().toISOString()
      };
      
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
      });
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Header 
        onMenuClick={() => setIsDrawerOpen(prev => !prev)}
        isDrawerOpen={isDrawerOpen}
      />
      <Sidebar
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chats={chats}
        activeChat={activeChat}
        createNewChat={createNewChat}
        switchChat={switchChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
      />
      <div className="container mx-auto px-0 sm:px-4 pt-20 max-w-4xl h-screen flex flex-col">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <MessageInput
        message={message}
        loading={loading}
        fileInputRef={useRef(null)}
        onMessageChange={setMessage}
        onSubmit={handleMessageSubmit}
        onImageUpload={() => {}}
      />
      <Toaster />

      {postToPublish && (
        <PublishDialog
          open={publishDialogOpen}
          onClose={() => setPublishDialogOpen(false)}
          post={postToPublish.content}
          onPublish={(channel, time) => {
            const timeText = time === 'now' ? 'сейчас' : `в ${time}`;
            const confirmation: Message = {
              id: nanoid(),
              role: 'assistant',
              content: `✅ Пост запланирован на публикацию ${timeText} в ${channel}`,
              createdAt: new Date().toISOString()
            };
            setMessages([...messages, confirmation]);
            setPublishDialogOpen(false);
            scrollToBottom();
          }}
          channels={channels}
        />
      )}
    </main>
  );
}
