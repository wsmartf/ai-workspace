import { useState, useEffect } from 'react';
import { Thread } from '../types/Thread';
import { ChatMessage } from '../types/Chat';
import { loadThreadsFromDisk, saveThreadsToDisk, loadMessagesFromDisk, saveMessagesToDisk, generateThreadId, deleteThreadFromDisk } from '../utils/threads';
import log from '../utils/logger';


export function useThreadManager() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [threadMessages, setThreadMessages] = useState<Record<string, ChatMessage[]>>({});

    useEffect(() => {
        async function initializeThreads() {
            log.info('Initializing threads...');

            const loadedThreads = await loadThreadsFromDisk();
            setThreads(loadedThreads);
            log.info(`Loaded ${loadedThreads.length} threads from disk.`);

            if (loadedThreads.length > 0) {

                const messagesMap = await Promise.all(
                    loadedThreads.map(async (thread) => {
                        const messages = await loadMessagesFromDisk(thread.id);
                        return { [thread.id]: messages };
                    })
                );
                setThreadMessages(Object.assign({}, ...messagesMap));

                const firstThread = loadedThreads[0];
                setActiveThreadId(firstThread.id);
                log.info(`Set active thread to ${firstThread.id}.`);
            } else {
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
            log.info(`Created new thread with ID ${threadId}.`);
            return updatedThreads;
        });

        setActiveThreadId(threadId);
        setThreadMessages((prev) => ({
            ...prev,
            [threadId]: [{ role: 'system', content: 'How can I help you think today?' }],
        }));
    };

    const deleteThread = async (id: string) => {
        log.info(`Deleting thread with ID ${id}...`);
        const updatedThreads = threads.filter((thread) => thread.id !== id);
        setThreads(updatedThreads);

        if (activeThreadId === id) {
            if (updatedThreads.length > 0) {
                const firstThread = updatedThreads[0];
                setActiveThreadId(firstThread.id);
                const messages = await loadMessagesFromDisk(firstThread.id);
                setThreadMessages({ [firstThread.id]: messages });
                log.info(`Active thread switched to ${firstThread.id} after deletion.`);
            } else {
                setActiveThreadId(null);
                setThreadMessages({});
                log.info('No threads remaining after deletion.');
            }
        }

        try {
            await deleteThreadFromDisk(id);
            log.info(`Successfully deleted thread file for ${id}.`);
        } catch (err) {
            log.error(`Error deleting thread file for ${id}:`, err);
        }
        saveThreadsToDisk(updatedThreads);
    };

    const switchThread = async (id: string) => {
        log.info(`Switching to thread with ID ${id}...`);
        if (activeThreadId) {
            await saveMessagesToDisk(activeThreadId, threadMessages[activeThreadId] || []);
            log.info(`Saved messages for thread ${activeThreadId}.`);
        }
        setActiveThreadId(id);

        if (!threadMessages[id]) {
            const messages = await loadMessagesFromDisk(id);
            setThreadMessages((prev) => ({ ...prev, [id]: messages }));
            log.info(`Loaded messages for thread ${id}.`);
        }
    };

    const updateMessagesForThread = (threadId: string, messages: ChatMessage[]) => {
        setThreadMessages((prev) => {
            const updatedMessages = { ...prev, [threadId]: [...messages] };
            return updatedMessages;
        });
        log.info(`Updated messages for thread ${threadId}.`);
    };

    const createBranchThread = async (parentThreadId: string, messageIndex: number) => {
        const parentThread = threads.find((thread) => thread.id === parentThreadId);
        if (!parentThread) {
            log.error(`Parent thread with ID ${parentThreadId} not found.`);
            return;
        }
        const newThreadId = generateThreadId();
        const newThread: Thread = { id: newThreadId, title: `Branch of ${parentThread.title}` };
        setThreads((prev) => {
            const updatedThreads = [...prev, newThread];
            saveThreadsToDisk(updatedThreads);
            log.info(`Created new branch thread with ID ${newThreadId}.`);
            return updatedThreads;
        });
        setActiveThreadId(newThreadId);
        const parentMessages = threadMessages[parentThreadId] || [];
        const newMessages = parentMessages.slice(0, messageIndex + 1);
        setThreadMessages((prev) => ({
            ...prev,
            [newThreadId]: newMessages,
        }));
        log.info(`Created branch thread with ID ${newThreadId} from message index ${messageIndex}.`);
        await saveMessagesToDisk(newThreadId, newMessages);
        log.info(`Saved messages for new branch thread ${newThreadId}.`);
        await saveThreadsToDisk(threads);
        log.info(`Saved threads to disk after creating branch thread ${newThreadId}.`);
    };

        return {
            threads,
            activeThreadId,
            threadMessages,
            createThread,
            deleteThread,
            switchThread,
            updateMessagesForThread,
            createBranchThread
        };
    }