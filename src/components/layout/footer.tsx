import Link from "next/link";
import { BadgeCheck, ChevronLeft, Clock, Headset, Mail, MapPin, Phone, ShieldCheck, Smartphone, type LucideIcon } from "lucide-react";
import { CategoryIcon } from "@/components/brand/category-icon";
import { Mark } from "@/components/brand/logo";
import { MessengerIcon } from "@/components/brand/messenger-icon";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { shopHref } from "@/lib/shop-query";
import { BackToTop, NewsletterForm } from "./footer-parts";

const MESSENGER_COLORS: Record<string, string> = {
  telegram: "#229ed9",
  whatsapp: "#25d366",
  instagram: "linear-gradient(45deg, #f09433, #dc2743 55%, #bc1888)",
  bale: "#0f766e",
  eitaa: "#c2410c",
  rubika: "#6c3ce1",
};

const SERVICE_LINKS: [string, string][] = [
  ["/track", "پیگیری سفارش"],
  ["/account", "حساب کاربری"],
  ["/wishlist", "علاقه‌مندی‌ها"],
  ["/compare", "مقایسه‌ی محصولات"],
  ["/faq", "سوالات متداول"],
  ["/terms#returns", "شرایط بازگشت کالا"],
];

const COMPANY_LINKS: [string, string][] = [
  ["/about", "درباره‌ی ما"],
  ["/contact", "تماس با ما"],
  ["/wholesale", "فروش عمده"],
  ["/terms", "قوانین و مقررات"],
  ["/terms#privacy", "حریم خصوصی"],
  ["/credits", "منابع تصاویر"],
];

const CONTACTS: { icon: LucideIcon; label: string; value: string; href?: string; ltr?: boolean }[] = [
  { icon: Phone, label: "تلفن فروشگاه", value: site.phone.label, href: site.phone.href, ltr: true },
  { icon: Smartphone, label: "پشتیبانی ۲۴ ساعته", value: site.mobile.label, href: site.mobile.href, ltr: true },
  { icon: Mail, label: "پست الکترونیک", value: site.email, href: `mailto:${site.email}`, ltr: true },
  { icon: Clock, label: "ساعات مراجعه‌ی حضوری", value: site.hours },
];

function LinkColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title}>
      <h2 className="heading flex items-center gap-2 text-sm">
        <span className="h-4 w-1 rounded-full bg-flare" aria-hidden="true" />
        {title}
      </h2>
      <ul className="mt-3 space-y-0.5">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="group flex items-center gap-1 py-1.5 text-white/70 transition-colors hover:text-white">
              <ChevronLeft className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="no-print mt-20 text-[0.8125rem]">
      <div className="shell relative z-10 -mb-16">
        <div className="grid overflow-hidden rounded-3xl border bg-white shadow-[0_24px_60px_-34px_rgb(21_23_28/0.45)] lg:grid-cols-[1.25fr_1fr]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center lg:p-7">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-brand">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="heading text-base">عضویت در خبرنامه</h2>
              <p className="mb-3 text-xs text-muted-foreground">اطلاع از محصولات جدید و موجود شدن کالاها از طریق پیامک.</p>
              <NewsletterForm />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 bg-[linear-gradient(135deg,#fff4ec,#ffe3d4)] p-5 lg:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand">
                <Headset className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">پشتیبانی در تمام ساعات شبانه‌روز</p>
                <a href={site.phone.href} dir="ltr" className="heading block text-lg text-carbon hover:text-brand">{site.phone.label}</a>
              </div>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {site.messengers.map((m) => (
                <li key={m.id}>
                  <a href={m.href} target="_blank" rel="noreferrer" aria-label={m.label} title={m.label} className="grid size-10 place-items-center rounded-xl text-white transition-transform hover:-translate-y-0.5" style={{ background: MESSENGER_COLORS[m.id] ?? "var(--carbon)" }}>
                    <MessengerIcon id={m.id} label={m.label} className="size-4.5 text-[0.6rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="on-dark bg-carbon bg-[radial-gradient(ellipse_50%_60%_at_100%_0%,rgb(255_122_69/0.16),transparent),radial-gradient(ellipse_40%_60%_at_0%_100%,rgb(61_123_255/0.14),transparent)] pt-24 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:rounded-t-[2.5rem] lg:pb-0">
        <div className="shell grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex w-fit items-center gap-2.5" aria-label={`${site.name}، صفحه‌ی اصلی`}>
              <Mark className="size-11" />
              <span>
                <span className="heading block text-lg leading-tight">{site.shortName}</span>
                <span className="text-[0.7rem] text-white/60">فروشگاه تخصصی دخانیات</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm leading-7 text-white/70">{site.intro}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {CONTACTS.map(({ icon: Icon, label, value, href, ltr }) => {
                const body = (
                  <>
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-flare">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.65rem] text-white/55">{label}</span>
                      <span dir={ltr ? "ltr" : undefined} className="block truncate text-white">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? <a href={href} className="flex items-center gap-2.5 rounded-2xl p-1 transition-colors hover:bg-white/5">{body}</a> : <div className="flex items-center gap-2.5 p-1">{body}</div>}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 flex items-start gap-2.5 p-1 text-white/70">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-flare">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span className="pt-2">{site.address}</span>
            </p>
          </div>

          <nav aria-label="دسته‌بندی‌ها">
            <h2 className="heading flex items-center gap-2 text-sm">
              <span className="h-4 w-1 rounded-full bg-flare" aria-hidden="true" />
              دسته‌بندی‌ها
            </h2>
            <ul className="mt-3 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={shopHref({ cat: [c.slug] })} className="group flex items-center gap-2.5 py-1 text-white/70 transition-colors hover:text-white">
                    <span className="grid size-7 place-items-center rounded-lg transition-transform group-hover:scale-110" style={{ background: c.tint, color: c.ink }}>
                      <CategoryIcon slug={c.slug} className="size-3.5" />
                    </span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LinkColumn title="خدمات مشتریان" links={SERVICE_LINKS} />
          <div>
            <LinkColumn title="کمانگری" links={COMPANY_LINKS} />
            <ul className="mt-5 grid grid-cols-2 gap-2" aria-label="مجوزها">
              {[
                [ShieldCheck, "محل نماد اعتماد"],
                [BadgeCheck, "محل نشان ساماندهی"],
              ].map(([Icon, label]) => {
                const I = Icon as LucideIcon;
                return (
                  <li key={label as string} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-white/20 p-2 text-center text-[0.65rem] text-white/55">
                    <I className="size-6 text-white/40" aria-hidden="true" />
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10">
          <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-white/55 sm:flex-row sm:text-start">
            <p>
              © تمامی حقوق برای {site.name} محفوظ است.
              <span className="block text-[0.7rem] text-white/40">نسخه‌ی نمایشی؛ قیمت‌ها، موجودی و اطلاعات تماس نمونه هستند.</span>
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
