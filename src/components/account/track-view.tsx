"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { latinDigits } from "@/lib/format";
import { useReady, useShop } from "@/lib/store";

const SAMPLE = "KM-12345678";
const STAGES = ["ثبت سفارش", "تأیید پرداخت", "آماده‌سازی و بسته‌بندی", "تحویل به شرکت حمل", "تحویل به شما"];

export function TrackView() {
  const initial = useSearchParams().get("code") ?? "";
  const ready = useReady();
  const orders = useShop((s) => s.orders);
  const [code, setCode] = useState(initial);
  const [searched, setSearched] = useState(initial);

  if (!ready) return <Loading />;

  const id = latinDigits(searched).trim().toUpperCase();
  const order = orders.find((o) => o.id === id);
  const stage = id === SAMPLE ? 4 : order ? (order.status === "paid" ? 3 : 1) : null;

  return (
    <div className="shell grid gap-6 py-5 lg:grid-cols-2 lg:py-7">
      <form
        className="self-start rounded-2xl border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSearched(code);
        }}
      >
        <label htmlFor="track-code" className="mb-1.5 block text-xs font-semibold">شماره‌ی سفارش</label>
        <Input id="track-code" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} placeholder="KM-12345678" required />
        <Button type="submit" size="lg" variant="brand" className="mt-3 w-full">پیگیری</Button>
        <button
          type="button"
          className="mt-3 text-xs text-brand underline"
          onClick={() => {
            setCode(SAMPLE);
            setSearched(SAMPLE);
          }}
        >
          مشاهده‌ی سفارش نمونه
        </button>
      </form>

      <div aria-live="polite">
        {!id ? (
          <p className="text-xs text-muted-foreground">شماره‌ی سفارش در فاکتور و پیامک تأیید آمده است.</p>
        ) : stage === null ? (
          <p className="text-xs text-danger">سفارشی با این شماره یافت نشد. سفارش‌های نمایشی تنها در مرورگر ثبت‌کننده قابل پیگیری هستند.</p>
        ) : (
          <ol>
            {STAGES.map((label, i) => (
              <li key={label} aria-current={i === stage - 1 ? "step" : undefined} className="relative flex items-center gap-3 pb-6 last:pb-0">
                {i < STAGES.length - 1 && <span className={cn("absolute start-4 top-8 bottom-0 w-px", i < stage - 1 ? "bg-success" : "bg-input")} />}
                <span className={cn("grid size-8 rounded-full shrink-0 place-items-center", i < stage ? "bg-success text-white" : "bg-secondary")}>
                  {i < stage && <Check className="size-4" />}
                </span>
                <span className={cn("text-[0.8125rem] font-semibold", i >= stage && "text-muted-foreground")}>{label}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
