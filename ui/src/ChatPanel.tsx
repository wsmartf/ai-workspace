import { ChatMessage } from './types/Chat';
import ReactMarkdown from 'react-markdown';

export function ChatMessages({
  messages, setSavingChat,
}: {
  messages: ChatMessage[];
  setSavingChat: (message: ChatMessage) => void;
}) {
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

function ChatInput({ sendMessage }: { sendMessage: (input: string) => Promise<void> }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const input = (e.currentTarget.elements.namedItem('msg') as HTMLInputElement).value;
        if (!input) return;
        sendMessage(input);
        e.currentTarget.reset();
      }}
    >
      <input
        name="msg"
        placeholder="Type a message..."
        style={{ width: '100%', padding: '0.5rem' }}
      />
    </form>
  );
}

export function ChatPanel({ chat, sendMessage }: {
  chat: ChatMessage[];
  sendMessage: (input: string) => Promise<void>;
}) {
  return (
    <div style={{ flex: 1, borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <ChatMessages messages={chat} setSavingChat={() => { }} />
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}
