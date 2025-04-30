import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import MessageItem from '../components/MessageItem';
import { MenuItem, ContextMenu } from '../components/ContextMenu';



export function ChatPanel() {
  return (
    <>
      <div className="flex flex-col flex-1">
        <MessageList/>
        <ChatInput/>
      </div>
    </>
  );
}

function MessageList() {
  // Handle messages
  const { currentThread, setSavingChat, createBranchThread } = useAppContext();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageIndex: number } | null>(null);
  const messages = currentThread?.messages || [];

  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);


  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-7 ">
        <div className="text-gray-500">No messages yet.</div>
      </div>
    );
  }

  // Handle context menu
  const handleContextMenu = (x: number, y: number, index: number) => {
    setContextMenu({ x, y, messageIndex: index });
  };

  const menuItems: MenuItem[] = [
    {
      label: "Branch from here",
      onClick: () => {
        if (contextMenu) {
          createBranchThread(contextMenu.messageIndex);
          setContextMenu(null);
        }
      },
    },
    {
      label: "Save to memory",
      onClick: () => {
        if (contextMenu) {
          setSavingChat(messages[contextMenu.messageIndex]);
          setContextMenu(null);
        }
      },
    },
    // {
    //   label: "Copy",
    //   onClick: () => {
    //     if (contextMenu) {
    //       navigator.clipboard.writeText(activeMessages[contextMenu.messageIndex].content);
    //       setContextMenu(null);
    //     }
    //   },
    // }
  ];

  return (
    <>
      <div ref={messageListRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            message={message}
            index={index}
            onShowContextMenu={handleContextMenu}
            isSelected={contextMenu?.messageIndex === index}
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
  const { sendMessage, loading } = useAppContext();

  return (
    <div className="p-4">
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
    </div>
  );
}
