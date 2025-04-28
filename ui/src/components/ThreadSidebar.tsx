import { useAppContext } from "../context/AppContext";
import { Thread } from "../types/Thread";


export default function ThreadSidebar() {
  const { threadsById, threadOrder, switchToThread, createThread, deleteThread, isActiveThread } = useAppContext();

  return (
    <div className="w-64 bg-gray-100 border-r h-full flex flex-col">
      <div className="px-4 py-3 font-bold text-gray-800 border-b">Threads</div>
      <div className="flex-1 overflow-auto">
        {threadOrder.map((threadId: string) => {
          const thread: Thread = threadsById[threadId];
          return (
            <div key={thread.id} className="flex items-center">
              <button
                onClick={() => switchToThread(thread.id)}
                className={`flex-1 text-left px-4 py-2 hover:bg-gray-200 ${isActiveThread(thread.id) ? "bg-white font-semibold" : ""
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
    </div>
  );
}