import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'bot';
  content: string;
  versions?: string[];
  currentVersion?: number;
  isRegenerating?: boolean;
  createdAt?: string;
}

export type ChatType = 'default' | 'smm-assistant' | 'analysis-assistant';

export type Chat = {
  id: string
  title: string
  subtitle?: string
  messages: Message[]
  createdAt: string
  chatType?: ChatType
}

type ChatStore = {
  chats: Chat[]
  activeChat: string | null
  messages: Message[]
  setMessages: (messages: Message[]) => void
  createNewChat: () => void
  switchChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  renameChat: (chatId: string, newTitle: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      messages: [], // Messages for the *active* chat
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
      createNewChat: (chatType: ChatType = 'default') => {
        const title = `Новый чат ${get().chats.length + 1}`;
        const subtitle = chatType === 'smm-assistant'
          ? 'SMM Ассистент: Ваш помощник в маркетинге соцсетей'
          : chatType === 'analysis-assistant'
          ? 'Анализ данных: Помощник по аналитике'
          : undefined;
          
        const initialMessages: Message[] = chatType === 'smm-assistant' 
          ? [{
              id: nanoid(),
              role: 'assistant',
              content: 'Привет, я твой SMM Ассистент! Чем могу помочь?',
              createdAt: new Date().toISOString()
            }]
          : chatType === 'analysis-assistant'
          ? [{
              id: nanoid(),
              role: 'assistant',
              content: 'Привет, я твой SMM Ассистент! Чем могу помочь?',
              createdAt: new Date().toISOString()
            }]
          : [];

        const newChat = {
          id: Date.now().toString(),
          title,
          subtitle,
          messages: initialMessages,
          createdAt: new Date().toISOString(),
          chatType
        }
        set((state) => ({
          chats: [...state.chats, newChat],
          activeChat: newChat.id,
          messages: initialMessages,
        }))
      },
      switchChat: (chatId) => {
        const chat = get().chats.find((c) => c.id === chatId)
        if (chat) {
          set({
            activeChat: chatId,
            messages: chat.messages,
          })
        }
      },
      deleteChat: (chatId) => {
        const { activeChat, chats } = get()
        const newChats = chats.filter((chat) => chat.id !== chatId)
        set({
          chats: newChats,
          ...(activeChat === chatId && {
            activeChat: newChats.length > 0 ? newChats[newChats.length - 1].id : null,
            messages: newChats.length > 0 ? newChats[newChats.length - 1].messages : [],
          }),
        })
      },
      renameChat: (chatId, newTitle) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title: newTitle.trim() } : chat
          ),
        }))
      },
    }),
    {
      name: 'chat-storage', // name of the item in the storage (must be unique)
    }
  )
)
