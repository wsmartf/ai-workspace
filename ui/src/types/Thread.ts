export interface ThreadMessage {
    role: string;
    content: string;
    createdAt: string;
}

export interface Thread {
    id: string;
    title: string;
    messages: ThreadMessage[];
    createdAt: string;
    lastActiveAt: string;
    documentId: string;
}
