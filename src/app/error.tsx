"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="shell grid min-h-[60svh] place-items-center text-center">
      <div>
        <h1 className="heading text-lg">بارگذاری صفحه با خطا مواجه شد</h1>
        <p className="mt-1 text-xs text-muted-foreground">لطفاً اتصال اینترنت را بررسی و مجدداً تلاش کنید.</p>
        <Button size="lg" className="mt-5" onClick={() => window.location.reload()}>بارگذاری دوباره</Button>
      </div>
    </div>
  );
}
