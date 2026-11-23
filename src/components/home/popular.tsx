"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { CategoryIcon } from "@/components/brand/category-icon";
import { ProductCard } from "@/components/product/product-card";
import { SectionHead } from "@/components/shared/section-head";
import type { Product } from "@/data/types";
import { shopHref } from "@/lib/shop-query";

export function Popular({ groups }: { groups: { id: string; label: string; products: Product[] }[] }) {
  const [active, setActive] = useState(groups[0].id);
  const group = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <section className="mt-9 bg-mist py-8 lg:mt-12 lg:py-10">
      <div className="shell">
        <SectionHead icon={TrendingUp} title="پرطرفدارترین محصولات" href={shopHref({ sort: "popular" })} className="mb-3 [&>div>span]:bg-white" />
        <div role="group" aria-label="بخش محصولات" className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
          {groups.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={id === active} onClick={() => setActive(id)} className={cn("relative flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs whitespace-nowrap transition-colors", id === active ? "text-white" : "bg-white text-carbon hover:bg-secondary")}>
              {id === active && <motion.span layoutId="popular-pill" className="absolute inset-0 rounded-xl bg-carbon" transition={{ type: "spring", bounce: 0.12, visualDuration: 0.3 }} />}
              <CategoryIcon slug={id} className={cn("relative size-3.5", id === active && "text-flare")} />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} className="grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-3">
            {group.products.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
