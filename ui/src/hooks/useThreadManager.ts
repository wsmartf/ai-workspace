import { useState, useEffect } from 'react';
import { Thread } from '../types/Thread';
import { ChatMessage } from '../types/Chat';
import { loadThreadsFromDisk, saveThreadsToDisk, loadMessagesFromDisk, saveMessagesToDisk, generateThreadId, deleteThreadFromDisk } from '../utils/threads';

export function useThreadManager() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [threadMessages, setThreadMessages] = useState<Record<string, ChatMessage[]>>({});

    useEffect(() => {
        async function initializeThreads() {
            const loadedThreads = await loadThreadsFromDisk();
            setThreads(loadedThreads); 

            if (loadedThreads.length > 0) {
                // First, load the messages for all threads into the state
                for (const thread of loadedThreads) {
                    console.log(`Loading messages for thread ${thread.id} into state....`);
                    const messages = await loadMessagesFromDisk(thread.id);
                    console.log(`Loaded ${messages.length} messages for thread ${thread.id}`);
                    setThreadMessages((prev) => ({ ...prev, [thread.id]: messages }));
                }

                // Set the first thread as active
                const firstThread = loadedThreads[0];
                setActiveThreadId(firstThread.id);
                const messages = await loadMessagesFromDisk(firstThread.id);
                setThreadMessages({ [firstThread.id]: messages });
            } else {
                console.log("No threads found, creating a new one..."); 
                createThread();
            }
        }
        initializeThreads();
    }, []);

    const createThread = async () => {
        const threadId = generateThreadId();
        const newThread: Thread = { id: threadId, title: `New Thread ${threadId.slice(0, 4)}` };

        setThreads((prev) => {
            const updatedThreads = [...prev, newThread];
            saveThreadsToDisk(updatedThreads);
            return updatedThreads;
        });

        setActiveThreadId(threadId);
        setThreadMessages((prev) => ({
            ...prev,
            [threadId]: [{ role: 'system', content: 'How can I help you think today?' }],
        }));
    };

    const deleteThread = async (id: string) => {
        const updatedThreads = threads.filter((thread) => thread.id !== id);
        setThreads(updatedThreads);

        if (activeThreadId === id) {
            const firstThread = updatedThreads[0];
            if (firstThread) {
                setActiveThreadId(firstThread.id);
                const messages = await loadMessagesFromDisk(firstThread.id);
                setThreadMessages({ [firstThread.id]: messages });
            } else {
                setActiveThreadId(null);
                setThreadMessages({});
            }
        }

        deleteThreadFromDisk(id).catch((err) => {
            console.error(`Error deleting thread file for ${id}:`, err);
        });
        saveThreadsToDisk(updatedThreads);
    };

    const switchThread = async (id: string) => {
        if (activeThreadId) {
            await saveMessagesToDisk(activeThreadId, threadMessages[activeThreadId] || []);
        }
        setActiveThreadId(id);

        if (!threadMessages[id]) {
            const messages = await loadMessagesFromDisk(id);
            setThreadMessages((prev) => ({ ...prev, [id]: messages }));
        }
    };

    const updateMessagesForThread = (threadId: string, messages: ChatMessage[]) => {
        setThreadMessages((prev) => ({
            ...prev,
            [threadId]: messages,
        }));
    };

    return {
        threads,
        activeThreadId,
        threadMessages,
        createThread,
        deleteThread,
        switchThread,
        updateMessagesForThread
    };
}