import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ThreadItem from "./ThreadItem";
import { ContextMenu, MenuItem } from "./ContextMenu";
import { Thread } from "../types/Thread";

export default function ThreadSidebar() {
  const {
    threadsById,
    threadOrder,
    switchToThread,
    createThread,
    deleteThread,
    isActiveThread,
    updateThreadTitle,
  } = useAppContext();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; threadId: string } | null>(null);

  const handleRename = async (id: string, title: string) => {
    await updateThreadTitle(id, title);
  };

  const handleCreateThread = async () => {
    const thread: Thread = await createThread();
    setRenamingId(thread.id.toString());
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
        {threadOrder.map((id) => (
          <ThreadItem
            key={id}
            thread={threadsById[id]}
            isActive={isActiveThread(id)}
            isRenaming={renamingId === id}
            onClick={() => switchToThread(id)}
            onDelete={() => deleteThread(id)}
            onRename={(title) => handleRename(id, title)}
            onRightClick={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, threadId: id });
            }}
            startRenaming={() => setRenamingId(id)}
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
