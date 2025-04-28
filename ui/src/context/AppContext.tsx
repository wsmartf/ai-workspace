import React, { createContext, useContext } from "react";
import { useDocumentManager } from "../hooks/useDocumentManager";
import { useMemory } from "../hooks/useMemory";
import { useThreadManager } from "../hooks/useThreadManager";
import { Thread, ThreadMessage } from "../types/Thread";

interface AppContextType {
  // Document
  currentDocContent: string | null;
  setCurrentDocContent: React.Dispatch<React.SetStateAction<string | null>>;
  saveDocumentState: () => Promise<void>;

  // Memory
  saveMemory: () => Promise<void>;
  savingChat: ThreadMessage | null;
  setSavingChat: React.Dispatch<React.SetStateAction<ThreadMessage | null>>;
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
  cancelSave: () => Promise<void>;

  // Threads
  currentThread: Thread | null;
  loading: boolean;
  threadsById: Record<string, Thread>;
  threadOrder: string[];
  createThread: (title?: string) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  createBranchThread: (messageIndex: number) => Promise<void>;
  switchToThread: (id: string) => void;
  switchToFirstThread: () => void;
  sendMessage: (message: string) => Promise<void>;
  isActiveThread: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const document = useDocumentManager();
  const memory = useMemory();
  const threads = useThreadManager();

  const value: AppContextType = {
    ...document,
    ...memory,
    ...threads,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
