import { fetchBlogBySlug } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { Blog } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
    params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: BlogDetailPageProps): Promise<Metadata> {
    const slug = decodeURIComponent(params.slug);
    let blog: Blog | null = null;
    try {
        blog = await fetchBlogBySlug(slug);
    } catch {
        blog = null;
    }

    if (!blog) {
        return {
            title: "Blog Not Found | PetSetu",
            robots: { index: false, follow: true },
        };
    }

    const seo = blog.seo;
    const title =
        seo?.meta_title ||
        `${blog.title} | PetSetu Blog`;
    const description =
        seo?.meta_description ||
        blog.excerpt ||
        "Read the latest pet care tips and stories on PetSetu.";
    const canonical = seo?.canonical_url || `${SITE_URL}/blog/${blog.slug || blog._id}`;
    const ogImage = seo?.og_image || blog.featured_image?.url;
    const keywords = [
        seo?.focus_keyword,
        ...(blog.tags || []),
        "pet blog",
        "pet care",
    ].filter(Boolean) as string[];

    return {
        title,
        description,
        keywords,
        alternates: { canonical },
        robots: seo?.robots
            ? undefined
            : { index: true, follow: true },
        ...(seo?.robots ? { robots: { index: true, follow: true } } : {}),
        openGraph: {
            title: seo?.og_title || blog.title,
            description: seo?.og_description || description,
            url: canonical,
            siteName: "PetSetu",
            type: "article",
            locale: blog.language || "en_US",
            publishedTime: blog.published_at || blog.publishedAt,
            modifiedTime: blog.updatedAt,
            authors: blog.author?.name ? [blog.author.name] : undefined,
            images: ogImage
                ? [
                    {
                        url: ogImage,
                        width: blog.featured_image?.width || 1200,
                        height: blog.featured_image?.height || 630,
                        alt: blog.featured_image?.alt_text || blog.title,
                    },
                ]
                : undefined,
        },
        twitter: {
            card:
                seo?.twitter_card === "summary"
                    ? "summary"
                    : "summary_large_image",
            title: seo?.og_title || blog.title,
            description: seo?.og_description || description,
            images: ogImage ? [ogImage] : undefined,
            site: "@PetSetu",
            creator: "@PetSetu",
        },
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const slug = decodeURIComponent(params.slug);

    let blog: Blog | null = null;
    let error: string | null = null;

    try {
        blog = await fetchBlogBySlug(slug);
    } catch (e: any) {
        error = e.message || "Failed to load blog.";
    }

    if (!blog && !error) {
        notFound();
    }

    if (!blog) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
                <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Blog not found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || "The article you are looking for does not exist."}
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                        Back to blogs
                    </Link>
                </section>
            </main>
        );
    }

    const publishDate = blog.published_at || blog.publishedAt;
    const category = blog.category || blog.categories?.[0];
    const authorName = blog.author?.name;
    const readingTime = blog.metrics?.reading_time ?? blog.readTime;

    return (
        <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
            {/* Hero Banner */}
            <section
                className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat sm:min-h-[420px]"
                style={{
                    backgroundImage: blog.featured_image?.url
                        ? `url('${blog.featured_image.url}')`
                        : undefined,
                }}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-orange-950/90 via-black/70 to-orange-900/80"
                />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    {category?.name && (
                        <span className="mb-4 inline-block rounded-full bg-orange-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                            {category.name}
                        </span>
                    )}
                    <h1 className="text-3xl font-black  text-white/80 drop-shadow-xl sm:text-5xl lg:text-6xl font-normal !leading-tight">
                        {blog.title}
                    </h1>
                    {blog.excerpt && (
                        <p className="mt-5 text-lg sm:text-lg/8 font-normal text-white/90 drop-shadow-md max-w-2xl mx-auto">
                            {blog.excerpt}
                        </p>
                    )}
                    {(authorName || publishDate || typeof readingTime === "number") && (
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
                            {authorName && <span>By {authorName}</span>}
                            {publishDate && (
                                <time dateTime={publishDate}>
                                    {new Date(publishDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                            )}
                            {typeof readingTime === "number" && readingTime > 0 && (
                                <span>{readingTime} min read</span>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {blog.content && (
                    <article
                        className="blog-content space-y-5 text-gray-800"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                )}

                {/* Gallery */}
                {blog.gallery && blog.gallery.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">
                            Gallery
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {blog.gallery.map((image, index) => (
                                <figure
                                    key={`${image.url}-${index}`}
                                    className="overflow-hidden rounded-xl bg-gray-100 shadow-sm"
                                >
                                    <div className="relative aspect-[4/3] w-full">
                                        <Image
                                            src={image.url}
                                            alt={image.alt_text || blog.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    {image.caption && (
                                        <figcaption className="p-3 text-sm text-gray-600">
                                            {image.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer CTA */}
                <div className="mt-12 flex items-center justify-between border-t border-orange-100 pt-8">
                    <Link
                        href="/blog"
                        className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                        ← Back to all blogs
                    </Link>
                    <span className="text-sm text-gray-500">
                        Published on PetSetu
                    </span>
                </div>
            </section>
        </main>
    );
}
