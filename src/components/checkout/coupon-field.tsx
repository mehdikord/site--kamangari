"use client";

import { useState } from "react";
import { TicketPercent, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { latinDigits, toman } from "@/lib/format";
import { COUPONS, couponError, findCoupon } from "@/lib/pricing";
import { useCart, useShop } from "@/lib/store";

export function CouponField() {
  const { totals } = useCart();
  const stored = useShop((s) => s.coupon);
  const setCoupon = useShop((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const saved = findCoupon(stored);

  function apply(value: string) {
    const normalized = latinDigits(value).trim().toUpperCase();
    const problem = couponError(normalized, totals.subtotal);
    setError(problem);
    if (problem) return;
    setCoupon(normalized);
    setCode("");
    toast.success("کد تخفیف اعمال شد");
  }

  if (saved) {
    return (
      <div className="rounded-lg border border-dashed border-success p-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-bold">
            <TicketPercent className="size-4 text-success" />
            <span dir="ltr">{saved.code}</span>
          </span>
          <button type="button" aria-label="حذف کد تخفیف" onClick={() => setCoupon(null)} className="grid size-9 place-items-center rounded-full hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        <p className={totals.coupon ? "text-muted-foreground" : "text-danger"}>
          {totals.coupon ? saved.label : `این کد از خرید ${toman(saved.min)} به بالا فعال می‌شود.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="coupon" className="mb-1.5 block text-xs font-semibold">کد تخفیف</label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          dir="ltr"
          value={code}
          autoCapitalize="characters"
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby="coupon-error"
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            // the field lives inside the checkout form
            e.preventDefault();
            apply(code);
          }}
          className="h-10"
        />
        <Button type="button" variant="outline" onClick={() => apply(code)}>اعمال</Button>
      </div>
      <p id="coupon-error" role="alert" className="mt-1 text-xs text-danger empty:hidden">{error}</p>
      <p className="mt-2 text-[0.7rem] text-muted-foreground">کدهای آزمایشی:</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {COUPONS.map((coupon) => (
          <button key={coupon.code} type="button" dir="ltr" title={coupon.label} onClick={() => apply(coupon.code)} className="rounded bg-muted px-2 py-1 text-[0.7rem] hover:bg-secondary">
            {coupon.code}
          </button>
        ))}
      </div>
    </div>
  );
}
