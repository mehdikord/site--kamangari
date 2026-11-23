import { categories, categoryBySlug } from "@/data/categories";
import { products } from "@/data/catalog";
import type { CategorySlug, Product } from "@/data/types";
import { digitsOnly, normalizeSearch } from "./format";
import { basePrice, byNewest, byPopular, productDiscount } from "./product";

export const SORTS = {
  popular: "پرطرفدارترین",
  newest: "جدیدترین",
  cheapest: "ارزان‌ترین",
  priciest: "گران‌ترین",
  discount: "بیشترین تخفیف",
  rating: "بالاترین امتیاز",
  name: "نام، الفبایی",
} as const;

export type SortKey = keyof typeof SORTS;
export const PAGE_SIZES = [12, 24, 48];

export interface ShopQuery {
  q: string;
  cat: CategorySlug[];
  type: string[];
  brand: string[];
  material: string[];
  flavor: string[];
  min: number;
  max: number;
  sale: boolean;
  flash: boolean;
  stock: boolean;
  rating: number;
  sort: SortKey;
  page: number;
  per: number;
  view: "grid" | "list";
}

export const EMPTY_QUERY: ShopQuery = {
  q: "", cat: [], type: [], brand: [], material: [], flavor: [],
  min: 0, max: 0, sale: false, flash: false, stock: false, rating: 0,
  sort: "popular", page: 1, per: 12, view: "grid",
};

type RawParams = Record<string, string | string[] | undefined>;

export function parseQuery(params: RawParams): ShopQuery {
  const all = (key: string) => {
    const value = params[key];
    return value === undefined ? [] : Array.isArray(value) ? value : [value];
  };
  const one = (key: string) => all(key)[0] ?? "";
  const int = (key: string) => Number(digitsOnly(one(key)).slice(0, 12)) || 0;
  const sort = one("sort");
  const per = int("per");
  return {
    q: one("q").slice(0, 80),
    cat: all("cat").filter((value): value is CategorySlug => categories.some((c) => c.slug === value)),
    type: all("type"),
    brand: all("brand"),
    material: all("material"),
    flavor: all("flavor"),
    min: int("min"),
    max: int("max"),
    sale: one("sale") === "1",
    flash: one("flash") === "1",
    stock: one("stock") === "1",
    rating: Math.min(Number(one("rating")) || 0, 5),
    sort: Object.hasOwn(SORTS, sort) ? (sort as SortKey) : "popular",
    page: Math.max(1, int("page")),
    per: PAGE_SIZES.includes(per) ? per : 12,
    view: one("view") === "list" ? "list" : "grid",
  };
}

export function shopHref(query: Partial<ShopQuery>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === EMPTY_QUERY[key as keyof ShopQuery]) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (typeof value === "boolean") {
      if (value) params.set(key, "1");
    } else if (value !== undefined) params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `/shop?${search}` : "/shop";
}

const haystacks = new Map<number, string>();

function matchesSearch(product: Product, words: string[]) {
  if (!words.length) return true;
  let text = haystacks.get(product.id);
  if (text === undefined) {
    text = normalizeSearch([product.name, product.brand, product.type, product.flavor, product.material, product.slug, categoryBySlug[product.category].name].filter(Boolean).join(" "));
    haystacks.set(product.id, text);
  }
  return words.every((word) => text.includes(word));
}

export function searchProducts(term: string) {
  const words = normalizeSearch(term).split(" ").filter(Boolean);
  return words.length ? products.filter((p) => matchesSearch(p, words)).sort(byPopular) : [];
}

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: byPopular,
  newest: byNewest,
  cheapest: (a, b) => basePrice(a) - basePrice(b),
  priciest: (a, b) => basePrice(b) - basePrice(a),
  discount: (a, b) => productDiscount(b) - productDiscount(a) || byPopular(a, b),
  rating: (a, b) => b.rating - a.rating || byPopular(a, b),
  name: (a, b) => a.name.localeCompare(b.name, "fa"),
};

export interface Facet {
  value: string;
  label: string;
  count: number;
}

export function queryProducts(query: ShopQuery) {
  const words = normalizeSearch(query.q).split(" ").filter(Boolean);
  // facet counts follow search and category, so a choice never empties its own list
  const searched = products.filter((p) => matchesSearch(p, words));
  const scoped = query.cat.length ? searched.filter((p) => query.cat.includes(p.category)) : searched;
  const matched = scoped.filter(
    (p) =>
      (!query.type.length || query.type.includes(p.type)) &&
      (!query.brand.length || query.brand.includes(p.brand)) &&
      (!query.material.length || query.material.includes(p.material ?? "")) &&
      (!query.flavor.length || query.flavor.includes(p.flavor ?? "")) &&
      (!query.min || basePrice(p) >= query.min) &&
      (!query.max || basePrice(p) <= query.max) &&
      (!query.sale || productDiscount(p) > 0) &&
      (!query.flash || p.flash) &&
      (!query.stock || p.stock > 0) &&
      (!query.rating || p.rating >= query.rating),
  );
  const sorter = SORTERS[query.sort];
  matched.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || sorter(a, b));

  const facet = (key: "type" | "brand" | "material" | "flavor"): Facet[] => {
    const counts = new Map<string, number>();
    for (const p of scoped) if (p[key]) counts.set(p[key], (counts.get(p[key]) ?? 0) + 1);
    for (const chosen of query[key]) if (!counts.has(chosen)) counts.set(chosen, 0);
    return [...counts].map(([value, count]) => ({ value, label: value, count })).sort((a, b) => b.count - a.count);
  };

  const pages = Math.max(1, Math.ceil(matched.length / query.per));
  const page = Math.min(query.page, pages);
  return {
    total: matched.length,
    pages,
    page,
    items: matched.slice((page - 1) * query.per, page * query.per),
    facets: {
      cat: categories.map((c): Facet => ({ value: c.slug, label: c.name, count: searched.filter((p) => p.category === c.slug).length })),
      type: facet("type"),
      brand: facet("brand"),
      material: facet("material"),
      flavor: facet("flavor"),
    },
  };
}

export type ShopResult = ReturnType<typeof queryProducts>;
