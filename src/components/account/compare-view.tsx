"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useAddToCart } from "@/components/product/use-add-to-cart";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { productById } from "@/data/catalog";
import { fa, faRating, toman } from "@/lib/format";
import { basePrice, productDiscount } from "@/lib/product";
import { useReady, useShop } from "@/lib/store";

export function CompareView() {
  const ready = useReady();
  const ids = useShop((s) => s.compare);
  const toggle = useShop((s) => s.toggleCompare);
  const addToCart = useAddToCart();

  if (!ready) return <Loading />;
  const items = ids.flatMap((id) => productById.get(id) ?? []);
  if (!items.length) return <EmptyState title="فهرست مقایسه خالی است" text="با انتخاب نشان مقایسه، تا چهار کالا را هم‌زمان مقایسه کنید." />;

  const labels = [...new Set(items.flatMap((p) => p.specs.map(([label]) => label)))];
  const rows: [string, string[]][] = [
    ["قیمت", items.map((p) => toman(basePrice(p)))],
    ["تخفیف", items.map((p) => (productDiscount(p) ? `${fa(productDiscount(p))}٪` : "ندارد"))],
    ["امتیاز", items.map((p) => faRating(p.rating))],
    ["موجودی", items.map((p) => (p.stock ? "موجود" : "ناموجود"))],
    ["تخفیف عمده", items.map((p) => `${fa(p.bulk.percent)}٪ از ${fa(p.bulk.min)} عدد`)],
    ...labels.map((label): [string, string[]] => [label, items.map((p) => p.specs.find(([l]) => l === label)?.[1] ?? "ندارد")]),
  ];
  const sticky = "sticky start-0 z-10 bg-white p-3 text-start";

  return (
    <div className="shell overflow-x-auto py-5 lg:py-7">
      <table className="w-full table-fixed text-xs" style={{ minWidth: `${7 + items.length * 11}rem` }}>
        <thead>
          <tr>
            <th scope="col" className={`${sticky} w-28`}><span className="sr-only">ویژگی</span></th>
            {items.map((product) => (
              <th key={product.id} scope="col" className="relative p-2 align-top font-normal">
                <button type="button" aria-label={`حذف ${product.name}`} onClick={() => toggle(product.id)} className="absolute end-3 top-3 z-[1] grid size-9 place-items-center rounded-full bg-secondary">
                  <X className="size-4" />
                </button>
                <Link href={`/product/${product.slug}`}>
                  <Image src={product.images[0]} alt="" width={240} height={240} className="aspect-square w-full rounded-2xl bg-mist object-contain" />
                  <span className="mt-2 block min-h-12 font-bold">{product.name}</span>
                </Link>
                <Button size="sm" disabled={!product.stock} onClick={() => addToCart(product, product.options[0])} className="mt-2 w-full">افزودن به سبد</Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, values]) => (
            <tr key={label} className="border-b">
              <th scope="row" className={`${sticky} text-muted-foreground`}>{label}</th>
              {values.map((value, i) => (
                <td key={items[i].id} className="p-3 text-center font-semibold">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
