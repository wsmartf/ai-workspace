
import { useState } from "react";
import { ChatMessage } from "../types/Chat";

export function useMemory() {
    const [savingChat, setSavingChat] = useState<ChatMessage | null>(null);

    async function saveMemory(title: string, message: ChatMessage) {
        const content = `Role: ${message.role}\nContent: ${message.content}`;
    
        await fetch("http://localhost:11434/memory/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content: content,
            tags: []
          }),
        });
    
        alert("Saved to memory!");
        setSavingChat(null);
      }
    

    return { saveMemory, savingChat, setSavingChat };
}