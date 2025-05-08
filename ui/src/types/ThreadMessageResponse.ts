import { Document } from './Document';
import { Thread } from './Thread';

export interface SendMessageResponse {
    thread: Thread;
    document?: Document;
}