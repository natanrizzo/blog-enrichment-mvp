"use client"

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

// Define the form field types
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

export default function PostForm(postId: number) {
    // Initial form state
    const [formData, setFormData] = useState<BlogFormData>({
        id: null, // Auto-incrementing, will be set by backend
        blog: 0, // Immutable after creation
        externalId: "",
        title: "",
        content: "",
        author: "",
        publishedAt: "", // Immutable after creation
        extraData: {},
        createdAt: "", // Defaults to now(), immutable
    })    

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [response, setResponse] = useState<any>(null)
    const [isNewEntry, setIsNewEntry] = useState(true)

    useEffect(() => {
        getOnePostById(postId)
        .then(setFormData) // Adjust
    }, [])

    // Initialize TipTap editor
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

    // Set default dates for new entries
    useEffect(() => {
        if (isNewEntry) {
        const now = new Date().toISOString()
        setFormData((prev) => ({
            ...prev,
            publishedAt: now,
            createdAt: now,
        }))
        }
    }, [isNewEntry])

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        // Don't allow changes to immutable fields if not a new entry
        if (!isNewEntry && ["blog", "author", "publishedAt", "createdAt"].includes(name)) {
        return
        }

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    // Handle extra data as JSON
    const handleExtraDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
        const parsedJson = e.target.value ? JSON.parse(e.target.value) : {}
        setFormData((prev) => ({
            ...prev,
            extraData: parsedJson,
        }))
        } catch (error) {
        // If JSON is invalid, store as string to be validated later
        setFormData((prev) => ({
            ...prev,
            extraData: e.target.value,
        }))
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
        // In a real app, replace with your actual API endpoint
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
            // If successful and we get an ID back, it's no longer a new entry
            setIsNewEntry(false)
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

    // Handle AI Resume button click
    const handleAiResume = async () => {
        setIsSubmitting(true)

        try {
        // In a real app, replace with your actual AI API endpoint
        const response = await summarizeText(JSON.stringify(formData))

        const data = await response;

        // Display the summarized text as the response
        if (data) {
            setResponse({
            summarizedText: data,
            })

            // Update the content field with the summarized text if needed
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
            {/* ID field - read only */}
            <div className="space-y-2">
                <Label htmlFor="id">ID (Auto-generated)</Label>
                <Input id="id" name="id" value={formData.id || ""} disabled placeholder="Auto-generated" />
            </div>

            {/* Blog reference field - immutable after creation */}
            <div className="space-y-2">
                <Label htmlFor="blog">Blog Reference</Label>
                <Input
                id="blog"
                name="blog"
                value={formData.blog ? `${formData.blog}` : ""}
                disabled={!isNewEntry}
                placeholder="Blog reference"
                onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">Immutable after creation</p>
            </div>

            {/* External ID field - read-only */}
            <div className="space-y-2">
                <Label htmlFor="externalId">External ID</Label>
                <Input
                id="externalId"
                name="externalId"
                value={formData.externalId}
                disabled
                placeholder="External ID (from backend)"
                />
                <p className="text-sm text-muted-foreground">Provided by backend</p>
            </div>

            {/* Title field */}
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter title" />
            </div>

            {/* Content field with WYSIWYG editor */}
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md p-2 min-h-[200px] bg-background">
                <EditorContent editor={editor} />
                </div>
            </div>

            {/* Author field - read-only */}
            <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={formData.author} disabled placeholder="Author (from backend)" />
                <p className="text-sm text-muted-foreground">Provided by backend</p>
            </div>

            {/* Published At field - read-only */}
            <div className="space-y-2">
                <Label htmlFor="publishedAt">Published At</Label>
                <Input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                value={formData.publishedAt ? formData.publishedAt.slice(0, 16) : ""}
                disabled
                />
                <p className="text-sm text-muted-foreground">Provided by backend</p>
            </div>

            {/* Extra Data field (JSON) */}
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

            {/* Created At field - immutable */}
            <div className="space-y-2">
                <Label htmlFor="createdAt">Created At</Label>
                <Input
                id="createdAt"
                name="createdAt"
                type="datetime-local"
                value={formData.createdAt ? formData.createdAt.slice(0, 16) : ""}
                disabled
                />
                <p className="text-sm text-muted-foreground">Automatically set to current time</p>
            </div>

            {/* Response display area */}
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
