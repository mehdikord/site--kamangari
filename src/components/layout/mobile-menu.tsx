"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { shopHref } from "@/lib/shop-query";

const LINKS = [
  ["/shop", "همه‌ی محصولات"],
  [shopHref({ sort: "newest" }), "جدیدترین‌ها"],
  [shopHref({ flash: true }), "تخفیف‌های لحظه‌ای"],
  ["/wholesale", "خرید عمده"],
  ["/track", "پیگیری سفارش"],
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
      <SheetContent side="right" className="gap-0 overflow-y-auto overscroll-contain p-4 data-[side=right]:w-[86%]">
        <SheetTitle className="sr-only">منوی سایت</SheetTitle>
        <SheetDescription className="sr-only">دسته‌بندی‌ها و صفحات</SheetDescription>
        <Logo onClick={close} className="mb-4 self-start" />
        <p className="text-xs text-muted-foreground">دسته‌بندی‌ها</p>
        <Accordion type="single" collapsible className="shrink-0">
          {categories.map((c) => (
            <AccordionItem key={c.slug} value={c.slug}>
              <AccordionTrigger className="items-center py-2 hover:no-underline">
                <span className="flex items-center gap-2.5">
                  <Image src={c.image} alt="" width={36} height={36} className="size-9 rounded-lg bg-mist object-contain" />
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
        <nav aria-label="صفحات سایت" className="mt-3 border-t pt-2">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} onClick={close} className="block py-2">{label}</Link>
          ))}
        </nav>
        <a href={site.phone.href} className="mt-3 flex items-center gap-2 rounded-xl bg-mist p-3">
          <Phone className="size-4 text-brand" />
          <span dir="ltr">{site.phone.label}</span>
        </a>
      </SheetContent>
    </Sheet>
  );
}
