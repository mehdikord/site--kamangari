"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { EmptyState } from "@/components/shared/empty-state";
import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { provinces } from "@/data/content";
import { digitsOnly, fa, faText, normalizeMobile, toman } from "@/lib/format";
import { getTotals, SHIPPING } from "@/lib/pricing";
import { useCart, useReady, useShop, type Customer } from "@/lib/store";
import { CouponField } from "./coupon-field";
import { SummaryRows } from "./summary";

const EMPTY: Customer = { firstName: "", lastName: "", mobile: "", province: "", city: "", address: "", postalCode: "", note: "" };

type Errors = Partial<Record<keyof Customer | "shipping" | "consent", string>>;

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">{label}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const { lines } = useCart();
  const user = useShop((s) => s.user);
  const saved = useShop((s) => s.customer);
  const coupon = useShop((s) => s.coupon);
  const placeOrder = useShop((s) => s.placeOrder);

  const [form, setForm] = useState<Customer>(() => {
    const initial = { ...EMPTY, ...saved, note: "" };
    return { ...initial, mobile: faText(initial.mobile || user?.mobile || ""), postalCode: faText(initial.postalCode) };
  });
  const [chosen, setChosen] = useState("post");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const method = SHIPPING.find((m) => m.id === chosen && (!m.tehranOnly || form.province === "تهران")) ?? SHIPPING[0];
  const totals = getTotals(lines, coupon, method);

  if (!lines.length && !submitting) return <EmptyState title="کالایی برای پرداخت وجود ندارد" text="لطفاً ابتدا کالاهای موردنظر را به سبد خرید اضافه کنید." />;

  const bind = (key: keyof Customer) => ({
    id: key,
    name: key,
    value: form[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
    },
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Errors = {};
    const mobile = normalizeMobile(form.mobile);
    const postalCode = digitsOnly(form.postalCode);
    if (form.firstName.trim().length < 2) found.firstName = "لطفاً نام را وارد کنید.";
    if (form.lastName.trim().length < 2) found.lastName = "نام خانوادگی را وارد کنید.";
    if (!mobile) found.mobile = "شماره‌ی موبایل باید ۱۱ رقم باشد و با ۰۹ آغاز شود.";
    if (!form.province) found.province = "استان را انتخاب کنید.";
    if (form.city.trim().length < 2) found.city = "شهر را وارد کنید.";
    if (form.address.trim().length < 10) found.address = "لطفاً نشانی را همراه با خیابان و پلاک وارد کنید.";
    if (postalCode.length !== 10) found.postalCode = "کد پستی باید ۱۰ رقم باشد.";
    if (!consent) found.consent = "تأیید سن و پذیرش قوانین الزامی است.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first || !mobile) {
      const field = document.getElementById(first);
      field?.focus({ preventScroll: true });
      field?.scrollIntoView({ block: "center" });
      return;
    }

    setSubmitting(true);
    const now = Date.now();
    const id = `KM-${String(now).slice(-8)}`;
    const { coupon: applied, ...amounts } = totals;
    placeOrder({
      id,
      createdAt: now,
      status: "pending",
      customer: { ...form, mobile, postalCode },
      shippingName: method.name,
      items: lines.map((line) => ({
        id: line.id,
        option: line.option,
        qty: line.qty,
        slug: line.product.slug,
        name: line.product.name,
        image: line.product.images[0],
        optionLabel: line.product.options.length > 1 ? line.selected.label : "",
        unit: line.selected.price,
        total: line.total,
      })),
      totals: { ...amounts, couponCode: applied?.code ?? null },
    });
    router.push(`/invoice?id=${id}`);
  }

  return (
    <form onSubmit={submit} noValidate className="shell grid gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8 lg:py-7">
      <div className="min-w-0 space-y-6">
        {!user && (
          <p className="rounded-xl bg-mist px-3.5 py-2.5 text-xs">
            حساب کاربری دارید؟ <Link href="/login?next=/checkout" className="font-bold text-brand underline">وارد شوید</Link>. ادامه‌ی خرید بدون ورود نیز امکان‌پذیر است.
          </p>
        )}

        <section>
          <h2 className="heading mb-3 text-sm lg:text-base">مشخصات گیرنده</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="firstName" label="نام" error={errors.firstName}><Input {...bind("firstName")} autoComplete="given-name" /></Field>
            <Field id="lastName" label="نام خانوادگی" error={errors.lastName}><Input {...bind("lastName")} autoComplete="family-name" /></Field>
            <Field id="mobile" label="شماره‌ی موبایل" error={errors.mobile} className="sm:col-span-2">
              <Input {...bind("mobile")} dir="ltr" type="tel" inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="heading mb-3 text-sm lg:text-base">نشانی تحویل</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="province" label="استان" error={errors.province}>
              <select {...bind("province")} autoComplete="address-level1" className="h-11 w-full rounded-lg border border-input bg-white px-3 text-base aria-invalid:border-danger sm:text-sm">
                <option value="">انتخاب استان</option>
                {provinces.map((province) => (
                  <option key={province}>{province}</option>
                ))}
              </select>
            </Field>
            <Field id="city" label="شهر" error={errors.city}><Input {...bind("city")} autoComplete="address-level2" /></Field>
            <Field id="address" label="نشانی کامل" error={errors.address} className="sm:col-span-2">
              <Textarea {...bind("address")} autoComplete="street-address" rows={3} placeholder="خیابان، کوچه، پلاک، واحد" className="min-h-20 bg-white text-base sm:text-sm" />
            </Field>
            <Field id="postalCode" label="کد پستی" error={errors.postalCode}>
              <Input {...bind("postalCode")} dir="ltr" inputMode="numeric" autoComplete="postal-code" maxLength={14} />
            </Field>
            <Field id="note" label="توضیح سفارش (اختیاری)"><Input {...bind("note")} maxLength={300} /></Field>
          </div>
        </section>

        <section>
          <h2 id="shipping-title" className="heading mb-3 text-sm lg:text-base">روش ارسال</h2>
          <RadioGroup value={method.id} onValueChange={setChosen} aria-labelledby="shipping-title" className="grid gap-2.5">
            {SHIPPING.map((option) => {
              const disabled = !!option.tehranOnly && form.province !== "تهران";
              const cost = getTotals(lines, coupon, option).shipping;
              return (
                <label key={option.id} className={cn("flex items-center gap-3 rounded-xl border p-3 text-xs has-data-checked:border-carbon has-data-checked:bg-mist", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
                  <RadioGroupItem value={option.id} disabled={disabled} />
                  <span className="flex-1">
                    <span className="block font-bold">{option.name}</span>
                    <span className="block text-xs text-muted-foreground">{disabled ? "فقط برای استان تهران" : option.eta}</span>
                  </span>
                  <span className="font-semibold">{cost ? toman(cost) : option.id === "freight" ? "پس‌کرایه" : "رایگان"}</span>
                </label>
              );
            })}
          </RadioGroup>
        </section>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-6">
            <Checkbox
              id="consent"
              checked={consent}
              aria-invalid={!!errors.consent}
              className="mt-1"
              onCheckedChange={(value) => {
                setConsent(value === true);
                setErrors((current) => ({ ...current, consent: undefined }));
              }}
            />
            <span>
              تأیید می‌کنم بیش از ۱۸ سال سن دارم، هنگام تحویل کارت شناسایی ارائه می‌کنم و{" "}
              <Link href="/terms" target="_blank" className="text-brand underline">قوانین و مقررات</Link> را می‌پذیرم.
            </span>
          </label>
          {errors.consent && <p role="alert" className="mt-1 text-xs text-danger">{errors.consent}</p>}
        </div>
      </div>

      <aside aria-label="لیست نهایی" className="self-start rounded-2xl border p-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <div className="flex items-baseline justify-between">
          <h2 className="heading text-sm">فهرست نهایی سفارش</h2>
          <Link href="/cart" className="text-xs text-brand underline">ویرایش سبد</Link>
        </div>
        <ul className="my-3 max-h-[30svh] overflow-y-auto">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center gap-3 border-b py-2 text-xs">
              <Image src={line.product.images[0]} alt="" width={56} height={56} className="size-12 shrink-0 object-contain" />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 font-semibold">{line.product.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {fa(line.qty)} عدد{line.product.options.length > 1 && `، ${line.selected.label}`}
                </span>
              </span>
              <span className="text-xs font-bold whitespace-nowrap">{toman(line.total)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-5">
          <CouponField />
          <SummaryRows totals={totals} shippingLabel={method.name} />
          <Button type="submit" size="lg" variant="brand" disabled={submitting} className="w-full">
            {submitting ? "در حال صدور فاکتور" : "صدور فاکتور"}
          </Button>
        </div>
      </aside>
    </form>
  );
}

export function CheckoutView() {
  // mount the form only once saved values are known, so they become its initial state
  return useReady() ? <CheckoutForm /> : <Loading />;
}
