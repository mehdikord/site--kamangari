"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Heart, House, LayoutGrid, Menu, Search, ShoppingBag, UserRound, Zap } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "cn";
import { CategoryIcon } from "@/components/brand/category-icon";
import { Logo } from "@/components/brand/logo";
import { Price } from "@/components/product/price";
import { categories } from "@/data/categories";
import { products } from "@/data/catalog";
import { fa, faText, toman } from "@/lib/format";
import { byPopular } from "@/lib/product";
import { shopHref } from "@/lib/shop-query";
import { useCart, useReady, useShop } from "@/lib/store";
import { CartSheet } from "./cart-sheet";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { TopBar } from "./top-bar";

const SEARCH_HINTS = ["قلیان استیل", "زغال نارگیل", "فندک زیپو", "شلنگ سیلیکونی", "سری سرامیکی"];
const topSeller = Object.fromEntries(categories.map((c) => [c.slug, [...products].filter((p) => p.category === c.slug && p.stock > 0).sort(byPopular)[0]]));

function Count({ value, className }: { value: number; className?: string }) {
  if (!value) return null;
  return (
    <motion.span key={value} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4, duration: 0.4 }} className={cn("absolute -top-1.5 -left-2 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[0.65rem] leading-none font-bold text-white ring-2 ring-white", className)}>
      {fa(value)}
    </motion.span>
  );
}

function SearchTrigger({ onOpen }: { onOpen: () => void }) {
  const [hint, setHint] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setHint((i) => (i + 1) % SEARCH_HINTS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <button type="button" onClick={onOpen} aria-label="جست‌وجو" className="group mx-auto flex h-12 w-full max-w-2xl items-center gap-3 rounded-2xl border border-transparent bg-mist ps-4 pe-1.5 text-[0.8125rem] text-muted-foreground transition-[background-color,border-color,box-shadow] hover:border-input hover:bg-white hover:shadow-[0_8px_24px_-14px_rgb(21_23_28/0.35)]">
      <Search className="size-4.5 shrink-0 text-carbon" />
      <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap">
        جست‌وجو در
        <span className="relative inline-flex h-6 min-w-32 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={hint} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.28 }} className="absolute inset-y-0 start-0 flex items-center font-semibold text-carbon">
              «{SEARCH_HINTS[hint]}»
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <kbd dir="ltr" className="hidden rounded-md border bg-white px-1.5 py-0.5 font-sans text-[0.65rem] text-muted-foreground xl:block">Ctrl K</kbd>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-carbon text-white transition-colors group-hover:bg-brand">
        <Search className="size-4" />
      </span>
    </button>
  );
}

