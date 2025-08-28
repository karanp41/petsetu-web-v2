import { PET_CATEGORY_ID_MAP } from "./constants";
import { FetchPostsParams, PostsApiResponse } from "./types";

const API_BASE = "https://petsetu-api.onrender.com/v1";

// NOTE: The backend expects POST with JSON body, query params for sort/page/limit.
export async function fetchPosts(
  params: FetchPostsParams = {}
): Promise<PostsApiResponse> {
  const {
    page = 1,
    limit = 20,
    postType = "all",
    // query removed from API usage per new spec
    query, // kept for backward compatibility (ignored)
    location,
    petCategories,
  } = params;
  const searchParams = new URLSearchParams({
    sortBy: "createdAt:desc",
    page: String(page),
    limit: String(limit),
  });

  // Body – include only known filters. 'query' & 'location' speculative (may be ignored by API).
  const body: Record<string, any> = { isActive: true, postType };
  if (location) body.location = location; // tentative key (may be ignored server side)
  // Determine petCategory array: if explicit petCategories passed use them else default to all mapped values
  const categoryIds =
    petCategories && petCategories.length > 0
      ? petCategories
      : Object.values(PET_CATEGORY_ID_MAP);
  if (categoryIds.length) body.petCategory = categoryIds;

  const res = await fetch(
    `${API_BASE}/post/get-posts?${searchParams.toString()}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      // Always fresh for SEO accuracy
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as PostsApiResponse;
  return data;
}
