import { MarkdownEditor } from './components/MarkdownEditor';
import { ChatPanel } from './components/ChatPanel';
import ThreadSidebar from './components/ThreadSidebar';
import { WorkspaceProvider } from './context/WorkspaceProvider';

function App() {
  return (
    <>
      <WorkspaceProvider>

        <div className="flex h-screen font-sans border-t border-gray-300">
          <ThreadSidebar />
          <div className="flex flex-1">
            <MarkdownEditor />

            <div className="w-px bg-gray-300"/>

            <ChatPanel />
          </div>
        </div>

      </WorkspaceProvider>
    </>
  );
}

export default App;
