import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, SlidersHorizontal, Zap } from "lucide-react";
import { Price } from "@/components/product/price";
import { Countdown } from "@/components/shared/countdown";
import { site } from "@/config/site";
import type { Product } from "@/data/types";
import { HeroSlider } from "./hero-slider";

export function Hero({ featured }: { featured: Product }) {
  return (
    <section aria-labelledby="hero-title" className="shell pt-3 lg:pt-4">
      <h1 id="hero-title" className="sr-only">{site.name}؛ فروشگاه تخصصی قلیان، لوازم جانبی و دخانیات</h1>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_17rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
        <HeroSlider />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <Link href={`/product/${featured.slug}`} className="group relative flex flex-col overflow-hidden rounded-3xl border bg-white p-3 transition-colors hover:border-input lg:p-4">
            <span className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <span className="grid size-7 place-items-center rounded-lg bg-accent text-brand">
                  <Zap className="size-3.5 fill-current" aria-hidden="true" />
                </span>
                <span className="max-sm:hidden">پیشنهاد ویژه</span>
              </span>
              <span className="rounded-lg bg-brand px-2 py-0.5 text-[0.7rem] text-white">
                <Countdown compact />
              </span>
            </span>
            <span className="relative my-2 block min-h-24 flex-1 rounded-2xl bg-[radial-gradient(circle_at_50%_60%,#e8f0ff,var(--mist)_70%)]">
              <Image src={featured.images[0]} alt="" fill sizes="(min-width: 64rem) 18rem, 45vw" className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="line-clamp-1 text-xs font-semibold lg:text-[0.8125rem]">{featured.name}</span>
            <Price option={featured.options[0]} />
          </Link>

          <Link href="#builder" className="group relative isolate flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#101633,#2a4bc4)] p-3 text-white lg:min-h-44 lg:p-4">
            <Image src="/images/studio/builder-qalyan.webp" alt="" width={400} height={400} className="absolute -bottom-6 -left-6 -z-10 w-[68%] max-w-44 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3" />
            <span className="grid size-8 place-items-center rounded-xl bg-white/12 text-[#9dbaff]">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="heading block text-sm lg:text-base">شخصی‌سازی قلیان</span>
              <span className="block max-w-[9rem] text-[0.7rem] leading-5 text-white/80">قطعات را انتخاب و نتیجه را سه‌بعدی ببینید</span>
            </span>
            <span className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-white text-carbon transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
