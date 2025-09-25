import { cookies } from "next/headers";
import "server-only"; // ensure this module is only ever executed on the server
import { PET_CATEGORY_ID_MAP } from "./constants";
import { FetchPostsParams, Post, PostsApiResponse } from "./types";

// Read API base from environment; prefer server-side env (no NEXT_PUBLIC needed here since used on server)
const API_BASE = process.env.API_BASE;
if (!API_BASE) {
  throw new Error(
    "Missing required environment variable API_BASE. Define it in .env.local"
  );
}

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

// Fetch a single post by id (requires endpoint exposing manage-post/:id)
export async function fetchPostById(
  id: string,
  authToken?: string
): Promise<Post> {
  if (!id) throw new Error("fetchPostById requires an id");

  // If no explicit token provided, try reading from request cookies (set by AuthProvider on login)
  let token = authToken;
  if (!token) {
    try {
      const c = cookies();
      token = c.get("ps_access_token")?.value;
    } catch {
      // ignore – cookies() only available in server context; guarded by server-only import
    }
  }

  const res = await fetch(`${API_BASE}/post/manage-post/${id}`, {
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store", // always fresh
  });

  if (res.status === 401) {
    // Throw an error that callers can differentiate (attach status)
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    throw new Error(
      `Failed to fetch post ${id}: ${res.status} ${res.statusText}`
    );
  }
  return (await res.json()) as Post;
}
