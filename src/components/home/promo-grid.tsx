"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "cn";
import { CategoryIcon } from "@/components/brand/category-icon";
import { shopHref } from "@/lib/shop-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Banner {
  title: string;
  text: string;
  icon: string;
  href: string;
  image: string;
  tone: string;
  chip: string;
  imageBox: string;
  wide?: boolean;
  /** Pixels of scroll drift. */
  drift: number;
}

const BANNERS: Banner[] = [
  {
    title: "قلیان‌های مدرن",
    text: "تنه‌ی استیل، آلومینیوم و چوب با شش ماه ضمانت اتصالات",
    icon: "hookah",
    href: shopHref({ cat: ["hookah"] }),
    image: "/images/studio/lineup.webp",
    tone: "bg-carbon bg-[radial-gradient(ellipse_50%_70%_at_25%_80%,rgb(61_123_255/0.3),transparent)] text-white h-52 col-span-2 lg:row-span-2 lg:h-auto",
    chip: "bg-white/10 text-flare",
    imageBox: "-bottom-3 left-0 h-[92%] w-[56%]",
    wide: true,
    drift: 18,
  },
  {
    title: "زغال",
    text: "نارگیل، لیمو و فشرده",
    icon: "lighter",
    href: shopHref({ cat: ["hookah-accessories"], type: ["زغال"] }),
    image: "/images/catalog/coal-coco-0.webp",
    tone: "bg-brand text-white h-44",
    chip: "bg-white text-brand",
    imageBox: "-bottom-4 -left-2 h-[76%] w-[78%]",
    drift: 10,
  },
  {
    title: "فندک",
    text: "بنزینی و گازی",
    icon: "lighter",
    href: shopHref({ cat: ["lighter"] }),
    image: "/images/catalog/zippo-chrome-0.webp",
    tone: "bg-[#e8f0ff] h-44",
    chip: "bg-white text-[#2f5fd0]",
    imageBox: "-bottom-5 -left-3 h-[76%] w-[78%]",
    drift: 14,
  },
];

function BannerTile({ banner, progress }: { banner: Banner; progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 1], [banner.drift, -banner.drift]);
  return (
    <Link href={banner.href} className={cn("group relative overflow-hidden rounded-3xl p-4 lg:p-6", banner.tone)}>
      <motion.div style={{ y: reduced ? 0 : y }} className={cn("pointer-events-none absolute", banner.imageBox)}>
        <Image src={banner.image} alt="" fill sizes="(min-width: 64rem) 30rem, 55vw" className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105" />
      </motion.div>
      <span className="relative flex items-start justify-between gap-2">
        <span className="flex items-start gap-2.5">
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", banner.chip)}>
            <CategoryIcon slug={banner.icon} className="size-4.5" />
          </span>
          <span>
            <span className="heading block text-base lg:text-xl">{banner.title}</span>
            <span className={cn("block text-[0.7rem] leading-5 lg:text-xs", banner.wide && "max-w-[8rem] lg:max-w-[13rem]")}>{banner.text}</span>
          </span>
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-carbon transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpLeft className="size-4" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export function PromoGrid() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  return (
    <section ref={section} aria-label="مجموعه‌های منتخب" className="shell grid grid-cols-2 gap-2.5 pt-9 lg:grid-cols-3 lg:gap-3 lg:pt-12">
      {BANNERS.map((banner) => (
        <BannerTile key={banner.title} banner={banner} progress={scrollYProgress} />
      ))}
    </section>
  );
}
