import { useThreadContext } from '../context/ThreadContext';

export default function ThreadSidebar() {
  const { threads, activeThreadId, switchThread, createThread, deleteThread } = useThreadContext();

  return (
    <div className="w-64 bg-gray-100 border-r h-full flex flex-col">
      <div className="px-4 py-3 font-bold text-gray-800 border-b">Threads</div>
      <div className="flex-1 overflow-auto">
        {threads.map((thread) => (
          <div key={thread.id} className="flex items-center">
            <button
              onClick={() => switchThread(thread.id)}
              className={`flex-1 text-left px-4 py-2 hover:bg-gray-200 ${thread.id === activeThreadId ? "bg-white font-semibold" : ""
                }`}
            >
              {thread.title}
            </button>
            <button
              onClick={() => deleteThread(thread.id)}
              className="text-red-500 px-2 hover:text-red-700"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <button
          onClick={createThread}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
        >
          + New Thread
        </button>
      </div>
    </div>
  );
}