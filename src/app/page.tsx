import { CircleHelp, Sparkles } from "lucide-react";
import { Builder } from "@/components/home/builder";
import { CategoriesSection } from "@/components/home/categories-section";
import { Features } from "@/components/home/features";
import { FlashDeals } from "@/components/home/flash-deals";
import { Hero } from "@/components/home/hero";
import { Popular } from "@/components/home/popular";
import { PromoGrid } from "@/components/home/promo-grid";
import { QuickLinks } from "@/components/home/quick-links";
import { Testimonials } from "@/components/home/testimonials";
import { WholesaleBand } from "@/components/home/wholesale-band";
import { ProductRail } from "@/components/product/product-rail";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { FaqList } from "@/components/shared/faq-list";
import { SectionHead } from "@/components/shared/section-head";
import { categories } from "@/data/categories";
import { products } from "@/data/catalog";
import { faq } from "@/data/content";
import { byNewest, byPopular, diverse } from "@/lib/product";
import { shopHref } from "@/lib/shop-query";

export default function HomePage() {
  const counts = Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));
  const popular = [...products].sort(byPopular);
  const flash = products.filter((p) => p.flash);
  const groups = [
    { id: "all", label: "همه", products: diverse(popular, 10) },
    ...categories.map((c) => ({ id: c.slug, label: c.name, products: popular.filter((p) => p.category === c.slug && p.stock > 0).slice(0, 10) })),
  ];
  const questions = [faq[0].items[0], faq[1].items[0], faq[1].items[1], faq[2].items[0], faq[2].items[1], faq[3].items[0]];

  return (
    <>
      <Hero featured={flash.find((p) => p.category === "hookah" && p.slug !== "qalyan-shab") ?? flash[0]} />
      <QuickLinks />
      <CategoriesSection counts={counts} total={products.length} />
      <FlashDeals products={flash} />
      <PromoGrid />
      <Popular groups={groups} />
      <Builder />
      <section className="shell pt-9 lg:pt-12">
        <SectionHead icon={Sparkles} title="جدیدترین محصولات" href={shopHref({ sort: "newest" })} />
        <ProductRail products={diverse([...products].sort(byNewest), 10)} label="جدیدترین محصولات" />
      </section>
      <WholesaleBand />
      <Features />
      <Testimonials />
      <section className="shell pt-9 lg:pt-12">
        <SectionHead icon={CircleHelp} title="سوالات متداول" href="/faq" />
        <div className="grid items-start gap-2 lg:grid-cols-2 lg:gap-3">
          <FaqList items={questions.slice(0, 3)} />
          <FaqList items={questions.slice(3)} />
        </div>
      </section>
      <RecentlyViewed />
    </>
  );
}
