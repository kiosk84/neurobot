"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from 'nanoid';
import { ErrorBoundary } from "react-error-boundary";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useChatStore } from "@/store/useChatStore";
import { analyzeImage } from "@/lib/image-analysis";
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { ErrorFallback } from "@/components/ChatMessage";
import type { Message } from "@/store/useChatStore";

export default function Home() {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const memoizedCreateNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  useEffect(() => {
    if (chats.length === 0) {
      memoizedCreateNewChat();
    }
  }, [chats.length, memoizedCreateNewChat]);

  const updateMessages = (messages: Message[]) => {
    setMessages(messages);
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (chats.length === 0) {
          const savedChats = localStorage.getItem('chats');
          if (savedChats) {
            const parsedChats = JSON.parse(savedChats);
            if (parsedChats.length > 0) {
              const lastChat = parsedChats[parsedChats.length - 1];
              if (!activeChat || activeChat !== lastChat.id) {
                switchChat(lastChat.id);
              }
            }
          }
        }
      } catch (error) {
        console.error("Ошибка при инициализации чата:", error);
        toast({
          variant: "destructive",
          title: "Ошибка инициализации",
          description: "Не удалось загрузить историю чатов",
        });
      } finally {
        setTimeout(() => {
          setInitialLoading(false);
        }, 500);
      }
    };

    initializeChat();
  }, [chats.length, activeChat, switchChat, toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const activeChatObj = chats.find(chat => chat.id === activeChat);
    const isSmmChat = activeChatObj?.chatType === 'smm-assistant';

    const newMessage: Message = { 
      id: nanoid(),
      role: 'user', 
      content: message.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedMessages = [...messages, newMessage];
    updateMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const requestMessages = isSmmChat 
        ? [
            {
              role: 'system',
              content: 'Ты SMM ассистент, помогающий с маркетингом в соцсетях. Отвечай кратко, креативно, с эмодзи. Предлагай идеи постов, хэштеги, стратегии продвижения.'
            },
            ...updatedMessages
          ]
        : updatedMessages;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: requestMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении ответа от сервера');
      }

      const data = await response.json();
      
      if (!data?.choices?.[0]?.message) {
        throw new Error('Некорректный формат ответа от сервера');
      }

      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.choices[0].message.content || 'Не удалось получить ответ',
        createdAt: new Date().toISOString()
      };
      
      updateMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при отправке сообщения",
      });
    } finally {
      setLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const processingMessage: Message = { 
      id: nanoid(),
      role: 'system', 
      content: `*уже смотрю...*`,
      createdAt: new Date().toISOString()
    };
    const currentMessages = [...messages, processingMessage];
    updateMessages(currentMessages);
    scrollToBottom();

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];

        if (!base64String) {
          throw new Error("Cannot read file as base64");
        }

        const analysisResult = await analyzeImage({ imageData: base64String });
        const analysisText = analysisResult?.choices?.[0]?.message?.content;

        const messagesWithoutProcessing = currentMessages.filter(msg => msg !== processingMessage);

        if (analysisText) {
          const botMessage: Message = { 
            id: nanoid(),
            role: 'assistant', 
            content: analysisText,
            createdAt: new Date().toISOString()
          };
          updateMessages([...messagesWithoutProcessing, botMessage]);
        } else {
          updateMessages(messagesWithoutProcessing);
           toast({
             variant: "default",
             title: "Анализ изображения",
             description: "Не удалось получить описание изображения.",
           });
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.onerror = (error) => {
         throw new Error("Ошибка чтения файла");

}
   } catch (error) {
      const messagesWithoutProcessing = currentMessages.filter(msg => msg !== processingMessage);
      updateMessages(messagesWithoutProcessing);
      toast({
        variant: "destructive",
        title: "Ошибка анализа изображения",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";

}
   } finally {
      setLoading(false);
      requestAnimationFrame(scrollToBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (  chats && chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
      } else if (chats && chats.length === 0) {
      localStorage.removeItem('chats');
    }
  }, [chats]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {initialLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-500 border-t-blue-500"></div>
            <h2 className="text-xl font-semibold text-gray-200">Загрузка приложения...</h2>
            <p className="text-sm text-gray-400">Пожалуйста, подождите</p>
          </div>
        </div>
      ) : (
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
              createNewChat={memoizedCreateNewChat}
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
            fileInputRef={fileInputRef}
            onMessageChange={setMessage}
            onSubmit={handleMessageSubmit}
            onImageUpload={handleImageUpload}
          />
        </main>
      )}
      <Toaster />
    </ErrorBoundary>
  );
}
