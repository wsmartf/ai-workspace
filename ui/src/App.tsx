import { useState } from 'react';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import MemoryPrompt from "./components/MemoryPrompt";
import { ChatMessage } from "./types/Chat";

function App() {
  const [doc, setDoc] = useState<string>('');
  const [chat, setChat] = useState<ChatMessage[]>([{ role: 'system', content: 'How can I help you think today?' }]);
  const [savingChat, setSavingChat] = useState<ChatMessage | null>(null);


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
    const newChat = [...chat, { role: "user", content: input }];
    setChat([...newChat, { role: "assistant", content: "..." }]);

    if (!isValidChat(chat)) {
      console.error('Invalid chat format. Removing invalid messages.');
      setChat(sanitizeChat(chat));
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
      setChat([...newChat, { role: "assistant", content: "[error calling GPT]" }]);
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
    setChat([...newChat, { role: "assistant", content: data.edit_summary }]);
    setDoc(data.updated_doc);
  }

  function handleChatResponse(data: any, newChat: ChatMessage[]) {
    if (!data.reply) {
      console.error("Invalid chat response");
      return;
    }
    setChat([...newChat, { role: "assistant", content: data.reply }]);
  }

  function renderChatMessages() {
    return chat.map((m, i) => (
      <div key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <strong>{m.role}</strong>: {m.content}
        </div>
        <button
          onClick={() => setSavingChat(m)}
        >
          💾
        </button>
      </div>
    ));
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <MarkdownEditor doc={doc} setDoc={setDoc} loadDocument={loadDocument} saveDocument={saveDocument} />
        <ChatPanel chat={chat} renderChatMessages={renderChatMessages} sendMessage={sendMessage} />
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

function MarkdownEditor({
  doc,
  setDoc,
  loadDocument,
  saveDocument,
}: {
  doc: string;
  setDoc: React.Dispatch<React.SetStateAction<string>>;
  loadDocument: () => Promise<void>;
  saveDocument: () => Promise<void>;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
        <button onClick={loadDocument} style={{ marginRight: '0.5rem' }}>📂 Load</button>
        <button onClick={saveDocument}>💾 Save</button>
      </div>
      <textarea
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
        placeholder="Write your doc here..."
        style={{
          flex: 1,
          padding: '1rem',
          fontFamily: 'monospace',
          border: 'none',
          outline: 'none',
          resize: 'none',
        }}
      />
    </div>
  );
}

function ChatPanel({
  renderChatMessages,
  sendMessage,
}: {
  chat: ChatMessage[];
  renderChatMessages: () => JSX.Element[];
  sendMessage: (input: string) => Promise<void>;
}) {
  return (
    <div style={{ flex: 1, borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {renderChatMessages()}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.currentTarget.elements.namedItem('msg') as HTMLInputElement).value;
          if (!input) return;
          sendMessage(input);
          e.currentTarget.reset();
        }}
      >
        <input name="msg" placeholder="Type a message..." style={{ width: '100%', padding: '0.5rem' }} />
      </form>
    </div>
  );
}

export default App;
