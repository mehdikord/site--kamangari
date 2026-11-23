import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  text: string;
  href?: string;
  action?: string;
  onAction?: () => void;
}

export function EmptyState({ title, text, href = "/shop", action = "مشاهده‌ی فروشگاه", onAction }: Props) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-16 text-center">
      <span className="grid size-20 place-items-center rounded-3xl bg-mist text-muted-foreground">
        <PackageOpen className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="heading mt-4 text-lg">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <Button asChild className="mt-5">
        <Link href={href} onClick={onAction}>{action}</Link>
      </Button>
    </div>
  );
}
