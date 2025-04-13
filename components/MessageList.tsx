import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ui/chat-message";
import type { Message } from "@/store/useChatStore";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

interface ExtendedMessageListProps extends MessageListProps {
  chatType?: 'default' | 'smm';
}

export function MessageList({ messages, messagesEndRef, chatType }: ExtendedMessageListProps) {
  return (
    <ScrollArea className="flex-1 mb-[80px]">
      <div className="space-y-4 px-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            {/* Убрали иконку */}
            <h3 className="text-lg font-medium text-gray-300 mb-1">Добро пожаловать в Neurobot</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Введите ваш вопрос в поле ниже, чтобы начать общение
            </p>
          </div>
        ) : (
          messages
            .filter(msg => msg.role !== 'system')
            .map((msg, i) => (
              <ChatMessage
                key={`${msg.id || i}`}
                role={msg.role as "user" | "assistant"}
                content={msg.content}
                timestamp={msg.createdAt ? new Date(msg.createdAt).getTime() : undefined}
              />
            ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
