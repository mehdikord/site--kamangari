import imageManifest from "./images.json";
import { categoryBySlug } from "./categories";
import type { CategorySlug, Product, ProductOption } from "./types";

/*
 * Mock catalogue. Prices (toman), stock, sales and ratings are sample values.
 * When a real backend arrives, replace `products` and keep the exported shape.
 */

interface Seed {
  slug: string;
  name: string;
  category: CategorySlug;
  type: string;
  brand: string;
  /** Key in images.json */
  image: string;
  price: number | [label: string, price: number][];
  optionLabel?: string;
  /** Discount percent */
  off?: number;
  flash?: boolean;
  stock?: number;
  flavor?: string;
  material?: string;
  note: string;
  specs: [string, string][];
}

/** Seeds the merchandising mock: what leads "popular" and "newest". */
const BEST_SELLERS = ["qalyan-gerdoo", "zippo-chrome", "coal-coco", "pipe-bent", "moassel-doosib", "bahman", "hose-blue", "toton-cavendish", "qalyan-lajvard", "glass-bell"];
const NEW_ARRIVALS = ["qalyan-mes", "zippo-rainbow", "glass-flask", "pipe-blue", "moassel-golab", "humidor", "bowl-turquoise", "qalyan-firoozeh", "case-bird", "toton-oriental"];
const rankBoost = (list: string[], slug: string) => (list.includes(slug) ? list.length - list.indexOf(slug) : 0);

const manifest: Record<string, string[]> = imageManifest;

const cigarette = (slug: string, image: string, name: string, brand: string, origin: string, pack: number, note: string, extra?: Partial<Seed>): Seed => ({
  slug, image, brand, note,
  name: `سیگار ${name}`,
  category: "cigarette",
  type: origin === "ایران" ? "سیگار ایرانی" : "سیگار خارجی",
  optionLabel: "بسته‌بندی",
  price: [["پاکت ۲۰ نخی", pack], ["باکس ۱۰ پاکتی", pack * 9.5]],
  specs: [["کشور سازنده", origin], ["تعداد در پاکت", "۲۰ نخ"], ["نحوه‌ی عرضه", "فقط پلمب، بدون فروش نخی"]],
  ...extra,
});

const moassel = (key: string, flavor: string, price: number, note: string, extra?: Partial<Seed>): Seed => ({
  slug: `moassel-${key}`, image: `moassel-${key}`, flavor, note,
  name: `تنباکوی معسل ${flavor}`,
  category: "tobacco",
  type: "معسل طعم‌دار",
  brand: "کمانگری",
  optionLabel: "وزن بسته",
  price: [["۵۰ گرم", price], ["۲۵۰ گرم", price * 4.4], ["۱ کیلوگرم", price * 15.5]],
  specs: [["طعم", flavor], ["نوع برش", "متوسط"], ["پایه", "ملاس و گلیسیرین"], ["بسته‌بندی", "دولایه و پلمب"]],
  ...extra,
});

const sonati = (key: string, origin: string, price: number, note: string, extra?: Partial<Seed>): Seed => ({
  slug: `tobacco-${key}`, image: `sonati-${key}`, note,
  name: `تنباکوی سنتی ${origin}`,
  category: "tobacco",
  type: "تنباکوی سنتی",
  brand: "کمانگری",
  flavor: "بدون طعم",
  optionLabel: "وزن بسته",
  price: [["۲۵۰ گرم", price], ["۵۰۰ گرم", price * 1.9], ["۱ کیلوگرم", price * 3.6]],
  specs: [["گونه", origin], ["افزودنی طعم", "ندارد"], ["شکل", "برگ خردشده"], ["آماده‌سازی", "نیاز به خیساندن"]],
  ...extra,
});

const qalyan = (key: string, name: string, stem: string, glass: string, height: number, price: number, note: string, extra?: Partial<Seed>): Seed => ({
  slug: `qalyan-${key}`, image: `qalyan-${key}`, note, price,
  name: `قلیان ${name}`,
  category: "hookah",
  type: stem.startsWith("چوب") ? "قلیان چوبی" : "قلیان فلزی",
  brand: "کمانگری",
  material: stem.startsWith("چوب") ? "چوب" : stem,
  specs: [["جنس تنه", stem], ["شیشه", glass], ["ارتفاع", `${height.toLocaleString("fa-IR")} سانتی‌متر`], ["اقلام همراه", "شلنگ، سری، سینی، واشر و انبر"], ["ضمانت", "شش ماه برای تنه و اتصالات"]],
  ...extra,
});

const part = (slug: string, image: string, name: string, type: string, material: string, price: Seed["price"], note: string, specs: [string, string][], extra?: Partial<Seed>): Seed => ({
  slug, image, name, type, material, price, note,
  category: "hookah-accessories",
  brand: "کمانگری",
  specs: [["جنس", material], ...specs],
  ...extra,
});

