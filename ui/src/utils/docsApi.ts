import { Document } from '../types/Document';
import { apiFetch } from './api';
import { mapApiResponseToDocument } from './mappers.ts';

export async function getDocumentsApi(): Promise<Document[]> {
    const resp = await apiFetch("/documents");
    return resp.map((doc: any) => mapApiResponseToDocument(doc));
}

export async function getDocumentApi(id: number): Promise<Document> {
    const resp = await apiFetch(`/documents/${id}`);
    return mapApiResponseToDocument(resp);
}

export async function createDocumentApi(title: string, content: string, linkedThreads: number[] = [], linkedNodes: number[] = []): Promise<Document> {
    const resp = await apiFetch("/documents", { method: "POST", body: { title, content, linkedThreads, linkedNodes } });
    return mapApiResponseToDocument(resp);
}
export async function updateDocumentApi({
    id,
    title,
    content,
    linkedThreads,
    linkedNodes,
}: {
    id: number;
    title?: string;
    content?: string;
    linkedThreads?: number[];
    linkedNodes?: number[];
}): Promise<Document> {
    const resp = await apiFetch(`/documents/${id}`, {
        method: "PUT",
        body: {
            title: title,
            content: content,
            linked_threads: linkedThreads,
            linked_nodes: linkedNodes,
        },
    });
    return mapApiResponseToDocument(resp);
}

export async function deleteDocumentApi(id: number): Promise<void> {
    await apiFetch(`/documents/${id}`, { method: "DELETE" });
}