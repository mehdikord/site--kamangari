import { BadgeCheck, Boxes, Headset, PackageCheck, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { SectionHead } from "@/components/shared/section-head";

const FEATURES: { icon: LucideIcon; title: string; text: string; tint: string; ink: string }[] = [
  { icon: ShieldCheck, title: "پرداخت ایمن", text: "از طریق درگاه بانکی", tint: "#e6f5e9", ink: "#2f7a3a" },
  { icon: Truck, title: "ارسال سریع", text: "۱ تا ۴ روز کاری", tint: "#e8f0ff", ink: "#2f5fd0" },
  { icon: Boxes, title: "فروش کلی و جزئی", text: "تخفیف پلکانی خودکار", tint: "#fff3dc", ink: "#a2660a" },
  { icon: Headset, title: "پشتیبانی ۲۴ / ۷", text: "تلفنی و پیام‌رسان", tint: "#efeaff", ink: "#5b3fc4" },
  { icon: BadgeCheck, title: "ضمانت اصالت", text: "بازپرداخت کامل وجه", tint: "#ffeee6", ink: "#bd3a0b" },
  { icon: PackageCheck, title: "بیمه‌ی حمل", text: "پوشش شکستگی کالا", tint: "#e2f6f4", ink: "#0f6b64" },
];

export function Features() {
  return (
    <section className="shell pt-9 lg:pt-12">
      <SectionHead icon={ShieldCheck} title="مزایای خرید از کمانگری" />
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
        {FEATURES.map(({ icon: Icon, title, text, tint, ink }) => (
          <li key={title} className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center" style={{ background: tint }}>
            <span className="grid size-12 place-items-center rounded-2xl bg-white transition-transform duration-200 group-hover:-translate-y-1" style={{ color: ink }}>
              <Icon className="size-6" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <div>
              <h3 className="heading text-[0.8125rem]">{title}</h3>
              <p className="text-[0.7rem] text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
