import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const useUpdateNodes = () => {
    const { updateNodeForCurrentThread } = useAppContext();
    const [isUpdating, setIsUpdating] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleUpdate = async () => {
        setIsUpdating(true);
        setDialogMessage("Updating nodes, please wait...");
        setErrorMessage("");
        try {
            await updateNodeForCurrentThread();
            setDialogMessage("Nodes updated successfully! ✅");
        } catch (error) {
            console.error("Failed to update nodes:", error);
            setErrorMessage("Failed to update nodes. Please try again.");
        } finally {
            setTimeout(() => setIsUpdating(false), 1000);
        }
    };

    return { isUpdating, dialogMessage, errorMessage, handleUpdate };
};