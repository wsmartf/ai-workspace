import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Thread } from '../types/Thread';
import { Document } from '../types/Document';
import {
  getThreadsApi,
  createThreadApi,
  updateThreadApi,
  deleteThreadApi,
  branchThreadApi,
  sendThreadMessageApi,
  updateThreadNodesApi,
} from '../utils/threadsApi';
import {
  getDocumentApi,
  createDocumentApi,
  updateDocumentApi,
} from '../utils/docsApi';
import { ThreadMessage } from '../types/Thread';

// --- State & Actions ---
interface State {
  threads: Thread[];
  currentThreadId: number | null;
  document: Document | null;
  loading: boolean;
  sending: boolean;
  docDirty: boolean;
}

type Action =
  | { type: 'SET_THREADS'; threads: Thread[] }
  | { type: 'SWITCH_THREAD'; threadId: number }
  | { type: 'SET_DOCUMENT'; document: Document | null }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SENDING'; sending: boolean }
  | { type: 'ADD_MESSAGE'; message: ThreadMessage }
  | { type: 'SET_DOC_CONTENT'; content: string }
  | { type: 'SET_DOC_TITLE'; title: string }
  | { type: 'MARK_DOC_DIRTY'; dirty: boolean };

const initialState: State = {
  threads: [],
  currentThreadId: null,
  document: null,
  loading: false,
  sending: false,
  docDirty: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_THREADS':
      return { ...state, threads: action.threads };
    case 'SWITCH_THREAD':
      // prevent clearing on re-click
      if (action.threadId === state.currentThreadId) return state;
      return { ...state, currentThreadId: action.threadId, document: null, docDirty: false };
    case 'SET_DOCUMENT':
      return { ...state, document: action.document };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_DOC_CONTENT':
      if (!state.document) return state;
      return { ...state, document: { ...state.document, content: action.content }, docDirty: true };
    case 'SET_DOC_TITLE':
      if (!state.document) return state;
      return { ...state, document: { ...state.document, title: action.title }, docDirty: true };
    case 'MARK_DOC_DIRTY':
      return { ...state, docDirty: action.dirty };
    case 'SET_SENDING':
      return { ...state, sending: action.sending };
    case 'ADD_MESSAGE':
      if (!state.currentThreadId) return state;
      return {
        ...state,
        threads: state.threads.map(t =>
          t.id === state.currentThreadId
            ? { ...t, messages: [...t.messages, action.message] }
            : t
        ),
      };
    default:
      return state;
  }
}

// --- Context ---
interface WorkspaceContextType {
  state: State;
  currentThread: Thread | null;
  switchThread: (id: number) => void;
  sendChat: (msg: string) => Promise<void>;
  createThread: () => Promise<Thread>;
  deleteThread: (id: number) => Promise<void>;
  updateThreadTitle: (id: number, title: string) => Promise<void>;
  createBranchThread: (msgIndex: number) => Promise<void>;
  updateThreadNodes: () => Promise<void>;
  setDocumentContent: (content: string) => void;
  setDocumentTitle: (title: string) => void;
  saveDocument: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// --- Provider ---
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // compute currentThread for context
  const currentThread = state.threads.find(t => t.id === state.currentThreadId) || null;

