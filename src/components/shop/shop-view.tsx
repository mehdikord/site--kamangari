"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { categoryBySlug } from "@/data/categories";
import { fa, faRating } from "@/lib/format";
import { EMPTY_QUERY, PAGE_SIZES, SORTS, shopHref, type ShopQuery, type ShopResult, type SortKey } from "@/lib/shop-query";
import { Filters } from "./filters";

function activeFilters(q: ShopQuery) {
  const chips: { label: string; change: Partial<ShopQuery> }[] = [];
  if (q.q) chips.push({ label: `جست‌وجو: ${q.q}`, change: { q: "" } });
  for (const cat of q.cat) chips.push({ label: categoryBySlug[cat].name, change: { cat: q.cat.filter((x) => x !== cat) } });
  for (const key of ["type", "brand", "material", "flavor"] as const) {
    for (const value of q[key]) chips.push({ label: value, change: { [key]: q[key].filter((x) => x !== value) } });
  }
  if (q.min) chips.push({ label: `از ${fa(q.min)} تومان`, change: { min: 0 } });
  if (q.max) chips.push({ label: `تا ${fa(q.max)} تومان`, change: { max: 0 } });
  if (q.stock) chips.push({ label: "موجود", change: { stock: false } });
  if (q.sale) chips.push({ label: "تخفیف‌دار", change: { sale: false } });
  if (q.flash) chips.push({ label: "لحظه‌ای", change: { flash: false } });
  if (q.rating) chips.push({ label: `امتیاز ${faRating(q.rating)} به بالا`, change: { rating: 0 } });
  return chips;
}

function pageList(current: number, pages: number) {
  const list: (number | string)[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - current) <= 1) list.push(n);
    else if (typeof list.at(-1) === "number") list.push(`gap-${n}`);
  }
  return list;
}

