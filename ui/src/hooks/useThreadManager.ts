import { useState, useEffect } from 'react';
import { Thread } from '../types/Thread';
import log from '../utils/logger';
import { getThreadsApi, createThreadApi, deleteThreadApi, branchThreadApi, sendThreadMessageApi, updateThreadApi } from '../utils/threadsApi';
import { useDocumentManager } from './useDocumentManager';


export function useThreadManager() {
    const [threadsById, setThreadsById] = useState<Record<string, Thread>>({});
    const [threadOrder, setThreadOrder] = useState<string[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const currentThread = activeThreadId ? threadsById[activeThreadId] : null;
    const [loading, setLoading] = useState<boolean>(false);

    const { saveDocumentState, currentDocContent, setCurrentDocContent, updateDocs, activeDocId } = useDocumentManager();

    useEffect(() => {
        async function initializeThreads() {
            log.info('Initializing threads...');
            await switchToFirstThread();
        }
        initializeThreads();
    }, []);

    const createThread = async (title: string = 'New Thread') => {
        log.info('Creating new thread...');
        const thread: Thread = await createThreadApi(title);
        await updateThreads();
        setActiveThreadId(thread.id);
        
    };

    const saveDocument = async () => {
        if (currentDocContent && activeThreadId) {
            log.info(`Saving document state for thread ID: ${activeThreadId}`);
            await saveDocumentState();
            await updateThreadDocumentId(activeThreadId, activeDocId!);
        } else {
            log.warn('No document content to save or no active thread.');
        }
    }

    const updateThreadDocumentId = async (threadId: string, documentId: number) => {
        log.info(`Updating thread document ID for thread ID: ${threadId} to document ID: ${documentId}`);
        const thread = threadsById[threadId];
        if (thread) {
            await updateThreadApi({
                id: threadId, 
                documentId: documentId
            });
        } else {
            throw new Error(`Thread with ID ${threadId} not found.`);
        }
    }

    const updateThreads = async (): Promise<string[]> => {
        const threadsArray: Thread[] = await getThreadsApi();
        const idMap = Object.fromEntries(threadsArray.map(thread => [thread.id, thread]));
        const order = threadsArray.map(thread => thread.id);
        setThreadsById(idMap);
        setThreadOrder(order);
        return order;
    }

    const switchToFirstThread = async () => {
        const updatedThreadOrder = await updateThreads();

        if (updatedThreadOrder.length > 0) {
            setActiveThreadId(updatedThreadOrder[0]);
            log.info(`Switched to first thread: ${updatedThreadOrder[0]}`);
        } else {
            log.warn('No threads available to switch to. Creating a new thread.');
            await createThread();
        }
    }

    const deleteThread = async (id: string) => {
        await deleteThreadApi(id);
        await updateThreads();
        if (id === activeThreadId) {
            switchToFirstThread();
        }
    };

    const createBranchThread = async (messageIndex: number, title?: string) => {
        log.info(`Creating branch thread from parent thread ID: ${activeThreadId} at message index: ${messageIndex}`);
        
        // First save the current document state
        await saveDocument();

        const thread: Thread = await branchThreadApi(activeThreadId!, messageIndex, title);
        await updateThreads();
        setActiveThreadId(thread.id);
    };

    const switchToThread = async (threadId: string) => {
        await updateThreads();
        if (threadOrder.includes(threadId)) {
            setActiveThreadId(threadId);
            log.info(`Switched to thread: ${threadId}`);
        } else {
            log.warn(`Thread ID ${threadId} not found in thread order.`);
        }
    };
    
    const sendMessage = async (message: string) => {
        if (!activeThreadId) {
            log.error('No active thread ID found. Cannot send message.');
            return;
        }
        setLoading(true);

        try {
            await saveDocument();

            
            let mode: "edit" | "ask";
            if (message.startsWith('/edit')) {
                mode = "edit";
            } else {
                mode = "ask";
            }

            // Start the API call immediately
            const apiCall = sendThreadMessageApi(activeThreadId, message, mode);

            // Add the user message immediately
            const tempUserMessage = { role: 'user', content: message, createdAt: new Date().toISOString() };
            const updatedThreadWithUserMessage: Thread = {
                ...threadsById[activeThreadId],
                messages: [...threadsById[activeThreadId].messages, tempUserMessage],
            };
            setThreadsById({ ...threadsById, [activeThreadId]: updatedThreadWithUserMessage });

            // Add the temporary agent message after a short delay
            const delay = new Promise<void>((resolve) => {
                setTimeout(() => {
                    const tempAgentMessage = { role: 'assistant', content: '...', createdAt: new Date().toISOString() };
                    const updatedThreadWithAgentMessage: Thread = {
                        ...threadsById[activeThreadId],
                        messages: [...updatedThreadWithUserMessage.messages, tempAgentMessage],
                    };
                    setThreadsById({ ...threadsById, [activeThreadId]: updatedThreadWithAgentMessage });
                    resolve();
                }, 500); // 300ms delay
            });

            // Wait for both the API call and the delay to complete
            await Promise.all([apiCall, delay]);

            await updateThreads();
            

            // Update the document with the response, if it was an edit
            if (mode === "edit") {
                await updateDocs(); // TODO: This updates all documents. We should only update the one that was edited.
            }
        } catch (error) {
            log.error('Failed to send message:', error);

            // Reload the threads.
            await updateThreads();
        } finally {
            setLoading(false);
        }
    };

    const isActiveThread = (threadId: string) => {
        return threadId === activeThreadId;
    };

    return {
        threadsById,
        threadOrder,
        currentThread,
        loading,
        createThread,
        deleteThread,
        createBranchThread,
        switchToThread,
        switchToFirstThread,
        sendMessage,
        isActiveThread,
        saveDocument,
        setCurrentDocContent,
        currentDocContent,
    };
}