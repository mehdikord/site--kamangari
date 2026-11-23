"use client";

import { motion } from "motion/react";
import { cn } from "cn";
import { fa, toman } from "@/lib/format";
import type { Totals } from "@/lib/pricing";

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className={cn("flex justify-between gap-3", tone)}>
      <dt>{label}</dt>
      <dd className="font-semibold whitespace-nowrap">{value}</dd>
    </div>
  );
}

export function SummaryRows({ totals, shippingLabel }: { totals: Omit<Totals, "coupon">; shippingLabel?: string }) {
  return (
    <dl className="space-y-2 text-xs">
      <Row label={`قیمت ${fa(totals.count)} عدد کالا`} value={toman(totals.list)} />
      {totals.productSaving > 0 && <Row label="تخفیف کالاها" value={`${toman(totals.productSaving)} کمتر`} tone="text-danger" />}
      {totals.bulkSaving > 0 && <Row label="تخفیف عمده" value={`${toman(totals.bulkSaving)} کمتر`} tone="text-success" />}
      {totals.couponSaving > 0 && <Row label="کد تخفیف" value={`${toman(totals.couponSaving)} کمتر`} tone="text-danger" />}
      {shippingLabel ? <Row label={shippingLabel} value={totals.shipping ? toman(totals.shipping) : "بدون هزینه"} /> : <Row label="هزینه‌ی ارسال" value="محاسبه در مرحله‌ی بعد" />}
      <div className="flex items-baseline justify-between gap-2 border-t pt-3">
        <dt className="font-bold">مبلغ قابل پرداخت</dt>
        <dd className="text-base font-bold">
          <motion.span key={totals.total} initial={{ opacity: 0.2, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="inline-block" aria-live="polite">
            {toman(totals.total)}
          </motion.span>
        </dd>
      </div>
      {totals.saving > 0 && <p className="rounded-lg bg-accent px-3 py-2 text-center font-semibold">{toman(totals.saving)} صرفه‌جویی در این خرید</p>}
    </dl>
  );
}
