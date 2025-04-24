import PostDTO from "@/types/post/postDTO";
import client from "./client";

export const getAllPosts = async (): Promise<PostDTO[]> => {
    const res = await client.get("/posts");
    return res.data;
}

export const getOnePostById = async (postId: number): Promise<PostDTO> => {
    const res = await client.get(`/posts/${postId}`);
    return res.data;
}