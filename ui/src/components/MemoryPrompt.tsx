import { useMemoryContext } from "../context/MemoryContext";

export default function MemoryPrompt() {
  const { savingChat } = useMemoryContext();

  return (
    savingChat && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Save to Memory</h2>
          <MemoryInput />
          <div className="flex justify-end space-x-2">
            <CancelButton />
            <SaveButton />
          </div>
        </div>
      </div>
    )
  );
}

function MemoryInput() {
  const { title, setTitle } = useMemoryContext();

  return (
    <input
      type="text"
      placeholder="Enter a title…"
      value={title || ""}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    />
  )
}

function SaveButton() {
  const { saveMemory, title } = useMemoryContext();
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => {
        if (!title) {
          alert("Please enter a title.");
          return;
        }
        saveMemory();
      }}
    >
      Save
    </button>
  )
}

function CancelButton() {
  const { cancelSave } = useMemoryContext();

  return (
    <button
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      onClick={cancelSave}
    >
      Cancel
    </button>
  )
}
