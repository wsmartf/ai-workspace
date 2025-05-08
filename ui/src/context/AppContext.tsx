import React, { createContext, useContext, useEffect } from "react";
import { Thread } from "../types/Thread";
import { Document } from "../types/Document";
import log from "../utils/logger";
import { useWorkspace } from "../hooks/useWorkspace";

interface AppContextType {

  currentThread: Thread | null;
  loading: boolean;
  threadsById: Record<number, Thread>;
  threadOrder: number[];
  createThread: (title?: string) => Promise<Thread>;
  deleteThread: (id: number) => Promise<void>;
  createBranchThread: (messageIndex: number) => Promise<void>;
  switchToFirstThread: () => Promise<number>;
  switchToThread: (id: number) => Promise<void>;
  activeThreadId: number | null;
  updateThreadTitle: (id: number, title: string) => Promise<void>;
  updateThreadNodes: () => Promise<void>;

  // Document
  documentId: number | null;
  documentTitle: string | null;
  documentContent: string | null;
  setDocumentId: (id: number) => void;
  setDocumentTitle: (title: string) => void;
  setDocumentContent: (content: string) => void;
  loadDocument: (id: number) => Promise<Document>;
  reloadDocument: () => Promise<Document | null>;
  createDocument: (title: string, content: string) => Promise<Document>;
  updateDocumentTitle: (title: string) => Promise<void>;
  updateDocumentContent: (content: string) => Promise<void>;
  getDocuments: () => Promise<Document[]>;

  // Global state
  sendChatMessage: (message: string) => Promise<void>;
  saveDocumentState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const workspace = useWorkspace();

  useEffect(() => {
    async function init() {
      log.info("Initializing AppContext...");
      await workspace.switchToFirstThread();
    }
    init();
  }
    , []);

  const value: AppContextType = {
    ...workspace,
    ...workspace.docs
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
