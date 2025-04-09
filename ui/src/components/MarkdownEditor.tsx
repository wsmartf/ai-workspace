import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { useDocumentContext } from '../context/DocumentContext';

function MarkdownTextArea() {
  const { doc, setDoc } = useDocumentContext();
  return (
    <textarea
      value={doc}
      onChange={(e) => setDoc(e.target.value)}
      placeholder="Write your doc here..."
      className="flex-1 p-4 font-mono border-none outline-none resize-none"
    />
  );
}

function EditorToolbar() {
  const { loadDocument, saveDocument } = useDocumentContext();

  return (
    <div className="p-2 border-b border-gray-300 flex gap-2">
      <button onClick={loadDocument} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">📂 Load</button>
      <button onClick={saveDocument} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">💾 Save</button>
    </div>
  );
}

export function MarkdownPreviewer() {
  const { doc } = useDocumentContext();
  return (
    <div className="markdown-body p-4 bg-gray-100 border-t border-gray-300 flex-1 overflow-auto">
      <ReactMarkdown>{doc}</ReactMarkdown>
    </div>
  );
}

export function MarkdownEditor() {
  return (
    <div className="flex flex-col flex-1">
      <EditorToolbar />
      <MarkdownTextArea />
      <MarkdownPreviewer />
    </div>
  );
}
