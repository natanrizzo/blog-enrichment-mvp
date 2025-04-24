import { getAllPosts } from "@/api/posts";
import Card from "@/components/card";
import PostDTO from "@/types/post/postDTO";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<PostDTO[]>([]);
    
    useEffect(() => {
        getAllPosts()
        .then(setPosts)
    }, []);

    return (
        <div>
           {
            posts.map(p => (
                <Card
                    key={p.id}
                    author={p.author}
                    href={p.id.toString()}
                    creationDate={p.creationDate}
                    publishDate={p.publishedAt}
                    text={p.content}
                    title={p.title}
                />
            ))
           } 
        </div>
    )
}