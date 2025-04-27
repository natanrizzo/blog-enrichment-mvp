import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { createBlogWithXPath, updateBlog } from "@/api/blogs"

const formSchema = z.object({
    blogUrl: z.string().url({ message: "Please enter a valid URL" }).min(1, "Blog URL is required"),
    indexUrl: z.string().min(1, "Index URL is required"),
    itemXPath: z.string().min(1, "Item XPath is required"),
    paginationNextXPath: z.string().optional(),
    titleXPath: z.string().min(1, "Title XPath is required"),
    contentXPath: z.string().min(1, "Content XPath is required"),
    authorXPath: z.string().optional(),
    dateXPath: z.string().optional(),
    paginationLimit: z.coerce
    .number()
    .int()
    .min(1, "Pagination limit must be at least 1")
    .max(100, "Pagination limit cannot exceed 100"),
})

type FormValues = z.infer<typeof formSchema>

type BlogScraperFormProps = {
    mode: "create" | "edit"
    blogId?: number
    initialValues?: Partial<FormValues>
}

export default function BlogScraperForm({ mode, blogId, initialValues }: BlogScraperFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        blogUrl: "",
        indexUrl: "",
        itemXPath: "",
        paginationNextXPath: "",
        titleXPath: "",
        contentXPath: "",
        authorXPath: "",
        dateXPath: "",
        paginationLimit: 10,
        ...initialValues,
        },
    })

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        setResponse(null)

        const blogDto = {
            baseUrl: values.blogUrl,
            platform: "wordpress",
            xPath: {
                indexUrl: values.indexUrl,
                itemXPath: values.itemXPath,
                paginationNextXPath: values.paginationNextXPath || "",
                titleXPath: values.titleXPath,
                contentXPath: values.contentXPath,
                authorXPath: values.authorXPath || "",
                dateXPath: values.dateXPath || "",
                paginationLimit: values.paginationLimit,
            },
        };
    
        try {
        if (mode === "create") {
            const data = await createBlogWithXPath(blogDto);
            setResponse(data)
        } else if (mode === "edit" && blogId) {
            const data = await updateBlog(blogId, blogDto);
            setResponse(data)
        } else {
            throw new Error("Invalid operation: Missing blogId for editing")
        }
        } catch (error: any) {
            
        setResponse({ error: error?.message || "Failed to submit configuration. Please try again." })
        } finally {
        setIsSubmitting(false)
        }
    }
    

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{mode === "create" ? "Create Blog Scraper" : "Edit Blog Scraper"}</CardTitle>
                <CardDescription>Configure XPath selectors to extract content from blog pages</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="blogUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Blog URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="indexUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Index URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/blog" {...field} />
                        </FormControl>
                        <FormDescription>
                            URL of the page listing all blog posts (e.g., blog homepage).
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="itemXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>
                            Item XPath
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <HelpCircle className="ml-1 inline h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                XPath to select all post links from the index page.
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //div[@class="post"]//a/@href' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="paginationNextXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>
                            Pagination Next XPath
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <HelpCircle className="ml-1 inline h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                XPath for the "Next" button to navigate paginated blog lists.
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //a[@rel="next"]/@href' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="titleXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title XPath</FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //h1[@class="post-title"]/text()' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="contentXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Content XPath</FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //div[@class="post-content"]' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="authorXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Author XPath (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //span[@class="author"]/text()' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="dateXPath"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date XPath (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder='e.g. //time/@datetime' {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="paginationLimit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pagination Limit</FormLabel>
                        <FormControl>
                            <Input type="number" min={1} max={100} {...field} />
                        </FormControl>
                        <FormDescription>How many paginated pages should be scraped (1-100).</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Saving..."}
                        </>
                    ) : (
                        mode === "create" ? "Create Blog" : "Save Changes"
                    )}
                    </Button>
                </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
