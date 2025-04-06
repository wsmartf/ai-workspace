import { ChatMessage } from './types/Chat';

export function ChatPanel({
  renderChatMessages, sendMessage,
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
