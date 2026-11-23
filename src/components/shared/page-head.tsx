import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "cn";

export interface Crumb {
  label: string;
  href?: string;
}

export function Crumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="مسیر صفحه" className={cn("text-xs text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {[{ label: "خانه", href: "/" }, ...items].map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronLeft className="size-3 opacity-60" aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="py-1 hover:text-foreground">{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface Props {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
}

export function PageHead({ title, description, crumbs, children, className }: Props) {
  return (
    <div className={cn("shell pt-3", className)}>
      <div className="rounded-2xl bg-mist px-4 py-5 lg:px-8 lg:py-6">
        <Crumbs items={crumbs ?? [{ label: title }]} />
        <h1 className="heading title-page mt-1">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    </div>
  );
}
