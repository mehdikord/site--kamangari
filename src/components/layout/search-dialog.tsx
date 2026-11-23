"use client";

import { useDeferredValue, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { categories } from "@/data/categories";
import { fa, toman } from "@/lib/format";
import { basePrice } from "@/lib/product";
import { searchProducts, shopHref } from "@/lib/shop-query";

const SUGGESTIONS = ["زغال نارگیل", "فندک زیپو", "قلیان استیل", "شلنگ", "پیپ"];

function SearchPanel({ close }: { close: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const deferred = useDeferredValue(term);
  const results = searchProducts(deferred);

  return (
    <>
      <form
        role="search"
        className="flex items-center gap-3 border-b px-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!term.trim()) return;
          router.push(shopHref({ q: term.trim() }));
          close();
        }}
      >
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} type="search" enterKeyHint="search" aria-label="جست‌وجوی محصول" placeholder="نام محصول، برند یا طعم" className="h-14 min-w-0 flex-1 bg-transparent pe-9 text-base focus:outline-none [&::-webkit-search-cancel-button]:appearance-none" />
      </form>

      <div className="max-h-[60svh] overflow-y-auto overscroll-contain p-4" aria-live="polite">
        {!deferred.trim() ? (
          <>
            <p className="mb-2 text-xs text-muted-foreground">جست‌وجوهای پرتکرار</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setTerm(s)} className="rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-secondary">{s}</button>
              ))}
            </div>
            <p className="mt-5 mb-2 text-xs text-muted-foreground">دسته‌بندی‌ها</p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
              {categories.map((c) => (
                <Link key={c.slug} href={shopHref({ cat: [c.slug] })} onClick={close} className="rounded-lg px-2 py-2 hover:bg-muted">{c.name}</Link>
              ))}
            </div>
          </>
        ) : results.length ? (
          <>
            <ul>
              {results.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <Link href={`/product/${product.slug}`} onClick={close} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted">
                    <Image src={product.images[0]} alt="" width={56} height={56} className="size-14 shrink-0 object-contain" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{product.name}</span>
                      <span className="block text-xs text-muted-foreground">{product.type}</span>
                    </span>
                    <span className="shrink-0 text-xs font-bold sm:text-sm">{toman(basePrice(product))}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={shopHref({ q: deferred.trim() })} onClick={close} className="mt-2 block rounded-lg bg-muted p-3 text-center font-semibold text-brand">
              مشاهده‌ی {fa(results.length)} نتیجه
            </Link>
          </>
        ) : (
          <p className="py-8 text-center text-muted-foreground">محصولی با «{deferred}» یافت نشد. لطفاً نام کوتاه‌تر یا نام برند را جست‌وجو کنید.</p>
        )}
      </div>
    </>
  );
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[8svh] translate-y-0 gap-0 p-0 text-sm sm:max-w-xl">
        <DialogTitle className="sr-only">جست‌وجو</DialogTitle>
        <DialogDescription className="sr-only">جست‌وجو در محصولات فروشگاه</DialogDescription>
        <SearchPanel close={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
