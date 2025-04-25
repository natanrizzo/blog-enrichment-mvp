import PostDTO from "@/types/post/postDTO";
import client from "./client";

export const getAllPosts = async (): Promise<PostDTO[]> => {
    const res = await client.get("/posts");
    return res.data;
}

export const getOnePostById = async (id: number): Promise<PostDTO> => {
    const res = await client.get(`/posts/${id}`);
    return res.data;
}

export const updatePost = async (id: number, post: PostDTO): Promise<PostDTO> => {
    const res = await client.post(`/posts/${id}/update`, { post });
    return await res.data;
} 