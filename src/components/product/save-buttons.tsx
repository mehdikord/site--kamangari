"use client";

import { useRouter } from "next/navigation";
import { GitCompareArrows, Heart } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "cn";
import { useReady, useShop } from "@/lib/store";

interface Props {
  id: number;
  name: string;
  className?: string;
}

const round = "grid size-9 place-items-center rounded-full bg-white/90 text-carbon transition-colors hover:bg-white";

export function WishButton({ id, name, className }: Props) {
  const ready = useReady();
  const saved = useShop((s) => s.wishlist.includes(id));
  const toggle = useShop((s) => s.toggleWish);
  const active = ready && saved;
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`علاقه‌مندی: ${name}`}
      className={cn(round, className)}
      onClick={() => {
        toggle(id);
        toast(saved ? "از فهرست علاقه‌مندی‌ها حذف شد" : "به فهرست علاقه‌مندی‌ها افزوده شد");
      }}
    >
      <motion.span key={String(active)} initial={{ scale: active ? 0.5 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}>
        <Heart className={cn("size-4", active && "fill-brand text-brand")} />
      </motion.span>
    </button>
  );
}

export function CompareButton({ id, name, className }: Props) {
  const router = useRouter();
  const ready = useReady();
  const saved = useShop((s) => s.compare.includes(id));
  const toggle = useShop((s) => s.toggleCompare);
  const active = ready && saved;
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`مقایسه: ${name}`}
      className={cn(round, active && "bg-carbon text-white hover:bg-carbon", className)}
      onClick={() => {
        const action = { label: "مشاهده‌ی مقایسه", onClick: () => router.push("/compare") };
        if (!toggle(id)) toast.error("امکان مقایسه‌ی حداکثر چهار محصول وجود دارد.", { action });
        else if (saved) toast("از فهرست مقایسه حذف شد");
        else toast("به فهرست مقایسه افزوده شد", { action });
      }}
    >
      <GitCompareArrows className="size-4" />
    </button>
  );
}
