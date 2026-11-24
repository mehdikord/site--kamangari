import { Boxes, Flame, Puzzle, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { products } from "@/data/catalog";
import type { Product } from "@/data/types";
import { fa, toman } from "@/lib/format";
import { basePrice, productDiscount } from "@/lib/product";
import { shopHref } from "@/lib/shop-query";

export interface SlideArt {
  src: string;
  /** Position inside the art box, in percent of its width and height. */
  left: number;
  bottom: number;
  width: number;
  rotate?: number;
  /** How strongly the piece follows the pointer. */
  depth: number;
}

export interface Slide {
  id: string;
  tab: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text: string;
  cta: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** Small floating facts shown over the artwork. */
  badges: string[];
  dark: boolean;
  background: string;
  /** Colour of the glow, rings and tab accent. */
  accent: string;
  countdown?: boolean;
  art: SlideArt[];
}

const image = (key: string) => `/images/catalog/${key}-0.webp`;
const from = (list: Product[]) => Math.min(...list.map(basePrice));

const hookahs = products.filter((p) => p.category === "hookah");
const flash = products.filter((p) => p.flash);
const bestDeal = Math.max(...flash.map(productDiscount));
const lighters = products.filter((p) => p.category === "lighter" && p.type !== "سوخت فندک");

export const SLIDES: Slide[] = [
  {
    id: "hookah",
    tab: "قلیان‌های مدرن",
    icon: Sparkles,
    eyebrow: "مجموعه‌ی قلیان‌های مدرن",
    title: "طراحی مدرن، ساخت دقیق",
    text: "تنه‌ی استیل و آلومینیوم، شیشه‌ی نورپردازی‌شده و شش ماه ضمانت اتصالات.",
    cta: { href: shopHref({ cat: ["hookah"] }), label: "مشاهده‌ی قلیان‌ها" },
    secondary: { href: "#builder", label: "شخصی‌سازی" },
    badges: ["آزمون نشتی پیش از ارسال", `شروع قیمت ${toman(from(hookahs))}`],
    dark: true,
    background: "radial-gradient(ellipse 55% 75% at 22% 62%, rgb(61 123 255 / 0.5), transparent 70%), linear-gradient(135deg, #0c0f1d, #1b2147)",
    accent: "#5b8cff",
    art: [
      { src: "/images/studio/hero-qalyan.webp", left: 16, bottom: -6, width: 70, depth: 1 },
      { src: image("glass-flask"), left: 2, bottom: 4, width: 26, rotate: -6, depth: 2.2 },
      { src: image("bowl-turquoise"), left: 74, bottom: 46, width: 22, rotate: 8, depth: 2.8 },
    ],
  },
  {
    id: "flash",
    tab: "تخفیف‌های لحظه‌ای",
    icon: Zap,
    eyebrow: "پیشنهادهای ویژه‌ی امروز",
    title: `تخفیف‌های لحظه‌ای تا ${fa(bestDeal)}٪`,
    text: "پیشنهادهای ویژه‌ی قلیان، لوازم و فندک، معتبر تا پایان امروز.",
    cta: { href: shopHref({ flash: true }), label: "مشاهده‌ی تخفیف‌ها" },
    badges: [`${fa(flash.length)} محصول دارای تخفیف`],
    dark: true,
    countdown: true,
    background: "radial-gradient(ellipse 60% 80% at 25% 30%, rgb(255 190 120 / 0.55), transparent 70%), linear-gradient(135deg, #ff7a45, #b3330a)",
    accent: "#ffd2b3",
    art: [
      { src: image("qalyan-shab"), left: 30, bottom: -2, width: 44, depth: 1 },
      { src: image("coal-coco"), left: 0, bottom: 2, width: 36, rotate: -4, depth: 2 },
      { src: image("gas-check"), left: 70, bottom: 30, width: 26, rotate: 10, depth: 2.6 },
    ],
  },
  {
    id: "parts",
    tab: "قطعات و لوازم",
    icon: Puzzle,
    eyebrow: "لوازم و قطعات قلیان",
    title: "همه‌ی قطعات، به‌صورت جداگانه",
    text: "شیشه، شلنگ، سری و تنه؛ سازگار با قلیان‌های استاندارد و همراه با مشاوره‌ی سازگاری.",
    cta: { href: shopHref({ cat: ["hookah-accessories"] }), label: "مشاهده‌ی لوازم" },
    badges: ["مشاوره‌ی رایگان سازگاری", "بیمه‌ی شکستگی در حمل"],
    dark: true,
    background: "radial-gradient(ellipse 55% 75% at 25% 65%, rgb(45 212 191 / 0.4), transparent 70%), linear-gradient(135deg, #062e2b, #0f6b64)",
    accent: "#5eead4",
    art: [
      { src: image("glass-bell"), left: 22, bottom: 0, width: 44, depth: 1 },
      { src: image("hose-blue"), left: 0, bottom: 2, width: 36, rotate: -8, depth: 2.2 },
      { src: image("stem-steel"), left: 62, bottom: 8, width: 30, rotate: 6, depth: 1.6 },
      { src: image("bowl-clay"), left: 66, bottom: 56, width: 18, rotate: -10, depth: 3 },
    ],
  },
  {
    id: "lighter",
    tab: "فندک‌ها",
    icon: Flame,
    eyebrow: "فندک‌های بنزینی و گازی",
    title: "فندک اصل، با ضمانت اصالت",
    text: "مدل‌های بادگیر، رومیزی و جیبی از برندهای معتبر، همراه با سوخت و لوازم سرویس.",
    cta: { href: shopHref({ cat: ["lighter"] }), label: "مشاهده‌ی فندک‌ها" },
    badges: [`${fa(lighters.length)} مدل فندک`, "آزمون جرقه پیش از ارسال"],
    dark: true,
    background: "radial-gradient(ellipse 55% 75% at 25% 55%, rgb(167 139 250 / 0.5), transparent 70%), linear-gradient(135deg, #1d1446, #4c35b5)",
    accent: "#c4b5fd",
    art: [
      { src: image("zippo-rainbow"), left: 26, bottom: 6, width: 40, rotate: -4, depth: 1 },
      { src: image("zippo-chrome"), left: 0, bottom: 0, width: 32, rotate: -12, depth: 2 },
      { src: image("zippo-brass"), left: 64, bottom: 28, width: 30, rotate: 10, depth: 2.6 },
    ],
  },
  {
    id: "wholesale",
    tab: "خرید عمده",
    icon: Boxes,
    eyebrow: "فروش عمده و سازمانی",
    title: "خرید عمده با تخفیف پلکانی",
    text: "فاکتور رسمی، ارسال با باربری و لیست قیمت همکاری برای فروشگاه‌ها و کسب‌وکارها.",
    cta: { href: "/wholesale", label: "درخواست لیست قیمت" },
    secondary: { href: "/contact", label: "تماس با واحد فروش" },
    badges: ["تخفیف خودکار در سبد", "ارسال به سراسر کشور"],
    dark: false,
    background: "radial-gradient(ellipse 55% 75% at 22% 60%, rgb(255 255 255 / 0.75), transparent 70%), linear-gradient(135deg, #fff4dd, #ffd79a)",
    accent: "#e09a2c",
    art: [
      { src: image("coal-limoo"), left: 20, bottom: 0, width: 46, depth: 1 },
      { src: image("coal-quick"), left: 0, bottom: 18, width: 30, rotate: -8, depth: 2.2 },
      { src: image("fuel-gas"), left: 66, bottom: 10, width: 26, rotate: 6, depth: 2.6 },
    ],
  },
];
