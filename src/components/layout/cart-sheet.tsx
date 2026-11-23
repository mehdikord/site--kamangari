"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FreeShippingMeter } from "@/components/cart/free-shipping-meter";
import { EmptyState } from "@/components/shared/empty-state";
import { Quantity } from "@/components/shared/quantity";
import { fa, toman } from "@/lib/format";
import { useCart, useShop } from "@/lib/store";

export function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { lines, totals } = useCart();
  const setQty = useShop((s) => s.setQty);
  const remove = useShop((s) => s.remove);
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="gap-0 bg-white text-sm data-[side=left]:w-[92%] data-[side=left]:sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="heading text-base">سبد خرید</SheetTitle>
          <SheetDescription>{totals.count ? `${fa(totals.count)} عدد کالا` : "فاقد کالا"}</SheetDescription>
        </SheetHeader>
        {lines.length ? (
          <>
            <ul className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li key={line.key} layout="position" exit={{ opacity: 0, x: -40 }} className="flex gap-3 border-b py-4">
                    <Link href={`/product/${line.product.slug}`} onClick={close} className="shrink-0">
                      <Image src={line.product.images[0]} alt="" width={80} height={80} className="size-16 rounded-lg bg-mist object-contain" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${line.product.slug}`} onClick={close} className="line-clamp-2 text-sm font-semibold">{line.product.name}</Link>
                      {line.product.options.length > 1 && <p className="text-xs text-muted-foreground">{line.selected.label}</p>}
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <Quantity value={line.qty} max={line.product.stock} label={line.product.name} className="h-9" onChange={(n) => setQty(line.id, line.option, n)} onRemove={() => remove(line.id, line.option)} />
                        <span className="text-sm font-bold">{toman(line.total)}</span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="space-y-3 border-t bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <FreeShippingMeter subtotal={totals.subtotal} />
              <div className="flex justify-between font-bold">
                <span>جمع سبد</span>
                <span>{toman(totals.subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline"><Link href="/cart" onClick={close}>مشاهده‌ی سبد</Link></Button>
                <Button asChild><Link href="/checkout" onClick={close}>تسویه حساب</Link></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-4">
            <EmptyState title="سبد خرید خالی است" text="برای شروع خرید به فروشگاه مراجعه کنید." onAction={close} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
