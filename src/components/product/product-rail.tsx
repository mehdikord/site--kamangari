"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import type { Product } from "@/data/types";
import { ProductCard } from "./product-card";

interface Props {
  products: Product[];
  label: string;
  /** Cards visible at once on desktop. */
  visible?: 4 | 5;
  className?: string;
}

export function ProductRail({ products, label, visible = 5, className }: Props) {
  const track = useRef<HTMLUListElement>(null);
  // in RTL, "forward" is a negative scroll offset
  const move = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    el.scrollBy({ left: -direction * el.clientWidth * 0.8, behavior });
  };
  const arrow = "absolute top-[34%] z-10 hidden size-9 place-items-center rounded-full border bg-white text-carbon transition-colors hover:bg-mist lg:grid";

  return (
    <div className={cn("relative min-w-0", className)}>
      <ul ref={track} aria-label={label} className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain lg:gap-3">
        {products.map((product) => (
          <li key={product.id} className={cn("w-[46%] min-w-38 shrink-0 snap-start sm:w-[31%]", visible === 5 ? "lg:w-[calc((100%-3rem)/5)]" : "lg:w-[calc((100%-2.25rem)/4)]")}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {products.length > visible && (
        <>
          <button type="button" className={cn(arrow, "-right-3")} onClick={() => move(-1)} aria-label="محصولات قبلی">
            <ChevronRight className="size-4" />
          </button>
          <button type="button" className={cn(arrow, "-left-3")} onClick={() => move(1)} aria-label="محصولات بعدی">
            <ChevronLeft className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
