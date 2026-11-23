const number = new Intl.NumberFormat("fa-IR");
const plain = new Intl.NumberFormat("fa-IR", { useGrouping: false });
const decimal = new Intl.NumberFormat("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const fa = (value: number) => number.format(value);
export const faPlain = (value: number) => plain.format(value);
export const faRating = (value: number) => decimal.format(value);
export const toman = (value: number) => `${number.format(value)} تومان`;
export const faText = (value: string) => value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/** Persian and Arabic digits to ASCII. */
export const latinDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

export const digitsOnly = (value: string) => latinDigits(value).replace(/\D/g, "");

/** Accepts ۰۹۱۲…, +98912…, 0098912…, 912…; returns 09123456789 or null. */
export function normalizeMobile(value: string) {
  let digits = digitsOnly(value);
  if (digits.startsWith("0098")) digits = digits.slice(4);
  else if (digits.startsWith("98") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("9") && digits.length === 10) digits = `0${digits}`;
  return /^09\d{9}$/.test(digits) ? digits : null;
}

/** Folds the spellings people actually type so search is forgiving. */
export const normalizeSearch = (value: string) =>
  latinDigits(value)
    .toLowerCase()
    .replace(/ي|ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ً-ٟ]/g, "")
    .replace(/[‌\s-]+/g, " ")
    .trim();

export function faDate(timestamp: number) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(timestamp);
}
