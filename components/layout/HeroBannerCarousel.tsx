"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
// embla-carousel-autoplay types sometimes mismatch embla-carousel-react version; use dynamic require to avoid TS incompatibility
const Autoplay: any =
  require("embla-carousel-autoplay").default ||
  require("embla-carousel-autoplay");

// Static imports so Next can optimize & generate blur placeholders (if configured)
import img1 from "@/assets/home_banner/alvan-nee-ZCHj_2lJP00-unsplash.jpg";
import img2 from "@/assets/home_banner/andrew-s-ouo1hbizWwo-unsplash.jpg";
import img3 from "@/assets/home_banner/diego-rodriguez-prMB2KfnEQY-unsplash.jpg";
import img4 from "@/assets/home_banner/veronika-jorjobert-27w3ULIIJfI-unsplash.jpg";

const IMAGES: StaticImageData[] = [img1, img2, img3, img4];

interface HeroBannerCarouselProps {
  className?: string;
  aspect?: "square" | "video" | "ultrawide"; // allow flexibility later
  autoPlayDelay?: number; // ms
}

/**
 * Postcard style hero banner carousel.
 * - Rounded corners, subtle drop shadow
 * - Slight scale & parallax fade between slides
 * - Autoplay with pause on hover + manual nav arrows + dots
 */
export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  className,
  aspect = "square",
  autoPlayDelay = 3000,
}) => {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(IMAGES.length);

  useEffect(() => {
    if (!api) return;
    setCount(api.slideNodes().length);
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "video"
      ? "aspect-video"
      : "aspect-[21/9]";

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={
          [
            Autoplay({
              delay: autoPlayDelay,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ] as any
        }
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {IMAGES.map((img, idx) => (
            <CarouselItem key={idx} className="pl-2">
              <div className="[perspective:1600px]">
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-3xl shadow-2xl group will-change-transform transition-transform duration-700",
                    aspectClass
                  )}
                >
                  {/* Decorative stacked postcard layers */}
                  <div
                    className="pointer-events-none absolute inset-0 -rotate-2 scale-[1.02] rounded-3xl bg-white/20 shadow-lg backdrop-blur-sm"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rotate-3 scale-[1.01] rounded-3xl bg-white/10 shadow-md"
                    aria-hidden
                  />
                  <Image
                    src={img}
                    alt={`Pet banner ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover rounded-3xl transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/20 to-transparent mix-blend-multiply rounded-3xl" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 border-none shadow-md" />
        <CarouselNext className="bg-white/70 backdrop-blur-sm hover:bg-white text-gray-700 border-none shadow-md" /> */}
      </Carousel>

      {/* Dots */}
      {/* <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {Array.from({ length: count }).map((_, i) => {
          const isActive = current === i;
          return (
            <button
              key={i}
              onClick={() => api && api.scrollTo(i)}
              className={cn(
                "group relative h-2 w-6 overflow-hidden rounded-full bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                isActive && "bg-orange-200"
              )}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive}
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-[3500ms] ease-linear",
                  isActive && "scale-x-100"
                )}
              />
            </button>
          );
        })}
      </div> */}
    </div>
  );
};

export default HeroBannerCarousel;
