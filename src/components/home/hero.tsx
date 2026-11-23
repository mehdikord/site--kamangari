"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import type { Product } from "@/data/types";
import { toman } from "@/lib/format";
import { basePrice } from "@/lib/product";
import { shopHref } from "@/lib/shop-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { HERO_PARTS } from "./hero-parts";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

/** Scroll position at which each act is fully on screen. */
const ACTS = [
  { label: "معرفی مجموعه", at: 0 },
  { label: "قطعات و لوازم", at: 0.5 },
  { label: "کنترل کیفیت و ارسال", at: 1 },
];

const copyBlock = "absolute inset-x-0 bottom-0 max-lg:text-center lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2";
const actTitle = "heading text-[clamp(1.375rem,min(2.9vw,5.4svh),2.5rem)] leading-normal";
const lead = "mx-auto mt-2 max-w-sm text-[0.8125rem] leading-6 text-muted-foreground lg:mx-0 lg:text-[0.9375rem] lg:leading-7 [@media(max-height:600px)]:hidden";
const actions = "mt-4 flex gap-2 max-lg:justify-center lg:mt-6";

export function Hero({ featured }: { featured: Product }) {
  const section = useRef<HTMLElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [act, setAct] = useState<0 | 1 | 2>(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });

  const first = useTransform(progress, [0, 0.12, 0.2], [1, 1, 0]);
  const firstY = useTransform(progress, [0, 0.2], [0, -28]);
  const second = useTransform(progress, [0.22, 0.32, 0.64, 0.72], [0, 1, 1, 0]);
  const secondY = useTransform(progress, [0.22, 0.32, 0.64, 0.72], [28, 0, 0, -28]);
  const third = useTransform(progress, [0.78, 0.88], [0, 1]);
  const thirdY = useTransform(progress, [0.78, 0.88], [28, 0]);
  const labelOpacity = useTransform(progress, [0.32, 0.4, 0.62, 0.67], [0, 1, 1, 0]);
  const heat = useTransform(progress, [0.78, 0.96], [0, 1]);
  const cool = useTransform(progress, [0.78, 0.96], [1, 0]);
  const track = useTransform(progress, [0, 1], [0.02, 1]);

  // hidden acts must leave the tab order as well as the screen
  useMotionValueEvent(progress, "change", (value) => setAct(value < 0.2 ? 0 : value < 0.74 ? 1 : 2));

  function goToAct(at: number) {
    const el = section.current;
    const pinned = el?.firstElementChild;
    if (!el || !pinned) return;
    const start = el.getBoundingClientRect().top + window.scrollY - (document.querySelector("header")?.offsetHeight ?? 0);
    window.scrollTo({ top: start + (el.offsetHeight - pinned.clientHeight) * at, behavior: "smooth" });
  }

  return (
    <section ref={section} aria-label={`معرفی ${site.name}`} className="relative h-[320svh] motion-reduce:h-auto">
      <div className="sticky top-(--header-h) h-[calc(100svh-var(--header-h)-4rem-env(safe-area-inset-bottom))] min-h-[24rem] p-2 lg:h-[calc(100svh-var(--header-h))] lg:p-3">
        <div className="on-dark relative isolate h-full overflow-hidden rounded-3xl bg-carbon">
          <motion.div aria-hidden="true" style={{ opacity: reduced ? 1 : cool }} className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_38%_48%_at_50%_68%,rgb(61_123_255/0.24),transparent)]" />
          <motion.div aria-hidden="true" style={{ opacity: reduced ? 0 : heat }} className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_38%_48%_at_50%_68%,rgb(255_90_44/0.28),transparent)]" />

          <div className="absolute inset-x-0 top-0 h-[54%] lg:inset-y-0 lg:right-[27%] lg:left-[23%] lg:h-full">
            <Image
              src="/images/studio/hero-qalyan.webp"
              alt="قلیان مدرن با تنه‌ی استیل و شیشه‌ی نورپردازی‌شده"
              fill
              preload
              sizes="(min-width: 64rem) 50vw, 100vw"
              className={cn("object-contain transition-opacity duration-500", ready && !reduced && "opacity-0")}
            />
            {!reduced && (
              <>
                <HeroScene progress={progress} labels={labels} onReady={() => setReady(true)} />
                <motion.ul aria-label="قطعات قلیان" inert={act !== 1 || !ready} style={{ opacity: labelOpacity }} className={cn("pointer-events-none absolute inset-0", !ready && "invisible")}>
                  {HERO_PARTS.map((part, i) => (
                    <li
                      key={part.id}
                      ref={(node) => {
                        labels.current[i] = node;
                      }}
                      className="absolute top-0 left-0"
                    >
                      <Link dir="ltr" href={part.href} className={cn("group flex items-center py-1", act === 1 && "pointer-events-auto", part.side === "left" && "flex-row-reverse")}>
                        <span className="size-1.5 shrink-0 rounded-full bg-white" />
                        <span className="h-px w-4 bg-white/35 sm:w-8" />
                        <span dir="rtl" className="flex h-7 items-center gap-1 rounded-full border border-white/20 bg-graphite px-2.5 text-[0.7rem] whitespace-nowrap transition-colors group-hover:border-flare group-hover:bg-flare group-hover:text-carbon sm:h-8 sm:text-xs">
                          {part.label}
                          <ChevronLeft className="size-3" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-4 top-[54%] bottom-5 lg:inset-y-0 lg:right-[4%] lg:left-auto lg:w-[28%]">
            <motion.div inert={!reduced && act !== 0} style={reduced ? { opacity: 1, y: 0 } : { opacity: first, y: firstY }} className="absolute inset-0">
              <div className={cn(copyBlock, (reduced || act === 0) && "pointer-events-auto")}>
                <h1>
                  <span className="block text-xs font-semibold text-flare lg:text-sm">{site.name}</span>
                  <span className="heading mt-1 block text-[clamp(1.5rem,min(3.4vw,6svh),3rem)] leading-normal">
                    اصالت در کالا،
                    <br />
                    اطمینان در خرید
                  </span>
                </h1>
                <p className={lead}>{site.intro}</p>
                <div className={actions}>
                  <Button asChild variant="brand">
                    <Link href="/shop">مشاهده‌ی محصولات</Link>
                  </Button>
                  <Button asChild variant="ghostDark">
                    <Link href="/wholesale">خرید عمده</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {!reduced && (
              <>
                <motion.div inert={act !== 1} style={{ opacity: second, y: secondY }} className="absolute inset-0">
                  <div className={cn(copyBlock, act === 1 && "pointer-events-auto")}>
                    <h2 className={actTitle}>تأمین کامل قطعات و لوازم</h2>
                    <p className={lead}>تمامی قطعات قلیان به‌صورت جداگانه عرضه می‌شوند. برای مشاهده‌ی مدل‌ها، قطعه‌ی موردنظر را انتخاب کنید.</p>
                  </div>
                </motion.div>
                <motion.div inert={act !== 2} style={{ opacity: third, y: thirdY }} className="absolute inset-0">
                  <div className={cn(copyBlock, act === 2 && "pointer-events-auto")}>
                    <h2 className={actTitle}>کنترل کیفیت پیش از ارسال</h2>
                    <p className={lead}>آزمون نشتی، بسته‌بندی ایمن، بیمه‌ی حمل و شش ماه ضمانت اتصالات برای هر قلیان.</p>
                    <div className={actions}>
                      <Button asChild variant="brand">
                        <Link href={shopHref({ cat: ["hookah"] })}>مشاهده‌ی قلیان‌ها</Link>
                      </Button>
                      <Button asChild variant="ghostDark">
                        <a href="#builder">شخصی‌سازی</a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="absolute inset-y-0 left-[3.5%] hidden w-[20%] max-w-64 flex-col justify-center gap-8 lg:flex">
            {!reduced && (
              <ol aria-label="بخش‌های معرفی">
                {ACTS.map((item, i) => (
                  <li key={item.label}>
                    <button type="button" aria-current={i === act ? "step" : undefined} onClick={() => goToAct(item.at)} className={cn("flex items-center gap-3 py-2 text-[0.8125rem] transition-colors", i === act ? "text-white" : "text-muted-foreground hover:text-white")}>
                      <span className={cn("h-0.5 w-7 origin-right rounded-full transition-[transform,background-color] duration-300", i === act ? "bg-flare" : "scale-x-40 bg-white/40")} />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <Link href={`/product/${featured.slug}`} className="flex items-center gap-3 rounded-2xl border bg-white/5 p-2 transition-colors hover:bg-white/10 [@media(max-height:600px)]:hidden">
              <Image src={featured.images[0]} alt="" width={64} height={64} className="size-16 shrink-0 rounded-xl bg-white/10 object-contain" />
              <span className="min-w-0 text-xs">
                <span className="block text-flare">پیشنهاد ویژه</span>
                <span className="line-clamp-2 leading-5 font-semibold">{featured.name}</span>
                <span className="block text-[0.7rem] text-muted-foreground">{toman(basePrice(featured))}</span>
              </span>
            </Link>
          </div>

          <div aria-hidden="true" className="absolute inset-x-8 bottom-2 h-0.5 overflow-hidden rounded-full bg-white/10 motion-reduce:hidden lg:hidden">
            <motion.div style={{ scaleX: track }} className="h-full origin-right bg-flare" />
          </div>
        </div>
      </div>
    </section>
  );
}
