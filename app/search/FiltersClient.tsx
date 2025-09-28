"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const postTypeOptions = [
  { label: "All", value: "all" },
  { label: "Sell", value: "sell" },
  { label: "Adopt", value: "adopt" },
  { label: "Breed", value: "breed" },
];

const petCategoryOptions = ["dog", "cat", "bunny"]; // compact list

export function FiltersClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [postType, setPostType] = useState(sp.get("type") || "");
  const [location, setLocation] = useState(sp.get("loc") || "");
  const [petCategory, setPetCategory] = useState(sp.get("cat") || "");

  useEffect(() => {
    setPostType(sp.get("type") || "");
    setLocation(sp.get("loc") || "");
    setPetCategory(sp.get("cat") || "");
  }, [sp]);

  const updateUrl = (page?: number) => {
    const params = new URLSearchParams();
    if (postType && postType !== "all") params.set("type", postType);
    if (location) params.set("loc", location);
    if (petCategory && petCategory !== "all") params.set("cat", petCategory);
    if (page) params.set("page", String(page));
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <div
      className="grid gap-2 md:grid-cols-5 items-center"
      aria-busy={isPending}
      aria-live="polite"
    >
      {/* Type */}
      <div>
        <label htmlFor="post-type" className="sr-only">
          Type
        </label>
        <Select value={postType} onValueChange={setPostType}>
          <SelectTrigger
            id="post-type"
            className="h-9 text-sm text-gray-500"
            disabled={isPending}
          >
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {postTypeOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Pet Category */}
      <div>
        <label htmlFor="pet-category" className="sr-only">
          Pet Category
        </label>
        <Select value={petCategory} onValueChange={setPetCategory}>
          <SelectTrigger
            id="pet-category"
            className="h-9 text-sm text-gray-500"
            disabled={isPending}
          >
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {petCategoryOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Location */}
      <div>
        <label htmlFor="loc" className="sr-only">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="loc"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-7 h-9 text-sm"
            disabled={isPending}
          />
        </div>
      </div>
      {/* Actions */}
      <div className="col-span-2 flex gap-2">
        <Button
          onClick={() => updateUrl()}
          className="flex-[3] h-9 text-sm bg-orange-600 hover:bg-orange-700"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...
            </>
          ) : (
            "Apply"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-9 text-sm"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              setPostType("all");
              setLocation("");
              setPetCategory("all");
              router.push("/search");
            });
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
