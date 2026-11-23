"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { cn } from "cn";
import { categoryBySlug } from "@/data/categories";
import type { Product } from "@/data/types";
import { fa, faRating } from "@/lib/format";
import { Price } from "./price";
import { CompareButton, WishButton } from "./save-buttons";
import { useAddToCart } from "./use-add-to-cart";

interface Props {
  product: Product;
  layout?: "grid" | "list";
  eager?: boolean;
}

const SIZES = "(min-width: 80rem) 15rem, (min-width: 48rem) 25vw, 50vw";

export function ProductCard({ product, layout = "grid", eager }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const addToCart = useAddToCart();
  const list = layout === "list";
  const soldOut = product.stock === 0;
  const option = product.options[0];
  const href = `/product/${product.slug}`;
  const second = product.images[1];

  return (
    <article className={cn("group/card relative flex h-full min-w-0 rounded-2xl border bg-white p-1.5 text-carbon transition-colors hover:border-input [--muted-foreground:#5a606b]", list ? "flex-row gap-3 sm:gap-5" : "flex-col")}>
      <div className={cn("relative shrink-0 overflow-hidden rounded-xl bg-mist", list ? "w-28 self-start sm:w-40" : "w-full")}>
        <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square">
          <Image
            ref={imageRef}
            src={product.images[0]}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={SIZES}
            className={cn("object-contain transition-opacity duration-300", soldOut ? "opacity-45 grayscale" : "[@media(hover:hover)]:group-hover/card:opacity-0")}
          />
          {!soldOut && second && (
            <Image src={second} alt="" fill sizes={SIZES} className="hidden object-contain opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 [@media(hover:hover)]:block" />
          )}
        </Link>
        <div className="pointer-events-none absolute start-2 top-2 flex flex-col items-start gap-1 text-[0.65rem] font-semibold">
          {soldOut ? (
            <span className="rounded-full bg-white px-2 py-0.5">ناموجود</span>
          ) : (
            <>
              {product.flash && <span className="rounded-full bg-carbon px-2 py-0.5 text-white">پیشنهاد ویژه</span>}
              {product.stock <= 4 && <span className="rounded-full bg-white px-2 py-0.5">{fa(product.stock)} عدد باقی‌مانده</span>}
            </>
          )}
        </div>
        <div className="absolute end-1.5 top-1.5 flex flex-col gap-1 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/card:opacity-100 [@media(hover:hover)]:group-hover/card:opacity-100">
          <WishButton id={product.id} name={product.name} className="size-8" />
          <CompareButton id={product.id} name={product.name} className={"size-8 max-sm:hidden"} />
        </div>
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col px-1.5 pb-1", list ? "pt-1" : "pt-2.5")}>
        <div className="flex items-center justify-between gap-2 text-[0.7rem] text-muted-foreground">
          <span className="truncate">{product.type}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Star className="size-3 fill-star text-star" aria-hidden="true" />
            {faRating(product.rating)}
          </span>
        </div>
        <h3 className="mt-0.5 text-[0.8125rem] leading-6 font-semibold sm:text-sm">
          <Link href={href} className={cn("line-clamp-2 break-words hover:text-brand", !list && "min-h-12")}>{product.name}</Link>
        </h3>
        {list && <p className="text-xs leading-6 text-muted-foreground max-sm:hidden">{product.summary}</p>}
        {list && categoryBySlug[product.category].tobacco && <p className="text-[0.7rem] font-semibold text-danger max-sm:hidden">مخصوص افراد بالای ۱۸ سال؛ دخانیات عامل سرطان است.</p>}
        <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
          <Price option={option} from={product.options.length > 1} />
          <button
            type="button"
            disabled={soldOut}
            aria-label={`افزودن ${product.name} به سبد`}
            onClick={() => addToCart(product, option, 1, imageRef.current)}
            className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-mist transition-colors after:absolute after:-inset-1.5 hover:bg-brand hover:text-white disabled:opacity-35 sm:size-9"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
