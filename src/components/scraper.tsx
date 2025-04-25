import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { scrapBlog } from "@/api/scraper"

interface ScraperFormData {
    url: string
    platform: string
}

interface ScraperResponse {
    success: boolean
    data?: {
        title?: string
        content?: string
        author?: string
        publishedAt?: string
        [key: string]: any
    }
    error?: string
    }

export default function Scraper() {
    const [formData, setFormData] = useState<ScraperFormData>({
        url: "",
        platform: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [response, setResponse] = useState<ScraperResponse | null>(null)

    const platforms = [
        { value: "wordpress", label: "WordPress" },
    ]

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
        ...prev,
        url: e.target.value,
        }))
    }

    const handlePlatformChange = (value: string) => {
        setFormData((prev) => ({
        ...prev,
        platform: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await scrapBlog(JSON.stringify(formData.url), JSON.stringify(formData.platform));
            const data = await response.json();
            setResponse(data)
        } catch (error) {
        setResponse({
            success: false,
            error: "Failed to scrape content. Please check the URL and try again.",
        })
        } finally {
        setIsSubmitting(false)
        }
    }

    return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Scraper</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
            {/* Blog URL field */}
            <div className="space-y-2">
                <Label htmlFor="url">Blog URL</Label>
                <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleUrlChange}
                placeholder="https://example.com/blog-post"
                required
                />
            </div>

            {/* Platform field */}
            <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={formData.platform} onValueChange={handlePlatformChange}>
                <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                    {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {response && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                <h3 className="font-medium mb-2">Scraper Result:</h3>
                {response.success ? (
                    <div className="space-y-2">
                    <p>
                        <span className="font-medium">Title:</span> {response.data?.title}
                    </p>
                    <p>
                        <span className="font-medium">Author:</span> {response.data?.author}
                    </p>
                    <p>
                        <span className="font-medium">Published:</span>{" "}
                        {response.data?.publishedAt ? new Date(response.data.publishedAt).toLocaleDateString() : "Unknown"}
                    </p>
                    <p className="font-medium">Content Preview:</p>
                    <div className="max-h-40 overflow-y-auto border p-2 rounded bg-background">
                        {response.data?.content ? response.data.content.substring(0, 200) + "..." : "No content available"}
                    </div>
                    </div>
                ) : (
                    <div className="text-destructive">{response.error}</div>
                )}
                </div>
            )}
            </CardContent>

            <CardFooter>
            <Button type="submit" disabled={isSubmitting || !formData.url}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping
                </>
                ) : (
                "Scrape Content"
                )}
            </Button>
            </CardFooter>
        </form>
    </Card>
)
}