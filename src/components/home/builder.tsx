"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Rotate3d, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useInView } from "motion/react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { productBySlug } from "@/data/catalog";
import type { Product } from "@/data/types";
import { toman } from "@/lib/format";
import { useShop } from "@/lib/store";
import type { QalyanOptions } from "@/three/qalyan";

const BuilderCanvas = dynamic(() => import("./builder-canvas"), { ssr: false });

interface Choice {
  slug: string;
  label: string;
  look: Partial<QalyanOptions>;
}

// each choice is a real catalogue product
const GROUPS: { title: string; choices: Choice[] }[] = [
  {
    title: "شیشه",
    choices: [
      { slug: "glass-bell", label: "مخروطی آبی", look: { shape: "cone", glass: "#2f6fff" } },
      { slug: "glass-globe", label: "کروی سرخ", look: { shape: "sphere", glass: "#e0444e" } },
      { slug: "glass-flask", label: "تراش فیروزه‌ای", look: { shape: "facet", glass: "#19b7b0" } },
      { slug: "glass-green", label: "کروی دودی", look: { shape: "sphere", glass: "#8fa3b8" } },
    ],
  },
  {
    title: "تنه و سینی",
    choices: [
      { slug: "stem-steel", label: "استیل", look: { stem: "steel" } },
      { slug: "stem-wood", label: "گردو", look: { stem: "wood" } },
      { slug: "stem-brass", label: "شامپاینی", look: { stem: "champagne" } },
    ],
  },
  {
    title: "سری",
    choices: [
      { slug: "bowl-black", label: "مشکی", look: { bowl: "#23252c" } },
      { slug: "bowl-turquoise", label: "فیروزه‌ای", look: { bowl: "#19a7a1" } },
      { slug: "bowl-clay", label: "سفالی", look: { bowl: "#b8562f" } },
    ],
  },
  {
    title: "شلنگ",
    choices: [
      { slug: "hose-black", label: "مشکی", look: { hose: "#20232a" } },
      { slug: "hose-blue", label: "آبی", look: { hose: "#2f5fd0" } },
      { slug: "hose-red", label: "سرخ", look: { hose: "#c93a44" } },
      { slug: "hose-cream", label: "روشن", look: { hose: "#d9d4cb" } },
    ],
  },
];

export function Builder() {
  const [picked, setPicked] = useState([0, 0, 0, 0]);
  const [ready, setReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const near = useInView(section, { once: true, margin: "500px 0px" });
  const add = useShop((s) => s.add);

  const { options, products, total } = useMemo(() => {
    const chosen = GROUPS.map((group, i) => group.choices[picked[i]]);
    const products = chosen.map((c) => productBySlug.get(c.slug)).filter((p): p is Product => !!p);
    const options: QalyanOptions = { shape: "cone", glass: "#2f6fff", stem: "steel", bowl: "#23252c", hose: "#20232a" };
    for (const choice of chosen) Object.assign(options, choice.look);
    return { options, products, total: products.reduce((sum, p) => sum + p.options[0].price, 0) };
  }, [picked]);

  function addAll() {
    const added = products.filter((p) => add(p.id, p.options[0].id) > 0).length;
    if (added === products.length) toast.success("چهار قطعه‌ی انتخابی به سبد خرید افزوده شد");
    else toast.error("موجودی برخی قطعات کافی نیست. لطفاً سبد خرید را بررسی کنید.");
  }

  return (
    <section ref={section} id="builder" className="shell pt-9 lg:pt-12">
      <div className="grid overflow-hidden rounded-3xl border lg:grid-cols-[1fr_1.15fr]">
        <div className="relative h-72 bg-carbon bg-[radial-gradient(ellipse_55%_55%_at_50%_65%,rgb(61_123_255/0.3),transparent)] lg:order-last lg:h-auto lg:min-h-[30rem]">
          <Image src="/images/studio/builder-qalyan.webp" alt="" fill sizes="(min-width: 64rem) 50vw, 100vw" className={cn("object-contain transition-opacity duration-300", ready && "opacity-0")} />
          {near && <BuilderCanvas options={options} onReady={() => setReady(true)} />}
          <span className="pointer-events-none absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] text-white">
            <Rotate3d className="size-3.5" />
            نمای سه‌بعدی
          </span>
        </div>
        <div className="p-4 lg:p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-brand">
              <SlidersHorizontal className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="heading title-section">شخصی‌سازی قلیان</h2>
              <p className="text-xs text-muted-foreground">قطعات موردنظر را انتخاب و نتیجه را پیش از خرید مشاهده کنید.</p>
            </div>
          </div>
          {GROUPS.map((group, g) => (
            <fieldset key={group.title} className="mt-3">
              <legend className="mb-1.5 text-xs font-semibold">{group.title}</legend>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {group.choices.map((choice, i) => (
                  <label key={choice.slug} className="flex h-12 cursor-pointer items-center gap-1.5 rounded-xl border px-1.5 text-[0.7rem] transition-colors has-checked:border-carbon has-checked:bg-mist has-checked:font-semibold has-focus-visible:outline-2 has-focus-visible:outline-brand">
                    <input type="radio" name={`builder-${g}`} checked={picked[g] === i} onChange={() => setPicked((prev) => prev.map((v, k) => (k === g ? i : v)))} className="sr-only" />
                    <Image src={`/images/catalog/${choice.slug}-0.webp`} alt="" width={40} height={40} className="size-10 shrink-0 object-contain" />
                    {choice.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p aria-live="polite">
              <span className="block text-[0.7rem] text-muted-foreground">مجموع چهار قطعه</span>
              <span className="text-lg font-bold">{toman(total)}</span>
            </p>
            <Button variant="brand" onClick={addAll}>
              <ShoppingBag />
              افزودن به سبد خرید
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
