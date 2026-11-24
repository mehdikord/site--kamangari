"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, Timer } from "lucide-react";
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform, type MotionValue, type PanInfo } from "motion/react";
import { cn } from "cn";
import { Countdown } from "@/components/shared/countdown";
import { faPlain } from "@/lib/format";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SLIDES, type Slide, type SlideArt } from "./hero-slides";

const DURATION = 6.5;
const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => faPlain(n).padStart(2, "۰");

function Art({ art, index, direction, pointerX, pointerY }: { art: SlideArt; index: number; direction: number; pointerX: MotionValue<number>; pointerY: MotionValue<number> }) {
  const x = useTransform(pointerX, [-0.5, 0.5], [art.depth * 14, art.depth * -14]);
  const y = useTransform(pointerY, [-0.5, 0.5], [art.depth * 9, art.depth * -9]);
  return (
    <motion.div
      className="absolute"
      style={{ left: `${art.left}%`, bottom: `${art.bottom}%`, width: `${art.width}%`, zIndex: Math.round(10 - art.depth) }}
      initial={{ opacity: 0, x: -direction * 90, scale: 0.82, rotate: (art.rotate ?? 0) - 12 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotate: art.rotate ?? 0 }}
      exit={{ opacity: 0, x: direction * 60, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ type: "spring", bounce: 0.22, visualDuration: 0.7, delay: 0.1 + index * 0.08 }}
    >
      <motion.div style={{ x, y }}>
        <div className="animate-float" style={{ animationDuration: `${5 + index * 1.2}s`, animationDelay: `${index * -1.6}s` }}>
          <Image src={art.src} alt="" width={800} height={800} draggable={false} preload={index === 0} sizes="(min-width: 64rem) 22rem, 45vw" className="h-auto w-full drop-shadow-[0_26px_28px_rgb(0_0_0/0.35)] select-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function SlideView({ slide, direction, pointerX, pointerY, onLink }: { slide: Slide; direction: number; pointerX: MotionValue<number>; pointerY: MotionValue<number>; onLink: (e: React.MouseEvent) => void }) {
  const Icon = slide.icon;
  const words = slide.title.split(" ");
  const tone = slide.dark ? "text-white" : "text-carbon";
  const soft = slide.dark ? "text-white/80" : "text-carbon/75";
  const glass = slide.dark ? "border-white/15 bg-white/10 text-white" : "border-carbon/10 bg-white/70 text-carbon";
  const reveal = (step: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.18 + step * 0.08, duration: 0.55, ease: EASE } },
  });

  return (
    <motion.div
      className={cn("absolute inset-0 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]", tone)}
      style={{ background: slide.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}
    >
      <div className="relative order-2 flex flex-1 flex-col justify-end px-5 pb-16 lg:order-1 lg:justify-center lg:ps-12 lg:pe-4 lg:pb-14">
        <motion.span {...reveal(0)} className={cn("mb-3 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold backdrop-blur lg:text-xs", glass)}>
          <Icon className="size-3.5" style={{ color: slide.accent }} aria-hidden="true" />
          {slide.eyebrow}
        </motion.span>
        <h2 className="heading text-[1.45rem] leading-snug sm:text-[1.75rem] lg:text-[2.25rem]">
          {words.map((word, i) => (
            // the space must sit outside the clipped box, or the browser drops it
            <Fragment key={`${word}-${i}`}>
              {i > 0 && " "}
              <span className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ delay: 0.12 + i * 0.06, duration: 0.65, ease: EASE }}>
                  {word}
                </motion.span>
              </span>
            </Fragment>
          ))}
        </h2>
        <motion.p {...reveal(2)} className={cn("mt-2 max-w-md text-xs leading-6 lg:text-sm lg:leading-7 max-lg:[@media(max-height:700px)]:hidden", soft)}>
          {slide.text}
        </motion.p>
        {slide.countdown && (
          <motion.div {...reveal(3)} className={cn("mt-3 flex w-fit items-center gap-2 rounded-xl border px-3 py-1.5 text-xs backdrop-blur", glass)}>
            <Timer className="size-4" aria-hidden="true" />
            پایان تخفیف‌ها
            <Countdown compact />
          </motion.div>
        )}
        <motion.div {...reveal(4)} className="mt-4 flex flex-wrap gap-2 lg:mt-6">
          <Link href={slide.cta.href} onClick={onLink} className={cn("group flex h-11 items-center gap-2 rounded-xl px-5 text-[0.8125rem] font-semibold transition-colors", slide.dark ? "bg-white text-carbon hover:bg-mist" : "bg-carbon text-white hover:bg-graphite")}>
            {slide.cta.label}
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
          {slide.secondary && (
            <Link href={slide.secondary.href} onClick={onLink} className={cn("flex h-11 items-center rounded-xl border px-4 text-[0.8125rem] font-semibold backdrop-blur transition-colors max-sm:hidden", glass, slide.dark ? "hover:bg-white/20" : "hover:bg-white")}>
              {slide.secondary.label}
            </Link>
          )}
        </motion.div>
      </div>

      <div className="relative order-1 h-[46%] shrink-0 lg:order-2 lg:h-auto max-lg:[@media(max-height:700px)]:h-[40%]">
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 aspect-square w-[min(78%,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-40"
          style={{ borderColor: slide.accent }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4, rotate: 360 }}
          transition={{ scale: { duration: 0.9, ease: EASE }, opacity: { duration: 0.9 }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 aspect-square w-[min(56%,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: slide.accent }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 1, ease: EASE }}
        />
        <div className="absolute inset-x-[6%] top-[6%] bottom-0 lg:inset-x-[4%] lg:top-[10%] lg:bottom-[4%]">
          {slide.art.map((art, i) => (
            <Art key={art.src} art={art} index={i} direction={direction} pointerX={pointerX} pointerY={pointerY} />
          ))}
        </div>
        <ul className="pointer-events-none absolute end-3 top-3 flex flex-col items-end gap-1.5 lg:end-auto lg:start-4 lg:top-auto lg:bottom-16 max-lg:[@media(max-height:700px)]:hidden">
          {slide.badges.map((badge, i) => (
            <motion.li
              key={badge}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.35, visualDuration: 0.5, delay: 0.55 + i * 0.12 }}
              className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold whitespace-nowrap backdrop-blur-md lg:text-[0.7rem]", glass, i > 0 && "max-sm:hidden")}
            >
              <span className="size-1.5 rounded-full" style={{ background: slide.accent }} />
              {badge}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function HeroSlider() {
  const reduced = useReducedMotion();
  const [[index, direction], setSlide] = useState([0, 1]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const progress = useMotionValue(0);
  const fill = useTransform(progress, (value) => `scaleX(${value})`);

  const pointerX = useSpring(0, { stiffness: 80, damping: 20 });
  const pointerY = useSpring(0, { stiffness: 80, damping: 20 });

  const count = SLIDES.length;
  const slide = SLIDES[index];
  const playing = !reduced && !stopped && !hovered && !focused && visible;

  const go = useCallback(
    (step: number) => {
      progress.set(0);
      setSlide(([current]) => [(current + step + count) % count, step]);
    },
    [count, progress],
  );
  const goTo = (target: number) => {
    if (target === index) return;
    progress.set(0);
    setSlide([target, target > index ? 1 : -1]);
  };

  // remaining time carries over when the slider resumes after a pause
  useEffect(() => {
    if (!playing) return;
    const controls = animate(progress, 1, { duration: DURATION * (1 - progress.get()), ease: "linear", onComplete: () => go(1) });
    return () => controls.stop();
  }, [playing, index, go, progress]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden));
    const onVisibility = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function swipe(_: unknown, info: PanInfo) {
    // in RTL the next slide waits on the left, so it is pulled in with a swipe to the right
    if (Math.abs(info.offset.x) < 50 && Math.abs(info.velocity.x) < 400) return;
    dragged.current = true;
    go(info.offset.x > 0 ? 1 : -1);
  }

  const onLink = (event: React.MouseEvent) => {
    if (!dragged.current) return;
    event.preventDefault();
    dragged.current = false;
  };

  const control = "grid size-9 place-items-center rounded-full border backdrop-blur transition-colors";
  const controlTone = slide.dark ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-carbon/10 bg-white/70 text-carbon hover:bg-white";

  return (
    <div className="min-w-0">
      <div
        ref={root}
        role="region"
        aria-roledescription="اسلایدر"
        aria-label="معرفی و پیشنهادهای ویژه"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
          pointerX.set(0);
          pointerY.set(0);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reduced) return;
          const box = e.currentTarget.getBoundingClientRect();
          pointerX.set((e.clientX - box.left) / box.width - 0.5);
          pointerY.set((e.clientY - box.top) / box.height - 0.5);
        }}
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(1);
          if (e.key === "ArrowRight") go(-1);
        }}
        className="relative h-[clamp(26rem,calc(100svh-9.5rem),34rem)] overflow-hidden rounded-3xl bg-carbon sm:h-[30rem] lg:h-[27.5rem] xl:h-[29rem]"
      >
        <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragStart={() => (dragged.current = false)} onDragEnd={swipe} className="absolute inset-0 touch-pan-y">
          <AnimatePresence initial={false} custom={direction}>
            <div key={slide.id} role="group" aria-roledescription="اسلاید" aria-label={`${pad(index + 1)} از ${pad(count)}: ${slide.tab}`} className="absolute inset-0">
              <SlideView slide={slide} direction={direction} pointerX={pointerX} pointerY={pointerY} onLink={onLink} />
            </div>
          </AnimatePresence>
        </motion.div>

        <div className={cn("absolute inset-x-4 bottom-4 z-20 flex items-center gap-2 lg:inset-x-auto lg:start-12 lg:bottom-6", slide.dark ? "text-white" : "text-carbon")}>
          <span className="me-1 text-xs tabular-nums" aria-hidden="true">
            <span className="font-bold">{pad(index + 1)}</span>
            <span className="opacity-60"> / {pad(count)}</span>
          </span>
          <div className="flex flex-1 gap-1 lg:hidden" aria-hidden="true">
            {SLIDES.map((item, i) => (
              <span key={item.id} className={cn("relative h-1 flex-1 overflow-hidden rounded-full", slide.dark ? "bg-white/25" : "bg-carbon/15")}>
                {i === index && <motion.span className="absolute inset-0 origin-right rounded-full bg-current" style={{ transform: reduced ? "none" : fill }} />}
                {i < index && <span className="absolute inset-0 rounded-full bg-current opacity-70" />}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => go(-1)} aria-label="اسلاید قبلی" className={cn(control, controlTone)}>
            <ChevronRight className="size-4" />
          </button>
          <button type="button" onClick={() => setStopped((v) => !v)} aria-label={stopped ? "پخش خودکار اسلایدها" : "توقف پخش خودکار"} aria-pressed={stopped} className={cn(control, controlTone, reduced && "hidden")}>
            {stopped ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
          <button type="button" onClick={() => go(1)} aria-label="اسلاید بعدی" className={cn(control, controlTone)}>
            <ChevronLeft className="size-4" />
          </button>
        </div>
      </div>

      <div role="group" aria-label="انتخاب اسلاید" className="mt-3 hidden grid-cols-5 gap-2 lg:grid">
        {SLIDES.map((item, i) => {
          const Icon = item.icon;
          const active = i === index;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active}
              onClick={() => goTo(i)}
              className={cn("relative flex h-13 items-center gap-2.5 overflow-hidden rounded-2xl border px-3 text-start text-xs font-semibold transition-colors", active ? "border-carbon bg-carbon text-white" : "bg-white hover:bg-mist")}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-xl" style={{ background: active ? "rgb(255 255 255 / 0.12)" : "var(--mist)", color: active ? item.accent : "var(--brand)" }}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate">{item.tab}</span>
              {active && <motion.span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-right bg-flare" style={{ transform: reduced ? "none" : fill }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
