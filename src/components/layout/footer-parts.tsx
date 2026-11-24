"use client";

import { useState } from "react";
import { ArrowUp, Mail } from "lucide-react";
import { toast } from "sonner";
import { normalizeMobile } from "@/lib/format";

export function NewsletterForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!normalizeMobile(value)) return setError("لطفاً شماره‌ی موبایل معتبر وارد کنید.");
    setError("");
    setValue("");
    toast.success("عضویت شما در خبرنامه ثبت شد", { description: "این فرم نمایشی است و پیامکی ارسال نمی‌شود." });
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter" className="sr-only">شماره‌ی موبایل</label>
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="newsletter"
            type="tel"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="۰۹۱۲۱۲۳۴۵۶۷"
            aria-invalid={!!error}
            aria-describedby="newsletter-error"
            className="h-12 w-full rounded-2xl border border-input bg-white pr-10 pl-3 text-left text-base outline-none placeholder:text-muted-foreground/70 focus-visible:border-carbon aria-invalid:border-danger sm:text-sm"
          />
        </div>
        <button type="submit" className="h-12 shrink-0 rounded-2xl bg-carbon px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-brand">عضویت</button>
      </div>
      <p id="newsletter-error" role="alert" className="mt-1.5 text-xs text-danger empty:hidden">{error}</p>
    </form>
  );
}

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className="group flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3.5 text-xs text-white transition-colors hover:bg-white/20"
    >
      بازگشت به بالا
      <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  );
}
