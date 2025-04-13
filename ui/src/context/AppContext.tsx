import React, { createContext, useContext } from "react";
import { useDocumentManager } from "../hooks/useDocumentManager";
import { useMemory } from "../hooks/useMemory";
import { useThreadManager } from "../hooks/useThreadManager";

import { ChatMessage } from "../types/Chat";
import { Thread } from "../types/Thread";

interface AppContextType {
  // Document
  doc: string;
  setDoc: (doc: string) => void;
  loadDocument: () => Promise<void>;
  saveDocument: () => Promise<void>;

  // Memory
  saveMemory: () => Promise<void>;
  savingChat: ChatMessage | null;
  setSavingChat: React.Dispatch<React.SetStateAction<ChatMessage | null>>;
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
  cancelSave: () => Promise<void>;

  // Threads
  threads: Thread[];
  activeThreadId: string | null;
  threadMessages: Record<string, ChatMessage[]>;
  createThread: () => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  switchThread: (id: string) => Promise<void>;
  updateMessagesForThread: (threadId: string, messages: ChatMessage[]) => void;
  createBranchThread: (threadId: string, messageIndex: number) => Promise<void>;
  activeMessages: ChatMessage[] | null;
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
