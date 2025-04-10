import React, { createContext, useContext } from "react";
import { Thread } from "../types/Thread";
import { ChatMessage } from "../types/Chat";
import { useThreadManager } from "../hooks/useThreadManager";

interface ThreadContextType {
  threads: Thread[];
  activeThreadId: string | null;
  threadMessages: Record<string, ChatMessage[]>;
  createThread: () => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  switchThread: (id: string) => Promise<void>;
  updateMessagesForThread: (threadId: string, messages: ChatMessage[]) => void;
  createBranchThread: (threadId: string, messageIndex: number) => Promise<void>;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const threadManager = useThreadManager();
  return (
    <ThreadContext.Provider value={threadManager}>
      {children}
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }
  return context;
};