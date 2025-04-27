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
import { getOnePostById, updatePost } from "@/api/posts"
import AiSelector from "./aiSelector"

interface BlogFormData {
    id: number
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

export default function PostForm({ postId }: PostFormProps) {
    const [formData, setFormData] = useState<BlogFormData>({
        id: 0,
        blog: 0,
        externalId: "",
        title: "",
        content: "",
        author: "",
        publishedAt: "",
        extraData: {},
        createdAt: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [selectedAi, setSelectedAi] = useState("deepseek");

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        onUpdate: ({ editor }) => {
            setFormData((prev) => ({
                ...prev,
                content: editor.getHTML(),
            }))
        },
    })

    useEffect(() => {
        getOnePostById(postId).then((post) => {
            const postFormatted: BlogFormData = {
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
            setFormData(postFormatted)

            if (editor) {
                editor.commands.setContent(postFormatted.content)
            }
        })
    }, [postId, editor])

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
        } catch {
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
            const response = await updatePost(postId, {
                id: formData.id,
                blogId: formData.blog,
                externalId: formData.externalId,
                title: formData.title,
                content: formData.content,
                author: formData.author,
                publishedAt: formData.publishedAt,
                extraData: formData.extraData,
                creationDate: formData.createdAt,
            })

            setResponse(response)

            if (response?.id) {
                setFormData((prev) => ({
                    ...prev,
                    id: response.id,
                }))
            }
        } catch {
            setResponse({ error: "Failed to submit form. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAiResume = async () => {
        setIsSubmitting(true)
        try {
            const response = await summarizeText(selectedAi, formData.content)
            if (response) {
                setResponse(response.data);
            }
        } catch(err) {
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
                        <Label htmlFor="id">ID</Label>
                        <Input id="id" name="id" value={formData.id || ""} disabled />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="blog">Blog ID</Label>
                        <Input id="blog" name="blog" value={formData.blog || ""} disabled onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="externalId">External ID</Label>
                        <Input id="externalId" name="externalId" value={formData.externalId} disabled onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <div className="border rounded-md p-2 min-h-[200px] bg-background">
                            <EditorContent editor={editor} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" name="author" value={formData.author} disabled onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="publishedAt">Published At</Label>
                        <Input
                            id="publishedAt"
                            name="publishedAt"
                            type="datetime-local"
                            disabled
                            value={formData.publishedAt?.slice(0, 16)}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="extraData">Extra Data (JSON)</Label>
                        <Textarea
                            id="extraData"
                            name="extraData"
                            value={typeof formData.extraData === "object"
                                ? JSON.stringify(formData.extraData, null, 2)
                                : formData.extraData}
                            onChange={handleExtraDataChange}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="createdAt">Created At</Label>
                        <Input
                            id="createdAt"
                            name="createdAt"
                            disabled
                            type="datetime-local"
                            value={formData.createdAt?.slice(0, 16)}
                            onChange={handleChange}
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
                                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                            )}
                        </div>
                    )}
                </CardContent>
                
                <AiSelector selectedAi={selectedAi} setSelectedAi={setSelectedAi} />
            
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting</> : "Submit"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleAiResume} disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : "AI Resume"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
