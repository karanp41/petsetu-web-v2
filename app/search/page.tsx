import { fetchPosts } from "@/lib/api";
import { PET_CATEGORY_ID_MAP } from "@/lib/constants";
import { PostsApiResponse } from "@/lib/types";
import { Metadata } from "next";
import { FiltersClient } from "./FiltersClient";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export const dynamic = "force-dynamic"; // ensure SSR on each request

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const type =
    typeof searchParams.type === "string" ? searchParams.type : "all";
  const pieces: string[] = [];
  if (type && type !== "all")
    pieces.push(type.charAt(0).toUpperCase() + type.slice(1));
  const title = pieces.length
    ? `${pieces.join(" • ")} | PetSetu Posts`
    : "Search Pets & Posts | PetSetu";
  const description =
    "Browse active pet posts. Filter by type or location to find pets to buy, adopt or breed.";
  return { title, description, alternates: { canonical: "/search" } };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const page = Number(searchParams.page) || 1;
  const postType = (
    typeof searchParams.type === "string" ? searchParams.type : "all"
  ).toLowerCase();
  const location =
    typeof searchParams.loc === "string" ? searchParams.loc : undefined;
  const petCategoryKey =
    typeof searchParams.cat === "string"
      ? searchParams.cat.toLowerCase()
      : "all";
  const petCategories =
    petCategoryKey && petCategoryKey !== "all"
      ? [PET_CATEGORY_ID_MAP[petCategoryKey]].filter(Boolean)
      : Object.values(PET_CATEGORY_ID_MAP);

  let data: PostsApiResponse | null = null;
  let error: string | null = null;
  try {
    data = await fetchPosts({ page, postType, location, petCategories });
  } catch (e: any) {
    error = e.message || "Failed to load posts.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Find Pets
        </h1>
        <p className="text-gray-600 mb-8">
          Browse the latest listings to buy, adopt, or breed pets. Use filters
          to refine results.
        </p>

        <div className="bg-white/90 backdrop-blur rounded-xl shadow-xl p-3 md:p-4 mb-8 border border-orange-100 sticky top-16 z-40">
          <FiltersClient />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-8">
            <p className="font-medium mb-1">Could not load posts</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!error && !data && (
          <div className="text-center text-gray-500 py-20">
            Loading posts...
          </div>
        )}

        {!error && data && data.results.length === 0 && (
          <div className="text-center text-gray-600 py-20">
            <p className="text-lg font-medium mb-2">No posts found</p>
            <p className="text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}

        {!error && data && data.results.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.results.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
