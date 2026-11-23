import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  { slug: "hookah", tint: "#e8f0ff", ink: "#2f5fd0", name: "قلیان", blurb: "استیل، آلومینیوم و چوب", image: "/images/catalog/qalyan-lajvard-0.webp", tobacco: false, types: ["قلیان چوبی", "قلیان فلزی"] },
  { slug: "tobacco", tint: "#ffe9ea", ink: "#c9363f", name: "تنباکو", blurb: "معسل طعم‌دار و سنتی", image: "/images/catalog/moassel-doosib-0.webp", tobacco: true, types: ["معسل طعم‌دار", "تنباکوی سنتی"] },
  { slug: "hookah-accessories", tint: "#e2f6f4", ink: "#0f6b64", name: "لوازم قلیان", blurb: "شیشه، شلنگ، سری و زغال", image: "/images/catalog/hose-black-0.webp", tobacco: false, types: ["زغال", "شیشه قلیان", "شلنگ قلیان", "سری قلیان", "تنه و سینی", "انبر و فویل"] },
  { slug: "cigarette", tint: "#fff3dc", ink: "#a2660a", name: "سیگار", blurb: "ایرانی و خارجی", image: "/images/catalog/davidoff-0.webp", tobacco: true, types: ["سیگار ایرانی", "سیگار خارجی"] },
  { slug: "lighter", tint: "#ffeee6", ink: "#bd3a0b", name: "فندک", blurb: "بنزینی، گازی و سوخت", image: "/images/catalog/zippo-chrome-0.webp", tobacco: false, types: ["فندک بنزینی", "فندک گازی", "سوخت فندک"] },
  { slug: "smoking-accessories", tint: "#efeaff", ink: "#5b3fc4", name: "لوازم سیگار", blurb: "پیپ، جاسیگاری و سیگارپیچ", image: "/images/catalog/pipe-blue-0.webp", tobacco: false, types: ["پیپ", "چوب سیگار", "جاسیگاری", "قوطی سیگار", "سیگارپیچ", "کاغذ و فیلتر", "شیکر و گرایندر", "لوازم سیگاربرگ"] },
  { slug: "rolling-tobacco", tint: "#e6f5e9", ink: "#2f7a3a", name: "توتون", blurb: "پیپ و دست‌پیچ", image: "/images/catalog/toton-burley-0.webp", tobacco: true, types: ["توتون پیپ", "توتون دست‌پیچ"] },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<CategorySlug, Category>;
