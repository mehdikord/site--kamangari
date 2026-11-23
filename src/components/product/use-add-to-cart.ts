"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, ProductOption } from "@/data/types";
import { fa } from "@/lib/format";
import { flyToCart } from "@/lib/fly-to-cart";
import { useShop } from "@/lib/store";

export function useAddToCart() {
  const router = useRouter();
  const add = useShop((s) => s.add);

  return (product: Product, option: ProductOption, qty = 1, image?: Element | null) => {
    const added = add(product.id, option.id, qty);
    if (!added) {
      toast.error("موجودی انبار برای افزودن تعداد بیشتر کافی نیست.", { description: product.name });
      return;
    }
    flyToCart(image);
    const detail = product.options.length > 1 ? `${product.name}، ${option.label}` : product.name;
    toast.success(added < qty ? `فقط ${fa(added)} عدد موجود بود و افزوده شد` : "به سبد خرید افزوده شد", {
      description: detail,
      action: { label: "مشاهده‌ی سبد", onClick: () => router.push("/cart") },
    });
  };
}