const coal = (key: string, name: string, base: string, burn: string, kilo: number, note: string, extra?: Partial<Seed>): Seed =>
  part(`coal-${key}`, `coal-${key}`, `زغال ${name}`, "زغال", base,
    [["۱ کیلوگرم", kilo], ["۳ کیلوگرم", kilo * 2.8], ["کارتن ۱۰ کیلویی", kilo * 8.6]], note,
    [["ماندگاری حرارت", burn], ["بسته‌بندی", "کارتن و نایلون ضدرطوبت"]],
    { brand: "کمانگری", optionLabel: "وزن بسته", ...extra });

const lighter = (slug: string, image: string, name: string, brand: string, fuel: "بنزینی" | "گازی", material: string, price: Seed["price"], note: string, extra?: Partial<Seed>): Seed => ({
  slug, image, brand, material, price, note,
  name: `فندک ${name}`,
  category: "lighter",
  type: `فندک ${fuel}`,
  specs: [["نوع سوخت", fuel === "بنزینی" ? "بنزین فندک" : "گاز بوتان"], ["جنس بدنه", material], ["قابل شارژ", "بله"], ["ارسال", "بدون سوخت، مطابق ضوابط حمل"]],
  ...extra,
});

const accessory = (slug: string, image: string, name: string, type: string, material: string, price: Seed["price"], note: string, specs: [string, string][], extra?: Partial<Seed>): Seed => ({
  slug, image, name, type, material, price, note,
  category: "smoking-accessories",
  brand: "متفرقه",
  specs: [["جنس", material], ...specs],
  ...extra,
});

const toton = (slug: string, image: string, name: string, type: "توتون پیپ" | "توتون دست‌پیچ", cut: string, price: number, note: string, extra?: Partial<Seed>): Seed => ({
  slug, image, name, type, note,
  category: "rolling-tobacco",
  brand: "کمانگری",
  optionLabel: "وزن بسته",
  price: [["۵۰ گرم", price], ["۱۰۰ گرم", price * 1.85], ["۲۵۰ گرم", price * 4.2]],
  specs: [["نوع برش", cut], ["مناسب", type === "توتون پیپ" ? "پیپ" : "کاغذ دست‌پیچ"], ["نگهداری", "ظرف دربسته، دور از نور"]],
  ...extra,
});

