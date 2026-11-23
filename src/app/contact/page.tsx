import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { MessengerIcon } from "@/components/brand/messenger-icon";
import { PageHead } from "@/components/shared/page-head";
import { RequestForm } from "@/components/shared/request-form";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "تماس با ما" };

export default function ContactPage() {
  const phones = [
    { ...site.phone, title: "تلفن فروشگاه", icon: Phone },
    { ...site.mobile, title: "پشتیبانی ۲۴ / ۷", icon: Smartphone },
  ];
  return (
    <>
      <PageHead title="تماس با ما" description="پاسخ‌گویی در تمام ساعات شبانه‌روز. اطلاعات تماس در این نسخه نمونه است." />
      <div className="shell grid gap-6 py-5 lg:grid-cols-2 lg:gap-8 lg:py-7">
        <div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {phones.map(({ href, label, title, icon: Icon }) => (
              <li key={title}>
                <a href={href} className="block rounded-2xl bg-carbon p-4 text-white transition-colors hover:bg-graphite">
                  <Icon className="size-5 text-flare" />
                  <span className="mt-2 block text-xs text-white/70">{title}</span>
                  <span dir="ltr" className="block text-end text-base font-bold">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          <h2 className="heading mt-6 mb-2.5 text-sm">پیام‌رسان‌ها</h2>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {site.messengers.map((m) => (
              <li key={m.id}>
                <a href={m.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border p-2.5 text-xs transition-colors hover:bg-mist">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist text-brand">
                    <MessengerIcon id={m.id} label={m.label} className="text-[0.625rem]" />
                  </span>
                  <span>
                    <span className="block font-semibold">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="mt-5 space-y-2.5 text-xs">
            <li className="flex gap-3"><MapPin className="size-4 shrink-0 text-brand" />{site.address}</li>
            <li className="flex gap-3"><Clock className="size-4 shrink-0 text-brand" />{site.hours}</li>
            <li className="flex gap-3"><Mail className="size-4 shrink-0 text-brand" /><a href={`mailto:${site.email}`} dir="ltr">{site.email}</a></li>
          </ul>
        </div>
        <RequestForm title="ارسال پیام" subjectLabel="موضوع" subjects={["پیگیری سفارش", "مشاوره‌ی سازگاری قطعه", "بازگشت کالا", "پیشنهاد یا شکایت"]} action="ثبت پیام" placeholder="در صورت وجود، شماره‌ی سفارش را وارد کنید" />
      </div>
    </>
  );
}
