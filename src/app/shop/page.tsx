import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import { HealthWarning } from "@/components/shared/health-warning";
import { PageHead } from "@/components/shared/page-head";
import { ShopView } from "@/components/shop/shop-view";
import { categories, categoryBySlug } from "@/data/categories";
import { fa } from "@/lib/format";
import { parseQuery, queryProducts, shopHref, type ShopQuery } from "@/lib/shop-query";

function heading(query: ShopQuery) {
  if (query.q) return `نتایج جست‌وجوی «${query.q}»`;
  if (query.cat.length === 1) return query.type.length === 1 ? query.type[0] : categoryBySlug[query.cat[0]].name;
  if (query.flash) return "تخفیف‌های لحظه‌ای";
  if (query.sale) return "محصولات دارای تخفیف";
  if (query.sort === "newest") return "جدیدترین محصولات";
  return "فروشگاه";
}

export async function generateMetadata({ searchParams }: PageProps<"/shop">): Promise<Metadata> {
  return { title: heading(parseQuery(await searchParams)) };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const query = parseQuery(await searchParams);
  const result = queryProducts(query);
  const title = heading(query);
  const single = query.cat.length === 1 ? categoryBySlug[query.cat[0]] : undefined;

  return (
    <>
      <PageHead title={title} description={single?.blurb} crumbs={title === "فروشگاه" ? [{ label: title }] : [{ label: "فروشگاه", href: "/shop" }, { label: title }]}>
        <ul className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto" aria-label="دسته‌بندی‌ها">
          {categories.map((category) => {
            const active = query.cat.includes(category.slug);
            return (
              <li key={category.slug} className="shrink-0">
                <Link
                  href={shopHref({ cat: active ? [] : [category.slug] })}
                  aria-current={active ? "true" : undefined}
                  className={cn("flex h-11 items-center gap-1.5 rounded-xl ps-1.5 pe-3 text-xs whitespace-nowrap transition-colors", active ? "bg-carbon text-white" : "bg-white hover:bg-secondary")}
                >
                  <Image src={category.image} alt="" width={36} height={36} className="size-9 object-contain" />
                  {category.name}
                  <span className="text-[0.65rem]">{fa(result.facets.cat.find((f) => f.value === category.slug)?.count ?? 0)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageHead>
      {single?.tobacco && <HealthWarning className="shell mt-3" />}
      <ShopView query={query} result={result} />
    </>
  );
}
