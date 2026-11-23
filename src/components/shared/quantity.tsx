"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "cn";
import { fa } from "@/lib/format";

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** When given, stepping below one removes the item. */
  onRemove?: () => void;
  label: string;
  className?: string;
}

export function Quantity({ value, max, onChange, onRemove, label, className }: Props) {
  const removing = value <= 1 && !!onRemove;
  const step = "grid h-full w-10 shrink-0 place-items-center transition-colors hover:bg-muted disabled:opacity-30";
  return (
    <div role="group" aria-label={`تعداد ${label}`} className={cn("flex h-10 w-fit text-sm items-center overflow-hidden rounded-lg border border-input bg-white text-carbon", className)}>
      <button type="button" className={step} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`افزایش تعداد ${label}`}>
        <Plus className="size-4" />
      </button>
      <span className="relative grid h-full min-w-9 place-items-center overflow-hidden font-bold tabular-nums" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={value} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.18 }}>
            {fa(value)}
          </motion.span>
        </AnimatePresence>
      </span>
      <button type="button" className={step} disabled={value <= 1 && !onRemove} onClick={() => (removing ? onRemove() : onChange(value - 1))} aria-label={removing ? `حذف ${label}` : `کاهش تعداد ${label}`}>
        {removing ? <Trash2 className="size-4 text-danger" /> : <Minus className="size-4" />}
      </button>
    </div>
  );
}
