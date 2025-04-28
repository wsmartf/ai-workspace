import { Document } from '../types/Document';
import { apiFetch } from './api';

export async function getDocumentsApi(): Promise<Document[]> {
    return apiFetch("/documents");
}

export async function getDocumentApi(id: string): Promise<Document> {
    return apiFetch(`/documents/${id}`);
}

export async function createDocumentApi(title: string, content: string, linkedThreads: string[] = [], linkedNodes: string[] = []): Promise<Document> {
    return apiFetch("/documents", { method: "POST", body: { title, content, linkedThreads, linkedNodes } });
}

export async function updateDocumentApi(id: string, content: string = "", title: string = "", linkedThreads: string[] = [], linkedNodes: string[] = []): Promise<Document> {
    return apiFetch(`/documents/${id}`, { method: "PUT", body: { title, content, linkedThreads, linkedNodes } });
}

export async function deleteDocumentApi(id: string): Promise<void> {
    return apiFetch(`/documents/${id}`, { method: "DELETE" });
}