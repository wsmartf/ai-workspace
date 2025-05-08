// ThreadSidebar.tsx
import { useState } from "react";
import { useWorkspaceContext } from "../context/WorkspaceProvider";
import ThreadItem from "./ThreadItem";
import { ContextMenu, MenuItem } from "./ContextMenu";
import { Thread } from "../types/Thread";

export default function ThreadSidebar() {
  const {
    state: { threads, currentThreadId },
    switchThread,
    createThread,
    deleteThread,
    updateThreadTitle,
  } = useWorkspaceContext();

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; threadId: number } | null>(null);

  const handleRename = async (id: number, title: string) => {
    updateThreadTitle(id, title);
    setRenamingId(null);
  };

  const handleCreateThread = async () => {
    const newThread: Thread = await createThread();
    setRenamingId(newThread.id);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Rename",
      onClick: () => {
        if (contextMenu) {
          setRenamingId(contextMenu.threadId);
          setContextMenu(null);
        }
      },
    },
  ];

  return (
    <div className="w-64 bg-gray-100 border-r h-full flex flex-col relative">
      <div className="px-4 py-3 font-bold text-gray-800 border-b">Threads</div>
      <div className="flex-1 overflow-auto">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
            isActive={currentThreadId === thread.id}
            isRenaming={renamingId === thread.id}
            onClick={() => switchThread(thread.id)}
            onDelete={() => deleteThread(thread.id)}
            onRename={(title) => handleRename(thread.id, title)}
            onRightClick={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, threadId: thread.id });
            }}
            startRenaming={() => setRenamingId(thread.id)}
            stopRenaming={() => setRenamingId(null)}
          />
        ))}
      </div>
      <div className="p-3 border-t">
        <button
          onClick={handleCreateThread}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
        >
          + New Thread
        </button>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
