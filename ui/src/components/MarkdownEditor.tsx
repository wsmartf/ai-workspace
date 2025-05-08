import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';
import { SaveButton } from "../components/SaveButton";
import { useWorkspaceContext } from '../context/WorkspaceProvider';

export function MarkdownEditor() {
  const { state: { document } } = useWorkspaceContext();
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="flex flex-col flex-1">
      <div className="p-2 border-b border-gray-300">
        <EditorToolbar
          isEditMode={isEditMode}
          onToggleEditPreview={() => setIsEditMode(!isEditMode)}
        />
      </div>
      {isEditMode ? <MarkdownTextArea /> : <MarkdownPreviewer doc={document?.content || ''} />}
    </div>
  );
}

function MarkdownTextArea() {
  const {
    state: { document },
    setDocumentContent,
  } = useWorkspaceContext();
  return (
    <textarea
      value={document?.content || ''}
      onChange={(e) => setDocumentContent(e.target.value)}
      placeholder="Write your doc here..."
      className="flex-1 p-4 font-mono border-none outline-none resize-none"
    />
  );
}

export function EditorToolbar({ isEditMode, onToggleEditPreview }: { isEditMode: boolean; onToggleEditPreview: () => void }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    state: { docDirty },
    saveDocument
  } = useWorkspaceContext();

  const handleSave = async () => {
      await saveDocument();
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1000); // Hide after 1 second
  };

  return (
    <div className="flex gap-2 items-center relative">
      {isEditMode && docDirty && <SaveButton onSave={handleSave} />}
      <ToggleEditPreviewButton isEditMode={isEditMode} onToggle={onToggleEditPreview} />
      {showConfirmation && (
        <span className="left-full ml-2 text-green-500 text-sm">
          Saved!
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
