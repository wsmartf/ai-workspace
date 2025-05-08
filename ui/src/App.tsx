import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './components/ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <>
      <AppProvider>

        <div className="flex h-screen font-sans border-t border-gray-300">
          <ThreadSidebar />
          <div className="flex flex-1">
            <MarkdownEditor />

            <div className="w-px bg-gray-300"/>

            <ChatPanel />
          </div>
        </div>

      </AppProvider>
    </>
  );
}

export default App;
