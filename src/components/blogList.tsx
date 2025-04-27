import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, Plus, Pencil, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getAllBlogs } from "@/api/blogs"

interface Blog {
    id: string
    baseUrl: string
    createdAt: string
    updatedAt: string
}

const BLOGS_PER_PAGE = 5

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const blogs = await getAllBlogs()
                setBlogs(blogs || [])

                const calculatedTotalPages = Math.ceil((blogs?.length || 0) / BLOGS_PER_PAGE)
                setTotalPages(calculatedTotalPages)
            } catch (err) {
                console.error("Failed to fetch blogs:", err)
                setError("Failed to load blogs. Please try again later.")
                setBlogs([])
                setTotalPages(1)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBlogs()
    }, [])

    const handleEditBlog = (blogId: string) => {
        navigate(`/blogs/${blogId}`)
    }

    const handleAddNewBlog = () => {
        navigate("/blogs/")
    }

    const renderPaginationItems = () => {
        const items = []
        const maxPages = 5
        const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxPages / 2), totalPages - maxPages + 1))
        const endPage = Math.min(startPage + maxPages - 1, totalPages)

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            )
        }
        return items
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const paginatedBlogs = blogs.slice(
        (currentPage - 1) * BLOGS_PER_PAGE,
        currentPage * BLOGS_PER_PAGE
    )

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog List</CardTitle>
                <Button onClick={handleAddNewBlog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Blog
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => setCurrentPage(1)}>
                            Try Again
                        </Button>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No blogs found.</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddNewBlog}>
                            Add Your First Blog
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60%]">Blog URL</TableHead>
                                        <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedBlogs.map((blog) => (
                                        <TableRow key={blog.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate max-w-[300px]">{blog.baseUrl}</span>
                                                    <a
                                                        href={blog.baseUrl ? (blog.baseUrl.startsWith("http") ? blog.baseUrl : `https://${blog.baseUrl}`) : "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-primary"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{formatDate(blog.updatedAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditBlog(blog.id)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            aria-disabled={currentPage === 1}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                            aria-disabled={currentPage === totalPages}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
