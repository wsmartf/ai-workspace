import React from "react";

type Thread = {
  id: string;
  title: string;
};

type Props = {
  threads: Thread[];
  activeThreadId: string | null;
  onSelect: (id: string) => void;
  onNewThread: () => void;
};

export default function ThreadSidebar({
  threads,
  activeThreadId,
  onSelect,
  onNewThread,
}: Props) {
  return (
    <div className="w-64 bg-gray-100 border-r h-full flex flex-col">
      <div className="px-4 py-3 font-bold text-gray-800 border-b">
        Threads
      </div>

      <div className="flex-1 overflow-auto">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${
              thread.id === activeThreadId ? "bg-white font-semibold" : ""
            }`}
          >
            {thread.title}
          </button>
        ))}
      </div>

      <div className="p-3 border-t">
        <button
          onClick={onNewThread}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
        >
          + New Thread
        </button>
      </div>
    </div>
  );
}
