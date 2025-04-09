import { useState } from "react";
import { ChatMessage } from "../types/Chat";
import { fetchFromServer } from "../utils/server";
import { saveMessagesToDisk } from "../utils/threads";
import { useThreadContext } from "../context/ThreadContext";
import { useDocumentContext } from "../context/DocumentContext";
import log from "../utils/logger";


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
        let newChat = [...currentMessages, { role: "user", content: input }];
        const newChatWaiting = [...newChat, { role: "assistant", content: "..." }];
        updateMessagesForThread(activeThreadId, newChatWaiting);

        if (!isValidChat(newChat)) {
            log.warn("Invalid chat format detected. Sanitizing messages...");
            newChat = sanitizeChat(newChat);
            updateMessagesForThread(activeThreadId, newChat);
            await saveMessagesToDisk(activeThreadId, newChat);
            setLoadingResp(false);
            return;
        }

        const endpoint = isEditCommand ? "/edit" : "/chat";
        const body = {
            messages: newChat,
            document: doc,
        };

        try {
            log.info(`Sending request to server: ${endpoint}`);
            const data = await fetchFromServer(endpoint, body);

            if (isEditCommand) {
                if (!data.edit_summary || !data.updated_doc) {
                    log.error("Invalid edit response received from server.");
                    setLoadingResp(false);
                    return;
                }
                const chatWithResponse = [
                    ...newChat,
                    { role: "assistant", content: data.edit_summary },
                ];
                updateMessagesForThread(activeThreadId, chatWithResponse);
                setDoc(data.updated_doc);
                await saveMessagesToDisk(activeThreadId, chatWithResponse);
                log.info("Edit command processed successfully.");
            } else {
                if (!data.reply) {
                    log.error("Invalid chat response received from server.");
                    setLoadingResp(false);
                    return;
                }
                const chatWithResponse = [
                    ...newChat,
                    { role: "assistant", content: data.reply },
                ];
                updateMessagesForThread(activeThreadId, chatWithResponse);
                await saveMessagesToDisk(activeThreadId, chatWithResponse);
                log.info("Chat response processed successfully.");
            }
        } catch (err) {
            log.error("Error while communicating with the server:", err);
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