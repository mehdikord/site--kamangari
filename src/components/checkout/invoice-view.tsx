"use client";

import Link from "next/link";
import { CreditCard, Printer } from "lucide-react";
import { Mark } from "@/components/brand/logo";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { fa, faDate, faText, toman } from "@/lib/format";
import { SummaryRows } from "./summary";
import { useOrder } from "./use-order";

export function InvoiceView() {
  const { ready, order } = useOrder();
  if (!ready) return <Loading />;
  if (!order) return <EmptyState title="فاکتوری یافت نشد" text="فاکتورهای نمایشی تنها در مرورگر ثبت‌کننده‌ی سفارش قابل مشاهده هستند." href="/cart" action="مشاهده‌ی سبد خرید" />;

  const { customer, totals } = order;
  const paid = order.status === "paid";
  const details = [
    ["تاریخ", faDate(order.createdAt)],
    ["خریدار", `${customer.firstName} ${customer.lastName}`],
    ["موبایل", faText(customer.mobile)],
    ["کد پستی", faText(customer.postalCode)],
    ["روش ارسال", order.shippingName],
    ...(totals.couponCode ? [["کد تخفیف", totals.couponCode]] : []),
  ];

  return (
    <div className="shell grid gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-7 print:block print:py-0">
      <article className="min-w-0 overflow-hidden rounded-2xl border bg-white">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Mark className="size-10" />
            <div>
              <h2 className="heading text-base">فاکتور {site.name}</h2>
              <p className="text-xs text-muted-foreground">نمونه‌ی نمایشی، فاقد اعتبار مالی</p>
            </div>
          </div>
          <p className="text-xs">
            <span className="block" dir="ltr">{order.id}</span>
            <span className={paid ? "font-bold text-success" : "text-muted-foreground"}>{paid ? "پرداخت‌شده" : order.status === "failed" ? "پرداخت ناموفق" : "در انتظار پرداخت"}</span>
          </p>
        </header>

        <dl className="grid grid-cols-2 gap-3 p-4 text-xs sm:grid-cols-3 sm:p-5">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="font-semibold break-words">{value}</dd>
            </div>
          ))}
          <div className="col-span-full">
            <dt className="text-xs text-muted-foreground">نشانی</dt>
            <dd className="font-semibold break-words">{customer.province}، {customer.city}، {customer.address}</dd>
          </div>
          {customer.note && (
            <div className="col-span-full">
              <dt className="text-xs text-muted-foreground">توضیح</dt>
              <dd className="break-words">{customer.note}</dd>
            </div>
          )}
        </dl>

        <table className="w-full text-[0.7rem] sm:text-xs">
          <thead className="bg-secondary">
            <tr>
              <th scope="col" className="p-3 text-start">شرح کالا</th>
              <th scope="col" className="p-3 text-center">تعداد</th>
              <th scope="col" className="hidden p-3 text-start sm:table-cell">قیمت واحد</th>
              <th scope="col" className="p-3 text-start">جمع (تومان)</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={`${item.id}:${item.option}`} className="border-b">
                <td className="p-3">
                  <span className="font-semibold">{item.name}</span>
                  {item.optionLabel && <span className="block text-muted-foreground">{item.optionLabel}</span>}
                </td>
                <td className="p-3 text-center">{fa(item.qty)}</td>
                <td className="hidden p-3 whitespace-nowrap sm:table-cell">{fa(item.unit)}</td>
                <td className="p-3 font-semibold whitespace-nowrap">{fa(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ms-auto max-w-sm p-4 sm:p-5">
          <SummaryRows totals={totals} shippingLabel={order.shippingName} />
        </div>
        <p className="border-t p-4 text-center text-xs text-muted-foreground">{site.healthWarning}</p>
      </article>

      <aside aria-label="جزییات پرداخت" className="no-print self-start rounded-2xl border p-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <h2 className="heading text-sm">جزییات پرداخت</h2>
        <dl className="my-3 space-y-2 text-xs">
          <div className="flex justify-between"><dt>روش</dt><dd className="font-semibold">پرداخت آنلاین</dd></div>
          <div className="flex justify-between"><dt>درگاه</dt><dd className="font-semibold">درگاه آزمایشی</dd></div>
          {order.reference && <div className="flex justify-between"><dt>کد پیگیری</dt><dd dir="ltr">{faText(order.reference)}</dd></div>}
        </dl>
        <p className="text-lg font-bold">{toman(totals.total)}</p>
        {paid ? (
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={`/track?code=${order.id}`}>پیگیری سفارش</Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="brand" className="mt-5 w-full">
            <Link href={`/payment?id=${order.id}`}><CreditCard />پرداخت آنلاین</Link>
          </Button>
        )}
        <Button variant="outline" className="mt-2.5 w-full" onClick={() => window.print()}>
          <Printer />
          چاپ فاکتور
        </Button>
      </aside>
    </div>
  );
}
