import { useState, useEffect } from 'react';
import { readTextFile, writeTextFile, BaseDirectory, remove } from '@tauri-apps/plugin-fs';
import { exists } from '@tauri-apps/plugin-fs';
import MemoryPrompt from "./components/MemoryPrompt";
import { ChatMessage } from "./types/Chat";
import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { saveMessagesToDisk, loadMessagesFromDisk, generateThreadId } from './utils/threads';
import { Thread } from './types/Thread';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

function App() {
  const [doc, setDoc] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savingChat, setSavingChat] = useState<ChatMessage | null>(null);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [creatingThread, setCreatingThread] = useState(false);

  useEffect(() => {
    loadThreadsFromDisk().then((loaded) => {
      if (loaded.length > 0) {
        setThreads(loaded);
        setActiveThreadId(loaded[0].id);
      } else {
        createThread();
      }
    });
  }, []);

  async function loadDocument() {
    try {
      const contents = await readTextFile("Documents/Home/ai-workspace/data/document.md", {
        baseDir: BaseDirectory.Home
      });
      setDoc(contents);
    } catch (err) {
      console.error('Error loading doc:', err);
      setDoc(''); // fallback to blank if not found
    }
  }

  async function saveDocument() {
    try {
      await writeTextFile("Documents/Home/ai-workspace/data/document.md", doc, {
        baseDir: BaseDirectory.Home
      });
    } catch (err) {
      console.error('Error saving doc:', err);
    }
  }

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

    setSavingChat(null);
    alert("Saved to memory!");
  }


  function isValidChat(messages: ChatMessage[]): boolean {
    return messages.every((message) => message.role && message.content);
  }

  function sanitizeChat(messages: ChatMessage[]): ChatMessage[] {
    return messages.filter((message) => message.role && message.content);
  }

  async function sendMessage(input: string) {
    if (input.trim() === '') return;

    const isEditCommand = input.trim().startsWith('/edit');
    const newChat = [...messages, { role: "user", content: input }];
    setMessages([...newChat, { role: "assistant", content: "..." }]);

    if (!isValidChat(messages)) {
      console.error('Invalid chat format. Removing invalid messages.');
      setMessages(sanitizeChat(messages));
    }

    const endpoint = isEditCommand ? "/edit" : "/chat";

    try {
      const data = await fetchFromServer(endpoint, newChat, doc);
      if (isEditCommand) {
        handleEditResponse(data, newChat);
      } else {
        handleChatResponse(data, newChat);
      }
    } catch (err) {
      console.error("GPT error", err);
      setMessages([...newChat, { role: "assistant", content: "[error calling GPT]" }]);
    }

    if (activeThreadId) {
      await saveMessagesToDisk(activeThreadId, messages);
    }
  }

  async function fetchFromServer(endpoint: string, messages: ChatMessage[], document: string) {
    const res = await fetch("http://localhost:11434" + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, document }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (!data) throw new Error("No response from server");
    return data;
  }

  function handleEditResponse(data: any, newChat: ChatMessage[]) {
    if (!data.edit_summary || !data.updated_doc) {
      console.error("Invalid edit response");
      return;
    }
    setMessages([...newChat, { role: "assistant", content: data.edit_summary }]);
    setDoc(data.updated_doc);
  }

  function handleChatResponse(data: any, newChat: ChatMessage[]) {
    if (!data.reply) {
      console.error("Invalid chat response");
      return;
    }
    setMessages([...newChat, { role: "assistant", content: data.reply }]);
  }

  function renderChatMessages() {
    return messages.map((m, i) => (
      <div
        key={i}
        className="mb-4 flex items-center border-b border-gray-300 pb-4"
      >
        <div className="flex-1">
          <strong>{m.role}</strong>
          <div className="markdown-body">
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        </div>
        <button onClick={() => setSavingChat(m)}>💾</button>
      </div>
    ));
  }

  async function loadThreadsFromDisk(): Promise<{ id: string; title: string }[]> {
    const path = "Documents/Home/ai-workspace/data/threads.json";
    const fileExists = await exists(path, {
      baseDir: BaseDirectory.Home,
    });
    if (!fileExists) return [];
  
    const raw = await readTextFile(path, { baseDir: BaseDirectory.Home });
    return JSON.parse(raw);
  }

  async function saveThreadsToDisk(threads: { id: string; title: string }[]) {
    await writeTextFile("Documents/Home/ai-workspace/data/threads.json", JSON.stringify(threads, null, 2), {
      baseDir: BaseDirectory.Home,
    });
  }

  async function deleteThread(id: string) {
    const updatedThreads = threads.filter((thread) => thread.id !== id);
    setThreads(updatedThreads);

    try {
      await remove(`Documents/Home/ai-workspace/data/${id}.json`, {
        baseDir: BaseDirectory.Home,
      });
    } catch (err) {
      console.error(`Error deleting thread file for ${id}:`, err);
    }

    if (activeThreadId === id && updatedThreads.length > 0) {
      const firstThread = updatedThreads[0];
      setActiveThreadId(firstThread.id);
      const loadedMessages = await loadMessagesFromDisk(firstThread.id);
      setMessages(loadedMessages);
    }

    await saveThreadsToDisk(updatedThreads);
  }

  async function createThread() {
    if (creatingThread) return;
    setCreatingThread(true);
  
    const threadId = generateThreadId();
    const threadTitle = `New Thread ${threadId.slice(0, 4)}`;
    const newThread: Thread = { id: threadId, title: threadTitle };
    console.log("Creating new thread:", newThread);
  
    setThreads((prevThreads) => {
      const updatedThreads = [...prevThreads, newThread];
      saveThreadsToDisk(updatedThreads);
      return updatedThreads;
    });
  
    setActiveThreadId(newThread.id);
    setMessages([{ role: 'system', content: 'How can I help you think today?' }]);
    setCreatingThread(false);
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onSelect={async (id) => {
            // Save current messages
            if (activeThreadId) await saveMessagesToDisk(activeThreadId, messages);
          
            // Load new thread's messages
            const loaded = await loadMessagesFromDisk(id);
            setMessages(loaded);
            setActiveThreadId(id);
          }}
          onNewThread={async () => {
            if (activeThreadId) await saveMessagesToDisk(activeThreadId, messages);
            createThread();
          }}
          onDelete={deleteThread}
        />
        <MarkdownEditor doc={doc} setDoc={setDoc} loadDocument={loadDocument} saveDocument={saveDocument} />
        <ChatPanel chat={messages} renderChatMessages={renderChatMessages} sendMessage={sendMessage} />
      </div>

      {savingChat && (
        <MemoryPrompt
          message={savingChat}
          onSubmit={saveMemory}
          onCancel={() => setSavingChat(null)}
        />
      )}

    </>

  );
}

export default App;
