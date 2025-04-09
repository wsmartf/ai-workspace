import React, { createContext, useContext } from "react"
import { useDocumentManager } from "../hooks/useDocumentManager";

interface DocumentContextType {
    doc: string;
    setDoc: (doc: string) => void;
    loadDocument: () => Promise<void>;
    saveDocument: () => Promise<void>;
}
const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider = ({ children }: { children: React.ReactNode }) => {
  const documentManager = useDocumentManager();

  return (
    <DocumentContext.Provider value={documentManager}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocumentContext must be used within a DocumentProvider");
  }
  return context;
};