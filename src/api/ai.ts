import client from "./client";

export function summarizeText(model: string, text: string) {
    return client.post<{ prompt: string }>(`/posts/summarize`, { model, text });
}