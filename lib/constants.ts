// Centralized constants for the PetSetu web app
// Image base host (S3)
export const IMAGE_BASE_URL = "https://petsetu-dev.s3.ap-south-1.amazonaws.com";

// Public site URL used for absolute links in metadata/sitemap/robots
// Can be overridden via env for previews
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://petsetu.com";

// Pet category -> backend categoryId mapping (as provided)
// NOTE: user provided key name petCatogryIdMap (typo retained for compatibility)
export const petCatogryIdMap: Record<string, string> = {
  dog: "604b2158e256ed891404ca5c",
  cat: "604b21b6e256ed891404ca8a",
  bunny: "604b21c4e256ed891404ca92",
  // alias to support 'rabbit' label used on home page
  rabbit: "604b21c4e256ed891404ca92",
};

// Alias with corrected spelling for internal usage
export const PET_CATEGORY_ID_MAP = petCatogryIdMap;
