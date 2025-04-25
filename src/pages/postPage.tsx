import client from "@/api/client";
import { getOnePostById } from "@/api/posts";
import PostForm from "@/components/postForm";
import PostDTO from "@/types/post/postDTO";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState<PostDTO>();

    useEffect(() => {
        getOnePostById(Number(postId))
        .then(setPost)
    }, [postId]);

    return (
        <div>
            <PostForm />
        </div>
    )
}