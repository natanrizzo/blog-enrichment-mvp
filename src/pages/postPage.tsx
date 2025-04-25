import Button from "@/components/button";
import PostForm from "@/components/postForm";
import { useNavigate, useParams } from "react-router-dom";

export default function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    return (
        <div className="p-6">
            <Button className="my-3" onClick={() => navigate(-1)} >{"< Posts"}</Button>
            <PostForm postId={Number(postId)} />
        </div>
    )
}