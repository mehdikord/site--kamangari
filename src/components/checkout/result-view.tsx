"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { faText, toman } from "@/lib/format";
import { useOrder } from "./use-order";

export function ResultView() {
  const { ready, order } = useOrder();
  if (!ready) return <Loading />;
  if (!order || order.status === "pending") return <EmptyState title="نتیجه‌ای ثبت نشده است" text="پرداختی برای این سفارش انجام نشده است." href="/cart" action="مشاهده‌ی سبد خرید" />;

  const paid = order.status === "paid";
  return (
    <div className="shell grid min-h-[60svh] place-items-center py-10 text-center">
      <div className="w-full max-w-sm rounded-2xl border p-6">
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.35, visualDuration: 0.7 }} className={`mx-auto grid size-16 place-items-center rounded-full text-white ${paid ? "bg-success" : "bg-danger"}`}>
          {paid ? <Check className="size-8" strokeWidth={2.5} /> : <X className="size-8" strokeWidth={2.5} />}
        </motion.div>
        <h1 className="heading mt-3 text-lg" role="status">{paid ? "سفارش شما با موفقیت ثبت شد" : "پرداخت انجام نشد"}</h1>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          {paid ? "مراحل آماده‌سازی و ارسال از بخش پیگیری سفارش قابل مشاهده است." : "سبد خرید شما حفظ شده است و امکان پرداخت مجدد وجود دارد."}
        </p>
        <dl className="my-4 space-y-2 rounded-xl bg-mist p-3 text-xs">
          <div className="flex justify-between"><dt>شماره‌ی سفارش</dt><dd dir="ltr">{order.id}</dd></div>
          <div className="flex justify-between"><dt>مبلغ</dt><dd>{toman(order.totals.total)}</dd></div>
          {order.reference && <div className="flex justify-between"><dt>کد پیگیری</dt><dd dir="ltr">{faText(order.reference)}</dd></div>}
        </dl>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Button asChild variant="brand">
            <Link href={paid ? `/track?code=${order.id}` : `/payment?id=${order.id}`}>{paid ? "پیگیری سفارش" : "پرداخت مجدد"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/invoice?id=${order.id}`}>مشاهده‌ی فاکتور</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
