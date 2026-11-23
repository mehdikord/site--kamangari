import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn } from "cn";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHead({ title, description, icon: Icon, href, linkLabel = "مشاهده‌ی همه", className }: Props) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-4 lg:mb-5", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-brand">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="heading title-section">{title}</h2>
          {description && <p className="text-xs text-muted-foreground lg:text-[0.8125rem]">{description}</p>}
        </div>
      </div>
      {href && (
        <Link href={href} className="flex h-8 shrink-0 items-center gap-1 rounded-lg border bg-white px-2.5 text-xs font-semibold text-carbon transition-colors hover:bg-mist">
          {linkLabel}
          <ChevronLeft className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
