import PostForm from "@/components/postForm";
import { useParams } from "react-router-dom";

export default function PostPage() {
    const { postId } = useParams();

    return (
        <div>
            <PostForm postId={Number(postId)} />
        </div>
    )
}