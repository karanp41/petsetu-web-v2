"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const nav = (target: number) => {
    const params = new URLSearchParams(sp.toString());
    if (target === 1) params.delete("page");
    else params.set("page", String(target));
    router.push(`/search?${params.toString()}`);
  };

  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        disabled={!canPrev}
        onClick={() => nav(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={!canNext}
        onClick={() => nav(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
