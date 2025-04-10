import { useState } from "react";
import { ChatMessage } from "../types/Chat";
import { fetchFromServer } from "../utils/server";
import { saveMessagesToDisk } from "../utils/threads";
import log from "../utils/logger";
import { useAppContext } from "../context/AppContext";

export function useResponseHandler() {
    const [loadingResp, setLoadingResp] = useState(false);
    const { doc, setDoc, activeThreadId, threadMessages, updateMessagesForThread } = useAppContext();

    async function sendMessage(input: string) {
        const threadId = activeThreadId;
        if (!threadId) {
            log.error("No active thread ID found.");
            return;
        }
        if (!input.trim()) {
            log.warn("Empty input received. Ignoring request.");
            return;
        }

        setLoadingResp(true);
        const mode = determineMode(input);
        const currentChat = threadMessages[threadId] || [];
        const updatedChat = prepareChat(input, currentChat, threadId);

        if (!isValidChat(updatedChat)) {
            handleInvalidChat(updatedChat, threadId);
            return;
        }

        try {
            const response = await sendRequestToServer(mode, updatedChat);
            await handleServerResponse(response, mode, updatedChat, threadId);
        } catch (err) {
            handleError(err, updatedChat, threadId);
        } finally {
            setLoadingResp(false);
        }
    }

    function determineMode(input: string): "edit" | "chat" {
        return input.trim().startsWith("/edit") ? "edit" : "chat";
    }

    function prepareChat(input: string, currentChat: ChatMessage[], threadId: string): ChatMessage[] {
        const userMessage: ChatMessage = { role: "user", content: input };
        const aiWaitingMessage: ChatMessage = { role: "assistant", content: "..." };
        const updatedChat = [...currentChat, userMessage, aiWaitingMessage];
        updateMessagesForThread(threadId, updatedChat);
        return updatedChat;
    }

    function handleInvalidChat(updatedChat: ChatMessage[], threadId: string) {
        log.warn("Invalid chat format detected. Sanitizing messages and cancelling request.");
        const sanitizedChat = sanitizeChat(updatedChat);
        updateMessageStateAndSaveToDisk(sanitizedChat, threadId);
        setLoadingResp(false);
    }

    async function sendRequestToServer(mode: "edit" | "chat", updatedChat: ChatMessage[]) {
        const endpoint = mode === "edit" ? "/edit" : "/chat";
        const body = { messages: updatedChat, document: doc };
        log.info(`Sending request to server: ${endpoint}`);
        return await fetchFromServer(endpoint, body);
    }

    async function handleServerResponse(data: any, mode: "edit" | "chat", currentChat: ChatMessage[], threadId: string) {
        if (!activeThreadId) throw new Error("No active thread ID found.");

        const updatedChat = [...currentChat];
        updatedChat.pop(); // Remove the AI waiting message

        if (mode === "edit") {
            handleEditResponse(data, updatedChat);
        } else if (mode === "chat") {
            handleChatResponse(data, updatedChat);
        } else {
            log.error("Unknown mode:", mode);
            updatedChat.push({ role: "assistant", content: "[error calling GPT]" });
        }

        updateMessageStateAndSaveToDisk(updatedChat, threadId);
    }

    function handleEditResponse(data: any, updatedChat: ChatMessage[]) {
        if (!data.edit_summary || !data.updated_doc) {
            throw new Error("Invalid edit response received from server.");
        }
        setDoc(data.updated_doc);
        updatedChat.push({ role: "assistant", content: data.edit_summary });
    }

    function handleChatResponse(data: any, updatedChat: ChatMessage[]) {
        if (!data.reply) {
            throw new Error("Invalid chat response received from server.");
        }
        updatedChat.push({ role: "assistant", content: data.reply });
    }

    function handleError(err: any, updatedChat: ChatMessage[], threadId: string) {
        log.error("Error while communicating with the server:", err);
        updatedChat.push({ role: "assistant", content: "[error calling GPT]" });
        updateMessageStateAndSaveToDisk(updatedChat, threadId);
    }

    async function updateMessageStateAndSaveToDisk(messages: ChatMessage[], threadId: string) {
        updateMessagesForThread(threadId, messages);
        saveMessagesToDisk(threadId, messages);
    }

    function isValidChat(messages: ChatMessage[]): boolean {
        return messages.every((message) => message.role && message.content);
    }

    function sanitizeChat(messages: ChatMessage[]): ChatMessage[] {
        return messages.filter((message) => message.role && message.content);
    }

    return { sendMessage, loadingResp };
}
