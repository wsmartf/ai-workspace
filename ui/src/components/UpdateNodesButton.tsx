import React from 'react';
import { useUpdateNodes } from '../hooks/useUpdateNodes';

export const UpdateNodesButton: React.FC = () => {
    const { isUpdating, dialogMessage, errorMessage, handleNodeUpdate } = useUpdateNodes();

    return (
        <div className="relative">
            <button
                onClick={handleNodeUpdate}
                className="px-3 py-2 border bg-gray-200 rounded-r hover:bg-gray-300"
                disabled={isUpdating}
            >
                ❇️
            </button>
            {isUpdating && <LoadingOverlay message={dialogMessage} />}
            {errorMessage && <ErrorBanner message={errorMessage} />}
        </div>
    );
};

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-lg">
            <p>{message}</p>
        </div>
    </div>
);

const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
        {message}
    </div>
);