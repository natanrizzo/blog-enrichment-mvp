import { getAllPosts } from "@/api/posts";
import BlogList from "@/components/blogList";
import Card from "@/components/card";
import PostDTO from "@/types/post/postDTO";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [posts, setPosts] = useState<PostDTO[]>([]);
    
    useEffect(() => {
        getAllPosts()
        .then(setPosts)
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6 p-12 md:grid-cols-2 lg:grid-cols-3">
            <BlogList />
        {
            posts.map(p => (
                <Card
                    key={p.id}
                    author={p.author}
                    blog={p.blog?.baseUrl}
                    href={`posts/${p.id.toString()}`}
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