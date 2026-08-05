"use client";

import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.78 4.78 0 01-3.77-1.28l.77-2.73z" />
    </svg>
  );
}

interface SocialShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export function SocialShare({ url, title, className }: SocialShareProps) {
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : SITE_URL);
  const shareText = title || "Check this out on PetSetu!";

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      brandClass: "hover:bg-[#1877F2] hover:text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "X",
      icon: Twitter,
      brandClass: "hover:bg-black hover:text-white",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      brandClass: "hover:bg-[#0A66C2] hover:text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      brandClass: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white",
      href: "https://www.instagram.com/petsetu/?hl=en",
    },
    {
      name: "TikTok",
      icon: TikTokIcon,
      brandClass: "hover:bg-black hover:text-white",
      href: "https://www.tiktok.com/@petsetu",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 shadow-sm transition-colors",
            link.brandClass
          )}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
