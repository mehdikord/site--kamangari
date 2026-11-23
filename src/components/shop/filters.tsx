"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "cn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { categoryBySlug } from "@/data/categories";
import type { CategorySlug } from "@/data/types";
import { digitsOnly, fa, faRating } from "@/lib/format";
import type { Facet, ShopQuery, ShopResult } from "@/lib/shop-query";

// prices run from 60 thousand to 12 million, so the slider moves over steps
const STEPS = [0, 100_000, 200_000, 350_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000];
const LAST = STEPS.length - 1;
const PRESETS: [string, number, number][] = [
  ["تا ۵۰۰ هزار", 0, 500_000],
  ["۵۰۰ هزار تا ۲ میلیون", 500_000, 2_000_000],
  ["۲ تا ۵ میلیون", 2_000_000, 5_000_000],
  ["بالای ۵ میلیون", 5_000_000, 0],
];

export type Update = (changes: Partial<ShopQuery>) => void;

function nearestStep(value: number) {
  const index = STEPS.findIndex((step) => step >= value);
  return index < 0 ? LAST : index;
}

function PriceFilter({ min, max, update }: { min: number; max: number; update: Update }) {
  const [range, setRange] = useState([nearestStep(min), max ? nearestStep(max) : LAST]);
  const [from, setFrom] = useState(min ? fa(min) : "");
  const [to, setTo] = useState(max ? fa(max) : "");
  const parse = (value: string) => Number(digitsOnly(value)) || 0;
  const typed = (value: string) => (parse(value) ? fa(parse(value)) : "");

  function apply(event: React.FormEvent) {
    event.preventDefault();
    const low = parse(from);
    const high = parse(to);
    update(high && low > high ? { min: high, max: low } : { min: low, max: high });
  }

  return (
    <form onSubmit={apply} className="space-y-3 px-1">
      <div className="py-3">
        <Slider
          value={range}
          min={0}
          max={LAST}
          step={1}
          minStepsBetweenThumbs={1}
          aria-label="بازه‌ی قیمت"
          onValueChange={([low, high]) => {
            setRange([low, high]);
            setFrom(low ? fa(STEPS[low]) : "");
            setTo(high === LAST ? "" : fa(STEPS[high]));
          }}
          onValueCommit={([low, high]) => update({ min: STEPS[low], max: high === LAST ? 0 : STEPS[high] })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-muted-foreground">
          از (تومان)
          <Input inputMode="numeric" value={from} onChange={(e) => setFrom(typed(e.target.value))} placeholder="۰" className="mt-1 h-10 px-2 text-foreground" />
        </label>
        <label className="text-xs text-muted-foreground">
          تا (تومان)
          <Input inputMode="numeric" value={to} onChange={(e) => setTo(typed(e.target.value))} placeholder="نامحدود" className="mt-1 h-10 px-2 text-foreground" />
        </label>
      </div>
      <Button type="submit" size="sm" variant="outline" className="w-full">اعمال قیمت</Button>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(([label, low, high]) => {
          const active = min === low && max === high;
          return (
            <button key={label} type="button" aria-pressed={active} onClick={() => update({ min: active ? 0 : low, max: active ? 0 : high })} className={cn("rounded-full px-2.5 py-1 text-xs", active ? "bg-carbon text-white" : "bg-secondary")}>
              {label}
            </button>
          );
        })}
      </div>
    </form>
  );
}

function CheckList({ name, items, selected, onChange }: { name: string; items: Facet[]; selected: string[]; onChange: (next: string[]) => void }) {
  const [find, setFind] = useState("");
  const long = items.length > 9;
  const shown = find ? items.filter((item) => item.label.includes(find.trim())) : items;
  return (
    <>
      {long && (
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input value={find} onChange={(e) => setFind(e.target.value)} aria-label={`جست‌وجو در ${name}`} placeholder={`جست‌وجوی ${name}`} className="h-10 ps-9" />
        </div>
      )}
      <ul className={cn("pe-1", long && "max-h-64 overflow-y-auto")}>
        {shown.map(({ value, label, count }) => {
          const checked = selected.includes(value);
          return (
            <li key={value}>
              <label className={cn("flex min-h-10 cursor-pointer items-center gap-2.5 px-1 text-xs", !count && !checked && "opacity-45")}>
                <Checkbox checked={checked} disabled={!count && !checked} onCheckedChange={() => onChange(checked ? selected.filter((v) => v !== value) : [...selected, value])} />
                <span className="flex-1">{label}</span>
                <span className="text-xs text-muted-foreground">{fa(count)}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function Filters({ query, facets, update }: { query: ShopQuery; facets: ShopResult["facets"]; update: Update }) {
  const toggles = [
    ["stock", "فقط کالاهای موجود"],
    ["sale", "دارای تخفیف"],
    ["flash", "تخفیف‌های لحظه‌ای"],
  ] as const;

  const groups: { id: "type" | "brand" | "material" | "flavor"; title: string }[] = [
    { id: "type", title: "نوع" },
    { id: "flavor", title: "طعم" },
    { id: "brand", title: "برند" },
    { id: "material", title: "جنس" },
  ];
  const trigger = "heading py-3 text-[0.8125rem] hover:no-underline";

  function changeCategory(next: string[]) {
    const cat = next as CategorySlug[];
    // keep only the types that still exist in the chosen categories
    const type = cat.length ? query.type.filter((t) => cat.some((c) => categoryBySlug[c].types.includes(t))) : query.type;
    update({ cat, type, brand: [], material: [], flavor: [] });
  }

  return (
    <div>
      <div className="space-y-1 border-b pb-3">
        {toggles.map(([key, label]) => (
          <label key={key} className="flex min-h-10 cursor-pointer items-center justify-between gap-3 text-xs font-semibold">
            {label}
            <Switch checked={query[key]} onCheckedChange={(on) => update({ [key]: on })} />
          </label>
        ))}
      </div>
      <Accordion type="multiple" defaultValue={["cat", "price", "type", ...groups.filter((g) => query[g.id].length).map((g) => g.id)]}>
        <AccordionItem value="cat">
          <AccordionTrigger className={trigger}>دسته‌بندی</AccordionTrigger>
          <AccordionContent>
            <CheckList name="دسته" items={facets.cat} selected={query.cat} onChange={changeCategory} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className={trigger}>قیمت</AccordionTrigger>
          <AccordionContent>
            <PriceFilter key={`${query.min}-${query.max}`} min={query.min} max={query.max} update={update} />
          </AccordionContent>
        </AccordionItem>
        {groups.map(({ id, title }) =>
          facets[id].length ? (
            <AccordionItem key={id} value={id}>
              <AccordionTrigger className={trigger}>{title}</AccordionTrigger>
              <AccordionContent>
                <CheckList name={title} items={facets[id]} selected={query[id]} onChange={(next) => update({ [id]: next })} />
              </AccordionContent>
            </AccordionItem>
          ) : null,
        )}
        <AccordionItem value="rating">
          <AccordionTrigger className={trigger}>امتیاز</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-1.5">
              {[4, 4.5, 4.8].map((value) => (
                <button key={value} type="button" aria-pressed={query.rating === value} onClick={() => update({ rating: query.rating === value ? 0 : value })} className={cn("rounded-full px-3 py-2 text-xs", query.rating === value ? "bg-carbon text-white" : "bg-secondary")}>
                  {faRating(value)} به بالا
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
