"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, ShoppingBag, Timer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Countdown } from "@/components/shared/countdown";
import { Quantity } from "@/components/shared/quantity";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/types";
import { fa, toman } from "@/lib/format";
import { useReady, useShop } from "@/lib/store";
import { Price } from "./price";
import { CompareButton, WishButton } from "./save-buttons";
import { useAddToCart } from "./use-add-to-cart";

interface Purchase {
  product: Product;
  optionId: string;
  setOptionId: (id: string) => void;
  qty: number;
  setQty: (qty: number) => void;
}

const PurchaseContext = createContext<Purchase | null>(null);

function usePurchase() {
  const value = useContext(PurchaseContext);
  if (!value) throw new Error("BuyBox must be inside PurchaseProvider");
  const option = value.product.options.find((o) => o.id === value.optionId) ?? value.product.options[0];
  const bulk = value.qty >= value.product.bulk.min;
  const total = option.price * value.qty * (bulk ? 1 - value.product.bulk.percent / 100 : 1);
  return { ...value, option, bulk, total: Math.round(total / 1000) * 1000 };
}

/** Shares the chosen option and quantity between the buy box and the mobile bar. */
export function PurchaseProvider({ product, children }: { product: Product; children: React.ReactNode }) {
  const [optionId, setOptionId] = useState(product.options[0].id);
  const [qty, setQty] = useState(1);
  const ready = useReady();
  const view = useShop((s) => s.view);
  useEffect(() => {
    if (ready) view(product.id);
  }, [ready, view, product.id]);
  const value = useMemo(() => ({ product, optionId, setOptionId, qty, setQty }), [product, optionId, qty]);
  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function BuyBox() {
  const { product, option, setOptionId, qty, setQty, bulk, total } = usePurchase();
  const router = useRouter();
  const addToCart = useAddToCart();
  const add = useShop((s) => s.add);
  const soldOut = product.stock === 0;

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("پیوند محصول کپی شد");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("کپی نشد. لطفاً پیوند را از نوار نشانی مرورگر کپی کنید.");
    }
  }

  return (
    <div className="rounded-2xl border p-4">
      {product.flash && !soldOut && (
        <p className="mb-5 flex items-center justify-between gap-2 rounded-lg bg-carbon px-3 py-2 text-xs text-white">
          <span className="flex items-center gap-2"><Timer className="size-4" />پایان تخفیف لحظه‌ای</span>
          <Countdown compact />
        </p>
      )}

      {product.options.length > 1 && (
        <fieldset className="mb-5">
          <legend className="mb-1.5 text-xs font-semibold">{product.optionLabel ?? "مدل"}</legend>
          <div className="flex flex-wrap gap-2">
            {product.options.map((o) => (
              <label key={o.id} className="cursor-pointer rounded-lg border border-input px-2.5 py-1.5 text-xs transition-colors has-checked:border-carbon has-checked:bg-carbon has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-brand">
                <input type="radio" name="option" checked={o.id === option.id} onChange={() => setOptionId(o.id)} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <Price option={option} large />
        {!soldOut && <Quantity value={qty} max={product.stock} onChange={setQty} label={product.name} />}
      </div>

      {!soldOut && (
        <div className={cn("mt-4 rounded-lg px-3 py-2 text-xs", bulk ? "bg-success text-white" : "bg-muted")} aria-live="polite">
          {bulk ? `تخفیف عمده‌ی ${fa(product.bulk.percent)}٪ اعمال شد.` : `از ${fa(product.bulk.min)} عدد، ${fa(product.bulk.percent)}٪ تخفیف عمده اعمال می‌شود.`}
          {qty > 1 && <strong className="block">جمع: {toman(total)}</strong>}
        </div>
      )}

      {soldOut ? (
        <div className="mt-5">
          <p className="text-sm font-bold text-danger">این کالا در حال حاضر موجود نیست.</p>
          <Button size="lg" variant="outline" className="mt-3 w-full" onClick={() => toast.success("درخواست اطلاع‌رسانی موجودی ثبت شد (نمایشی)")}>اطلاع‌رسانی هنگام موجود شدن</Button>
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          <Button size="lg" variant="brand" onClick={() => addToCart(product, option, qty, document.querySelector("[data-product-image]"))}>
            <ShoppingBag />
            افزودن به سبد
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              add(product.id, option.id, qty);
              router.push("/checkout");
            }}
          >
            خرید فوری
          </Button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <WishButton id={product.id} name={product.name} className="size-9 border" />
        <CompareButton id={product.id} name={product.name} className="size-9 border" />
        <button type="button" onClick={share} aria-label="هم‌رسانی محصول" className="grid size-9 place-items-center rounded-full border">
          <Share2 className="size-4" />
        </button>
        {!soldOut && (
          <span className="ms-auto text-xs text-muted-foreground">{product.stock <= 10 ? `فقط ${fa(product.stock)} عدد در انبار` : "موجود در انبار"}</span>
        )}
      </div>
    </div>
  );
}

export function MobileBuyBar() {
  const { product, option, qty, total } = usePurchase();
  const addToCart = useAddToCart();
  if (!product.stock) return null;
  return (
    <div className="no-print sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 border-t bg-white px-4 py-2.5 lg:hidden">
      <p className="min-w-0">
        <span className="block truncate text-xs text-muted-foreground">
          {product.options.length > 1 ? option.label : "قیمت"}
          {qty > 1 && `، ${fa(qty)} عدد`}
        </span>
        <span className="font-extrabold whitespace-nowrap">{toman(total)}</span>
      </p>
      <Button variant="brand" className="px-4" onClick={() => addToCart(product, option, qty, document.querySelector("[data-product-image]"))}>
        <ShoppingBag />
        افزودن به سبد
      </Button>
    </div>
  );
}
