
import { useState } from "react";
import { ChatMessage } from "../types/Chat";

export function useMemory() {
  const [savingChat, setSavingChat] = useState<ChatMessage | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  async function saveMemory() {
    if (!savingChat) return;
    const content = `Role: ${savingChat.role}\nContent: ${savingChat.content}`;

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
    setTitle(null);
    setSavingChat(null);
  }

  async function cancelSave() {
    setTitle(null);
    setSavingChat(null);
  }


  return { saveMemory, savingChat, setSavingChat, title, setTitle, cancelSave };
}