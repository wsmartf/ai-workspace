export interface ThreadMessage {
    role: string;
    content: string;
    createdAt: string;
}

export interface Thread {
    id: number;
    title: string;
    messages: ThreadMessage[];
    createdAt: string;
    lastActiveAt: string;
    documentId: string;
    nodes: number;
}
