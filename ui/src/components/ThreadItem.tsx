import { useState, useRef, useEffect } from "react";
import { Thread } from "../types/Thread";

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  onRightClick: (e: React.MouseEvent) => void;
  isRenaming: boolean;
  startRenaming: () => void;
  stopRenaming: () => void;
}

export default function ThreadItem({
  thread,
  isActive,
  onClick,
  onDelete,
  onRename,
  onRightClick,
  isRenaming,
  startRenaming,
  stopRenaming,
}: ThreadItemProps) {
  const [tempTitle, setTempTitle] = useState(thread.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
    }
  }, [isRenaming]);

  const handleSubmit = () => {
    if (tempTitle.trim()) onRename(tempTitle);
    stopRenaming();
  };

  return (
    <div className="flex items-center" onContextMenu={onRightClick}>
      {isRenaming ? (
        <input
          ref={inputRef}
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") stopRenaming();
          }}
          autoFocus
          className="flex-1 px-4 py-2 border"
        />
      ) : (
        <button
          onClick={onClick}
          className={`flex-1 text-left px-4 py-2 hover:bg-gray-200 ${
            isActive ? "bg-white font-semibold" : ""
          }`}
        >
          {thread.title}
        </button>
      )}
      <button
        onClick={onDelete}
        className="text-gray-400 px-2 hover:text-gray-700"
      >
        x
      </button>
    </div>
  );
}
