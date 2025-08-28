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
