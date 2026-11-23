import { Check } from "lucide-react";
import { cn } from "cn";
import { fa } from "@/lib/format";

const STEPS = ["سبد خرید", "مشخصات", "فاکتور", "پرداخت"];

export function Steps({ current }: { current: number }) {
  return (
    <ol aria-label="مراحل خرید" className="no-print mt-4 flex max-w-xl items-center">
      {STEPS.map((label, i) => (
        <li key={label} aria-current={i === current ? "step" : undefined} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
          <span className="flex items-center gap-1.5">
            <span className={cn("grid size-6 place-items-center rounded-full text-[0.7rem] font-semibold", i <= current ? "bg-carbon text-white" : "bg-white text-muted-foreground")}>
              {i < current ? <Check className="size-3" /> : fa(i + 1)}
            </span>
            <span className={cn("text-[0.7rem] whitespace-nowrap sm:text-xs", i === current ? "font-semibold" : "text-muted-foreground max-sm:hidden")}>{label}</span>
          </span>
          {i < STEPS.length - 1 && <span aria-hidden="true" className={cn("mx-2 h-px flex-1 sm:mx-3", i < current ? "bg-carbon" : "bg-input")} />}
        </li>
      ))}
    </ol>
  );
}
