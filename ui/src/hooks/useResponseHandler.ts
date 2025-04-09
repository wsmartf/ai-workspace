
import { useState } from "react";
import { ChatMessage } from "../types/Chat";
import { fetchFromServer } from "../utils/server";
import { saveMessagesToDisk } from "../utils/threads";
import { useThreadContext } from "../context/ThreadContext";
import { useDocumentContext } from "../context/DocumentContext";


export function useResponseHandler() {
    const [loadingResp, setLoadingResp] = useState(false);
    const { activeThreadId, threadMessages, updateMessagesForThread } = useThreadContext();
    const { doc, setDoc } = useDocumentContext();

    function isValidChat(messages: ChatMessage[]): boolean {
        return messages.every((message) => message.role && message.content);
    }
    
    function sanitizeChat(messages: ChatMessage[]): ChatMessage[] {
        return messages.filter((message) => message.role && message.content);
    }
    
    async function sendMessage(input: string) {
        if (!input.trim() || !activeThreadId) return;
    
        setLoadingResp(true);
    
        const isEditCommand = input.trim().startsWith('/edit');
        const currentMessages = threadMessages[activeThreadId] || [];
        var newChat = [...currentMessages, { role: "user", content: input }];
        var newChatWaiting = [...newChat, { role: "assistant", content: "..." }];
        updateMessagesForThread(activeThreadId, newChatWaiting);
    
        if (!isValidChat(newChat)) {
            console.error('Invalid chat format. Removing invalid messages.');
            newChat = sanitizeChat(newChat);
            updateMessagesForThread(activeThreadId, newChat);
            await saveMessagesToDisk(activeThreadId, newChat);
            return;
        }
    
        const endpoint = isEditCommand ? "/edit" : "/chat";
        const body = {
            messages: newChat,
            document: doc,
        };
    
        try {
            console.log("Sending request to server:", endpoint, body);
            const data = await fetchFromServer(endpoint, body);
    
            if (isEditCommand) {
                if (!data.edit_summary || !data.updated_doc) {
                    console.error("Invalid edit response");
                    return;
                }
                const chatWithResponse = [
                    ...newChat,
                    { role: "assistant", content: data.edit_summary },
                ];
                updateMessagesForThread(activeThreadId!, chatWithResponse);
                setDoc(data.updated_doc);
                await saveMessagesToDisk(activeThreadId, chatWithResponse);
    
            } else {
                if (!data.reply) {
                    console.error("Invalid chat response");
                    return;
                }
                const chatWithResponse = [
                    ...newChat,
                    { role: "assistant", content: data.reply },
                ];
                updateMessagesForThread(activeThreadId!, chatWithResponse);
                await saveMessagesToDisk(activeThreadId, chatWithResponse);
            }
    
        } catch (err) {
            console.error("GPT error", err);
            const chatWithResponse = [
                ...newChat,
                { role: "assistant", content: "[error calling GPT]" },
            ];
            updateMessagesForThread(activeThreadId, chatWithResponse);
            await saveMessagesToDisk(activeThreadId, chatWithResponse);
        }
    
        setLoadingResp(false);
    }

    return { sendMessage, loadingResp };
}