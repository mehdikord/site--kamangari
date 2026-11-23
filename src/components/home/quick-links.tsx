import Link from "next/link";
import { Boxes, GitCompareArrows, Headset, PackageSearch, Percent, SlidersHorizontal, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { shopHref } from "@/lib/shop-query";

const LINKS: { href: string; label: string; icon: LucideIcon; tint: string; ink: string }[] = [
  { href: shopHref({ flash: true }), label: "تخفیف‌ها", icon: Percent, tint: "#ffeee6", ink: "#bd3a0b" },
  { href: shopHref({ sort: "newest" }), label: "جدیدترین‌ها", icon: Sparkles, tint: "#efeaff", ink: "#5b3fc4" },
  { href: shopHref({ sort: "popular" }), label: "پرفروش‌ها", icon: TrendingUp, tint: "#e6f5e9", ink: "#2f7a3a" },
  { href: "/#builder", label: "شخصی‌سازی", icon: SlidersHorizontal, tint: "#e8f0ff", ink: "#2f5fd0" },
  { href: "/wholesale", label: "خرید عمده", icon: Boxes, tint: "#fff3dc", ink: "#a2660a" },
  { href: "/track", label: "پیگیری سفارش", icon: PackageSearch, tint: "#e2f6f4", ink: "#0f6b64" },
  { href: "/compare", label: "مقایسه", icon: GitCompareArrows, tint: "#ffe9ea", ink: "#c9363f" },
  { href: "/contact", label: "پشتیبانی", icon: Headset, tint: "#eceef1", ink: "#15171c" },
];

export function QuickLinks() {
  return (
    <nav aria-label="میان‌برها" className="shell pt-4 lg:pt-5">
      <ul className="no-scrollbar flex gap-1 overflow-x-auto rounded-3xl border p-2 lg:grid lg:grid-cols-8 lg:p-3">
        {LINKS.map(({ href, label, icon: Icon, tint, ink }) => (
          <li key={label} className="w-[4.75rem] shrink-0 lg:w-auto">
            <Link href={href} className="group flex flex-col items-center gap-1.5 rounded-2xl py-2 text-center transition-colors hover:bg-mist lg:flex-row lg:justify-center lg:gap-2.5 lg:py-2.5">
              <span className="grid size-11 place-items-center rounded-2xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" style={{ background: tint, color: ink }}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-[0.7rem] font-semibold whitespace-nowrap lg:text-[0.8125rem]">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
