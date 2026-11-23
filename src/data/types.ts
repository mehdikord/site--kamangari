export type CategorySlug =
  | "cigarette"
  | "tobacco"
  | "lighter"
  | "smoking-accessories"
  | "hookah"
  | "hookah-accessories"
  | "rolling-tobacco";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
  /** Soft background and matching icon colour. */
  tint: string;
  ink: string;
  /** True for products made of tobacco: these always show the health warning. */
  tobacco: boolean;
  types: string[];
}

export interface ProductOption {
  id: string;
  label: string;
  price: number;
  /** Price before discount. */
  was?: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: CategorySlug;
  type: string;
  brand: string;
  images: string[];
  optionLabel?: string;
  /** Always has at least one entry. */
  options: ProductOption[];
  stock: number;
  sold: number;
  /** Higher means newer. */
  added: number;
  rating: number;
  flash: boolean;
  /** Automatic wholesale discount from this quantity of a single option. */
  bulk: { min: number; percent: number };
  flavor?: string;
  material?: string;
  summary: string;
  description: string[];
  features: string[];
  specs: [string, string][];
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  body: string;
}
