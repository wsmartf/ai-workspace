import { Thread } from '../types/Thread';
import { apiFetch } from './api';

export async function getThreadsApi(): Promise<Thread[]> {
    return apiFetch("/threads");
}

export async function getThreadApi(id: string): Promise<Thread> {
    return apiFetch(`/threads/${id}`);
}

export async function createThreadApi(title: string): Promise<Thread> {
    return apiFetch("/threads", { method: "POST", body: { title } });
}

export async function deleteThreadApi(id: string): Promise<void> {
    return apiFetch(`/threads/${id}`, { method: "DELETE" });
}

export async function sendThreadMessageApi(threadId: string, message: string): Promise<Thread> {
    return apiFetch(`/threads/${threadId}/messages`, { method: "POST", body: { content: message } });
}

export async function branchThreadApi(parentThreadId: string, lastMessageIndex: number): Promise<Thread> {
    return apiFetch(`/threads/${parentThreadId}/branch`, { method: "POST", body: { messageIndex: lastMessageIndex } });
}