  // Fetch threads on mount
  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_LOADING', loading: true });
      const threads = await getThreadsApi();
      dispatch({ type: 'SET_THREADS', threads });
      if (threads.length) dispatch({ type: 'SWITCH_THREAD', threadId: threads[0].id });
      dispatch({ type: 'SET_LOADING', loading: false });
    })();
  }, []);

  // Load or create document when thread changes
  useEffect(() => {
    (async () => {
      const id = state.currentThreadId;
      if (id == null) return;

      // save previous doc if dirty
      if (state.docDirty && state.document) {
        await updateDocumentApi({
          id: state.document.id,
          title: state.document.title,
          content: state.document.content,
        });
        dispatch({ type: 'MARK_DOC_DIRTY', dirty: false });
      }

      const thread = state.threads.find(t => t.id === id);
      if (!thread) return;

      dispatch({ type: 'SET_LOADING', loading: true });

      if (thread.documentId) {
        // load existing document
        const doc = await getDocumentApi(thread.documentId);
        dispatch({ type: 'SET_DOCUMENT', document: doc });
        dispatch({ type: 'MARK_DOC_DIRTY', dirty: false });
      } else {
        // auto-create a new document for this thread
        const newDoc = await createDocumentApi('Untitled', '');
        dispatch({ type: 'SET_DOCUMENT', document: newDoc });
        dispatch({ type: 'MARK_DOC_DIRTY', dirty: false });
        // attach doc to thread
        await updateThreadApi({ id, documentId: newDoc.id });
        // refresh thread list so documentId is updated
        const threads = await getThreadsApi();
        dispatch({ type: 'SET_THREADS', threads });
      }

      dispatch({ type: 'SET_LOADING', loading: false });
    })();
  }, [state.currentThreadId]);

  // Actions
  const switchThread = (id: number) => dispatch({ type: 'SWITCH_THREAD', threadId: id });

  const createThread = async (): Promise<Thread> => {
    dispatch({ type: 'SET_LOADING', loading: true });
    const t = await createThreadApi('New Thread');
    const threads = await getThreadsApi();
    dispatch({ type: 'SET_THREADS', threads });
    dispatch({ type: 'SWITCH_THREAD', threadId: t.id });
    dispatch({ type: 'SET_LOADING', loading: false });
    return t;
  };

  const deleteThread = async (id: number) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    await deleteThreadApi(id);
    const threads = await getThreadsApi();
    dispatch({ type: 'SET_THREADS', threads });
    if (state.currentThreadId === id && threads.length) {
      dispatch({ type: 'SWITCH_THREAD', threadId: threads[0].id });
    }
    dispatch({ type: 'SET_LOADING', loading: false });
  };

  const updateThreadTitle = async (id: number, title: string) => {
    if (!title.trim()) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    await updateThreadApi({ id, title });
    const threads = await getThreadsApi();
    dispatch({ type: 'SET_THREADS', threads });
    dispatch({ type: 'SET_LOADING', loading: false });
  };

  const createBranchThread = async (msgIndex: number) => {
    if (!state.currentThreadId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    const t = await branchThreadApi(state.currentThreadId, msgIndex, 'Branch Thread');
    const threads = await getThreadsApi();
    dispatch({ type: 'SET_THREADS', threads });
    dispatch({ type: 'SWITCH_THREAD', threadId: t.id });
    dispatch({ type: 'SET_LOADING', loading: false });
  };

  const updateThreadNodes = async () => {
    if (!state.currentThreadId) return;
    dispatch({ type: 'SET_LOADING', loading: true });
    await updateThreadNodesApi(state.currentThreadId);
    const threads = await getThreadsApi();
    dispatch({ type: 'SET_THREADS', threads });
    dispatch({ type: 'SET_LOADING', loading: false });
  };

  const sendChat = async (msg: string) => {
    if (!state.currentThreadId) return;

    const now = new Date().toISOString();
    const userMsg: ThreadMessage = { role: 'user', content: msg, createdAt: now };
    const placeholder: ThreadMessage = { role: 'assistant', content: '...', createdAt: now };

    // 1) Optimistic insert
    dispatch({ type: 'ADD_MESSAGE', message: userMsg });
    dispatch({ type: 'ADD_MESSAGE', message: placeholder });

    // 2) Mark sending (separate from loading!)
    dispatch({ type: 'SET_SENDING', sending: true });

    try {
      // 3) Fire API but don’t block UI
      if (msg.startsWith('/edit')) {
        const resp = await sendThreadMessageApi(state.currentThreadId, msg, 'edit');
        if (resp.document?.content) {
          dispatch({ type: 'SET_DOC_CONTENT', content: resp.document.content});
        }
      } else {
        await sendThreadMessageApi(state.currentThreadId, msg, 'ask');
      }

      // 4) Once done, re-fetch the real thread so it replaces the placeholder
      const threads = await getThreadsApi();
      dispatch({ type: 'SET_THREADS', threads });
    } finally {
      dispatch({ type: 'SET_SENDING', sending: false });
    }
  };

  const setDocumentContent = (content: string) => dispatch({ type: 'SET_DOC_CONTENT', content });
  const setDocumentTitle = (title: string) => dispatch({ type: 'SET_DOC_TITLE', title });

  const saveDocument = async () => {
    if (!state.document) return;
    await updateDocumentApi({
      id: state.document.id,
      title: state.document.title,
      content: state.document.content,
    });
    dispatch({ type: 'MARK_DOC_DIRTY', dirty: false });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        currentThread,
        switchThread,
        sendChat,
        createThread,
        deleteThread,
        updateThreadTitle,
        createBranchThread,
        updateThreadNodes,
        setDocumentContent,
        setDocumentTitle,
        saveDocument,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspaceContext must be inside WorkspaceProvider');
  return ctx;
};
