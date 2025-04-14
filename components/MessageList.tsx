// project/components/MessageList.tsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { useChatStore } from "@/store/useChatStore";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const activeChat = useChatStore(state => 
    state.chats.find(chat => chat.id === state.activeChat)
  );

  return (
    <ScrollArea className="flex-1 mb-[80px]"> {/* Added margin-bottom for input */}
      <div className="space-y-4 px-4 pb-4"> {/* Added padding-bottom */}
        {activeChat?.subtitle && (
          <div className="text-sm text-gray-400 mb-2 text-center">
            {activeChat.subtitle}
          </div>
        )}
        {messages.map((msg, i) => (
          // Use message content or index as key, ensure uniqueness
          <ChatMessage key={`${msg.role}-${i}-${msg.content.slice(0, 10)}`} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
