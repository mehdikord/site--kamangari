"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { cn } from "cn";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { fa } from "@/lib/format";

// in RTL the next slide waits on the left, so it is pulled in by swiping right
const slide = {
  enter: (direction: number) => ({ x: `${direction * -60}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: `${direction * 60}%`, opacity: 0 }),
};

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [[index, direction], setSlide] = useState([0, 1]);
  const [large, setLarge] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const go = (step: number) => setSlide(([i]) => [(i + step + images.length) % images.length, step]);
  function swipe(_: unknown, info: PanInfo) {
    if (info.offset.x > 60 || info.velocity.x > 400) go(1);
    else if (info.offset.x < -60 || info.velocity.x < -400) go(-1);
  }
  function keys(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") go(1);
    if (event.key === "ArrowRight") go(-1);
  }
  const control = "absolute z-10 grid size-9 place-items-center rounded-full bg-white text-carbon transition-colors hover:bg-secondary";

  return (
    <div className="flex flex-col gap-2" onKeyDown={keys}>
      <div role="group" aria-roledescription="اسلایدر" aria-label={`تصاویر ${name}`} className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.45}
            onDragEnd={swipe}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              const box = e.currentTarget.getBoundingClientRect();
              setLens(e.buttons ? null : { x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100 });
            }}
            onPointerLeave={() => setLens(null)}
            className="absolute inset-0 touch-pan-y"
          >
            <Image
              src={images[index]}
              alt={`${name}، تصویر ${fa(index + 1)}`}
              fill
              draggable={false}
              preload={index === 0}
              sizes="(min-width: 64rem) 38rem, 100vw"
              data-product-image
              className="object-contain transition-transform duration-200"
              style={lens ? { transform: "scale(1.7)", transformOrigin: `${lens.x}% ${lens.y}%` } : undefined}
            />
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => setLarge(true)} aria-label="بزرگ‌نمایی تصویر" className={cn(control, "start-3 top-3")}>
          <Expand className="size-4.5" />
        </button>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="تصویر قبلی" className={cn(control, "top-1/2 right-3 -mt-5")}><ChevronRight /></button>
            <button type="button" onClick={() => go(1)} aria-label="تصویر بعدی" className={cn(control, "top-1/2 left-3 -mt-5")}><ChevronLeft /></button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5">
          {images.map((src, i) => (
            <button key={src} type="button" aria-label={`نمایش تصویر ${fa(i + 1)}`} aria-current={i === index} onClick={() => setSlide([i, i > index ? 1 : -1])} className={cn("relative size-16 overflow-hidden rounded-xl border bg-mist transition-colors", i === index ? "border-carbon" : "border-transparent")}>
              <Image src={src} alt="" fill sizes="6rem" className="object-contain" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={large} onOpenChange={setLarge}>
        <DialogContent onKeyDown={keys} className="p-2 sm:max-w-[min(90vw,85svh)]">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <DialogDescription className="sr-only">نمای بزرگ تصویر محصول</DialogDescription>
          <div className="relative aspect-square">
            <Image src={images[index]} alt={name} fill sizes="90vw" className="object-contain" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="تصویر قبلی" className={cn(control, "top-1/2 right-2")}><ChevronRight /></button>
                <button type="button" onClick={() => go(1)} aria-label="تصویر بعدی" className={cn(control, "top-1/2 left-2")}><ChevronLeft /></button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
