"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { AGE_KEY } from "./age-script";

export function AgeGate() {
  const [denied, setDenied] = useState(false);
  const confirm = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset.age === "ok") return;
    const app = document.getElementById("app");
    app?.setAttribute("inert", "");
    confirm.current?.focus();
    return () => app?.removeAttribute("inert");
  }, []);

  function accept() {
    document.documentElement.dataset.age = "ok";
    document.getElementById("app")?.removeAttribute("inert");
    try {
      localStorage.setItem(AGE_KEY, "ok");
    } catch {
      // without storage the question is asked again next visit
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="age-title" className="age-gate no-print fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-carbon p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center text-carbon sm:p-8">
        <Mark className="mx-auto size-12" />
        <p className="heading mt-2 text-sm text-muted-foreground">{site.name}</p>
        <div aria-live="polite">
          {denied ? (
            <>
              <h2 id="age-title" className="heading mt-4 text-lg">امکان ورود وجود ندارد</h2>
              <p className="mt-1 text-sm text-muted-foreground">استفاده از این سایت برای افراد زیر ۱۸ سال مجاز نیست. {site.quitLine}</p>
              <Button variant="outline" className="mt-5 w-full" onClick={() => setDenied(false)}>بازگشت و انتخاب مجدد</Button>
            </>
          ) : (
            <>
              <h2 id="age-title" className="heading mt-4 text-lg">تأیید سن</h2>
              <p className="mt-1 text-sm text-muted-foreground">مشاهده و خرید از این سایت تنها برای افراد بالای ۱۸ سال مجاز است. لطفاً سن خود را تأیید کنید.</p>
              <div className="mt-5 grid gap-2">
                <Button ref={confirm} variant="brand" size="lg" onClick={accept}>بالای ۱۸ سال هستم</Button>
                <Button variant="outline" size="lg" onClick={() => setDenied(true)}>زیر ۱۸ سال هستم</Button>
              </div>
              <p className="mt-5 border-[3px] border-black px-3 py-1.5 text-xs font-bold text-black">دخانیات عامل سرطان و بیماری‌های قلبی است.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
