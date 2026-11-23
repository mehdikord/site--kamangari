"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CouponField } from "@/components/checkout/coupon-field";
import { SummaryRows } from "@/components/checkout/summary";
import { ProductRail } from "@/components/product/product-rail";
import { EmptyState } from "@/components/shared/empty-state";
import { HealthWarning } from "@/components/shared/health-warning";
import { Loading } from "@/components/shared/loading";
import { Quantity } from "@/components/shared/quantity";
import { SectionHead } from "@/components/shared/section-head";
import { Button } from "@/components/ui/button";
import { categoryBySlug } from "@/data/categories";
import { products } from "@/data/catalog";
import { fa, toman } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";
import { byPopular } from "@/lib/product";
import { useCart, useShop } from "@/lib/store";
import { FreeShippingMeter } from "./free-shipping-meter";

const EXTRAS = ["زغال", "انبر و فویل", "سوخت فندک", "کاغذ و فیلتر", "سری قلیان"];

function CartRow({ line, index }: { line: PricedLine; index: number }) {
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const restore = useShop((s) => s.restore);
  const { product, selected } = line;
  const before = (selected.was ?? selected.price) * line.qty;
  const toGo = product.bulk.min - line.qty;

  function removeWithUndo() {
    remove(line.id, line.option);
    toast("کالا از سبد خرید حذف شد", {
      description: product.name,
      action: { label: "بازگردانی", onClick: () => restore({ id: line.id, option: line.option, qty: line.qty }, index) },
    });
  }

  return (
    <motion.li layout="position" initial={false} exit={{ opacity: 0, x: -80 }} transition={{ type: "spring", bounce: 0.12, visualDuration: 0.35 }} className="border-b py-3.5 first:pt-0">
      <div className="flex gap-3 sm:gap-4">
        <Link href={`/product/${product.slug}`} className="shrink-0">
          <Image src={product.images[0]} alt="" width={160} height={160} className="size-20 rounded-xl bg-mist object-contain sm:size-28" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-[0.8125rem] font-semibold sm:text-sm"><Link href={`/product/${product.slug}`}>{product.name}</Link></h2>
              <p className="text-[0.7rem] text-muted-foreground sm:text-xs">
                {product.options.length > 1 ? `${product.optionLabel}: ${selected.label}` : product.type}
              </p>
            </div>
            <button type="button" onClick={removeWithUndo} aria-label={`حذف ${product.name}`} className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-danger">
              <Trash2 className="size-4.5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">هر عدد {toman(selected.price)}</p>
          <p className="mt-1 text-xs font-semibold text-success empty:hidden">
            {line.bulkApplied
              ? `تخفیف عمده‌ی ${fa(product.bulk.percent)}٪ فعال است`
              : toGo <= 3 && product.bulk.min <= product.stock
                ? `${fa(toGo)} عدد دیگر تا ${fa(product.bulk.percent)}٪ تخفیف عمده`
                : null}
          </p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
            <Quantity value={line.qty} max={product.stock} label={product.name} onChange={(n) => setQty(line.id, line.option, n)} />
            <p className="text-end">
              {before > line.total && <del className="block text-xs text-muted-foreground">{toman(before)}</del>}
              <motion.span key={line.total} initial={{ opacity: 0.2, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="inline-block text-sm font-bold">
                {toman(line.total)}
              </motion.span>
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function CartView() {
  const { ready, lines, totals } = useCart();
  const clear = useShop((s) => s.clear);
  const restore = useShop((s) => s.restore);

  if (!ready) return <Loading />;
  if (!lines.length) return <EmptyState title="سبد خرید شما خالی است" text="کالاهای انتخابی شما در این بخش نمایش داده می‌شوند." />;

  const suggestions = products.filter((p) => EXTRAS.includes(p.type) && p.stock > 0 && !lines.some((l) => l.id === p.id)).sort(byPopular).slice(0, 8);

  function clearWithUndo() {
    const backup = lines.map(({ id, option, qty }) => ({ id, option, qty }));
    clear();
    toast("همه‌ی کالاها از سبد حذف شدند", { action: { label: "بازگردانی", onClick: () => backup.forEach(restore) } });
  }

  return (
    <>
      <div className="shell grid gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8 lg:py-7">
        <div className="min-w-0">
          <div className="mb-4 rounded-2xl border p-3.5">
            <FreeShippingMeter subtotal={totals.subtotal} />
          </div>
          <ul className="overflow-x-clip">
            <AnimatePresence initial={false}>
              {lines.map((line, i) => (
                <CartRow key={line.key} line={line} index={i} />
              ))}
            </AnimatePresence>
          </ul>
          <div className="flex flex-wrap justify-between gap-2 pt-4">
            <Button asChild variant="ghost"><Link href="/shop">ادامه‌ی خرید</Link></Button>
            <Button variant="ghost" className="text-danger" onClick={clearWithUndo}>حذف همه‌ی کالاها</Button>
          </div>
        </div>

        <aside aria-label="خلاصه‌ی سبد" className="self-start lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
          <div className="space-y-4 rounded-2xl border p-4">
            <h2 className="heading text-sm">خلاصه‌ی سفارش</h2>
            <CouponField />
            <SummaryRows totals={totals} />
            <Button asChild size="lg" variant="brand" className="w-full">
              <Link href="/checkout">ادامه و ثبت مشخصات</Link>
            </Button>
          </div>
          {lines.some((l) => categoryBySlug[l.product.category].tobacco) && <HealthWarning className="mt-4" />}
        </aside>
      </div>
      <section className="shell pb-2">
        <SectionHead title="محصولات پیشنهادی" />
        <ProductRail products={suggestions} label="پیشنهاد برای سبد" />
      </section>
    </>
  );
}
