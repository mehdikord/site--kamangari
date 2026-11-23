import Link from "next/link";
import { cn } from "cn";
import { site } from "@/config/site";

/** A bow and arrow reduced to three strokes. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="var(--brand)" />
      <path d="M28 11C17.5 16 17.5 32 28 37" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 24H12.5M17 19.5 12.5 24l4.5 4.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label={`${site.name}، صفحه‌ی اصلی`} className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <Mark />
      <span className="flex flex-col leading-none">
        <span className="heading text-lg leading-tight font-extrabold">{site.shortName}</span>
        <span className="text-[0.65rem] text-muted-foreground">فروشگاه دخانیات</span>
      </span>
    </Link>
  );
}