export function ShopView({ query: committed, result }: { query: ShopQuery; result: ShopResult }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // controls answer at once while the server works out the new list
  const [query, setQuery] = useOptimistic(committed);
  const [drawer, setDrawer] = useState(false);

  function update(changes: Partial<ShopQuery>) {
    const next = { ...query, page: 1, ...changes };
    startTransition(() => {
      setQuery(next);
      router.push(shopHref(next), { scroll: false });
    });
  }

  const reset = () => update({ ...EMPTY_QUERY, sort: query.sort, per: query.per, view: query.view });
  const chips = activeFilters(query);
  const { items, total, pages, page } = result;
  const pageHref = (n: number) => shopHref({ ...committed, page: n });
  const pageButton = "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs hover:bg-secondary";

  return (
    <div className="shell grid gap-x-6 py-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-6">
      <aside aria-label="فیلتر محصولات" className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1rem)] max-h-[calc(100svh-var(--header-h)-2rem)] overflow-y-auto overscroll-contain rounded-2xl border p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="heading text-sm">فیلترها</h2>
            {chips.length > 0 && <Button variant="link" size="sm" className="px-0 text-danger" onClick={reset}>پاک‌کردن همه</Button>}
          </div>
          <Filters query={query} facets={result.facets} update={update} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <form
            role="search"
            className="relative w-full sm:w-auto sm:min-w-56 sm:flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              update({ q: String(new FormData(event.currentTarget).get("q") ?? "").trim() });
            }}
          >
            <input key={committed.q} name="q" type="search" defaultValue={committed.q} placeholder="جست‌وجو در محصولات" aria-label="جست‌وجو در محصولات" className="h-10 w-full rounded-lg border border-input bg-white ps-3 pe-11 text-base sm:text-[0.8125rem]" />
            <button type="submit" aria-label="جست‌وجو" className="absolute end-0 top-0 grid size-10 place-items-center">
              <Search className="size-4" />
            </button>
          </form>
          <Button variant="outline" className="px-3 lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal />
            فیلترها
            {chips.length > 0 && <span className="rounded-full bg-brand px-2 text-white">{fa(chips.length)}</span>}
          </Button>
          <Select value={query.sort} onValueChange={(sort) => update({ sort: sort as SortKey })}>
            <SelectTrigger aria-label="مرتب‌سازی" className="min-w-0 flex-1 px-2 max-sm:text-xs sm:min-w-40 sm:flex-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORTS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="min-h-10">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(query.per)} onValueChange={(per) => update({ per: Number(per) })}>
            <SelectTrigger aria-label="تعداد در هر صفحه" className="hidden xl:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>{fa(size)} در صفحه</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            {([["grid", LayoutGrid, "نمایش شبکه‌ای"], ["list", List, "نمایش فهرستی"]] as const).map(([view, Icon, label]) => (
              <button key={view} type="button" aria-pressed={query.view === view} aria-label={label} onClick={() => update({ view, page })} className={cn("grid size-10 place-items-center rounded-lg max-sm:w-8", query.view === view ? "bg-carbon text-white" : "hover:bg-secondary")}>
                <Icon className="size-4.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2.5 mb-3 flex flex-wrap items-center gap-1.5 text-xs">
          <p role="status" className="me-2 text-muted-foreground">{fa(total)} کالا</p>
          {chips.map(({ label, change }, i) => (
            <button key={`${label}-${i}`} type="button" aria-label={`حذف فیلتر ${label}`} onClick={() => update(change)} className="flex min-h-7 items-center gap-1.5 rounded-full bg-secondary px-3">
              {label}
              <X className="size-3.5" />
            </button>
          ))}
        </div>

        <div aria-busy={pending} className={cn("transition-opacity", pending && "opacity-50")}>
          {items.length ? (
            <ul className={committed.view === "list" ? "space-y-2.5" : "grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:gap-3 xl:grid-cols-4"}>
              {items.map((product, i) => (
                <li key={product.id} className="min-w-0">
                  <ProductCard product={product} layout={committed.view} eager={i < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-20 text-center">
              <h2 className="heading text-lg">کالایی مطابق با فیلترهای انتخابی یافت نشد</h2>
              <p className="mt-2 text-muted-foreground">لطفاً بازه‌ی قیمت یا فیلترها را تغییر دهید.</p>
              <Button className="mt-5" onClick={reset}>پاک‌کردن فیلترها</Button>
            </div>
          )}
        </div>

        {pages > 1 && (
          <nav aria-label="صفحه‌بندی" className="mt-8 flex flex-wrap items-center justify-center gap-1">
            {page > 1 && <Link href={pageHref(page - 1)} aria-label="صفحه‌ی قبل" className={pageButton}><ChevronRight /></Link>}
            {pageList(page, pages).map((entry) =>
              typeof entry === "number" ? (
                <Link key={entry} href={pageHref(entry)} aria-label={`صفحه‌ی ${fa(entry)}`} aria-current={entry === page ? "page" : undefined} className={cn(pageButton, entry === page && "bg-carbon font-bold text-white hover:bg-carbon")}>
                  {fa(entry)}
                </Link>
              ) : (
                <span key={entry} className="px-1">…</span>
              ),
            )}
            {page < pages && <Link href={pageHref(page + 1)} aria-label="صفحه‌ی بعد" className={pageButton}><ChevronLeft /></Link>}
          </nav>
        )}
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="right" className="gap-0 text-base data-[side=right]:w-[90%]">
          <SheetTitle className="heading px-5 pt-4 text-base">فیلترها</SheetTitle>
          <SheetDescription className="sr-only">محدودکردن فهرست محصولات</SheetDescription>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
            <Filters query={query} facets={result.facets} update={update} />
          </div>
          <div className="flex gap-2 border-t p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
            <Button className="flex-1" disabled={pending} onClick={() => setDrawer(false)}>
              {pending ? "در حال اعمال" : `مشاهده‌ی ${fa(total)} کالا`}
            </Button>
            {chips.length > 0 && <Button variant="outline" onClick={reset}>پاک‌کردن</Button>}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