function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const close = () => setOpen(false);
  const category = categories[current];
  const featured = topSeller[category.slug];

  return (
    <div
      className="relative flex h-full items-center"
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && close()}
      onKeyDown={(e) => e.key === "Escape" && close()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && close()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="shop-menu"
        // hover opens it first, so a mouse click must not toggle it shut again
        onClick={(e) => setOpen((value) => (e.detail > 0 ? true : !value))}
        className={cn("flex h-9 items-center gap-2 rounded-xl px-3.5 font-semibold transition-colors", open ? "bg-brand text-white" : "bg-carbon text-white hover:bg-graphite")}
      >
        <LayoutGrid className="size-4" />
        دسته‌بندی‌ها
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="shop-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute start-0 top-[calc(100%+0.5rem)] grid w-[52rem] origin-top-right grid-cols-[14rem_1fr_14rem] overflow-hidden rounded-3xl border bg-white shadow-[0_30px_60px_-30px_rgb(21_23_28/0.45)]"
          >
            <ul className="bg-mist p-2">
              {categories.map((item, i) => (
                <li key={item.slug}>
                  <Link
                    href={shopHref({ cat: [item.slug] })}
                    onClick={close}
                    onPointerEnter={() => setCurrent(i)}
                    onFocus={() => setCurrent(i)}
                    className={cn("flex h-11 items-center gap-2.5 rounded-xl px-2 transition-colors", i === current ? "bg-white font-semibold shadow-sm" : "hover:bg-white/60")}
                  >
                    <span className="grid size-8 place-items-center rounded-lg" style={{ background: item.tint, color: item.ink }}>
                      <CategoryIcon slug={item.slug} className="size-4" />
                    </span>
                    <span className="flex-1">{item.name}</span>
                    <ChevronLeft className={cn("size-3.5 transition-opacity", i === current ? "opacity-70" : "opacity-0")} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-5">
              <p className="heading text-base">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.blurb}</p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5">
                {category.types.map((type) => (
                  <li key={type}>
                    <Link href={shopHref({ cat: [category.slug], type: [type] })} onClick={close} className="flex h-10 items-center justify-between rounded-xl border px-3 text-xs transition-colors hover:border-carbon">
                      {type}
                      <ChevronLeft className="size-3.5 opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={shopHref({ cat: [category.slug] })} onClick={close} className="mt-3 flex w-fit items-center gap-1 text-xs font-semibold text-brand hover:underline">
                همه‌ی محصولات {category.name}
                <ChevronLeft className="size-3.5" />
              </Link>
            </div>
            {featured && (
              <Link href={`/product/${featured.slug}`} onClick={close} className="group m-2 flex flex-col rounded-2xl p-3" style={{ background: category.tint }}>
                <span className="w-fit rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold" style={{ color: category.ink }}>پرفروش‌ترین</span>
                <span className="relative my-1 block flex-1">
                  <Image src={featured.images[0]} alt="" fill sizes="13rem" className="object-contain transition-transform duration-300 group-hover:scale-105" />
                </span>
                <span className="line-clamp-2 text-xs font-semibold">{featured.name}</span>
                <Price option={featured.options[0]} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [cart, setCart] = useState(false);
  const [raised, setRaised] = useState(false);
  const pathname = usePathname();
  const ready = useReady();
  const { totals } = useCart();
  const wished = useShop((s) => s.wishlist.length);
  const user = useShop((s) => s.user);
  const signedIn = ready && !!user;
  const cartCount = ready ? totals.count : 0;

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setRaised(y > 40));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true]")) return;
      if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tabs = [
    { href: "/", label: "خانه", icon: House, count: 0 },
    { href: "/shop", label: "فروشگاه", icon: LayoutGrid, count: 0 },
    { href: "/cart", label: "سبد خرید", icon: ShoppingBag, count: cartCount },
    { href: "/wishlist", label: "علاقه‌مندی", icon: Heart, count: 0 },
    { href: signedIn ? "/account" : "/login", label: "حساب", icon: UserRound, count: 0 },
  ];
  const iconButton = "relative grid size-11 shrink-0 place-items-center rounded-2xl transition-colors hover:bg-mist";

  return (
    <>
      <TopBar />
      <header className={cn("no-print sticky top-0 z-40 h-(--header-h) bg-white/90 text-[0.8125rem] backdrop-blur-xl transition-shadow duration-300", raised ? "shadow-[0_10px_30px_-18px_rgb(21_23_28/0.35)]" : "shadow-[inset_0_-1px_0_var(--border)]")}>
        <div className="shell flex h-15 items-center gap-1.5 lg:h-[4.5rem] lg:gap-6">
          <button type="button" onClick={() => setMenu(true)} aria-label="باز کردن منو" className={cn(iconButton, "-ms-2 lg:hidden")}>
            <Menu className="size-5" />
          </button>
          <Logo className="[&_svg]:size-10" />
          <div className="hidden flex-1 lg:block">
            <SearchTrigger onOpen={() => setSearch(true)} />
          </div>
          <div className="ms-auto flex items-center gap-1 lg:ms-0 lg:gap-2">
            <button type="button" onClick={() => setSearch(true)} aria-label="جست‌وجو" className={cn(iconButton, "lg:hidden")}>
              <Search className="size-5" />
            </button>
            <Link href={signedIn ? "/account" : "/login"} className="hidden h-12 items-center gap-2.5 rounded-2xl px-2 transition-colors hover:bg-mist lg:flex">
              <span className="grid size-9 place-items-center rounded-xl bg-mist">
                <UserRound className="size-4.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.65rem] text-muted-foreground">{signedIn ? "خوش آمدید" : "حساب کاربری"}</span>
                <span className="block font-semibold whitespace-nowrap" dir={signedIn ? "ltr" : undefined}>{signedIn ? faText(user.mobile) : "ورود | ثبت‌نام"}</span>
              </span>
            </Link>
            <Link href="/wishlist" aria-label="علاقه‌مندی‌ها" className={cn(iconButton, "max-lg:hidden")}>
              <span className="relative">
                <Heart className="size-5" />
                <Count value={ready ? wished : 0} />
              </span>
            </Link>
            <button type="button" data-cart-target onClick={() => setCart(true)} aria-label={`سبد خرید، ${fa(cartCount)} کالا`} className="relative flex size-11 shrink-0 items-center justify-center gap-2.5 rounded-2xl transition-colors hover:bg-mist lg:h-12 lg:w-auto lg:bg-brand lg:ps-1.5 lg:pe-4 lg:text-white lg:hover:bg-[#a23109]">
              <span className="relative grid size-9 place-items-center rounded-xl lg:bg-white/15">
                <ShoppingBag className="size-5" />
                <Count value={cartCount} className="lg:bg-carbon lg:ring-brand" />
              </span>
              <span className="hidden text-start leading-tight lg:block">
                <span className="block text-[0.65rem] text-white/80">سبد خرید</span>
                <span className="block font-semibold whitespace-nowrap">{cartCount ? toman(totals.subtotal) : "خالی"}</span>
              </span>
            </button>
          </div>
        </div>

        <div className="shell hidden h-12 items-center gap-1 lg:flex">
          <CategoryMenu />
          <nav aria-label="دسته‌بندی‌ها" className="flex h-full items-center gap-0.5 ps-2">
            {categories.map((c, i) => (
              <Link key={c.slug} href={shopHref({ cat: [c.slug] })} className={cn("group flex h-9 items-center gap-2 rounded-xl px-2 whitespace-nowrap transition-colors hover:bg-mist", i > 3 && "max-xl:hidden")}>
                <span className="grid size-7 place-items-center rounded-lg transition-transform group-hover:scale-110" style={{ background: c.tint, color: c.ink }}>
                  <CategoryIcon slug={c.slug} className="size-3.5" />
                </span>
                {c.name}
              </Link>
            ))}
          </nav>
          <Link href={shopHref({ flash: true })} className="group ms-auto flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 font-semibold whitespace-nowrap text-brand transition-colors hover:bg-brand hover:text-white">
            <Zap className="size-4 fill-current transition-transform group-hover:rotate-12" />
            پیشنهادهای ویژه
          </Link>
        </div>
      </header>

      <nav aria-label="دسترسی سریع" className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        {tabs.map(({ href, label, icon: Icon, count }) => {
          const active = pathname === href;
          return (
            <Link key={label} href={href} aria-current={active ? "page" : undefined} className={cn("flex h-16 flex-col items-center justify-center gap-0.5 text-[0.65rem]", active ? "font-bold text-carbon" : "text-muted-foreground")}>
              <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-carbon text-white")}>
                <span className="relative">
                  <Icon className="size-4.5" />
                  <Count value={count} />
                </span>
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <MobileMenu open={menu} onOpenChange={setMenu} />
      <SearchDialog open={search} onOpenChange={setSearch} />
      <CartSheet open={cart} onOpenChange={setCart} />
    </>
  );
}
