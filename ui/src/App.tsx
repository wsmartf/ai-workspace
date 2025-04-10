import MemoryPrompt from "./components/MemoryPrompt";
import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './components/ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <>
      <AppProvider>

        <div className="flex h-screen font-sans">
          <ThreadSidebar />
          <div className="flex flex-1">
            <MarkdownEditor />

            <div className="w-px bg-gray-300"></div> {/* Border */}

            <ChatPanel />
          </div>
        </div>

        <MemoryPrompt />

      </AppProvider>
    </>
  );
}

export default App;
