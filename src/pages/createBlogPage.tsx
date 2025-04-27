import BlogForm from "@/components/blogForm";
import Button from "@/components/button";
import { useNavigate } from "react-router-dom";

export default function CreateBlogPage() {
    const navigate = useNavigate();
    
    return (
        <div className="p-6">
            <Button className="my-3" onClick={() => navigate(-1)} >{"< Back"}</Button>
            <BlogForm mode="create" />
        </div>
    )
}