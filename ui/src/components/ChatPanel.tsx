import { ChatMessage } from '../types/Chat';
import ReactMarkdown from 'react-markdown';
import { useThreadContext } from '../context/ThreadContext';
import { useResponseHandler } from '../hooks/useResponseHandler';


export function ChatPanel({ setSavingChat }: { setSavingChat: (message: ChatMessage) => void }) {
  const { activeThreadId, threadMessages } = useThreadContext();
  const { sendMessage, loadingResp } = useResponseHandler();

  const messages = activeThreadId ? threadMessages[activeThreadId] || [] : [];

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-auto p-4">
        <ChatMessages messages={messages} setSavingChat={setSavingChat} />
      </div>
      <div className="p-4">
        <ChatInput sendMessage={sendMessage} loading={loadingResp} />
      </div>
    </div>
  );
}

function ChatMessages({
  messages,
  setSavingChat,
}: {
  messages: ChatMessage[];
  setSavingChat: (message: ChatMessage) => void;
}) {
  if (!messages || messages.length === 0) {
    return <div className="text-gray-500">No messages yet.</div>;
  }
  return (
    <>
      {messages.map((m, i) => (
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
      ))}
    </>
  );
}

function ChatInput({ sendMessage, loading }: { sendMessage: (input: string) => Promise<void>; loading: boolean }) {
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
        disabled={loading}
        placeholder="Type a message..."
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
}
