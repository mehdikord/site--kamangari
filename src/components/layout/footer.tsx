import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { MessengerIcon } from "@/components/brand/messenger-icon";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { shopHref } from "@/lib/shop-query";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "دسته‌بندی‌ها", links: categories.map((c) => [shopHref({ cat: [c.slug] }), c.name]) },
  {
    title: "خدمات مشتریان",
    links: [["/track", "پیگیری سفارش"], ["/account", "حساب کاربری"], ["/wishlist", "علاقه‌مندی‌ها"], ["/compare", "مقایسه‌ی محصولات"], ["/wholesale", "خرید عمده"], ["/faq", "سوالات متداول"], ["/terms#returns", "شرایط بازگشت کالا"]],
  },
  { title: "کمانگری", links: [["/about", "درباره‌ی ما"], ["/contact", "تماس با ما"], ["/terms", "قوانین و مقررات"], ["/terms#privacy", "حریم خصوصی"], ["/credits", "منابع تصاویر"]] },
];

export function Footer() {
  return (
    <footer className="on-dark no-print mt-12 bg-carbon pb-[calc(4rem+env(safe-area-inset-bottom))] text-[0.8125rem] lg:pb-0">
      <div className="shell grid grid-cols-2 gap-x-8 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Logo className="w-fit" />
          <p className="mt-3 max-w-xs leading-6 text-muted-foreground">{site.intro}</p>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            <li><a href={site.phone.href} className="flex items-center gap-2 hover:text-white"><Phone className="size-3.5" /><span dir="ltr">{site.phone.label}</span></a></li>
            <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="size-3.5" /><span dir="ltr">{site.email}</span></a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-1 size-3.5 shrink-0" />{site.address}</li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {site.messengers.map((m) => (
              <li key={m.id}>
                <a href={m.href} target="_blank" rel="noreferrer" aria-label={m.label} className="grid h-9 min-w-9 place-items-center rounded-lg bg-white/5 px-2.5 transition-colors hover:bg-white/15">
                  <MessengerIcon id={m.id} label={m.label} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="heading text-sm">{column.title}</h2>
            <ul className="mt-1.5">
              {column.links.map(([href, label]) => (
                <li key={href}><Link href={href} className="inline-block py-1 text-muted-foreground hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="bg-white text-black">
        <p className="shell py-2.5 text-center text-xs font-bold">{site.healthWarning} {site.quitLine}</p>
      </div>
      <p className="shell py-3 text-center text-[0.7rem] text-muted-foreground">
        نسخه‌ی نمایشی {site.name}. قیمت‌ها، موجودی، نظرات و اطلاعات تماس نمونه هستند و پرداخت واقعی انجام نمی‌شود.
      </p>
    </footer>
  );
}
