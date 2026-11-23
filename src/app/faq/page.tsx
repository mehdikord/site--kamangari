import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/shared/faq-list";
import { PageHead } from "@/components/shared/page-head";
import { Button } from "@/components/ui/button";
import { faq } from "@/data/content";

export const metadata: Metadata = { title: "سوالات متداول" };

export default function FaqPage() {
  return (
    <>
      <PageHead title="سوالات متداول" description="پاسخ پرسش‌های پیش و پس از خرید." />
      <div className="shell grid gap-x-8 gap-y-4 py-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-7">
        <nav aria-label="موضوع‌ها" className="no-scrollbar flex gap-2 self-start overflow-x-auto lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:flex-col">
          {faq.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="shrink-0 rounded-lg bg-mist px-3 py-2 text-xs hover:bg-secondary">{group.title}</a>
          ))}
        </nav>
        <div className="min-w-0 space-y-6">
          {faq.map((group) => (
            <section key={group.id} id={group.id}>
              <h2 className="heading mb-2 text-sm lg:text-base">{group.title}</h2>
              <FaqList items={group.items} />
            </section>
          ))}
          <div className="rounded-2xl border p-4 text-xs">
            <h2 className="heading text-sm">نیاز به راهنمایی بیشتر دارید؟</h2>
            <p>کارشناسان پشتیبانی در تمام ساعات شبانه‌روز پاسخ‌گو هستند.</p>
            <Button asChild className="mt-3"><Link href="/contact">تماس با پشتیبانی</Link></Button>
          </div>
        </div>
      </div>
    </>
  );
}