const seeds: Seed[] = [
  qalyan("lajvard", "مدل K1 آلومینیومی آبی", "آلومینیوم", "مخروطی آبی با نور پایه", 72, 8_900_000, "تنه‌ی آلومینیوم آنادایز آبی، شیشه‌ی مخروطی و حلقه‌ی نور LED در پایه.", { off: 18, flash: true }),
  qalyan("gerdoo", "مدل K2 با روکش گردو", "چوب گردو", "کروی کهربایی", 78, 6_700_000, "مغزی استیل ۳۰۴ با روکش چوب گردو، شیشه‌ی کروی و شلنگ سیلیکونی."),
  qalyan("anar", "مدل K3 چوبی، شیشه‌ی سرخ", "چوب راش", "تراش سرخ", 70, 5_400_000, "روکش چوب راش روی مغزی استیل، همراه با شیشه‌ی تراش‌خورده‌ی سرخ.", { off: 12 }),
  qalyan("steel", "مدل K4 تمام‌استیل", "استیل", "مخروطی دودی", 75, 9_800_000, "تنه‌ی استیل ۳۰۴ ضدزنگ با اتصالات رزوه‌ای و قابلیت شست‌وشوی کامل."),
  qalyan("mes", "مدل K5 شامپاینی", "استیل", "کروی کهربایی", 68, 11_500_000, "استیل با پوشش PVD شامپاینی و شیشه‌ی کهربایی، در تیراژ محدود.", { stock: 3 }),
  qalyan("shab", "مدل K6 مشکی مات", "آلومینیوم", "تراش بنفش", 73, 7_200_000, "آلومینیوم آنادایز مات، سبک و مقاوم در برابر خط و لک.", { off: 20, flash: true }),
  qalyan("firoozeh", "مدل K7 فیروزه‌ای", "آلومینیوم", "مخروطی فیروزه‌ای", 72, 8_400_000, "تنه‌ی شامپاینی، شیشه‌ی فیروزه‌ای و شلنگ سیلیکونی روشن."),
  qalyan("mini", "مدل K8 کامپکت", "آلومینیوم", "کروی نارنجی", 52, 3_600_000, "طراحی سه‌تکه با ارتفاع کم، مناسب جابه‌جایی و فضای محدود."),

  moassel("doosib", "دو سیب", 145_000, "ترکیب سیب سبز و سرخ با ته‌مایه‌ی بادیان.", { off: 15, flash: true }),
  moassel("nana", "نعنا", 135_000, "عصاره‌ی نعنا، به‌تنهایی یا در ترکیب با طعم‌های میوه‌ای."),
  moassel("porteghal", "پرتقال خامه", 155_000, "مرکبات با پایه‌ی خامه‌ای و شیرینی کنترل‌شده."),
  moassel("blueberry", "بلوبری", 165_000, "طعم توت آبی با برش یکدست و رطوبت تنظیم‌شده.", { off: 10 }),
  moassel("limoo", "لیمو نعنا", 140_000, "لیموترش و نعنا، با شیرینی کمتر از طعم‌های میوه‌ای."),
  moassel("angoor", "انگور", 150_000, "انگور سیاه با برش متوسط و ملاس نیشکر."),
  moassel("hendevane", "هندوانه", 150_000, "طعم هندوانه با رایحه‌ی کم، در بسته‌ی پلمب."),
  moassel("golab", "گل محمدی", 170_000, "رایحه‌ی گلاب روی پایه‌ی ملاس، از طعم‌های قدیمی ایرانی."),
  sonati("khansar", "خوانسار", 290_000, "برگ دست‌چین خوانسار، بدون اسانس و رنگ."),
  sonati("borazjan", "برازجان", 260_000, "تنباکوی جنوب با برگ ضخیم و خاکستر روشن.", { off: 8 }),
  sonati("kashan", "حکان", 320_000, "برگ حکان فارس، سورت‌شده و خشک‌شده در سایه."),

  coal("coco", "نارگیل مکعبی", "پوست نارگیل", "۷۰ تا ۹۰ دقیقه", 285_000, "مکعب ۲۵ میلی‌متری کم‌خاکستر و بدون جرقه، ۷۲ حبه در هر کیلو.", { off: 22, flash: true }),
  coal("limoo", "لیموی جنوب", "چوب لیمو", "۴۰ تا ۵۰ دقیقه", 190_000, "زغال چوب مرکبات هرمزگان، سرندشده و بدون خاکه."),
  coal("quick", "خودسوز قرصی", "زغال فشرده", "۳۰ تا ۴۰ دقیقه", 240_000, "قرص‌های ۳۳ میلی‌متری در رول ده‌تایی. فقط در فضای باز روشن شود."),
  coal("hobbeh", "حبه‌ای فشرده", "خاک زغال طبیعی", "۵۰ تا ۶۰ دقیقه", 165_000, "حبه‌ی هم‌اندازه‌ی ایرانی، اقتصادی برای خرید کارتنی."),
  part("glass-globe", "glass-globe", "شیشه قلیان کروی سرخ", "شیشه قلیان", "شیشه", 1_650_000, "شیشه‌ی کروی دهان‌دمیده با حلقه‌ی استیل و نور پایه.", [["ارتفاع", "۲۶ سانتی‌متر"], ["دهانه", "۴۲ میلی‌متر"]]),
  part("glass-bell", "glass-bell", "شیشه قلیان مخروطی آبی", "شیشه قلیان", "شیشه", 1_850_000, "فرم مخروطی مدرن با کف پهن و پایدار.", [["ارتفاع", "۲۸ سانتی‌متر"], ["دهانه", "۴۲ میلی‌متر"]], { off: 14, flash: true }),
  part("glass-flask", "glass-flask", "شیشه قلیان تراش فیروزه‌ای", "شیشه قلیان", "شیشه", 1_400_000, "سطوح تراش‌خورده با گردن بلند و اتصال پایدار.", [["ارتفاع", "۲۷ سانتی‌متر"], ["دهانه", "۴۰ میلی‌متر"]]),
  part("glass-green", "glass-green", "شیشه قلیان کروی دودی", "شیشه قلیان", "شیشه", 1_550_000, "شیشه‌ی ضخیم دودی با حلقه‌ی استیل.", [["ارتفاع", "۲۶ سانتی‌متر"], ["دهانه", "۴۲ میلی‌متر"]]),
  part("hose-blue", "hose-blue", "شلنگ سیلیکونی آبی، دسته‌ی چوبی", "شلنگ قلیان", "سیلیکون و چوب", 780_000, "سیلیکون قابل شست‌وشو با سطح مات و دسته‌ی گردو.", [["طول", "۱۷۰ سانتی‌متر"], ["قابل شست‌وشو", "بله"]]),
  part("hose-red", "hose-red", "شلنگ سیلیکونی سرخ، دسته‌ی شامپاینی", "شلنگ قلیان", "سیلیکون و آلومینیوم", 920_000, "سیلیکون مات سرخ با دسته‌ی آلومینیوم شامپاینی.", [["طول", "۱۸۰ سانتی‌متر"], ["قابل شست‌وشو", "بله"]], { off: 25, flash: true }),
  part("hose-black", "hose-black", "شلنگ سیلیکونی مشکی، دسته‌ی استیل", "شلنگ قلیان", "سیلیکون و استیل", 850_000, "بدون بوی پلاستیک و بدون زنگ‌زدگی، مناسب قلیان‌های استیل.", [["طول", "۱۷۰ سانتی‌متر"], ["قابل شست‌وشو", "بله"]]),
  part("hose-cream", "hose-cream", "شلنگ سیلیکونی روشن، دسته‌ی مشکی", "شلنگ قلیان", "سیلیکون و آلومینیوم", 890_000, "سیلیکون مات روشن با سردسته‌ی آلومینیوم مشکی.", [["طول", "۱۷۵ سانتی‌متر"], ["قابل شست‌وشو", "بله"]]),
  part("bowl-turquoise", "bowl-turquoise", "سری قلیان سرامیکی فیروزه‌ای", "سری قلیان", "سرامیک", 360_000, "لعاب کامل داخل و بیرون، بدون جذب بو.", [["ظرفیت", "۱۵ گرم"]]),
  part("bowl-clay", "bowl-clay", "سری قلیان سفالی", "سری قلیان", "سفال", 220_000, "سفال پخت‌بالا با پخش یکنواخت حرارت.", [["ظرفیت", "۱۸ گرم"]]),
  part("bowl-black", "bowl-black", "سری قلیان سنگی مشکی", "سری قلیان", "سنگ", 540_000, "بدنه‌ی ضخیم با حفظ حرارت بالا.", [["ظرفیت", "۲۰ گرم"]], { off: 10 }),
  part("stem-wood", "stem-wood", "تنه قلیان گردو با سینی", "تنه و سینی", "چوب", 2_900_000, "روکش گردو روی مغزی استیل، همراه با سینی استیل.", [["ارتفاع", "۴۵ سانتی‌متر"]]),
  part("stem-brass", "stem-brass", "تنه قلیان شامپاینی با سینی", "تنه و سینی", "آلومینیوم", 3_800_000, "آلومینیوم CNC با پوشش شامپاینی، سازگار با دهانه‌ی ۴۲.", [["ارتفاع", "۴۴ سانتی‌متر"]]),
  part("stem-steel", "stem-steel", "تنه قلیان استیل با سینی", "تنه و سینی", "استیل", 3_300_000, "استیل ۳۰۴ با سوپاپ تخلیه و اتصال رزوه‌ای.", [["ارتفاع", "۴۶ سانتی‌متر"]]),
  part("tray-brass", "tray-brass", "سینی قلیان استیل", "تنه و سینی", "استیل", 680_000, "لبه‌ی برگشته برای مهار خاکستر و زغال.", [["قطر", "۲۴ سانتی‌متر"]]),
  part("tongs", "tongs", "انبر زغال استیل", "انبر و فویل", "استیل", 260_000, "فنری و سبک، با سری ایمن برای جابه‌جایی زغال.", [["طول", "۲۲ سانتی‌متر"]]),
  part("foil", "foil", "فویل سری قلیان سوراخ‌دار", "انبر و فویل", "آلومینیوم", 95_000, "فویل ضخیم ۴۰ میکرون، سوراخ‌شده و آماده.", [["تعداد", "۵۰ برگ"]]),

  cigarette("bahman", "bahman", "بهمن فیلتردار", "بهمن", "ایران", 60_000, "سیگار فیلتردار ایرانی در پاکت نرم."),
  cigarette("winston-red", "winston", "وینستون کلاسیک قرمز", "وینستون", "سوئیس", 130_000, "پاکت سخت کینگ‌سایز با فیلتر استات."),
  cigarette("winston-box", "winston-box", "وینستون باکس", "وینستون", "آمریکا", 160_000, "نسخه‌ی باکس سخت با بسته‌بندی کلاسیک برند."),
  cigarette("marlboro-red", "marlboro", "مارلبرو قرمز", "مارلبرو", "سوئیس", 210_000, "پاکت سخت کینگ‌سایز، واردات رسمی."),
  cigarette("marlboro-menthol", "marlboro-menthol", "مارلبرو منتول", "مارلبرو", "آمریکا", 230_000, "فیلتردار منتول در پاکت سخت."),
  cigarette("marlboro-27", "marlboro-27", "مارلبرو بلند ۲۷", "مارلبرو", "آمریکا", 245_000, "ترکیب شماره‌ی ۲۷ در پاکت سخت."),
  cigarette("camel-filters", "camel", "کمل فیلتر", "کمل", "آلمان", 175_000, "ترکیب توتون ترک و آمریکایی، کینگ‌سایز."),
  cigarette("camel-soft", "camel-soft", "کمل پاکت نرم", "کمل", "آمریکا", 185_000, "نسخه‌ی بدون فیلتر در پاکت نرم.", { stock: 0 }),
  cigarette("parliament", "parliament", "پارلمنت وان", "پارلمنت", "سوئیس", 220_000, "فیلتر تورفته با لایه‌ی زغال."),
  cigarette("lucky-strike", "lucky", "لاکی‌استرایک قرمز", "لاکی‌استرایک", "آلمان", 165_000, "پاکت سخت، ترکیب آمریکایی."),
  cigarette("pall-mall", "pallmall", "پال‌مال قرمز", "پال‌مال", "لهستان", 115_000, "کینگ‌سایز فیلتردار در پاکت سخت."),
  cigarette("davidoff", "davidoff", "داویدوف سوپریم", "داویدوف", "آلمان", 260_000, "پاکت سخت لبه‌گرد."),
  cigarette("dunhill", "dunhill", "دانهیل قهوه‌ای", "دانهیل", "اندونزی", 190_000, "فیلتردار با پیچش قهوه‌ای."),

  lighter("zippo-brass", "zippo-brass", "زیپو برنجی ساتن", "زیپو", "بنزینی", "برنج", 4_600_000, "مدل بادگیر کلاسیک با بدنه‌ی برنجی و ضمانت سازنده.", { off: 16, flash: true }),
  lighter("zippo-chrome", "zippo-chrome", "زیپو پیپ کروم", "زیپو", "بنزینی", "استیل", 4_200_000, "بادگیر دایره‌ای مخصوص روشن‌کردن پیپ از پهلو."),
  lighter("zippo-marble", "zippo-marble", "زیپو رومیزی مرمر", "زیپو", "بنزینی", "سنگ", 7_800_000, "بدنه‌ی مرمر سنگین برای میز کار و ویترین.", { stock: 2 }),
  lighter("zippo-fish", "zippo-gold", "زیپو طلایی ماهی", "زیپو", "بنزینی", "برنج", 9_200_000, "نسخه‌ی کلکسیونی با نقش برجسته‌ی ریخته‌گری."),
  lighter("zippo-snake", "zippo-snake", "زیپو طرح پوست مار", "زیپو", "بنزینی", "استیل", 4_900_000, "بدنه‌ی کروم مات با چاپ لاک‌خورده."),
  lighter("zippo-rainbow", "zippo-rainbow", "زیپو رنگین‌کمانی", "زیپو", "بنزینی", "استیل", 5_300_000, "پوشش PVD با بازتاب بنفش، آبی و طلایی.", { off: 10 }),
  lighter("zippo-1932", "zippo-1932", "زیپو یادبود ۱۹۳۲", "زیپو", "بنزینی", "استیل", 5_100_000, "طرح شعله‌ی کلاسیک برند روی کروم ساتن."),
  lighter("gas-brushed", "gas-brushed", "گازی استیل خش‌دار", "کولیبری", "گازی", "استیل", 1_750_000, "باریک و جیبی، با تنظیم ارتفاع شعله."),
  lighter("gas-star", "gas-star", "گازی اهرمی ستاره", "رانسون", "گازی", "استیل", 2_400_000, "جرقه‌ی اهرمی با درِ لولایی و نقش حکاکی."),
  lighter("gas-check", "gas-check", "گازی شطرنجی رترو", "کاوی", "گازی", "استیل", 1_950_000, "طراحی دهه‌ی شصت با بدنه‌ی نقش‌دار.", { off: 30, flash: true }),
  lighter("gas-table", "gas-table", "گازی رومیزی چوبی", "رانسون", "گازی", "چوب", 3_100_000, "پایه‌ی چوب سنگین با سر کروم قابل شارژ."),
  lighter("gas-pen", "gas-pen", "گازی طرح خودنویس", "رانسون", "گازی", "استیل", 1_600_000, "بدنه‌ی لاکی مشکی در فرم قلم."),
  lighter("gas-ronson", "gas-ronson", "گازی رانسون چرمی", "رانسون", "گازی", "چرم", 2_700_000, "روکش چرم بافت، همراه جعبه‌ی مخمل."),
  lighter("clipper", "clipper", "کلیپر سافت‌تاچ", "کلیپر", "گازی", "پلاستیک", [["تکی", 165_000], ["بسته‌ی ۱۲ عددی", 1_780_000]], "سنگ و مخزن قابل تعویض با بدنه‌ی نرم.", { optionLabel: "بسته‌بندی" }),
  lighter("clipper-color", "clipper-rainbow", "کلیپر رنگی شفاف", "کلیپر", "گازی", "پلاستیک", [["تکی", 140_000], ["بسته‌ی ۸ عددی", 980_000]], "مخزن شفاف با امکان مشاهده‌ی میزان گاز.", { optionLabel: "بسته‌بندی" }),
  { slug: "fuel-gas", image: "fuel-gas", name: "گاز فندک بوتان", category: "lighter", type: "سوخت فندک", brand: "کمانگری", optionLabel: "حجم", price: [["۱۵۰ میلی‌لیتر", 180_000], ["۳۰۰ میلی‌لیتر", 310_000]], note: "بوتان تصفیه‌شده با پنج سری نازل.", specs: [["خلوص", "۹۹ درصد"], ["ارسال", "فقط زمینی"]] },
  { slug: "fuel-benzin", image: "fuel-benzin", name: "بنزین فندک", category: "lighter", type: "سوخت فندک", brand: "کمانگری", price: 240_000, note: "نفتای کم‌بو، سازگار با فندک‌های فتیله‌ای.", specs: [["حجم", "۱۲۵ میلی‌لیتر"], ["ارسال", "فقط زمینی"]] },

  accessory("pipe-billiard", "pipe-billiard", "پیپ بریار بیلیارد", "پیپ", "چوب", 3_900_000, "ریشه‌ی بریار با دهنی ابونیت، فرم کلاسیک صاف.", [["طول", "۱۴ سانتی‌متر"], ["فیلتر", "۹ میلی‌متر"]]),
  accessory("pipe-bent", "pipe-bent", "پیپ بریار خمیده", "پیپ", "چوب", 4_300_000, "گردن خمیده با وزن متعادل و رگه‌ی طبیعی چوب.", [["طول", "۱۳ سانتی‌متر"], ["فیلتر", "۹ میلی‌متر"]], { off: 15, flash: true }),
  accessory("pipe-rustic", "pipe-rustic", "پیپ بریار راستیک", "پیپ", "چوب", 3_500_000, "سطح کنده‌کاری‌شده با انتقال حرارت کمتر.", [["طول", "۱۴ سانتی‌متر"], ["فیلتر", "۹ میلی‌متر"]]),
  accessory("pipe-apple", "pipe-apple", "پیپ بریار سیبی", "پیپ", "چوب", 3_750_000, "کاسه‌ی گرد با پرداخت روشن و دهنی نیم‌خم.", [["طول", "۱۴ سانتی‌متر"], ["فیلتر", "۹ میلی‌متر"]]),
  accessory("pipe-blue", "pipe-blue", "پیپ لاکی آبی", "پیپ", "چوب", 3_200_000, "بریار با لاک آبی عمیق و دهنی اکریلیک.", [["طول", "۱۵ سانتی‌متر"], ["فیلتر", "۹ میلی‌متر"]]),
  accessory("holder-silver", "holder-silver", "چوب سیگار نقره‌کوب", "چوب سیگار", "استخوان و فلز", 890_000, "ساقه‌ی استخوانی با بست فلزی نقش‌دار.", [["طول", "۹ سانتی‌متر"]]),
  accessory("holder-amber", "holder-amber", "چوب سیگار کهربایی", "چوب سیگار", "رزین", 1_250_000, "رزین کهربایی با کنده‌کاری دستی.", [["طول", "۸ سانتی‌متر"]]),
  accessory("holder-box", "holder-box", "چوب سیگار جعبه‌دار", "چوب سیگار", "رزین", 1_450_000, "سرِ کنده‌کاری‌شده با دهنی مشکی، در جعبه‌ی مخمل.", [["طول", "۱۰ سانتی‌متر"]]),
  accessory("ash-piston", "ash-piston", "جاسیگاری فلزی پیستون", "جاسیگاری", "آلومینیوم", 720_000, "ریخته‌گری سنگین به فرم پیستون موتور.", [["قطر", "۱۰ سانتی‌متر"]]),
  accessory("ash-turquoise", "ash-turquoise", "جاسیگاری کریستال فیروزه‌ای", "جاسیگاری", "شیشه", 650_000, "شیشه‌ی پرسی تراش‌دار با چهار شیار.", [["قطر", "۱۶ سانتی‌متر"]], { off: 20, flash: true }),
  accessory("ash-steel", "ash-steel", "جاسیگاری استیل", "جاسیگاری", "استیل", 480_000, "لبه‌ی پهن و قیفی برای مهار بو و خاکستر.", [["قطر", "۱۲ سانتی‌متر"]]),
  accessory("ash-green", "ash-green", "جاسیگاری سنگی سبز", "جاسیگاری", "سنگ", 820_000, "سنگ پرداخت‌شده با رگه‌ی طبیعی.", [["قطر", "۱۳ سانتی‌متر"]]),
  accessory("case-floral", "case-floral", "قوطی سیگار قلم‌زنی", "قوطی سیگار", "فلز", 1_900_000, "قلم‌زنی اسلیمی روی بدنه‌ی آب‌نقره.", [["ظرفیت", "۱۸ نخ"]]),
  accessory("case-bird", "case-bird", "قوطی سیگار گل‌ومرغ", "قوطی سیگار", "فلز", 2_200_000, "حکاکی پرنده و بامبو با قفل فشاری.", [["ظرفیت", "۱۲ نخ"]]),
  accessory("case-dragon", "case-dragon", "قوطی سیگار نقش اژدها", "قوطی سیگار", "فلز", 2_600_000, "نقش برجسته‌ی دوطرفه با پتینه‌ی تیره.", [["ظرفیت", "۲۰ نخ"]]),
  accessory("case-plain", "case-plain", "قوطی سیگار گیوشه", "قوطی سیگار", "فلز", 1_350_000, "بافت گیوشه‌ی ظریف و گوشه‌های گرد.", [["ظرفیت", "۱۰ نخ"]]),
  accessory("roll-tin", "roll-tin", "سیگارپیچ قوطی فلزی", "سیگارپیچ", "فلز", 390_000, "پیچش با بستن درپوش، همراه با محفظه‌ی توتون.", [["اندازه", "۷۰ میلی‌متر"]]),
  accessory("roll-injector", "roll-injector", "سیگارپیچ تزریقی", "سیگارپیچ", "پلاستیک", 560_000, "پرکردن لوله‌ی فیلتردار با اهرم کشویی.", [["اندازه", "۸۴ میلی‌متر"]]),
  accessory("roll-78", "roll-78", "سیگارپیچ غلتکی ۷۸", "سیگارپیچ", "اکریلیک", 280_000, "دو غلتک با نوار بافت، جیبی و ساده.", [["اندازه", "۷۸ میلی‌متر"]]),
  accessory("papers-slim", "papers-slim", "کاغذ سیگار اسلیم", "کاغذ و فیلتر", "کاغذ", [["تکی", 65_000], ["بسته‌ی ۲۵ عددی", 1_450_000]], "کاغذ نازک با چسب گیاهی.", [["برگ در هر دفترچه", "۵۰"]], { optionLabel: "بسته‌بندی" }),
  accessory("papers-gold", "papers-gold", "کاغذ سیگار کلاسیک طلایی", "کاغذ و فیلتر", "کاغذ", 85_000, "دفترچه‌ی کلاسیک اسپانیایی.", [["برگ در هر دفترچه", "۱۰۰"]]),
  accessory("filter", "filter", "فیلتر اسلیم دست‌پیچ", "کاغذ و فیلتر", "استات", 120_000, "فیلتر ۶ میلی‌متری هم‌اندازه با سیگارپیچ‌ها.", [["تعداد", "۱۵۰ عدد"]], { brand: "کمانگری" }),
  accessory("shaker", "shaker", "شیکر استیل سه‌تکه", "شیکر و گرایندر", "استیل", 980_000, "استیل آینه‌ای با صافی و درپوش پیمانه‌ای.", [["حجم", "۷۵۰ میلی‌لیتر"]], { off: 18 }),
  accessory("grinder", "grinder", "گرایندر توتون چهارتکه", "شیکر و گرایندر", "آلومینیوم", 620_000, "تیغه‌های لوزی با درِ مگنتی.", [["قطر", "۵۰ میلی‌متر"]]),
  accessory("grinder-rainbow", "grinder-rainbow", "گرایندر توتون رنگین‌کمانی", "شیکر و گرایندر", "فلز", 740_000, "بدنه‌ی زینک با پوشش PVD.", [["قطر", "۶۳ میلی‌متر"]]),
  accessory("cutter", "cutter", "کاتر سیگاربرگ دوتیغه", "لوازم سیگاربرگ", "استیل", 450_000, "دو تیغه‌ی استیل با برش یکنواخت.", [["دهانه", "۲۲ میلی‌متر"]]),
  accessory("humidor", "humidor", "هیومیدور چوب گردو", "لوازم سیگاربرگ", "چوب", 9_700_000, "آستر سدر با رطوبت‌سنج و قفل برنجی.", [["ظرفیت", "۵۰ سیگاربرگ"]], { stock: 4 }),

  toton("toton-virginia", "toton-virginia", "توتون ویرجینیا", "توتون دست‌پیچ", "نواری ریز", 180_000, "برگ روشن ویرجینیا با قند طبیعی."),
  toton("toton-burley", "toton-burley", "توتون برلی", "توتون پیپ", "روبانی", 210_000, "برلی هواخشک با طعم خشک و آجیلی.", { off: 12 }),
  toton("toton-cavendish", "toton-cavendish", "توتون کاوندیش سیاه", "توتون پیپ", "روبانی", 260_000, "تخمیرشده زیر فشار و بخار."),
  toton("toton-oriental", "toton-oriental", "توتون اورینتال", "توتون دست‌پیچ", "نواری ریز", 230_000, "برگ ریز آفتاب‌خشک منطقه‌ی اژه."),
  toton("toton-mixture", "toton-cut", "توتون پیپ مخلوط انگلیسی", "توتون پیپ", "درهم", 290_000, "ترکیب ویرجینیا، اورینتال و لاتاکیا."),
  toton("toton-coins", "toton-coin", "توتون پیپ سکه‌ای", "توتون پیپ", "سکه‌ای", 380_000, "طناب فشرده که عرضی بریده شده است."),
  toton("toton-flake", "toton-flake", "توتون پیپ فلیک", "توتون پیپ", "ورقه‌ای", 340_000, "ورقه‌های پرس‌شده در قوطی فلزی.", { off: 10 }),
  toton("toton-shag", "toton-shag", "توتون دست‌پیچ بالی‌شگ", "توتون دست‌پیچ", "شگ", 270_000, "برش بسیار ریز هلندی، بسته‌ی پلمب.", { brand: "بالی‌شگ" }),
];

