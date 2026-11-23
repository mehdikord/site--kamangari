import Link from "next/link";
import { Zap } from "lucide-react";
import { ProductRail } from "@/components/product/product-rail";
import { Countdown } from "@/components/shared/countdown";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/types";
import { shopHref } from "@/lib/shop-query";

export function FlashDeals({ products }: { products: Product[] }) {
  return (
    <section className="shell pt-9 lg:pt-12">
      <div className="grid gap-3 rounded-3xl bg-brand bg-[radial-gradient(ellipse_60%_90%_at_100%_0%,#e2571f,transparent)] p-2.5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:p-3">
        <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden p-3 text-white lg:flex-col lg:items-start lg:justify-center lg:p-4">
          <Zap aria-hidden="true" className="pointer-events-none absolute -bottom-6 -left-6 size-36 fill-white/10 text-transparent max-lg:hidden" />
          <div>
            <span className="mb-2 grid size-10 place-items-center rounded-2xl bg-white text-brand max-lg:hidden">
              <Zap className="size-5 fill-current" aria-hidden="true" />
            </span>
            <h2 className="heading title-section">تخفیف‌های لحظه‌ای</h2>
            <p className="text-xs">معتبر تا پایان امروز</p>
          </div>
          <Countdown />
          <Button asChild size="sm" className="bg-white text-carbon hover:bg-mist max-lg:w-full lg:mt-3">
            <Link href={shopHref({ flash: true })}>مشاهده‌ی همه</Link>
          </Button>
        </div>
        <ProductRail products={products} visible={4} label="تخفیف‌های لحظه‌ای" />
      </div>
    </section>
  );
}
