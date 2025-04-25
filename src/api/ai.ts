import client from "./client";

export function summarizeText(id: number, text: string) {
    return client.post<{ prompt: string }>(`/posts/${id}/summarize`, { text });
}