import React from 'react';
import { ChatMessage } from "../types/Chat";

type Props = {
    message: ChatMessage;
    onSubmit: (title: string, message: ChatMessage) => void;
    onCancel: () => void;
  };

  export default function MemoryPrompt({ message, onSubmit, onCancel }: Props) {
    const [title, setTitle] = React.useState("");
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow w-96">
          <h2 className="text-lg font-semibold mb-2">Save to Memory</h2>
          <p className="text-sm text-gray-600 mb-2">What should this memory be called?</p>
          <input
            className="w-full border p-2 rounded mb-3"
            type="text"
            placeholder="e.g. Project Goal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              onClick={() => {
                if (title.trim()) onSubmit(title.trim(), message);
                else alert("Please enter a title for the memory.");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }