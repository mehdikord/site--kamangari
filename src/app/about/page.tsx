import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Features } from "@/components/home/features";
import { PageHead } from "@/components/shared/page-head";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "درباره‌ی ما" };

const PROCESS = [
  ["تأمین", "کالا از واردکنندگان رسمی و تولیدکنندگان معتبر تهیه و مستندات اصالت آن نگهداری می‌شود."],
  ["کنترل کیفیت", "هر قلیان آزمون نشتی می‌شود و عملکرد فندک و کیفیت زغال پیش از عرضه بررسی می‌گردد."],
  ["انبارداری", "تنباکو و توتون در شرایط کنترل‌شده‌ی دما و نور و بر اساس تاریخ تولید نگهداری می‌شود."],
  ["ارسال", "سفارش‌ها با بسته‌بندی ایمن، فاکتور و روش حمل متناسب با نوع کالا ارسال می‌شوند."],
];

export default function AboutPage() {
  return (
    <>
      <PageHead title="درباره‌ی دخانیات کمانگری" description={site.slogan} />
      <section className="shell grid items-center gap-6 pt-9 lg:grid-cols-2 lg:gap-12 lg:pt-12">
        <div>
          <h2 className="heading title-section">معرفی مجموعه</h2>
          <div className="mt-2 space-y-3 text-[0.8125rem] leading-8 text-muted-foreground">
            <p>مجموعه‌ی دخانیات کمانگری در زمینه‌ی عرضه‌ی عمده و جزئی قلیان، لوازم جانبی، فندک و محصولات دخانی فعالیت می‌کند. تمرکز ما بر اصالت کالا، شفافیت قیمت و پاسخ‌گویی پس از فروش است.</p>
            <p>مشاوره‌ی کارشناسان مجموعه به اصالت، سازگاری و نگهداری کالا محدود است. این مجموعه مصرف دخانیات را ترویج نمی‌کند و خدمات آن تنها به افراد بالای ۱۸ سال ارائه می‌شود.</p>
          </div>
          <Button asChild className="mt-4"><Link href="/contact">تماس با مجموعه</Link></Button>
        </div>
        <div className="relative h-64 overflow-hidden rounded-3xl bg-carbon lg:h-80">
          <Image src="/images/studio/lineup.webp" alt="سه مدل قلیان مدرن" fill sizes="(min-width: 64rem) 40rem, 100vw" className="object-contain py-4" />
        </div>
      </section>
      <section className="shell pt-9 lg:pt-12">
        <h2 className="heading title-section mb-4">فرایند کار</h2>
        <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {PROCESS.map(([title, text]) => (
            <li key={title} className="rounded-2xl border p-4">
              <h3 className="heading text-sm">{title}</h3>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <Features />
    </>
  );
}
