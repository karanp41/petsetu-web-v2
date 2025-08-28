"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_BASE_URL } from "@/lib/constants";
import { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, PawPrint } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const firstPhoto = post.photos?.[0];
  // Photos may already contain a full URL. If not, prefix with our S3 host.
  const imageUrl = firstPhoto
    ? firstPhoto.startsWith("http")
      ? firstPhoto
      : `${IMAGE_BASE_URL.replace(/\/$/, "")}/${firstPhoto.replace(/^\//, "")}`
    : null;
  const category = post.petCategoryDetails?.petCategory;
  const price = post.price ? `${post.currency || "INR"} ${post.price}` : "";
  const location = [post.city, post.state].filter(Boolean).join(", ");

  return (
    <Card className="overflow-hidden group border-0 shadow hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={post.isFeatured}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <PawPrint className="h-10 w-10" />
          </div>
        )}
        {post.isFeatured && (
          <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Featured
          </span>
        )}
        {category && (
          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 hover:bg-white">
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold line-clamp-1" title={post.title}>
            {post.title}
          </h3>
          <Badge
            className={cn(
              "text-xs capitalize",
              post.postType === "sell" && "bg-green-100 text-green-700",
              post.postType === "adopt" && "bg-blue-100 text-blue-700",
              post.postType === "breed" && "bg-purple-100 text-purple-700"
            )}
          >
            {post.postType}
          </Badge>
        </div>
        <p
          className="text-sm text-gray-600 line-clamp-2"
          title={post.description}
        >
          {post.description || "No description provided."}
        </p>
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="font-medium text-gray-900">{price}</span>
          {location && (
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" /> {location}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
