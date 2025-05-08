import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { useAppContext } from '../context/AppContext';
import { SaveButton } from "../components/SaveButton";

export function MarkdownEditor() {
  const { documentContent } = useAppContext();
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="flex flex-col flex-1">
      <div className="p-2 border-b border-gray-300">
        <EditorToolbar
          isEditMode={isEditMode}
          onToggleEditPreview={() => setIsEditMode(!isEditMode)}
        />
      </div>
      {isEditMode ? <MarkdownTextArea /> : <MarkdownPreviewer doc={documentContent || ''} />}
    </div>
  );
}

function MarkdownTextArea() {
  const { documentContent, setDocumentContent } = useAppContext();
  return (
    <textarea
      value={documentContent || ''}
      onChange={(e) => setDocumentContent(e.target.value)}
      placeholder="Write your doc here..."
      className="flex-1 p-4 font-mono border-none outline-none resize-none"
    />
  );
}

export function EditorToolbar({ isEditMode, onToggleEditPreview }: { isEditMode: boolean; onToggleEditPreview: () => void }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { saveDocumentState } = useAppContext();

  const handleSave = async () => {
    try {
      await saveDocumentState();
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1000); // Hide after 1 second
    } catch (error) {
      console.error("Failed to save document:", error);
      alert("Failed to save document. Please try again.");
    }
  };

  return (
    <div className="flex gap-2 items-center relative">
      <SaveButton onSave={handleSave} />
      <ToggleEditPreviewButton isEditMode={isEditMode} onToggle={onToggleEditPreview} />
      {showConfirmation && (
        <span className="left-full ml-2 text-green-500 text-sm">
          Saved successfully!
        </span>
      )}
    </div>
  );
}

function ToggleEditPreviewButton({ isEditMode, onToggle }: { isEditMode: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      {isEditMode ? 'Preview' : 'Edit'}
    </button>
  );
}

export function MarkdownPreviewer({ doc }: { doc: string }) {
  return (
    <div className="markdown-body p-4 bg-gray-50 border-t border-gray-300 flex-1 overflow-auto">
      <ReactMarkdown>{doc}</ReactMarkdown>
    </div>
  );
}
