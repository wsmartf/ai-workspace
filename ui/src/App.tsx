import MemoryPrompt from "./components/MemoryPrompt";
import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './components/ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { ThreadProvider } from "./context/ThreadContext";
import { DocumentProvider } from "./context/DocumentContext";
import { MemoryProvider } from "./context/MemoryContext";

function App() {
  return (
    <>
      <DocumentProvider>
        <MemoryProvider>

          <div className="flex h-screen font-sans">
            <ThreadProvider>
              <ThreadSidebar />
              <div className="flex flex-1">
                <MarkdownEditor />
                
                <div className="w-px bg-gray-300"></div> {/* Border */}

                <ChatPanel />
              </div>
            </ThreadProvider>
          </div>

          <MemoryPrompt />
        </MemoryProvider>
      </DocumentProvider>
    </>
  );
}

export default App;
