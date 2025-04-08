'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from 'nanoid';
import { ErrorBoundary } from "react-error-boundary";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useChatStore } from "@/store/useChatStore";
import { analyzeImage } from "@/lib/image-analysis";
import AnimatedBackground from '@/components/AnimatedBackground'; // Импортируем фон сюда
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { ErrorFallback } from "@/components/ChatMessage";
import type { Message } from "@/store/useChatStore";

// Define user-friendly names for chat modes
const modeNames: { [key: string]: string } = {
  chat: "Чат",
  smm: "SMM Ассистент",
};

export default function Home() {
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  
  // Закрываем сайдбар при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Если сайдбар открыт и клик был не по сайдбару или кнопке меню
      if (isDrawerOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        const menuButton = document.querySelector('[data-menu-button]');
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setIsDrawerOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);
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

  const memoizedCreateNewChat = useCallback((type: 'chat' | 'smm') => {
    createNewChat(type);
  }, [createNewChat]);

  useEffect(() => {
    if (chats.length === 0) {
      memoizedCreateNewChat('chat');
    }
  }, [chats.length, memoizedCreateNewChat]);

  useEffect(() => {
    if (activeChat) {
      const currentChat = chats.find(c => c.id === activeChat);
      if (currentChat && currentChat.type !== activeTab) {
        const lastMatchingChat = chats
          .filter(c => c.type === activeTab)
          .slice(-1)[0];
        
        if (lastMatchingChat) {
          switchChat(lastMatchingChat.id);
        }
      }
    }
  }, [activeTab, activeChat, chats, switchChat]);

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('Request timed out');
    }, 30000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          chatType: activeTab
        }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.statusText}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      if (!data.data?.choices?.[0]?.message?.content) {
        throw new Error('Некорректный формат ответа от сервера');
      }

      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.data.choices[0].message.content,
        createdAt: new Date().toISOString()
      };
      
      updateMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage
      });

      updateMessages(messages);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const processingMessage: Message = { 
      id: nanoid(),
      role: 'assistant',
      content: `Анализирую изображение... ⏳`,
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
        <main className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          { !isDrawerOpen && <AnimatedBackground /> }
          <Header
            onMenuClick={() => setIsDrawerOpen(prev => !prev)}
            isDrawerOpen={isDrawerOpen}
          />
          <Sidebar
            isDrawerOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              chats={chats}
              activeChat={activeChat}
              createNewChat={memoizedCreateNewChat}
              switchChat={switchChat}
              deleteChat={deleteChat}
            renameChat={renameChat}
          />
          <div className="relative z-10 container mx-auto px-0 sm:px-4 pt-16 max-w-4xl h-screen flex flex-col">
            <div className="pb-2 border-b border-gray-700 text-center flex flex-col items-center">
              {activeChat && (
                <p className="text-xs text-gray-400 mb-0.5">
                  {chats.find(c => c.id === activeChat)?.title}
                </p>
              )}
              <span className="text-[10px] text-blue-400 font-medium px-2 py-0.5 rounded-full bg-blue-900/50">
                Режим: {modeNames[activeTab] || activeTab}
              </span>
            </div>
            <MessageList 
              messages={messages} 
              messagesEndRef={messagesEndRef}
              chatType={activeTab === 'smm' ? 'smm' : 'default'} 
            />
          </div>
          <div className="relative z-20">
            <MessageInput
              message={message}
              loading={loading}
            fileInputRef={fileInputRef}
            onMessageChange={setMessage}
            onSubmit={handleMessageSubmit}
              onImageUpload={handleImageUpload}
            />
          </div>
        </main>
      )}
      <Toaster />
    </ErrorBoundary>
  );
}

