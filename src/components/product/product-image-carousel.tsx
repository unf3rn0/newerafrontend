"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ProductImageCarouselProps = {
  alt: string;
  children?: ReactNode;
  className?: string;
  frameClassName?: string;
  href?: string;
  imageLabel: string;
  imageUrls: string[];
  nextLabel: string;
  previousLabel: string;
  priority?: boolean;
  showThumbnails?: boolean;
  sizes: string;
};

export function ProductImageCarousel({
  alt,
  children,
  className,
  frameClassName,
  href,
  imageLabel,
  imageUrls,
  nextLabel,
  previousLabel,
  priority = false,
  showThumbnails = false,
  sizes,
}: ProductImageCarouselProps) {
  const gallery = useMemo(() => imageUrls.map((url) => url.trim()).filter(Boolean), [imageUrls]);
  const images = gallery.length > 0 ? gallery : ["/assets/brand-mark.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex] ?? images[0];

  function updateActiveIndex(nextIndex: number) {
    setActiveIndex((nextIndex + images.length) % images.length);
  }

  function moveBy(delta: number) {
    setActiveIndex((currentIndex) => (currentIndex + delta + images.length) % images.length);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!hasMultipleImages || event.pointerType === "mouse") {
      return;
    }

    pointerStart.current = { x: event.clientX, y: event.clientY };
    swipedRef.current = false;
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerStart.current) {
      return;
    }

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 38 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isHorizontalSwipe) {
      event.preventDefault();
      swipedRef.current = true;
      moveBy(deltaX > 0 ? -1 : 1);
      window.setTimeout(() => {
        swipedRef.current = false;
      }, 0);
    }

    pointerStart.current = null;
  }

  function handleLinkClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (swipedRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleControlClick(event: ReactMouseEvent<HTMLButtonElement>, delta: number) {
    event.preventDefault();
    event.stopPropagation();
    moveBy(delta);
  }

  const imageNode = (
    <Image
      alt={alt}
      className="object-cover transition duration-700 group-hover/media:scale-[1.035]"
      fill
      key={activeImage}
      priority={priority && activeIndex === 0}
      sizes={sizes}
      src={activeImage}
    />
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "group/media relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-strong",
          frameClassName,
        )}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          pointerStart.current = null;
        }}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "pan-y" }}
      >
        {href ? (
          <Link
            aria-label={alt}
            className="relative block h-full"
            href={href}
            onClick={handleLinkClick}
          >
            {imageNode}
          </Link>
        ) : (
          <div className="relative h-full">{imageNode}</div>
        )}

        {children}

        {hasMultipleImages ? (
          <>
            <button
              aria-label={previousLabel}
              className={cn(
                "absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition",
                "hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
                "h-9 w-9 md:opacity-0 md:group-hover/media:opacity-100",
                showThumbnails && "sm:h-11 sm:w-11",
              )}
              onClick={(event) => handleControlClick(event, -1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              aria-label={nextLabel}
              className={cn(
                "absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-foreground shadow-lg shadow-primary/10 backdrop-blur transition",
                "hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
                "h-9 w-9 md:opacity-0 md:group-hover/media:opacity-100",
                showThumbnails && "sm:h-11 sm:w-11",
              )}
              onClick={(event) => handleControlClick(event, 1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/85 px-2 py-1 shadow-sm shadow-primary/10 backdrop-blur">
              {images.map((imageUrl, index) => (
                <button
                  aria-label={`${imageLabel} ${index + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition",
                    index === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-foreground/25",
                  )}
                  key={`${imageUrl}-${index}`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    updateActiveIndex(index);
                  }}
                  type="button"
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {hasMultipleImages && showThumbnails ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((imageUrl, index) => (
            <button
              aria-label={`${imageLabel} ${index + 1}`}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-lg border bg-surface-strong transition",
                index === activeIndex
                  ? "border-primary shadow-sm shadow-primary/20"
                  : "border-border hover:border-primary/35",
              )}
              key={`${imageUrl}-${index}`}
              onClick={() => updateActiveIndex(index)}
              type="button"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="object-cover"
                fill
                sizes="120px"
                src={imageUrl}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
