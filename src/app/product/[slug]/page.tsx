import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Check, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { BuyBox, MobileBuyBar, PurchaseProvider } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ProductRail } from "@/components/product/product-rail";
import { Stars } from "@/components/product/rating";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { Reviews } from "@/components/product/reviews";
import { HealthWarning } from "@/components/shared/health-warning";
import { Crumbs } from "@/components/shared/page-head";
import { SectionHead } from "@/components/shared/section-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryBySlug } from "@/data/categories";
import { productBySlug, products } from "@/data/catalog";
import { sampleReviews } from "@/data/content";
import type { Product } from "@/data/types";
import { fa, faPlain, faRating, toman } from "@/lib/format";
import { FREE_SHIPPING_FROM, SHIPPING } from "@/lib/pricing";
import { byPopular, diverse } from "@/lib/product";
import { shopHref } from "@/lib/shop-query";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = productBySlug.get((await params).slug);
  return product ? { title: product.name, description: product.summary } : {};
}

// what is usually bought next to each type of product
const COMPANIONS: Record<Product["category"], string[]> = {
  hookah: ["زغال", "انبر و فویل", "سری قلیان", "شلنگ قلیان"],
  tobacco: ["سری قلیان", "انبر و فویل", "زغال", "شیشه قلیان"],
  "hookah-accessories": ["انبر و فویل", "سری قلیان", "شلنگ قلیان", "تنه و سینی", "زغال"],
  cigarette: ["جاسیگاری", "قوطی سیگار", "چوب سیگار", "فندک گازی"],
  lighter: ["سوخت فندک", "قوطی سیگار", "جاسیگاری"],
  "smoking-accessories": ["فندک بنزینی", "جاسیگاری", "کاغذ و فیلتر", "قوطی سیگار"],
  "rolling-tobacco": ["پیپ", "سیگارپیچ", "کاغذ و فیلتر", "جاسیگاری"],
};

const PROMISES = [
  [BadgeCheck, "ضمانت اصالت کالا"],
  [Truck, "ارسال ۱ تا ۴ روز کاری"],
  [PackageCheck, "بیمه‌ی حمل"],
  [RotateCcw, "هفت روز مهلت بازگشت"],
] as const;

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = productBySlug.get((await params).slug);
  if (!product) notFound();

  const category = categoryBySlug[product.category];
  const others = products.filter((p) => p.id !== product.id);
  const similar = others
    .filter((p) => p.category === product.category)
    .sort((a, b) => Number(b.type === product.type) - Number(a.type === product.type) || byPopular(a, b))
    .slice(0, 10);
  const companions = diverse(
    COMPANIONS[product.category].flatMap((type) => others.filter((p) => p.type === type && p.type !== product.type).sort(byPopular).slice(0, 3)),
    10,
    10,
  );
  const tab = "h-full shrink-0 grow-0 px-3.5 text-xs text-carbon sm:text-[0.8125rem]";
  const row = "grid grid-cols-[8rem_1fr] gap-3 rounded-lg px-3 py-2.5 odd:bg-mist sm:grid-cols-[14rem_1fr]";

  return (
    <PurchaseProvider key={product.id} product={product}>
      <article>
        <div className="shell pt-4">
          <Crumbs
            items={[
              { label: "فروشگاه", href: "/shop" },
              { label: category.name, href: shopHref({ cat: [category.slug] }) },
              { label: product.name },
            ]}
          />
          <div className="mt-3 grid items-start gap-5 md:grid-cols-2 lg:gap-7 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3.4fr)]">
            <div className="min-w-0 md:row-span-2 xl:row-span-1">
              <Gallery images={product.images} name={product.name} />
            </div>

            <div className="min-w-0">
              <Link href={shopHref({ cat: [category.slug], type: [product.type] })} className="text-xs font-semibold text-brand hover:underline">{product.type}</Link>
              <h1 className="heading title-page">{product.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <a href="#reviews" className="flex items-center gap-1 hover:text-foreground">
                  <Stars value={product.rating} className="[&_svg]:size-3" />
                  {faRating(product.rating)}
                </a>
                <span>{fa(product.sold)} فروش</span>
                <span>کد کالا: {faPlain(product.id)}</span>
              </div>
              <p className="mt-3 text-[0.8125rem] leading-7 text-muted-foreground">{product.summary}</p>
              <h2 className="heading mt-4 text-sm">ویژگی‌های اصلی</h2>
              <dl className="mt-2 grid grid-cols-2 gap-1.5">
                {product.specs.slice(2, 6).map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-mist px-3 py-2">
                    <dt className="text-[0.7rem] text-muted-foreground">{label}</dt>
                    <dd className="text-xs font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 space-y-1.5 text-xs">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 space-y-3 md:col-start-2 xl:col-start-auto">
              <BuyBox />
              {category.tobacco && <HealthWarning />}
              <ul className="grid grid-cols-2 gap-2 text-[0.7rem] text-muted-foreground">
                {PROMISES.map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon className="size-4 shrink-0 text-carbon" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="shell pt-9 lg:pt-12">
          <Tabs defaultValue="about">
            <TabsList className="no-scrollbar h-10 w-full justify-start overflow-x-auto overflow-y-hidden bg-mist sm:w-fit">
              <TabsTrigger value="about" className={tab}>معرفی محصول</TabsTrigger>
              <TabsTrigger value="specs" className={tab}>مشخصات</TabsTrigger>
              <TabsTrigger value="delivery" className={tab}>ارسال و بازگشت</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="max-w-3xl pt-3 text-[0.8125rem] leading-8">
              {product.description.map((paragraph) => (
                <p key={paragraph} className="mb-2">{paragraph}</p>
              ))}
            </TabsContent>
            <TabsContent value="specs" className="max-w-3xl pt-3 text-[0.8125rem]">
              <dl>
                {product.specs.map(([label, value]) => (
                  <div key={label} className={row}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
                {product.options.length > 1 && (
                  <div className={row}>
                    <dt className="text-muted-foreground">{product.optionLabel}</dt>
                    <dd className="font-semibold">{product.options.map((o) => o.label).join("، ")}</dd>
                  </div>
                )}
              </dl>
            </TabsContent>
            <TabsContent value="delivery" className="max-w-3xl pt-3 text-[0.8125rem]">
              <dl>
                {SHIPPING.map((method) => (
                  <div key={method.id} className={row}>
                    <dt className="text-muted-foreground">{method.name}</dt>
                    <dd className="font-semibold">{method.eta}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 leading-7">
                ارسال سفارش‌های بالای {toman(FREE_SHIPPING_FROM)} با پست رایگان است. برای اطلاع از جزئیات، <Link href="/terms#returns" className="text-brand underline">شرایط بازگشت کالا</Link> را مطالعه فرمایید.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {companions.length > 0 && (
          <section className="shell pt-9 lg:pt-12">
            <SectionHead title="محصولات مکمل" />
            <ProductRail products={companions} label="محصولات مکمل" />
          </section>
        )}

        <div className="shell pt-9 lg:pt-12">
          <Reviews productId={product.id} samples={sampleReviews(product)} />
        </div>

        {similar.length > 0 && (
          <section className="shell pt-9 lg:pt-12">
            <SectionHead title="محصولات مشابه" href={shopHref({ cat: [category.slug] })} />
            <ProductRail products={similar} label="محصولات مشابه" />
          </section>
        )}
        <RecentlyViewed exclude={product.id} />
        <div className="h-6" />
        <MobileBuyBar />
      </article>
    </PurchaseProvider>
  );
}
