import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ui/chat-message"; // Corrected import path if needed
import type { Message } from "@/store/useChatStore"; // Ensure Message type is imported

interface MessageListProps {
  messages: Message[]; // Use the imported Message type
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

interface ExtendedMessageListProps extends MessageListProps {
  chatType?: 'default' | 'smm';
}

export function MessageList({ messages, messagesEndRef, chatType }: ExtendedMessageListProps) {
  return (
    <ScrollArea className="flex-1 mb-[80px]">
      <div className="space-y-4 px-4 pb-4">
        {messages
          .filter(msg => msg.role !== 'system')
          .map((msg, i) => (
            <ChatMessage
              key={`${msg.id || i}`} // Use message id if available, otherwise index
              role={msg.role as "user" | "assistant"} // Assert role type
              content={msg.content}
              timestamp={msg.createdAt ? new Date(msg.createdAt).getTime() : undefined} // Pass timestamp as number
              // isAnalysis={...} // Pass isAnalysis if needed based on msg properties
            />
          ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
