"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { toman } from "@/lib/format";
import { useShop } from "@/lib/store";
import { useOrder } from "./use-order";

export function PaymentView() {
  const router = useRouter();
  const { ready, order } = useOrder();
  const settle = useShop((s) => s.settleOrder);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!ready) return <Loading />;
  if (!order) return <EmptyState title="سفارشی برای پرداخت وجود ندارد" text="لطفاً فرایند خرید را از سبد خرید آغاز کنید." href="/cart" action="مشاهده‌ی سبد خرید" />;
  if (order.status === "paid" && !busy) return <EmptyState title="سفارش پرداخت شده است" text="پرداخت این سفارش پیش‌تر با موفقیت انجام شده است." href={`/invoice?id=${order.id}`} action="مشاهده‌ی فاکتور" />;

  function pay(success: boolean) {
    if (!order) return;
    setBusy(true);
    timer.current = window.setTimeout(() => {
      settle(order.id, success, success ? String(Date.now()).slice(-10) : undefined);
      router.replace(`/payment/result?id=${order.id}`);
    }, 1200);
  }

  return (
    <div className="shell max-w-md py-6 lg:py-10">
      <div className="rounded-2xl border p-5 text-center sm:p-6">
        <ShieldCheck className="mx-auto size-9 text-success" />
        <h2 className="heading mt-2 text-base">درگاه پرداخت آزمایشی</h2>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">در نسخه‌ی نهایی، خریدار در این مرحله به درگاه بانک منتقل می‌شود. در این نسخه تراکنشی انجام و اطلاعات کارتی دریافت نمی‌شود.</p>
        <dl className="my-4 space-y-2 rounded-xl bg-muted p-3 text-xs">
          <div className="flex justify-between"><dt>شماره‌ی سفارش</dt><dd dir="ltr">{order.id}</dd></div>
          <div className="flex justify-between"><dt>مبلغ</dt><dd className="text-sm font-bold">{toman(order.totals.total)}</dd></div>
        </dl>
        {busy ? (
          <p role="status" className="flex h-11 text-sm items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" />
            در حال ارتباط با درگاه
          </p>
        ) : (
          <div className="grid gap-2.5">
            <Button size="lg" variant="brand" onClick={() => pay(true)}>شبیه‌سازی پرداخت موفق</Button>
            <Button size="lg" variant="outline" onClick={() => pay(false)}>شبیه‌سازی پرداخت ناموفق</Button>
            <Button asChild variant="link"><Link href={`/invoice?id=${order.id}`}>بازگشت به فاکتور</Link></Button>
          </div>
        )}
      </div>
    </div>
  );
}
