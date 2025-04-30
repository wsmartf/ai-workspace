import { Thread } from '../types/Thread';
import { SendMessageResponse } from '../types/ThreadMessageResponse';
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

export async function sendThreadMessageApi(
    threadId: string,
    message: string,
    mode: "ask" | "edit"): Promise<SendMessageResponse> {
    return apiFetch(`/threads/${threadId}/messages`,
        {
            method: "POST",
            body: {
                content: message,
                mode: mode
            }
        });
}

export async function branchThreadApi(
    parentThreadId: string,
    lastMessageIndex: number,
    title?: string): Promise<Thread> {
    const body: { last_message_index: number; title?: string } = {
        last_message_index: lastMessageIndex,
    };
    if (title) {
        body.title = title;
    }
    return apiFetch(`/threads/${parentThreadId}/branch`,
        {
            method: "POST",
            body: body,
        });
}
