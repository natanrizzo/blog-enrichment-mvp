import client from "./client";

export function summarizeText(text: string) {
    return client.post<{ prompt: string }>('/ai/summarize', { text });
}