"use client";

import { useMemo } from "react";
import { SectionHead } from "@/components/shared/section-head";
import { productById } from "@/data/catalog";
import type { Product } from "@/data/types";
import { useReady, useShop } from "@/lib/store";
import { ProductRail } from "./product-rail";

export function RecentlyViewed({ exclude }: { exclude?: number }) {
  const ready = useReady();
  const recent = useShop((s) => s.recent);
  const products = useMemo(
    () => recent.filter((id) => id !== exclude).map((id) => productById.get(id)).filter((p): p is Product => !!p),
    [recent, exclude],
  );
  if (!ready || !products.length) return null;
  return (
    <section className="shell pt-9 lg:pt-12">
      <SectionHead title="بازدیدهای اخیر" />
      <ProductRail products={products} label="بازدیدهای اخیر" />
    </section>
  );
}
