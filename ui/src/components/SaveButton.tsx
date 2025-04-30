import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export function SaveButton() {
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
    <div className="relative">
      <button
        onClick={handleSave}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        💾 Save
      </button>
      {showConfirmation && (
        <span className="absolute left-full ml-2 text-green-500 text-sm">
          Saved successfully!
        </span>
      )}
    </div>
  );
}