"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const nav = (target: number) => {
    const params = new URLSearchParams(sp.toString());
    if (target === 1) params.delete("page");
    else params.set("page", String(target));
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  if (totalPages <= 1) return null;
  return (
    <div
      className="flex items-center justify-center gap-4 py-8"
      aria-busy={isPending}
      aria-live="polite"
    >
      <Button
        variant="outline"
        disabled={!canPrev || isPending}
        onClick={() => nav(page - 1)}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Previous
          </>
        ) : (
          "Previous"
        )}
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={!canNext || isPending}
        onClick={() => nav(page + 1)}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Next
          </>
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
}
