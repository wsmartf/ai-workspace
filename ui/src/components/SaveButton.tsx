export function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <button
      onClick={onSave}
      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      💾 Save
    </button>
  );
}