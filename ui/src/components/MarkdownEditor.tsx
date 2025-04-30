import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { useAppContext } from '../context/AppContext';


export function MarkdownEditor() {
  const { currentDocContent } = useAppContext();
  return (
    <div className="flex flex-col flex-1">
      <EditorToolbar />
      <MarkdownTextArea />
      <MarkdownPreviewer doc={currentDocContent || ''} />
    </div>
  );
}


function MarkdownTextArea() {
  const { currentDocContent, setCurrentDocContent } = useAppContext();
  return (
    <textarea
      value={currentDocContent || ''}
      onChange={(e) => setCurrentDocContent(e.target.value)}
      placeholder="Write your doc here..."
      className="flex-1 p-4 font-mono border-none outline-none resize-none"
    />
  );
}

function EditorToolbar() {
  const { saveDocument } = useAppContext();

  return (
    <div className="p-2 border-b border-gray-300 flex gap-2">
      <button onClick={saveDocument} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">💾 Save</button>
    </div>
  );
}

export function MarkdownPreviewer({ doc }: { doc: string }) {
  return (
    <div className="markdown-body p-4 bg-gray-100 border-t border-gray-300 flex-1 overflow-auto">
      <ReactMarkdown>{doc}</ReactMarkdown>
    </div>
  );
}
