// import { useState } from 'react';
// import { Thread } from '../types/Thread';
// import log from '../utils/logger';
// import { getThreadsApi, createThreadApi, deleteThreadApi, branchThreadApi, sendThreadMessageApi, updateThreadApi, updateThreadNodesApi } from '../utils/threadsApi';


// export function useThreadManager() {
//     const [threadsById, setThreadsById] = useState<Record<number, Thread>>({});
//     const [threadOrder, setThreadOrder] = useState<number[]>([]);
//     const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
//     const currentThread = activeThreadId ? threadsById[activeThreadId] : null;
//     const [loading, setLoading] = useState<boolean>(false);

//     const createThread = async (title: string = 'New Thread') => {
//         log.info('Creating new thread...');
//         const thread: Thread = await createThreadApi(title);
//         await updateThreads();
//         setActiveThreadId(thread.id);
//         return thread;
//     };

//     const updateThreadDocumentId = async (documentId: number) => {
//         if (!activeThreadId) {
//             log.error('No active thread ID found. Cannot update document ID.');
//             return;
//         }
//         log.info(`Updating thread document ID for thread ID: ${activeThreadId} to document ID: ${documentId}`);
//         await updateThreadApi({ id: activeThreadId, documentId });
//     }

//     const updateThreadTitle = async (threadId: number, newTitle: string) => {
//         if (!newTitle.trim()) return; // Prevent empty titles
//         await updateThreadApi({ id: threadId, title: newTitle });
//         await updateThreads(); // Refresh threads
//     };

//     const updateThreads = async (): Promise<number[]> => {
//         const threadsArray: Thread[] = await getThreadsApi();
//         const idMap = Object.fromEntries(threadsArray.map(thread => [thread.id, thread]));
//         const order = threadsArray.map(thread => thread.id);
//         setThreadsById(idMap);
//         setThreadOrder(order);
//         return order;
//     }

//     const switchToFirstThread = async () => {
//         const updatedThreadOrder = await updateThreads();

//         if (updatedThreadOrder.length > 0) {
//             setActiveThreadId(updatedThreadOrder[0]);
//             log.info(`Switched to first thread: ${updatedThreadOrder[0]}`);
//             return updatedThreadOrder[0];
//         } else {
//             log.warn('No threads available to switch to. Creating a new thread.');
//             await createThread();
//             const newThreadOrder = await updateThreads();
//             setActiveThreadId(newThreadOrder[0]);
//             log.info(`Created and switched to new thread: ${newThreadOrder[0]}`);
//             return newThreadOrder[0];
//         }
//     }

//     const deleteThread = async (id: number) => {
//         await deleteThreadApi(id);
//         await updateThreads();
//         if (activeThreadId === id) {
//             switchToFirstThread();
//         }
//     };

//     const createBranchThread = async (messageIndex: number, title?: string) => {
//         log.info(`Creating branch thread from parent thread ID: ${activeThreadId} at message index: ${messageIndex}`);
//         const thread: Thread = await branchThreadApi(activeThreadId!, messageIndex, title);
//         await updateThreads();
//         setActiveThreadId(thread.id);
//     };
    

//     const switchToThread = async (threadId: number) => {
//         await updateThreads();
//         if (threadOrder.includes(threadId)) {
//             setActiveThreadId(threadId);
//             log.info(`Switched to thread: ${threadId}`);
//         } else {
//             log.warn(`Thread ID ${threadId} not found in thread order.`);
//         }
//     };

//     const sendMessage = async (message: string) => {
//         if (!activeThreadId) {
//             log.error('No active thread ID found. Cannot send message.');
//             return;
//         }
//         setLoading(true);

//         try {

//             let mode: "edit" | "ask";
//             if (message.startsWith('/edit')) {
//                 mode = "edit";
//             } else {
//                 mode = "ask";
//             }

//             // Start the API call immediately
//             const apiCall = sendThreadMessageApi(activeThreadId, message, mode);

//             // Add the user message immediately
//             const tempUserMessage = { role: 'user', content: message, createdAt: new Date().toISOString() };
//             const updatedThreadWithUserMessage: Thread = {
//                 ...threadsById[activeThreadId],
//                 messages: [...threadsById[activeThreadId].messages, tempUserMessage],
//             };
//             setThreadsById({ ...threadsById, [activeThreadId]: updatedThreadWithUserMessage });

//             // Add the temporary agent message after a short delay
//             const delay = new Promise<void>((resolve) => {
//                 setTimeout(() => {
//                     const tempAgentMessage = { role: 'assistant', content: '...', createdAt: new Date().toISOString() };
//                     const updatedThreadWithAgentMessage: Thread = {
//                         ...threadsById[activeThreadId],
//                         messages: [...updatedThreadWithUserMessage.messages, tempAgentMessage],
//                     };
//                     setThreadsById({ ...threadsById, [activeThreadId]: updatedThreadWithAgentMessage });
//                     resolve();
//                 }, 500); // 300ms delay
//             });

//             // Wait for both the API call and the delay to complete
//             await Promise.all([apiCall, delay]);

//             await updateThreads();

//         } catch (error) {
//             log.error('Failed to send message:', error);

//             // Reload the threads.
//             await updateThreads();
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getCurrentThreadDocumentId = () => {
//         if (currentThread) {
//             return currentThread.documentId;
//         } else {
//             log.warn('No active thread found. Cannot get document ID.');
//             return null;
//         }
//     };

//     const getThreadDocumentId = (threadId: number) => {
//         const thread = threadsById[threadId];
//         if (thread) {
//             return thread.documentId;
//         } else {
//             log.warn(`Thread ID ${threadId} not found. Cannot get document ID.`);
//             return null;
//         }
//     };

//     const newThread = async (title: string = 'New Thread') => {
//         log.info('Creating new thread...');
//         const thread: Thread = await createThread(title);
//         await switchToThread(thread.id);
//     }

//     const updateThreadNodes = async () => {
//         if (!activeThreadId) {
//             log.error('No active thread ID found. Cannot update nodes.');
//             return;
//         }
//         log.info(`Updating nodes for thread ID: ${activeThreadId}`);
//         await updateThreadNodesApi(activeThreadId);
//         await updateThreads();
//     }
    

//     return {
//         activeThreadId,
//         threadsById,
//         threadOrder,
//         currentThread,
//         loading,
//         createThread,
//         deleteThread,
//         createBranchThread,
//         switchToThread,
//         switchToFirstThread,
//         sendMessage,
//         updateThreadTitle,
//         updateThreadDocumentId,
//         getThreadDocumentId,
//         getCurrentThreadDocumentId,
//         newThread,
//         updateThreadNodes,
//     };
// }