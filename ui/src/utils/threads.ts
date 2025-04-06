import { BaseDirectory, writeTextFile, readTextFile, exists } from "@tauri-apps/plugin-fs";
import { ChatMessage } from "../types/Chat";

export async function saveMessagesToDisk(threadId: string, messages: ChatMessage[]) {
    const path = `Documents/Home/ai-workspace/data/${threadId}.json`;
    await writeTextFile(path, JSON.stringify({ id: threadId, messages }, null, 2), {
      baseDir: BaseDirectory.Home,
    });
  }
  
  export async function loadMessagesFromDisk(threadId: string): Promise<ChatMessage[]> {
    const path = `Documents/Home/ai-workspace/data/${threadId}.json`;
    const fileExists = await exists(path, { baseDir: BaseDirectory.Home });
    if (!fileExists) return [];
  
    const raw = await readTextFile(path, { baseDir: BaseDirectory.Home });
    return JSON.parse(raw).messages || [];
  }