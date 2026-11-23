import { cn } from "cn";
import type { ProductOption } from "@/data/types";
import { fa, toman } from "@/lib/format";
import { discountPercent } from "@/lib/product";

export function Price({ option, from = false, large = false, className }: { option: ProductOption; from?: boolean; large?: boolean; className?: string }) {
  const off = discountPercent(option);
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("flex items-center gap-1.5 text-muted-foreground", large ? "h-6 text-[0.8125rem]" : "h-5 text-[0.7rem]")}>
        {off > 0 && (
          <>
            <del aria-label={`قیمت قبلی ${toman(option.was!)}`}>{fa(option.was!)}</del>
            <span className="rounded-full bg-brand px-1.5 leading-4 font-bold text-white">{fa(off)}٪</span>
          </>
        )}
        {!off && from && <span>شروع قیمت از</span>}
      </div>
      <p className={cn("whitespace-nowrap font-bold", large ? "text-xl" : "text-[0.8125rem] sm:text-[0.9375rem]")}>
        {fa(option.price)} <span className="text-[0.7rem] font-normal text-muted-foreground">تومان</span>
      </p>
    </div>
  );
}
