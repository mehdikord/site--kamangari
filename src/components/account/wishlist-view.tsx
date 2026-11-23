"use client";

import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { productById } from "@/data/catalog";
import { useReady, useShop } from "@/lib/store";

export function WishlistView() {
  const ready = useReady();
  const ids = useShop((s) => s.wishlist);
  if (!ready) return <Loading />;
  const items = ids.flatMap((id) => productById.get(id) ?? []);
  if (!items.length) return <EmptyState title="فهرست علاقه‌مندی‌ها خالی است" text="برای افزودن کالا، نشان علاقه‌مندی هر محصول را انتخاب کنید." />;
  return (
    <ul className="shell grid grid-cols-2 gap-2.5 py-5 md:grid-cols-4 lg:grid-cols-5 lg:gap-3 lg:py-7">
      {items.map((product) => (
        <li key={product.id} className="min-w-0"><ProductCard product={product} /></li>
      ))}
    </ul>
  );
}
