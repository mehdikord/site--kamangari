import type { PartName } from "@/three/qalyan";
import { shopHref } from "@/lib/shop-query";

export interface HeroPart {
  id: PartName;
  label: string;
  href: string;
  /** Point on the assembled model the label is pinned to. */
  anchor: [number, number, number];
  /** Physical side the label opens towards. */
  side: "left" | "right";
}

const accessory = (type: string) => shopHref({ cat: ["hookah-accessories"], type: [type] });

export const HERO_PARTS: HeroPart[] = [
  { id: "coals", label: "زغال", href: accessory("زغال"), anchor: [0.4, 4.48, 0.05], side: "right" },
  { id: "bowl", label: "سری", href: accessory("سری قلیان"), anchor: [-0.37, 4.2, 0.05], side: "left" },
  { id: "tray", label: "سینی", href: accessory("تنه و سینی"), anchor: [0.76, 3.75, 0], side: "right" },
  { id: "stem", label: "تنه", href: accessory("تنه و سینی"), anchor: [-0.19, 2.76, 0.03], side: "left" },
  { id: "hose", label: "شلنگ", href: accessory("شلنگ قلیان"), anchor: [1.36, 0.95, 0.35], side: "right" },
  { id: "base", label: "شیشه", href: accessory("شیشه قلیان"), anchor: [-0.8, 0.56, 0.05], side: "left" },
];
