"use client";

import Link from "next/link";
import { Boxes, Headset, PackageSearch, Percent, Phone, Sparkles, type LucideIcon } from "lucide-react";
import { CategoryIcon } from "@/components/brand/category-icon";
import { Logo } from "@/components/brand/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { shopHref } from "@/lib/shop-query";

const QUICK: [string, string, LucideIcon, string, string][] = [
  [shopHref({ flash: true }), "تخفیف‌ها", Percent, "#ffeee6", "#bd3a0b"],
  [shopHref({ sort: "newest" }), "جدیدترین‌ها", Sparkles, "#efeaff", "#5b3fc4"],
  ["/wholesale", "خرید عمده", Boxes, "#fff3dc", "#a2660a"],
  ["/track", "پیگیری سفارش", PackageSearch, "#e2f6f4", "#0f6b64"],
];

const LINKS = [
  ["/shop", "همه‌ی محصولات"],
  ["/compare", "مقایسه‌ی محصولات"],
  ["/about", "درباره‌ی ما"],
  ["/contact", "تماس با ما"],
  ["/faq", "سوالات متداول"],
  ["/terms", "قوانین و مقررات"],
];

export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 overflow-y-auto overscroll-contain p-0 data-[side=right]:w-[86%]">
        <SheetTitle className="sr-only">منوی سایت</SheetTitle>
        <SheetDescription className="sr-only">دسته‌بندی‌ها و صفحات</SheetDescription>
        <div className="border-b p-4">
          <Logo onClick={close} className="w-fit" />
        </div>
        <ul className="grid grid-cols-4 gap-1 p-3">
          {QUICK.map(([href, label, Icon, tint, ink]) => (
            <li key={label}>
              <Link href={href} onClick={close} className="flex flex-col items-center gap-1 rounded-2xl py-2 text-center text-[0.65rem] font-semibold">
                <span className="grid size-11 place-items-center rounded-2xl" style={{ background: tint, color: ink }}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4">
          <p className="text-xs text-muted-foreground">دسته‌بندی‌ها</p>
          <Accordion type="single" collapsible className="shrink-0">
            {categories.map((c) => (
              <AccordionItem key={c.slug} value={c.slug}>
                <AccordionTrigger className="items-center py-2 hover:no-underline">
                  <span className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl" style={{ background: c.tint, color: c.ink }}>
                      <CategoryIcon slug={c.slug} className="size-4" />
                    </span>
                    {c.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2 ps-11 [&_a]:no-underline">
                  <Link href={shopHref({ cat: [c.slug] })} onClick={close} className="block py-2 font-semibold text-brand">همه‌ی محصولات {c.name}</Link>
                  {c.types.map((type) => (
                    <Link key={type} href={shopHref({ cat: [c.slug], type: [type] })} onClick={close} className="block py-2 text-muted-foreground">{type}</Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <nav aria-label="صفحات سایت" className="mt-3 grid grid-cols-2 gap-x-3 border-t pt-2">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} onClick={close} className="block py-2">{label}</Link>
            ))}
          </nav>
        </div>
        <div className="m-4 flex items-center gap-3 rounded-2xl bg-carbon p-3 text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-flare">
            <Headset className="size-5" aria-hidden="true" />
          </span>
          <span className="flex-1 text-xs">
            <span className="block text-white/70">پشتیبانی ۲۴ ساعته</span>
            <a href={site.phone.href} dir="ltr" className="block text-end font-semibold">{site.phone.label}</a>
          </span>
          <Phone className="size-4 text-white/60" aria-hidden="true" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
