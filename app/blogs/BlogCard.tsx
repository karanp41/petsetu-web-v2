import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { IMAGE_BASE_URL } from "@/lib/constants";
import { Blog } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
    blog: Blog;
    priority?: boolean;
}

export function BlogCard({ blog, priority = false }: BlogCardProps) {
    const href = `/blogs/${blog.slug || blog._id}`;
    const imageUrl = blog.featured_image
        ? blog.featured_image.url.startsWith("http")
            ? blog.featured_image.url
            : `${IMAGE_BASE_URL.replace(/\/$/, "")}/${blog.featured_image.url.replace(
                /^\//,
                ""
            )}`
        : null;

    let publishDate: string | null = null;
    const publishTimestamp = blog.publishedAt || blog.published_at;
    if (publishTimestamp) {
        try {
            publishDate = format(parseISO(publishTimestamp), "MMM d, yyyy");
        } catch {
            publishDate = null;
        }
    }

    let addedOnDate: string | null = null;
    if (blog.createdAt) {
        try {
            addedOnDate = format(parseISO(blog.createdAt), "MMM d, yyyy");
        } catch {
            addedOnDate = null;
        }
    }

    const category = blog.category || blog.categories?.[0];
    const readTime = blog.readTime ?? blog.metrics?.reading_time;

    return (
        <article>
            <Card
                className={cn(
                    "group h-full overflow-hidden border-0 bg-white shadow-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-orange-500"
                )}
            >
                <Link
                    href={href}
                    className="block focus:outline-none"
                    prefetch={false}
                    aria-label={`Read ${blog.title}`}
                >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={blog.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority={priority}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 text-orange-300">
                                <span className="text-5xl font-bold opacity-30">P</span>
                            </div>
                        )}
                        {category?.name && (
                            <Badge className="absolute left-3 top-3 bg-white/95 text-gray-800 shadow-sm hover:bg-white">
                                {category.name}
                            </Badge>
                        )}
                    </div>
                </Link>

                <CardHeader className="pb-2 pt-5">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {blog.author?.name && (
                            <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {blog.author.name}
                            </span>
                        )}
                        {addedOnDate && (
                            <time dateTime={blog.createdAt} className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Added on {addedOnDate}
                            </time>
                        )}
                        {typeof readTime === "number" && readTime > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {readTime} min read
                            </span>
                        )}
                    </div>
                    <Link
                        href={href}
                        className="block focus:outline-none"
                        prefetch={false}
                        aria-label={`Read ${blog.title}`}
                    >
                        <CardTitle className="line-clamp-2 text-xl leading-snug transition-colors group-hover:text-orange-600">
                            {blog.title}
                        </CardTitle>
                    </Link>
                </CardHeader>

                <CardContent className="pt-0">
                    {blog.excerpt && (
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                            {blog.excerpt}
                        </CardDescription>
                    )}

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs font-normal"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-0 pb-5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="group/btn px-0 text-orange-600 hover:bg-transparent hover:text-orange-700"
                        asChild
                    >
                        <Link
                            href={href}
                            prefetch={false}
                            aria-label={`Read more about ${blog.title}`}
                        >
                            Read more
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </article>
    );
}
