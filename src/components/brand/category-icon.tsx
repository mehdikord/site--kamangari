import { Briefcase, Cigarette, Flame, FlaskConical, LayoutGrid, Leaf, Puzzle, Sprout, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  hookah: FlaskConical,
  tobacco: Leaf,
  "hookah-accessories": Puzzle,
  cigarette: Cigarette,
  lighter: Flame,
  "smoking-accessories": Briefcase,
  "rolling-tobacco": Sprout,
};

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? LayoutGrid;
  return <Icon className={className} aria-hidden="true" />;
}
