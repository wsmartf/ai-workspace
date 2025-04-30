export interface Document {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    lastModifiedAt: string;
    linkedThreads: number[];
    linkedNodes: number[];
}