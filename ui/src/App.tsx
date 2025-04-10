import MemoryPrompt from "./components/MemoryPrompt";
import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './components/ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { ThreadProvider } from "./context/ThreadContext";
import { DocumentProvider } from "./context/DocumentContext";
import { useMemory } from "./hooks/useMemory";

function App() {
  const { saveMemory, savingChat, setSavingChat } = useMemory();

  return (
    <>
      <ThreadProvider>
        <DocumentProvider>
          <div className="flex h-screen font-sans">
            <ThreadSidebar />
            <div className="flex flex-1">
              <MarkdownEditor />
              <div className="w-px bg-gray-300"></div> {/* Border */}
              <ChatPanel />
            </div>
          </div>

          {savingChat && (
            <MemoryPrompt
              message={savingChat}
              onSubmit={saveMemory}
              onCancel={() => setSavingChat(null)}
            />
          )}
        </DocumentProvider>
      </ThreadProvider>
    </>
  );
}

export default App;
