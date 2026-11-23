"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, Headset, Heart, House, LayoutGrid, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { Logo } from "@/components/brand/logo";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { fa } from "@/lib/format";
import { shopHref } from "@/lib/shop-query";
import { useCart, useReady, useShop } from "@/lib/store";
import { CartSheet } from "./cart-sheet";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";

const NAV = [
  ["/shop", "فروشگاه"],
  [shopHref({ flash: true }), "تخفیف‌ها"],
  [shopHref({ sort: "newest" }), "جدیدترین‌ها"],
  ["/wholesale", "خرید عمده"],
  ["/about", "درباره‌ی ما"],
  ["/contact", "تماس با ما"],
];

const iconButton = "relative grid size-10 shrink-0 place-items-center rounded-xl transition-colors hover:bg-mist";

function Count({ value }: { value: number }) {
  if (!value) return null;
  return (
    <motion.span key={value} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4, duration: 0.4 }} className="absolute -top-1.5 -left-2 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[0.65rem] leading-none font-bold text-white">
      {fa(value)}
    </motion.span>
  );
}

function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const close = () => setOpen(false);
  const category = categories[current];

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
        className="flex h-full items-center gap-2 pe-4 font-semibold"
      >
        <LayoutGrid className="size-4" />
        دسته‌بندی محصولات
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="shop-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute start-0 top-full grid w-[44rem] grid-cols-[13rem_1fr] overflow-hidden rounded-b-2xl border border-t-0 bg-white"
          >
            <ul className="bg-mist p-2">
              {categories.map((item, i) => (
                <li key={item.slug}>
                  <Link
                    href={shopHref({ cat: [item.slug] })}
                    onClick={close}
                    onPointerEnter={() => setCurrent(i)}
                    onFocus={() => setCurrent(i)}
                    className={cn("flex h-11 items-center gap-2.5 rounded-xl px-2", i === current && "bg-white font-semibold")}
                  >
                    <Image src={item.image} alt="" width={36} height={36} className="size-8 object-contain" />
                    <span className="flex-1">{item.name}</span>
                    <ChevronLeft className="size-3.5 opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-[1fr_10rem] gap-3 p-5">
              <div>
                <Link href={shopHref({ cat: [category.slug] })} onClick={close} className="heading text-base hover:text-brand">
                  همه‌ی محصولات {category.name}
                </Link>
                <ul className="mt-2">
                  {category.types.map((type) => (
                    <li key={type}>
                      <Link href={shopHref({ cat: [category.slug], type: [type] })} onClick={close} className="block py-1.5 text-muted-foreground hover:text-foreground">{type}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-square self-end rounded-2xl bg-mist">
                <Image src={category.image} alt="" fill sizes="10rem" className="object-contain" />
              </div>
            </div>
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
  const pathname = usePathname();
  const ready = useReady();
  const { totals } = useCart();
  const wished = useShop((s) => s.wishlist.length);
  const user = useShop((s) => s.user);
  const signedIn = ready && !!user;
  const cartCount = ready ? totals.count : 0;
  const account = signedIn ? { href: "/account", label: "حساب کاربری" } : { href: "/login", label: "ورود و ثبت‌نام" };

  const tabs = [
    { href: "/", label: "خانه", icon: House, count: 0 },
    { href: "/shop", label: "فروشگاه", icon: LayoutGrid, count: 0 },
    { href: "/cart", label: "سبد خرید", icon: ShoppingBag, count: cartCount },
    { href: "/wishlist", label: "علاقه‌مندی", icon: Heart, count: 0 },
    { href: account.href, label: "حساب", icon: UserRound, count: 0 },
  ];

  return (
    <>
      <header className="no-print sticky top-0 z-40 h-(--header-h) bg-white text-[0.8125rem] lg:border-b">
        <div className="shell flex h-15 items-center gap-1 lg:h-[4.375rem] lg:gap-2">
          <button type="button" onClick={() => setMenu(true)} aria-label="باز کردن منو" className={cn(iconButton, "-ms-2 lg:hidden")}>
            <Menu className="size-5" />
          </button>
          <Logo />
          <button type="button" onClick={() => setSearch(true)} aria-label="جست‌وجو" className="ms-auto flex h-10 items-center justify-center gap-2.5 rounded-xl text-muted-foreground transition-colors max-lg:w-10 lg:mx-auto lg:h-11 lg:w-full lg:max-w-xl lg:justify-start lg:bg-mist lg:px-4 lg:hover:bg-secondary">
            <Search className="size-4.5 shrink-0 max-lg:text-carbon" />
            <span className="max-lg:hidden">جست‌وجوی محصول، برند یا طعم</span>
          </button>
          <div className="flex items-center gap-1">
            <Link href="/wishlist" aria-label="علاقه‌مندی‌ها" className={cn(iconButton, "max-lg:hidden")}>
              <span className="relative">
                <Heart className="size-5" />
                <Count value={ready ? wished : 0} />
              </span>
            </Link>
            <Link href={account.href} className="hidden h-10 items-center gap-2 rounded-xl border px-3.5 whitespace-nowrap transition-colors hover:bg-mist lg:flex">
              <UserRound className="size-4.5" />
              {account.label}
            </Link>
            <button type="button" data-cart-target onClick={() => setCart(true)} aria-label={`سبد خرید، ${fa(cartCount)} کالا`} className={cn(iconButton, "lg:bg-carbon lg:text-white lg:hover:bg-graphite")}>
              <span className="relative">
                <ShoppingBag className="size-5" />
                <Count value={cartCount} />
              </span>
            </button>
          </div>
        </div>

        <div className="shell hidden h-[2.8125rem] items-center lg:flex">
          <CategoryMenu />
          <nav aria-label="منوی اصلی" className="flex h-full items-center border-s ps-2">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className="px-3 py-2 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-brand">
                {label}
              </Link>
            ))}
          </nav>
          <a href={site.phone.href} className="ms-auto flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Headset className="size-4 text-brand" />
            <span className="max-xl:hidden">پشتیبانی</span>
            <span dir="ltr">{site.phone.label}</span>
          </a>
        </div>
      </header>

      <nav aria-label="دسترسی سریع" className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
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
