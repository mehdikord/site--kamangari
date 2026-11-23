import { productById } from "@/data/catalog";
import type { Product, ProductOption } from "@/data/types";
import { toman } from "./format";

export interface CartLine {
  id: number;
  option: string;
  qty: number;
}

export interface PricedLine extends CartLine {
  key: string;
  product: Product;
  selected: ProductOption;
  bulkApplied: boolean;
  /** What the line costs after product and wholesale discounts. */
  total: number;
}

export interface Coupon {
  code: string;
  label: string;
  min: number;
  percent?: number;
  cap?: number;
  amount?: number;
  freeShipping?: boolean;
}

export const COUPONS: Coupon[] = [
  { code: "KAMAN10", label: "۱۰٪ تخفیف تا سقف ۵۰۰ هزار تومان", min: 500_000, percent: 10, cap: 500_000 },
  { code: "FIRST200", label: "۲۰۰ هزار تومان تخفیف", min: 2_000_000, amount: 200_000 },
  { code: "ERSAL", label: "ارسال رایگان", min: 1_000_000, freeShipping: true },
];

export const FREE_SHIPPING_FROM = 10_000_000;

export interface ShippingMethod {
  id: string;
  name: string;
  eta: string;
  cost: number;
  freeEligible: boolean;
  tehranOnly?: boolean;
}

export const SHIPPING: ShippingMethod[] = [
  { id: "post", name: "پست پیشتاز", eta: "۲ تا ۴ روز کاری", cost: 120_000, freeEligible: true },
  { id: "express", name: "تیپاکس", eta: "۱ تا ۲ روز کاری", cost: 220_000, freeEligible: false },
  { id: "courier", name: "پیک تهران", eta: "همان روز تا ساعت ۲۱", cost: 180_000, freeEligible: false, tehranOnly: true },
  { id: "freight", name: "باربری (سفارش عمده)", eta: "۲ تا ۵ روز، پرداخت کرایه در مقصد", cost: 0, freeEligible: false },
];

export function priceLines(cart: CartLine[]): PricedLine[] {
  return cart.flatMap((line) => {
    const product = productById.get(line.id);
    const selected = product?.options.find((o) => o.id === line.option);
    if (!product || !selected) return [];
    const bulkApplied = line.qty >= product.bulk.min;
    const gross = selected.price * line.qty;
    const total = bulkApplied ? Math.round((gross * (1 - product.bulk.percent / 100)) / 1000) * 1000 : gross;
    return [{ ...line, key: `${line.id}:${line.option}`, product, selected, bulkApplied, total }];
  });
}

export function findCoupon(input: string | null) {
  const code = input?.trim().toUpperCase();
  return code ? COUPONS.find((c) => c.code === code) : undefined;
}

export function couponError(input: string, subtotal: number) {
  if (!input.trim()) return "لطفاً کد تخفیف را وارد کنید.";
  const coupon = findCoupon(input);
  if (!coupon) return "کد تخفیف واردشده معتبر نیست.";
  if (subtotal < coupon.min) return `حداقل خرید برای استفاده از این کد ${toman(coupon.min)} است.`;
  return null;
}

export function getTotals(lines: PricedLine[], couponCode: string | null, method?: ShippingMethod) {
  let count = 0;
  let list = 0;
  let selling = 0;
  let subtotal = 0;
  for (const line of lines) {
    count += line.qty;
    list += (line.selected.was ?? line.selected.price) * line.qty;
    selling += line.selected.price * line.qty;
    subtotal += line.total;
  }

  const found = findCoupon(couponCode);
  const coupon = found && subtotal >= found.min ? found : undefined;
  let couponSaving = 0;
  if (coupon?.percent) couponSaving = Math.min(Math.round((subtotal * coupon.percent) / 100_000) * 1000, coupon.cap ?? Infinity);
  else if (coupon?.amount) couponSaving = Math.min(coupon.amount, subtotal);

  let shipping = method?.cost ?? 0;
  if (method && (coupon?.freeShipping || (method.freeEligible && subtotal >= FREE_SHIPPING_FROM))) shipping = 0;

  return {
    count,
    list,
    productSaving: list - selling,
    bulkSaving: selling - subtotal,
    subtotal,
    coupon,
    couponSaving,
    shipping,
    saving: list - subtotal + couponSaving,
    total: subtotal - couponSaving + shipping,
  };
}

export type Totals = ReturnType<typeof getTotals>;
