import Link from "next/link";
import { Headset, Phone } from "lucide-react";
import { MessengerIcon } from "@/components/brand/messenger-icon";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

export function SupportCard() {
  return (
    <aside className="rounded-3xl bg-carbon bg-[radial-gradient(ellipse_70%_60%_at_0%_100%,rgb(255_90_44/0.3),transparent)] p-5 text-white">
      <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-flare">
        <Headset className="size-5.5" aria-hidden="true" />
      </span>
      <h2 className="heading mt-3 text-base">نیاز به راهنمایی دارید؟</h2>
      <p className="mt-1 text-xs leading-6 text-white/85">کارشناسان پشتیبانی در تمام ساعات شبانه‌روز پاسخ‌گوی شما هستند.</p>
      <Button asChild variant="brand" className="mt-4 w-full">
        <a href={site.phone.href}>
          <Phone />
          <span dir="ltr">{site.phone.label}</span>
        </a>
      </Button>
      <ul className="mt-2.5 flex gap-1.5">
        {site.messengers.slice(0, 3).map((m) => (
          <li key={m.id} className="flex-1">
            <a href={m.href} target="_blank" rel="noreferrer" aria-label={m.label} className="grid h-10 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/20">
              <MessengerIcon id={m.id} label={m.label} className="size-4" />
            </a>
          </li>
        ))}
        <li className="flex-1">
          <Link href="/contact" className="grid h-10 place-items-center rounded-xl bg-white/10 text-xs transition-colors hover:bg-white/20">سایر راه‌ها</Link>
        </li>
      </ul>
    </aside>
  );
}
