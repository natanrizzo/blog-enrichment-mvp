import { useEffect, useState } from "react";
import BlogForm from "@/components/blogForm";
import { useNavigate, useParams } from "react-router-dom";
import { getOneBlogById } from "@/api/blogs";
import { BlogFormValues } from "@/types/blogs/blogFormValues"; // <-- importa o tipo correto aqui
import Button from "@/components/button";

export default function EditBlogPage() {
    const { blogId } = useParams();
    const [initialValues, setInitialValues] = useState<BlogFormValues | null>(null); // 👈 tipa corretamente!
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchBlog() {
            if (blogId) {
                const blog = await getOneBlogById(Number(blogId));
                setInitialValues({
                blogUrl: blog.baseUrl,
                indexUrl: blog.xPath.indexUrl,
                itemXPath: blog.xPath.itemXPath,
                paginationNextXPath: blog.xPath.paginationNextXPath,
                titleXPath: blog.xPath.titleXPath,
                contentXPath: blog.xPath.contentXPath,
                authorXPath: blog.xPath.authorXPath,
                dateXPath: blog.xPath.dateXPath,
                paginationLimit: blog.xPath.paginationLimit,
                });
            }
        }

        fetchBlog();
    }, [blogId]);

    if (!initialValues) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <Button className="my-3" onClick={() => navigate(-1)} >{"< Back"}</Button>
            <BlogForm mode="edit" blogId={Number(blogId)} initialValues={initialValues} />
        </div>
    );
}
