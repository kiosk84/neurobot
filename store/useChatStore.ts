import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid'; // Import nanoid

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'bot';
  content: string;
  versions?: string[];
  currentVersion?: number;
  isRegenerating?: boolean;
  createdAt?: string;
}

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  type: 'chat' | 'smm'; // Добавляем тип чата
}

interface ChatStore {
  chats: Chat[];
  activeChat: string | null;
  messages: Message[];
  isLoading: boolean;
  setMessages: (messages: Message[]) => void;
  createNewChat: (type: 'chat' | 'smm') => void; // Обновляем сигнатуру
  switchChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      messages: [],
      isLoading: false,
      
      setMessages: (messages) => {
        set({ messages })
        const { activeChat, chats } = get()
        if (activeChat) {
          set({
            chats: chats.map((chat) =>
              chat.id === activeChat ? { ...chat, messages } : chat
            ),
          })
        }
      },

      createNewChat: (type) => {
        console.log('Creating new chat with type:', type)
        const newChat = {
          id: nanoid(), // Use nanoid for unique IDs
          title: `${type === 'smm' ? 'SMM' : 'Чат'} ${get().chats.length + 1}`,
          messages: [],
          createdAt: new Date().toISOString(),
          type
        };

        set({
          chats: [...get().chats, newChat],
          activeChat: newChat.id,
          messages: [],
          isLoading: false
        });
      },

      switchChat: (chatId) => {
        const chat = get().chats.find((c) => c.id === chatId)
        if (chat) {
          set({
            activeChat: chatId,
            messages: chat.messages
          })
        }
      },

      deleteChat: (chatId) => {
        const { activeChat, chats } = get()
        const newChats = chats.filter((chat) => chat.id !== chatId)
        const nextActiveChat = newChats.length > 0 ? newChats[newChats.length - 1] : null
        
        set({
          chats: newChats,
          ...(activeChat === chatId && {
            activeChat: nextActiveChat ? nextActiveChat.id : null,
            messages: nextActiveChat ? nextActiveChat.messages : []
          })
        })
      },

      renameChat: (chatId, newTitle) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
          )
        }))
      }
    }),
    {
      name: 'chat-storage',
      // Добавляем onRehydrateStorage для очистки старых ID при загрузке
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate chat store:', error);
          return;
        }
        if (state) {
          console.log('Rehydrating chat store state...');
          const seenIds = new Set<string>();
          let stateModified = false;
          
          // Обновляем существующие чаты, добавляя тип, если его нет
          state.chats = state.chats.map(chat => {
            const isOldIdFormat = /^\d+$/.test(chat.id);
            const needsNewId = isOldIdFormat || seenIds.has(chat.id);
            
            if (needsNewId) {
              const oldId = chat.id;
              const newId = nanoid(); // Use nanoid here as well
              console.warn(`Replacing old/duplicate chat ID ${oldId} with ${newId}`);
              seenIds.add(newId);
              stateModified = true;
              return { 
                ...chat, 
                id: newId,
                type: chat.type || 'chat' // Добавляем тип по умолчанию
              };
            }
            
            seenIds.add(chat.id);
            return {
              ...chat,
              type: chat.type || 'chat' // Добавляем тип по умолчанию
            };
          });

          if (stateModified) {
             console.log('Chat store state modified during rehydration.');
          }
           // Убедимся, что activeChat соответствует существующему ID после очистки
           if (state.activeChat && !state.chats.some(c => c.id === state.activeChat)) {
             console.warn(`Active chat ID ${state.activeChat} not found after rehydration, resetting.`);
             state.activeChat = state.chats.length > 0 ? state.chats[0].id : null;
             state.messages = state.activeChat ? state.chats.find(c => c.id === state.activeChat)?.messages || [] : [];
           }
        }
      },
    }
  )
)
