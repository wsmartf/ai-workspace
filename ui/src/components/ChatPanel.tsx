// ChatPanel.tsx
import { useState, useEffect, useRef } from 'react';
import MessageItem from '../components/MessageItem';
import { MenuItem, ContextMenu } from '../components/ContextMenu';
import { useUpdateNodes } from '../hooks/useUpdateNodes';
import { useWorkspaceContext } from '../context/WorkspaceProvider';

export function ChatPanel() {
  return (
    <div className="flex flex-col flex-1">
      <MessageList />
      <ChatInput />
    </div>
  );
}

function MessageList() {
  const { currentThread, createBranchThread } = useWorkspaceContext();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageIndex: number;
  } | null>(null);

  const messages = currentThread?.messages || [];
  const listRef = useRef<HTMLDivElement>(null);

  // auto‑scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-7">
        <div className="text-gray-500">No messages yet.</div>
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Branch from here',
      onClick: () => {
        if (!contextMenu) return;
        createBranchThread(contextMenu.messageIndex);
        setContextMenu(null);
      },
    },
  ];

  return (
    <>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageItem
            key={i}
            message={msg}
            index={i}
            onShowContextMenu={(x, y) => setContextMenu({ x, y, messageIndex: i })}
            isSelected={contextMenu?.messageIndex === i}
          />
        ))}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

function ChatInput() {
  const {
    sendChat,
    state: { sending },
  } = useWorkspaceContext();

  const { isUpdating, errorMessage, handleNodeUpdate } = useUpdateNodes();

  return (
    <div className="p-4 flex items-center border-t">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget; // Store a reference to the form
          const input = (form.elements.namedItem('msg') as HTMLInputElement).value.trim();
          if (!input) return;
          form.reset(); // Use the stored reference
          await sendChat(input);
        }}
        className="flex flex-1"
      >
        <input
          name="msg"
          disabled={sending}
          placeholder={"Type a message..."}
          className={`w-full border rounded-l px-3 py-2 focus:outline-none ${sending ? "bg-gray-200" : ""
            }`}
        />
      </form>

      <button
        onClick={handleNodeUpdate}
        disabled={isUpdating}
        className="ml-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isUpdating ? 'Updating...' : 'Update Nodes'}
      </button>

      {(errorMessage) && (
        <div className="ml-3 text-sm">
          {errorMessage && <span className="text-red-600">{errorMessage}</span>}
        </div>
      )}
    </div>
  );
}
