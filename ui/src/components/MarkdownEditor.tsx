import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { useAppContext } from '../context/AppContext';

export function MarkdownEditor() {
  const { currentDocContent } = useAppContext();
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="flex flex-col flex-1">
      <div className="p-2 border-b border-gray-300">
        <EditorToolbar
          isEditMode={isEditMode}
          onToggleEditPreview={() => setIsEditMode(!isEditMode)}
        />
      </div>
      {isEditMode ? <MarkdownTextArea /> : <MarkdownPreviewer doc={currentDocContent || ''} />}
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

function EditorToolbar({ isEditMode, onToggleEditPreview }: { isEditMode: boolean; onToggleEditPreview: () => void }) {
  const { saveDocument } = useAppContext();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = async () => {
    try {
      await saveDocument(); // Wait for saveDocument to complete
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1000); // Hide after 1 second
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document. Please try again.");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button onClick={handleSave} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">💾 Save</button>
      <ToggleEditPreviewButton isEditMode={isEditMode} onToggle={onToggleEditPreview} />
      {showConfirmation && <span className="text-green-500 text-sm">Saved successfully!</span>}
    </div>
  );
}

function ToggleEditPreviewButton({ isEditMode, onToggle }: { isEditMode: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      {isEditMode ? 'Preview' : 'Edit'}
    </button>
  );
}

export function MarkdownPreviewer({ doc }: { doc: string }) {
  return (
    <div className="markdown-body p-4 bg-gray-100 border-t border-gray-300 flex-1 overflow-auto">
      <ReactMarkdown>{doc}</ReactMarkdown>
    </div>
  );
}
