import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/brand/category-icon";
import { SectionHead } from "@/components/shared/section-head";
import { categories } from "@/data/categories";
import { fa } from "@/lib/format";
import { shopHref } from "@/lib/shop-query";

const tile = "group flex h-full flex-col rounded-2xl p-1.5 text-center transition-transform duration-200 hover:-translate-y-1 lg:p-2";
const chip = "absolute start-0 top-0 grid size-6 place-items-center rounded-lg bg-white lg:size-7";

export function CategoriesSection({ counts, total }: { counts: Record<string, number>; total: number }) {
  return (
    <section aria-label="دسته‌بندی‌ها" className="shell pt-9 lg:pt-12">
      <SectionHead icon={LayoutGrid} title="دسته‌بندی‌ها" />
      <ul className="grid grid-cols-4 gap-1.5 sm:gap-2.5 lg:grid-cols-8 lg:gap-3">
        {categories.map((category) => (
          <li key={category.slug} className="min-w-0">
            <Link href={shopHref({ cat: [category.slug] })} className={tile} style={{ background: category.tint }}>
              <span className="relative block aspect-square">
                <Image src={category.image} alt="" fill sizes="(min-width: 64rem) 9rem, 25vw" className="object-contain p-1 transition-transform duration-300 group-hover:scale-110" />
                <span className={chip} style={{ color: category.ink }}>
                  <CategoryIcon slug={category.slug} className="size-3.5 lg:size-4" />
                </span>
              </span>
              <span className="mt-1 block truncate text-[0.7rem] font-semibold sm:text-[0.8125rem]">{category.name}</span>
              <span className="hidden text-[0.7rem] text-muted-foreground sm:block">{fa(counts[category.slug] ?? 0)} کالا</span>
            </Link>
          </li>
        ))}
        <li className="min-w-0">
          <Link href="/shop" className={`${tile} bg-carbon text-white`}>
            <span className="relative block aspect-square">
              <LayoutGrid aria-hidden="true" strokeWidth={1.4} className="absolute inset-0 m-auto size-8 text-flare transition-transform duration-300 group-hover:scale-110 lg:size-10" />
            </span>
            <span className="mt-1 block truncate text-[0.7rem] font-semibold sm:text-[0.8125rem]">همه‌ی کالاها</span>
            <span className="hidden text-[0.7rem] text-white/75 sm:block">{fa(total)} کالا</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
