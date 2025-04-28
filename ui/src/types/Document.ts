export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    lastModifiedAt: string;
    linkedThreads: string[];
    linkedNodes: string[];
}