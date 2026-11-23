"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { normalizeMobile } from "@/lib/format";

interface Props {
  title: string;
  subjectLabel: string;
  subjects: string[];
  action: string;
  placeholder: string;
}

/** Mock form: validates and confirms, sends nothing. */
export function RequestForm({ title, subjectLabel, subjects, action, placeholder }: Props) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (String(data.get("name")).trim().length < 2) return setError("نام را وارد کنید.");
    if (!normalizeMobile(String(data.get("mobile")))) return setError("لطفاً شماره‌ی موبایل معتبر وارد کنید.");
    if (String(data.get("message")).trim().length < 5) return setError("لطفاً توضیح کوتاهی وارد کنید.");
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="self-start rounded-2xl border p-6 text-center">
        <CircleCheck className="mx-auto size-9 text-success" />
        <h2 className="heading mt-2 text-base">درخواست ثبت شد</h2>
        <p className="text-xs text-muted-foreground">این فرم نمایشی است و اطلاعات آن ارسال نمی‌شود.</p>
        <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>ثبت درخواست جدید</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3 self-start rounded-2xl border p-4 sm:p-5">
      <h2 className="heading text-sm lg:text-base">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold">
          نام
          <Input name="name" autoComplete="name" className="mt-1.5" />
        </label>
        <label className="text-xs font-semibold">
          موبایل
          <Input name="mobile" dir="ltr" type="tel" inputMode="tel" autoComplete="tel" className="mt-1.5" />
        </label>
      </div>
      <label className="block text-xs font-semibold">
        {subjectLabel}
        <select name="subject" className="mt-1.5 h-11 w-full rounded-lg border border-input bg-white px-3 text-base font-normal">
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-semibold">
        توضیح
        <Textarea name="message" rows={5} placeholder={placeholder} className="mt-1.5 min-h-28 bg-white text-base font-normal sm:text-sm" />
      </label>
      <p role="alert" className="text-xs text-danger empty:hidden">{error}</p>
      <Button type="submit" size="lg" variant="brand" className="w-full">{action}</Button>
    </form>
  );
}
