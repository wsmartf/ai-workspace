import { Document } from '../types/Document';
import { Thread } from '../types/Thread';

export function mapApiResponseToDocument(apiResponse: any): Document {
    return {
        id: apiResponse.id,
        title: apiResponse.title,
        content: apiResponse.content,
        createdAt: apiResponse.created_at, // Map snake_case to camelCase
        lastModifiedAt: apiResponse.last_modified_at,
        linkedThreads: apiResponse.linked_threads || [], // Default to empty array if undefined
        linkedNodes: apiResponse.linked_nodes || [], // Default to empty array if undefined
    };
}

export function mapApiResponseToThread(apiResponse: any): Thread {
    return {
        id: apiResponse.id,
        title: apiResponse.title,
        messages: apiResponse.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at, // Map snake_case to camelCase
        })),
        createdAt: apiResponse.created_at,
        lastActiveAt: apiResponse.last_active_at,
        documentId: apiResponse.document_id || null, // Default to null if undefined
    };
}