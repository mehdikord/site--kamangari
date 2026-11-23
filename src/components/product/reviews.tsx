"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/data/types";
import { fa, faRating } from "@/lib/format";
import { useReady, useShop } from "@/lib/store";
import { Stars } from "./rating";

export function Reviews({ productId, samples }: { productId: number; samples: Review[] }) {
  const ready = useReady();
  const own = useShop((s) => s.reviews[productId]);
  const addReview = useShop((s) => s.addReview);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const all = ready && own ? [...own, ...samples] : samples;
  const average = all.reduce((sum, r) => sum + r.rating, 0) / all.length;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const author = String(data.get("author")).trim();
    const body = String(data.get("body")).trim();
    if (!rating) return setError("لطفاً امتیاز خود را انتخاب کنید.");
    if (author.length < 2) return setError("لطفاً نام خود را وارد کنید.");
    if (body.length < 5) return setError("لطفاً نظر خود را کامل‌تر وارد کنید.");
    addReview(productId, { id: String(Date.now()), author, body, rating, city: "شما", date: "همین حالا" });
    form.reset();
    setRating(0);
    setError("");
    toast.success("نظر شما ثبت شد", { description: "در نسخه‌ی نمایشی تنها در همین مرورگر قابل مشاهده است." });
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-10">
      <div>
        <h2 id="reviews-title" className="heading title-section">نظرات خریداران</h2>
        <p className="text-xs text-muted-foreground">نظرات اولیه نمونه هستند و پیش از انتشار جایگزین خواهند شد.</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="heading text-3xl">{faRating(average)}</span>
          <span>
            <Stars value={average} />
            <span className="block text-xs text-muted-foreground">از {fa(all.length)} نظر</span>
          </span>
        </div>
        <div className="mt-3 space-y-1">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = all.filter((r) => r.rating === n).length;
            return (
              <div key={n} className="flex items-center gap-2 text-xs">
                <span className="w-12">{fa(n)} ستاره</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span className="block h-full bg-star" style={{ width: `${(count / all.length) * 100}%` }} />
                </span>
                <span className="w-4">{fa(count)}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 space-y-2.5 rounded-2xl bg-mist p-4">
          <h3 className="heading text-sm">ثبت نظر</h3>
          <div role="radiogroup" aria-label="امتیاز شما" className="flex">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="grid size-9 cursor-pointer place-items-center rounded has-focus-visible:outline-2 has-focus-visible:outline-brand">
                <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="sr-only" aria-label={`${fa(n)} ستاره`} />
                <Star className={cn("size-5", n <= rating ? "fill-star text-star" : "text-input")} />
              </label>
            ))}
          </div>
          <Input name="author" aria-label="نام شما" placeholder="نام شما" maxLength={40} />
          <Textarea name="body" aria-label="متن نظر" placeholder="تجربه‌ی خود از کیفیت، اندازه و بسته‌بندی کالا" maxLength={700} rows={4} className="min-h-24 bg-white text-base sm:text-sm" />
          {error && <p role="alert" className="text-xs text-danger">{error}</p>}
          <Button type="submit" className="w-full">ارسال نظر</Button>
        </form>
      </div>

      <ul className="self-start">
        {all.map((review) => (
          <li key={review.id} className="border-b py-4 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>
                <span className="text-[0.8125rem] font-semibold">{review.author}</span>
                <span className="text-xs text-muted-foreground">، {review.city}</span>
              </p>
              <Stars value={review.rating} />
            </div>
            <p className="mt-1 text-[0.8125rem] leading-7 break-words">{review.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
