import { useState } from 'react';

function App() {
  const [doc, setDoc] = useState('');
  const [chat, setChat] = useState([{ role: 'system', content: 'How can I help you think today?' }]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Markdown editor */}
      <textarea
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
        style={{
          flex: 1,
          padding: '1rem',
          fontFamily: 'monospace',
          border: 'none',
          outline: 'none',
          resize: 'none',
        }}
        placeholder="Write your doc here..."
      />

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
            setChat([...chat, { role: 'user', content: input }, { role: 'assistant', content: '...' }]);
            e.currentTarget.reset();
          }}
          style={{ padding: '1rem', borderTop: '1px solid #ccc' }}
        >
          <input name="msg" placeholder="Type a message..." style={{ width: '100%' }} />
        </form>
      </div>
    </div>
  );
}

export default App;
