import { fetchBlogs } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { BlogsApiResponse } from "@/lib/types";
import { Metadata } from "next";
import { BlogCard } from "./BlogCard";
import { BlogPagination } from "./BlogPagination";

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const dynamic = "force-dynamic"; // ensure SSR on each request

export const metadata: Metadata = {
  title: "Pet Care Blog | Tips, Guides & Stories | PetSetu",
  description:
    "Explore the PetSetu blog for expert pet care tips, adoption guides, breed advice, heartwarming stories, and the latest trends for dogs, cats, and more.",
  keywords: [
    "pet care blog",
    "pet adoption tips",
    "dog care guide",
    "cat care tips",
    "pet health",
    "pet training",
    "pet stories",
    "PetSetu blog",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "PetSetu Blog - Pet Care Tips, Guides & Stories",
    description:
      "Discover expert pet care tips, adoption guides, and heartwarming pet stories on the PetSetu blog.",
    url: `${SITE_URL}/blog`,
    siteName: "PetSetu",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetSetu Blog - Pet Care Tips, Guides & Stories",
    description:
      "Discover expert pet care tips, adoption guides, and heartwarming pet stories on the PetSetu blog.",
    site: "@PetSetu",
    creator: "@PetSetu",
  },
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1;

  let data: BlogsApiResponse | null = null;
  let error: string | null = null;

  try {
    data = await fetchBlogs({ page, limit: 10 });
  } catch (e: any) {
    error = e.message || "Failed to load blogs.";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50">
      <section
        className="relative flex min-h-[300px] items-center justify-center overflow-hidden border-b border-orange-100 bg-cover bg-center bg-no-repeat sm:min-h-[320px]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1545529468-42764ef8c85f?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-orange-950/85 via-black/60 to-orange-900/75"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 py-12">
          <header className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-black tracking-tight text-white/80 drop-shadow-lg sm:text-6xl lg:text-7xl font-normal">
              PetSetu Blog
            </h1>
            <p className="mt-5 text-lg sm:text-lg/8 font-normal text-white/90 drop-shadow-md max-w-2xl mx-auto">
              Expert tips, adoption guides, breed advice, and heartwarming
              stories for every pet parent.
            </p>
          </header>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="mb-1 font-medium">Could not load blogs</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && !data && (
          <div className="py-20 text-center text-gray-500">
            Loading latest blogs…
          </div>
        )}

        {!error && data && data.results.length === 0 && (
          <div className="py-20 text-center text-gray-600">
            <p className="text-lg font-medium mb-2">No blogs found</p>
            <p className="text-sm">
              Check back soon for new pet care articles and stories.
            </p>
          </div>
        )}

        {!error && data && data.results.length > 0 && (
          <>
            <p className="mb-6 text-sm text-gray-500" aria-live="polite">
              Showing {data.results.length} of {data.totalResults} article
              {data.totalResults !== 1 ? "s" : ""}
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.results.map((blog, index) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  priority={index < 3}
                />
              ))}
            </div>

            <BlogPagination page={data.page} totalPages={data.totalPages} />
          </>
        )}
      </section>
    </main>
  );
}
