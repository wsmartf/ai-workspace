export function MarkdownEditor({
  doc, setDoc, loadDocument, saveDocument,
}: {
  doc: string;
  setDoc: React.Dispatch<React.SetStateAction<string>>;
  loadDocument: () => Promise<void>;
  saveDocument: () => Promise<void>;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
        <button onClick={loadDocument} style={{ marginRight: '0.5rem' }}>📂 Load</button>
        <button onClick={saveDocument}>💾 Save</button>
      </div>
      <textarea
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
        placeholder="Write your doc here..."
        style={{
          flex: 1,
          padding: '1rem',
          fontFamily: 'monospace',
          border: 'none',
          outline: 'none',
          resize: 'none',
        }} />
    </div>
  );
}
