export interface BreedDetails {
  name?: string;
}

export interface PetDetails {
  isVaccinationDone?: boolean;
  knowEssentialCommands?: boolean;
  age?: number; // in months? (sample shows 25, 1, 5)
  name?: string;
  sex?: string; // 'm' | 'f'
  weight?: number;
  breedDetails?: BreedDetails[];
}

export interface PetCategoryDetails {
  petCategoryId?: string;
  petCategory?: string; // e.g. Cat, Bunny
}

export interface OwnerDetails {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface Post {
  _id: string;
  photos: string[];
  postType: string; // 'sell' | 'adopt' | 'breed'
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  country?: string;
  currency?: string;
  description?: string;
  phone?: string;
  pincode?: string;
  price?: number;
  state?: string;
  title: string;
  createdAt?: string;
  petDetails?: PetDetails;
  petCategoryDetails?: PetCategoryDetails;
  ownerDetails?: OwnerDetails;
  loc?: {
    coordinates?: [number, number];
    type?: string;
  };
}

export interface PostsApiResponse {
  results: Post[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  postType?: string; // 'sell' | 'adopt' | 'breed' | 'all'
  // Removed free-text query usage per new requirements (keeping optional for backwards compatibility but unused)
  query?: string;
  location?: string; // city/state substring - server may ignore if unsupported
  petCategories?: string[]; // array of backend pet category IDs
}

export interface BlogAuthor {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface BlogCategory {
  _id?: string;
  name?: string;
  slug?: string;
  icon?: string;
}

export interface BlogSeo {
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  robots?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: "summary" | "summary_large_image" | "player" | "app";
}

export interface BlogImage {
  url: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  order?: number;
}

export interface BlogMetrics {
  view_count?: number;
  unique_view_count?: number;
  reading_time?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  bookmark_count?: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  content_format?: "html" | "markdown" | "plaintext";
  featured_image?: BlogImage;
  gallery?: BlogImage[];
  author?: BlogAuthor;
  co_authors?: BlogAuthor[];
  categories?: BlogCategory[];
  category?: BlogCategory;
  tags?: string[];
  publishedAt?: string;
  published_at?: string;
  readTime?: number; // minutes
  status?: "published" | "draft" | "archived";
  visibility?: "public" | "private" | "password_protected";
  language?: string;
  seo?: BlogSeo;
  metrics?: BlogMetrics;
  is_featured?: boolean;
  is_sticky?: boolean;
  allow_comments?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogsApiResponse {
  results: Blog[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface FetchBlogsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  status?: "published" | "draft" | "archived";
  category?: string;
  tag?: string;
}