const CATEGORY_COPY: Record<CategorySlug, { text: string; features: string[] }> = {
  hookah: {
    text: "هر قلیان پیش از ارسال سرهم و نشت‌گیری می‌شود و جدا از هم، با فوم و جعبه‌ی دوجداره بسته‌بندی می‌شود. شست‌وشوی قطعات با آب ولرم پیش از نخستین استفاده توصیه می‌شود.",
    features: ["آزمون نشتی پیش از ارسال", "قطعات یدکی موجود", "بیمه‌ی شکستگی در حمل", "قابل بازشدن و شست‌وشو"],
  },
  tobacco: {
    text: "بسته فقط به‌صورت پلمب تحویل می‌شود. وزن درج‌شده وزن خالص است و تاریخ تولید روی هر بسته قرار دارد.",
    features: ["بسته‌ی پلمب", "وزن خالص", "تاریخ تولید روی بسته", "نگهداری در انبار خنک"],
  },
  "hookah-accessories": {
    text: "اندازه‌ها با قلیان‌های استاندارد سازگار است. برای اطمینان از سازگاری دهانه و اتصالات، پیش از خرید تصویر قلیان را برای پشتیبانی ارسال کنید.",
    features: ["سازگار با اندازه‌ی استاندارد", "کنترل کیفیت تک‌تک قطعات", "بسته‌بندی ضدضربه", "مشاوره‌ی سازگاری"],
  },
  cigarette: {
    text: "طبق قانون، فروش نخی انجام نمی‌شود و هر پاکت با هشدار سلامت و برچسب رهگیری عرضه می‌شود. تصویر ممکن است با سری وارداتی موجود تفاوت داشته باشد.",
    features: ["پاکت پلمب", "برچسب رهگیری", "بدون فروش نخی", "مخصوص بالای ۱۸ سال"],
  },
  lighter: {
    text: "فندک و سوخت فقط با حمل زمینی ارسال می‌شود. عملکرد جرقه و درِ فندک پیش از بسته‌بندی بررسی شده است.",
    features: ["ضمانت اصالت", "آزمون جرقه پیش از ارسال", "قابل شارژ و سرویس", "بسته‌بندی مناسب هدیه"],
  },
  "smoking-accessories": {
    text: "رنگ و رگه‌ی محصولات طبیعی و دست‌ساز ممکن است کمی با تصویر تفاوت داشته باشد. مهلت بازگشت کالای سالم و استفاده‌نشده هفت روز است.",
    features: ["بررسی سلامت پیش از ارسال", "هفت روز مهلت بازگشت", "بسته‌بندی ضدضربه", "امکان سفارش عمده"],
  },
  "rolling-tobacco": {
    text: "توتون در بسته‌ی پلمب و با رطوبت کنترل‌شده ارسال می‌شود. پس از باز شدن، نگهداری در ظرف دربسته توصیه می‌شود.",
    features: ["رطوبت کنترل‌شده", "بسته‌ی پلمب", "وزن خالص", "تاریخ بسته‌بندی روی محصول"],
  },
};

