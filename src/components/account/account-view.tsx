"use client";

import Image from "next/image";
import Link from "next/link";
import { GitCompareArrows, Heart, LogOut, Truck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { productById } from "@/data/catalog";
import { fa, faDate, faText, toman } from "@/lib/format";
import { useReady, useShop, type Order } from "@/lib/store";

const STATUS: Record<Order["status"], string> = { paid: "در حال آماده‌سازی", pending: "در انتظار پرداخت", failed: "پرداخت ناموفق" };

const LINKS = [
  ["/wishlist", "علاقه‌مندی‌ها", Heart],
  ["/compare", "مقایسه", GitCompareArrows],
  ["/track", "پیگیری سفارش", Truck],
] as const;

export function AccountView() {
  const ready = useReady();
  const user = useShop((s) => s.user);
  const customer = useShop((s) => s.customer);
  const orders = useShop((s) => s.orders);
  const logout = useShop((s) => s.logout);

  if (!ready) return <Loading />;
  if (!user) return <EmptyState title="وارد حساب کاربری نشده‌اید" text="برای مشاهده‌ی سفارش‌ها با شماره‌ی موبایل وارد شوید." href="/login" action="ورود یا ثبت‌نام" />;

  return (
    <div className="shell grid gap-5 py-5 lg:grid-cols-[17rem_minmax(0,1fr)] lg:py-7">
      <aside className="self-start rounded-2xl border p-4 text-xs">
        <h2 className="heading text-sm">{customer ? `${customer.firstName} ${customer.lastName}` : "کاربر کمانگری"}</h2>
        <p dir="ltr" className="text-end text-muted-foreground">{faText(user.mobile)}</p>
        {customer && <p className="mt-3 break-words">{customer.province}، {customer.city}، {customer.address}</p>}
        <nav aria-label="بخش‌های حساب" className="mt-5 border-t pt-3">
          {LINKS.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex items-center gap-3 py-2.5 hover:text-brand">
              <Icon className="size-4.5" />
              {label}
            </Link>
          ))}
          <button type="button" onClick={logout} className="flex items-center gap-3 py-2.5 text-danger">
            <LogOut className="size-4.5" />
            خروج از حساب
          </button>
        </nav>
      </aside>

      <section>
        <h2 className="heading mb-3 text-base">سفارش‌های شما</h2>
        {!orders.length && <p className="rounded-2xl bg-mist p-4 text-xs text-muted-foreground">سفارشی ثبت نشده است. <Link href="/shop" className="text-brand underline">مشاهده‌ی فروشگاه</Link>.</p>}
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border p-3.5">
              <div className="flex flex-wrap justify-between gap-2 text-xs">
                <p>
                  <span dir="ltr" className="font-bold">{order.id}</span>
                  <span className="block text-xs text-muted-foreground">{faDate(order.createdAt)}</span>
                </p>
                <p className="font-semibold">{STATUS[order.status]}</p>
              </div>
              <div className="my-3 flex flex-wrap gap-2">
                {order.items.slice(0, 6).map((item) => (
                  <Image key={`${item.id}:${item.option}`} src={productById.get(item.id)?.images[0] ?? item.image} alt={item.name} width={64} height={64} className="size-14 rounded-lg bg-muted object-contain" />
                ))}
                {order.items.length > 6 && <span className="grid size-14 place-items-center rounded-lg bg-muted text-sm">{fa(order.items.length - 6)}+</span>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold">{toman(order.totals.total)}</span>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/invoice?id=${order.id}`}>{order.status === "paid" ? "مشاهده‌ی فاکتور" : "فاکتور و پرداخت"}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
