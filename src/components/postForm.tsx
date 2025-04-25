import type React from "react"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { summarizeText } from "@/api/ai"
import { getOnePostById } from "@/api/posts"


interface BlogFormData {
    id: number | null
    blog: number;
    externalId: string
    title: string
    content: string
    author: string
    publishedAt: string
    extraData: any
    createdAt: string
}

type PostFormProps = {
    postId: number
}

export default function PostForm({
    postId
}: PostFormProps) {
    const [formData, setFormData] = useState<BlogFormData>({
        id: null,
        blog: 0,
        externalId: "",
        title: "",
        content: "",
        author: "",
        publishedAt: "",
        extraData: {},
        createdAt: "",
    })    

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [response, setResponse] = useState<any>(null)

    useEffect(() => {
        getOnePostById(postId)
        .then((post) => {
            const postFormated: BlogFormData = {
                id: post.id,
                title: post.title,
                author: post.author,
                blog: post.blogId,
                content: post.content,
                createdAt: post.creationDate,
                externalId: post.externalId,
                extraData: post.extraData,
                publishedAt: post.publishedAt,
            }
            setFormData(postFormated);
        })
    }, [])

    const editor = useEditor({
        extensions: [StarterKit],
        content: formData.content,
        onUpdate: ({ editor }) => {
        setFormData((prev) => ({
            ...prev,
            content: editor.getHTML(),
        }))
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleExtraDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
        const parsedJson = e.target.value ? JSON.parse(e.target.value) : {}
        setFormData((prev) => ({
            ...prev,
            extraData: parsedJson,
        }))
        } catch (error) {
        setFormData((prev) => ({
            ...prev,
            extraData: e.target.value,
        }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
        const response = await fetch("/api/blog", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })

        const data = await response.json()
        setResponse(data)

        if (response.ok && data.id) {
            setFormData((prev) => ({
            ...prev,
            id: data.id,
            }))
        }
        } catch (error) {
        setResponse({ error: "Failed to submit form. Please try again." })
        } finally {
        setIsSubmitting(false)
        }
    }

    const handleAiResume = async () => {
        setIsSubmitting(true)

        try {
        const response = await summarizeText(postId, JSON.stringify(formData))

        const data = await response;

        if (data) {
            setResponse({
            summarizedText: data,
        })

        if (editor) {
        editor.commands.setContent(data)
        }
        } else {
            setResponse(data)
        }
        } catch (error) {
            setResponse({ error: "Failed to generate AI resume. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Blog Entry</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="id">ID (Auto-generated)</Label>
                <Input id="id" name="id" value={formData.id || ""} disabled placeholder="Auto-generated" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="blog">Blog Reference</Label>
                <Input
                id="blog"
                name="blog"
                value={formData.blog ? `${formData.blog}` : ""}
                disabled
                placeholder="Blog reference"
                onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="externalId">External ID</Label>
                <Input
                id="externalId"
                name="externalId"
                value={formData.externalId}
                disabled
                placeholder="External ID"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter title" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md p-2 min-h-[200px] bg-background">
                <EditorContent editor={editor} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={formData.author} disabled placeholder="Author (from backend)" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="publishedAt">Published At</Label>
                <Input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                value={formData.publishedAt ? formData.publishedAt.slice(0, 16) : ""}
                disabled
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="extraData">Extra Data (JSON)</Label>
                <Textarea
                id="extraData"
                name="extraData"
                value={
                    typeof formData.extraData === "object"
                    ? JSON.stringify(formData.extraData, null, 2)
                    : formData.extraData
                }
                onChange={handleExtraDataChange}
                placeholder="{ }"
                rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                id="createdAt"
                name="createdAt"
                type="datetime-local"
                value={formData.createdAt ? formData.createdAt.slice(0, 16) : ""}
                disabled
                />
            </div>

            {response && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                <h3 className="font-medium mb-2">AI Summary:</h3>
                {response.summarizedText ? (
                    <div className="prose prose-sm max-w-none">{response.summarizedText}</div>
                ) : response.error ? (
                    <div className="text-destructive">{response.error}</div>
                ) : (
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response, null, 2)}</pre>
                )}
                </div>
            )}
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                </>
                ) : (
                "Submit"
                )}
            </Button>

            <Button type="button" variant="secondary" onClick={handleAiResume} disabled={isSubmitting}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                </>
                ) : (
                "AI Resume"
                )}
            </Button>
            </CardFooter>
        </form>
        </Card>
    )
}
