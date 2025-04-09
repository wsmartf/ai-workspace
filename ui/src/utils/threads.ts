import { Thread } from '../types/Thread';
import { ChatMessage } from '../types/Chat';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { exists, remove, BaseDirectory } from '@tauri-apps/plugin-fs';


const THREADS_DIR = "Documents/Home/ai-workspace/data/threads";
const THREADS_FILE = `${THREADS_DIR}/threads.json`;

export async function loadThreadsFromDisk(): Promise<Thread[]> {
  const fileExists = await exists(THREADS_FILE, { baseDir: BaseDirectory.Home });
  if (!fileExists) return [];
  const raw = await readTextFile(THREADS_FILE, { baseDir: BaseDirectory.Home });
  return JSON.parse(raw);
}

export async function saveThreadsToDisk(threads: Thread[]) {
  await writeTextFile(THREADS_FILE, JSON.stringify(threads, null, 2), { baseDir: BaseDirectory.Home });
}

export async function deleteThreadFromDisk(threadId: string) {
  const messagesFilePath = `${THREADS_DIR}/${threadId}.json`;
  const messagesFileExists = await exists(messagesFilePath, { baseDir: BaseDirectory.Home });
  if (messagesFileExists) {
    await remove(messagesFilePath, { baseDir: BaseDirectory.Home });
  }
}

export async function loadMessagesFromDisk(threadId: string): Promise<ChatMessage[]> {
  const path = `${THREADS_DIR}/${threadId}.json`;
  const fileExists = await exists(path, { baseDir: BaseDirectory.Home });
  if (!fileExists) return [];
  const raw = await readTextFile(path, { baseDir: BaseDirectory.Home });
  return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
}

export async function saveMessagesToDisk(threadId: string, messages: ChatMessage[]) {
  const path = `${THREADS_DIR}/${threadId}.json`;
  await writeTextFile(path, JSON.stringify(messages, null, 2), { baseDir: BaseDirectory.Home });
}

export function generateThreadId(): string {
  return Math.random().toString(36).substr(2, 9);
}