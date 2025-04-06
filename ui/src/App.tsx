import { useState } from 'react';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

function App() {
  const [doc, setDoc] = useState('');
  const [chat, setChat] = useState([{ role: 'system', content: 'How can I help you think today?' }]);


  async function loadDocument() {
    try {
      console.log('Doc contents:', doc);
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
    console.log('Doc contents:', doc);
    await writeTextFile("Documents/Home/ai-workspace/data/document.md", doc, {
      baseDir: BaseDirectory.Home
    });
  }


  async function sendMessage(input: string) {
    const newChat = [...chat, { role: "user", content: input }];
    setChat([...newChat, { role: "assistant", content: "..." }]);

    console.log("Sending message to GPT:", input);
    console.log("Document contents:", doc);
    console.log("Chat history:", newChat);
    console.log("Body:", JSON.stringify(
      {
        messages: newChat,
        document: doc,
      })
    )

    try {
      const res = await fetch("http://localhost:11434/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            messages: newChat,
            document: doc,
          }),
      });

      const data = await res.json();
      setChat([...newChat, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("GPT error", err);
      setChat([...newChat, { role: "assistant", content: "[error calling GPT]" }]);
    }
  }


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Markdown editor + controls */}
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

      {/* Chat panel */}
      <div style={{ flex: 1, borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {chat.map((m, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <strong>{m.role}</strong>: {m.content}
            </div>
          ))}
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
          <input name="msg" placeholder="Type a message..." style={{ width: '100%' }} />
        </form>
      </div>
    </div>
  );
}

export default App;
