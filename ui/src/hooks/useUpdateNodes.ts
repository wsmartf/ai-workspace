import { useWorkspaceContext } from '../context/WorkspaceProvider';
import { useState } from 'react';

export const useUpdateNodes = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { updateThreadNodes } = useWorkspaceContext();

  const handleNodeUpdate = async () => {
    setIsUpdating(true);
    setErrorMessage("");
    try {
      await updateThreadNodes();
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update nodes. Try again.");
      setIsUpdating(false);
      setTimeout(() => {
        setErrorMessage(""); // Clear the error message after the delay
      }, 2000);
    }
  };

  return { isUpdating, errorMessage, handleNodeUpdate };
};