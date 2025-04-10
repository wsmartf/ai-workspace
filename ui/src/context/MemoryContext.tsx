import React, { createContext, useContext } from "react";
import { ChatMessage } from "../types/Chat";
import { useMemory } from "../hooks/useMemory";


interface MemoryContextType {
    saveMemory: () => Promise<void>;
    savingChat: ChatMessage | null;
    setSavingChat: React.Dispatch<React.SetStateAction<ChatMessage | null>>;
    title: string | null;
    setTitle: React.Dispatch<React.SetStateAction<string | null>>;
    cancelSave: () => Promise<void>;
}

const MemoryContext = createContext<MemoryContextType | null>(null);

export const MemoryProvider = ({ children }: { children: React.ReactNode }) => {

    const memoryManager = useMemory();
    return (
        <MemoryContext.Provider value={memoryManager}>
            {children}
        </MemoryContext.Provider>
    );
}
export const useMemoryContext = () => {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error('useMemoryContext must be used within a MemoryProvider');
    }
    return context;
}