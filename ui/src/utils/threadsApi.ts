import { Thread, ThreadMessage } from '../types/Thread';
import { SendMessageResponse } from '../types/ThreadMessageResponse';
import { apiFetch } from './api';
import { mapApiResponseToThread, mapApiResponseToDocument } from './mappers.ts';

const DEMO_MODE = true;

export async function getThreadsApi(): Promise<Thread[]> {
    const apiResponse = await apiFetch("/threads");
    return apiResponse.map(mapApiResponseToThread);
}

export async function getThreadApi(id: number): Promise<Thread> {
    const apiResponse = await apiFetch(`/threads/${id}`);
    return mapApiResponseToThread(apiResponse);
}

export async function createThreadApi(title: string): Promise<Thread> {
    const apiResponse = await apiFetch("/threads", { method: "POST", body: { title } });
    return mapApiResponseToThread(apiResponse);
}

export async function deleteThreadApi(id: number): Promise<void> {
    await apiFetch(`/threads/${id}`, { method: "DELETE" });
}

export async function sendThreadMessageApi(
    threadId: number,
    message: string,
    mode: "ask" | "edit"): Promise<SendMessageResponse> {
    var url = `/threads/${threadId}/messages`;
    if (DEMO_MODE) {
        url += "?demo=true";
    }
    const resp = await apiFetch(url,
        {
            method: "POST",
            body: {
                content: message,
                mode: mode
            }
        });
    return {
        thread: mapApiResponseToThread(resp.thread),
        document: mapApiResponseToDocument(resp.document),
    };
}

export async function branchThreadApi(
    parentThreadId: number,
    lastMessageIndex: number,
    title?: string): Promise<Thread> {
    const body: { last_message_index: number; title?: string } = {
        last_message_index: lastMessageIndex,
    };
    if (title) {
        body.title = title;
    }
    const resp = await apiFetch(`/threads/${parentThreadId}/branch`,
        {
            method: "POST",
            body: body,
        });
    return mapApiResponseToThread(resp);
}

export async function updateThreadApi({
    id,
    title,
    messages,
    documentId,
}: {
    id: number;
    title?: string;
    messages?: ThreadMessage[];
    documentId?: number;
}): Promise<Thread> {
    const resp = await apiFetch(`/threads/${id}`, {
        method: "PUT",
        body: {
            title: title,
            messages: messages,
            document_id: documentId,
        },
    });
    return mapApiResponseToThread(resp);
}

export async function updateThreadNodesApi(thread_id: number): Promise<void> {
    await apiFetch(`/threads/${thread_id}/update-node`, {
        method: "POST",
    });
}