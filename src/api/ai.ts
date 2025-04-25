import client from "./client";

export function summarizeText(text: string) {
    return client.post<{ prompt: string }>(`/posts/summarize`, { text });
}