import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const useUpdateNodes = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { updateThreadNodes } = useAppContext();

    const handleNodeUpdate = async () => {
        setIsUpdating(true);
        setDialogMessage("Updating nodes, please wait...");
        setErrorMessage("");
        try {
            await updateThreadNodes();
            setDialogMessage("Nodes updated successfully! ✅");
        } catch (error) {
            console.error("Failed to update nodes:", error);
            setErrorMessage("Failed to update nodes. Please try again.");
        } finally {
            setTimeout(() => setIsUpdating(false), 1500);
        }
    };

    return { isUpdating, dialogMessage, errorMessage, handleNodeUpdate };
};