const round = (value: number) => Math.round(value / 1000) * 1000;

function toOptions(seed: Seed): ProductOption[] {
  const rows: [string, number][] = typeof seed.price === "number" ? [["استاندارد", seed.price]] : seed.price;
  return rows.map(([label, price], index) => ({
    id: String(index),
    label,
    price: round(seed.off ? price * (1 - seed.off / 100) : price),
    was: seed.off ? round(price) : undefined,
  }));
}

export const products: Product[] = seeds.map((seed, i) => {
  const copy = CATEGORY_COPY[seed.category];
  const options = toOptions(seed);
  return {
    id: 1001 + i,
    slug: seed.slug,
    name: seed.name,
    category: seed.category,
    type: seed.type,
    brand: seed.brand,
    images: manifest[seed.image] ?? [],
    optionLabel: seed.optionLabel,
    options,
    stock: seed.stock ?? 8 + ((i * 17) % 70),
    sold: BEST_SELLERS.includes(seed.slug) ? 1500 + rankBoost(BEST_SELLERS, seed.slug) * 63 : 40 + ((i * 271) % 1400),
    added: NEW_ARRIVALS.includes(seed.slug) ? seeds.length + rankBoost(NEW_ARRIVALS, seed.slug) : (i * 43) % seeds.length,
    rating: 3.9 + ((i * 7) % 12) / 10,
    flash: seed.flash ?? false,
    bulk: options[0].price < 500_000 ? { min: 10, percent: 7 } : { min: 5, percent: 8 },
    flavor: seed.flavor,
    material: seed.material,
    summary: seed.note,
    description: [seed.note, copy.text],
    features: copy.features,
    specs: [["دسته‌بندی", categoryBySlug[seed.category].name], ["نوع", seed.type], ["برند", seed.brand], ...seed.specs],
  };
});

export const productBySlug = new Map(products.map((p) => [p.slug, p]));
export const productById = new Map(products.map((p) => [p.id, p]));
