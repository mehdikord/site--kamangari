"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Boxes, Headset, Phone, Truck, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/config/site";
import { toman } from "@/lib/format";
import { FREE_SHIPPING_FROM } from "@/lib/pricing";

const MESSAGES: [LucideIcon, string][] = [
  [Truck, `ارسال رایگان سفارش‌های بالای ${toman(FREE_SHIPPING_FROM)}`],
  [BadgeCheck, "ضمانت اصالت تمامی کالاها"],
  [Boxes, "تخفیف خودکار برای خرید عمده"],
  [Headset, "پشتیبانی در تمام ساعات شبانه‌روز"],
];

const LINKS = [
  ["/track", "پیگیری سفارش"],
  ["/wholesale", "خرید عمده"],
  ["/about", "درباره‌ی ما"],
  ["/contact", "تماس با ما"],
];

export function TopBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % MESSAGES.length), 4000);
    return () => window.clearInterval(id);
  }, []);

  const [Icon, text] = MESSAGES[current];
  return (
    <div className="no-print bg-carbon bg-[radial-gradient(ellipse_40%_120%_at_50%_0%,rgb(255_122_69/0.25),transparent)] text-[0.7rem] text-white/85">
      <div className="shell flex h-8 items-center justify-center lg:h-9 lg:justify-between">
        <div className="relative h-full w-full overflow-hidden lg:w-96" aria-live="off">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={current} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center justify-center gap-1.5 lg:justify-start">
              <Icon className="size-3.5 text-flare" aria-hidden="true" />
              {text}
            </motion.p>
          </AnimatePresence>
        </div>
        <nav aria-label="پیوندهای سریع" className="hidden items-center lg:flex">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="px-2.5 py-1 transition-colors hover:text-white">{label}</Link>
          ))}
          <a href={site.phone.href} className="ms-2 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 transition-colors hover:bg-white/20">
            <Phone className="size-3 text-flare" aria-hidden="true" />
            <span dir="ltr">{site.phone.label}</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
