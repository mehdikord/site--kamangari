import type { Product, ProductOption } from "@/data/types";

export const discountPercent = (option: ProductOption) =>
  option.was && option.was > option.price ? Math.round((1 - option.price / option.was) * 100) : 0;

export const basePrice = (product: Product) => product.options[0].price;
export const productDiscount = (product: Product) => discountPercent(product.options[0]);

export const byPopular = (a: Product, b: Product) => b.sold - a.sold;
export const byNewest = (a: Product, b: Product) => b.added - a.added;

/** Takes the top items while letting no single category fill the row. */
export function diverse(list: Product[], count: number, perCategory = 2) {
  const used: Partial<Record<string, number>> = {};
  const picked: Product[] = [];
  for (const product of list) {
    const n = used[product.category] ?? 0;
    if (n >= perCategory || product.stock === 0) continue;
    used[product.category] = n + 1;
    picked.push(product);
    if (picked.length === count) break;
  }
  return picked;
}
