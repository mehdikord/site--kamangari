"use client";

import { Fragment, useSyncExternalStore } from "react";
import { cn } from "cn";
import { faPlain } from "@/lib/format";

const DAY = 86_400_000;
const TEHRAN_OFFSET = 3.5 * 3_600_000;

function subscribe(tick: () => void) {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}

// deals roll over at midnight in Tehran
const secondsLeft = () => Math.floor((DAY - ((Date.now() + TEHRAN_OFFSET) % DAY)) / 1000);

export function Countdown({ className, compact = false }: { className?: string; compact?: boolean }) {
  const left = useSyncExternalStore(subscribe, secondsLeft, () => -1);
  const units = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60];
  const show = (n: number) => (left < 0 ? "--" : faPlain(n).padStart(2, "۰"));

  if (compact) return <span dir="ltr" className={cn("font-bold tabular-nums", className)}>{units.map(show).join(":")}</span>;

  return (
    <div dir="ltr" role="timer" aria-label="زمان باقی‌مانده تا پایان تخفیف" className={cn("flex items-center gap-1", className)}>
      {units.map((value, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="opacity-50">:</span>}
          <span className="heading grid size-9 place-items-center rounded-lg bg-black/25 text-[0.95rem] tabular-nums">{show(value)}</span>
        </Fragment>
      ))}
    </div>
  );
}
