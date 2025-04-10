import ReactMarkdown from 'react-markdown';
import { useResponseHandler } from '../hooks/useResponseHandler';
import { useState, useEffect } from 'react';
import { MemoryProvider, useMemoryContext } from '../context/MemoryContext';
import { useThreadContext } from '../context/ThreadContext';

interface ContextMenuProps {
  x: number;
  y: number;
  threadId: string;
  messageIndex: number;
}


export function ChatPanel() {
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-auto p-4">

          <ChatMessages
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
          />

        </div>
        <div className="p-4">
          <ChatInput />
        </div>
      </div>
    </>
  );
}

function ChatMessages({
  contextMenu,
  setContextMenu
}: {
  contextMenu: ContextMenuProps | null;
  setContextMenu: (contextMenu: ContextMenuProps | null) => void;
}) {
  const { setSavingChat } = useMemoryContext();
  const { activeMessages, activeThreadId } = useThreadContext();

  if (!activeMessages || activeMessages.length === 0) {
    return <div className="text-gray-500">No messages yet.</div>;
  }
  return (
    <>
      {activeMessages.map((m, i) => (
        <div
          key={i}
          className="mb-4 flex items-center border-b border-gray-300 pb-4"
        >
          <div className="flex-1">
            <strong>{m.role}</strong>
            <div
              className="markdown-body"
              onContextMenu={(e) => {
                console.log("Context menu triggered");
                e.preventDefault();
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  threadId: activeThreadId || '',
                  messageIndex: i,
                });
              }}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
          <button onClick={() => setSavingChat(m)}>💾</button>
          <ContextMenu
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
          />
        </div>
      ))}
    </>
  );
}

function ChatInput() {
  const { sendMessage, loadingResp } = useResponseHandler();

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
        disabled={loadingResp}
        placeholder="Type a message..."
        className="w-full border rounded px-3 py-2"
      />
    </form>
  );
}


function ContextMenu({
  contextMenu,
  setContextMenu
}: {
  contextMenu: ContextMenuProps | null;
  setContextMenu: (contextMenu: ContextMenuProps | null) => void;
}) {

  const { createBranchThread } = useThreadContext();

  return (
    contextMenu && (
      <ul
        className="absolute bg-white border shadow text-sm z-50"
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={() => setContextMenu(null)}
      >
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            createBranchThread(contextMenu.threadId, contextMenu.messageIndex);
            setContextMenu(null);
          }}
        >
          Branch from here
        </li>
      </ul>
    )
  );
}
