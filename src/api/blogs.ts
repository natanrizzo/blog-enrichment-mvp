import { BlogXPathDTO } from "@/types/blogs/blogDto";
import client from "./client"

export const createBlogWithXPath = async (blog: BlogXPathDTO) => {
    const res = await client.post("/blogs", { blog });
    return res.data;
}

export const updateBlog = async (blogId: number, blog: BlogXPathDTO) => {
    const res = await client.post(`/blogs/${blogId}/update/`, { blog });
    return res.data;
}

export const getOneBlogById = async (blogId: number) => {
    const res = await client.get(`/blogs/${blogId}`);
    return res.data;
}

export const getAllBlogs = async () => {
    const res = await client.get("/blogs");
    return res.data;
}