import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Thread } from "../types/Thread";
import { ContextMenu, MenuItem } from "./ContextMenu";

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

  const [renamingThreadId, setRenamingThreadId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; threadId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, threadId });
  };

  const handleRename = (threadId: string) => {
    setRenamingThreadId(threadId);
    setTempTitle(threadsById[threadId].title);
    setContextMenu(null);
  };

  const handleRenameSubmit = async (threadId: string) => {
    if (tempTitle.trim()) {
      await updateThreadTitle(threadId, tempTitle);
    }
    setRenamingThreadId(null);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Rename",
      onClick: () => contextMenu && handleRename(contextMenu.threadId),
    },
  ];

  return (
    <div className="w-64 bg-gray-100 border-r h-full flex flex-col">
      <div className="px-4 py-3 font-bold text-gray-800 border-b">Threads</div>
      <div className="flex-1 overflow-auto">
        {threadOrder.map((threadId: string) => {
          const thread: Thread = threadsById[threadId];
          const isRenaming = renamingThreadId === threadId;

          return (
            <div
              key={thread.id}
              className="flex items-center"
              onContextMenu={(e) => handleContextMenu(e, thread.id)}
            >
              {isRenaming ? (
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => handleRenameSubmit(thread.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(thread.id);
                    if (e.key === "Escape") setRenamingThreadId(null);
                  }}
                  className="flex-1 px-4 py-2 border"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => switchToThread(thread.id)}
                  className={`flex-1 text-left px-4 py-2 hover:bg-gray-200 ${
                    isActiveThread(thread.id) ? "bg-white font-semibold" : ""
                  }`}
                >
                  {thread.title}
                </button>
              )}
              <button
                onClick={() => deleteThread(thread.id)}
                className="text-red-500 px-2 hover:text-red-700"
              >
                x
              </button>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t">
        <button
          onClick={() => createThread()}
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