"use client";

import { useRef } from "react";
import { MessageSquareQuote, Quote as QuoteIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "cn";
import { Stars } from "@/components/product/rating";
import { SectionHead } from "@/components/shared/section-head";
import { testimonials } from "@/data/content";
import type { Review } from "@/data/types";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function Quote({ review }: { review: Review }) {
  return (
    <li className="relative w-[17rem] shrink-0 rounded-2xl bg-white p-4 sm:w-[22rem]">
      <QuoteIcon aria-hidden="true" className="absolute end-4 top-4 size-6 fill-accent text-accent" />
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="heading grid size-9 place-items-center rounded-full bg-carbon text-xs text-white">{review.author.charAt(0)}</span>
        <p className="text-xs">
          <span className="block font-semibold">{review.author}</span>
          <span className="text-muted-foreground">{review.city}</span>
        </p>
      </div>
      <blockquote className="mt-2.5 text-xs leading-6 text-muted-foreground">{review.body}</blockquote>
      <Stars value={review.rating} className="mt-2 [&_svg]:size-3" />
    </li>
  );
}

export function Testimonials() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const back = useTransform(scrollYProgress, [0, 1], ["14%", "0%"]);
  const rows = [testimonials.slice(0, 6), testimonials.slice(6)];

  return (
    <section ref={section} className="mt-9 overflow-x-clip bg-mist py-8 lg:mt-12 lg:py-10">
      <div className="shell">
        <SectionHead icon={MessageSquareQuote} title="نظرات مشتریان" description="نظرات این بخش نمونه هستند و پیش از انتشار جایگزین خواهند شد." className="[&>div>span]:bg-white" />
      </div>
      <div className={cn("space-y-2.5", reduced && "overflow-x-auto")}>
        {rows.map((row, r) => (
          <motion.ul key={r} style={reduced ? undefined : { x: r ? back : forward }} className="flex w-max gap-2.5 px-4">
            {row.map((review) => (
              <Quote key={review.id} review={review} />
            ))}
          </motion.ul>
        ))}
      </div>
    </section>
  );
}
