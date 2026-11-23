"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { demo } from "@/config/site";
import { digitsOnly, faPlain, faText, normalizeMobile } from "@/lib/format";
import { useReady, useShop } from "@/lib/store";

const CODE_LENGTH = demo.otp.length;

// only same-site paths: "//host" and friends must not pass
const safeNext = (value: string | null) => (value && /^\/[a-z][a-z0-9/-]*$/i.test(value) ? value : "/account");

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const ready = useReady();
  const user = useShop((s) => s.user);
  const login = useShop((s) => s.login);

  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [deadline, setDeadline] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!deadline) return;
    const id = window.setInterval(() => setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 500);
    return () => window.clearInterval(id);
  }, [deadline]);

  function send(number: string) {
    setMobile(number);
    setCode("");
    setError("");
    setLeft(demo.otpSeconds);
    setDeadline(Date.now() + demo.otpSeconds * 1000);
    toast.success("کد تأیید ارسال شد", { description: `پیامک نمایشی: کد شما ${faText(demo.otp)} است.` });
  }

  function verify(value: string) {
    if (!mobile) return;
    if (value.length < CODE_LENGTH) return setError("لطفاً کد پنج‌رقمی را کامل وارد کنید.");
    if (!left) return setError("اعتبار کد به پایان رسیده است. لطفاً کد جدید دریافت کنید.");
    if (value !== demo.otp) {
      setCode("");
      return setError("کد واردشده صحیح نیست. لطفاً دوباره تلاش کنید.");
    }
    login(mobile);
    toast.success("با موفقیت وارد شدید");
    router.replace(next);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (mobile) return verify(code);
    const number = normalizeMobile(phone);
    if (number) send(number);
    else setError("شماره‌ی موبایل باید ۱۱ رقم باشد و با ۰۹ آغاز شود.");
  }

  if (ready && user) {
    return (
      <div>
        <h1 className="heading text-lg">شما وارد حساب خود شده‌اید</h1>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">با شماره‌ی <span dir="ltr">{faText(user.mobile)}</span></p>
        <Button asChild size="lg" className="mt-6 w-full"><Link href={next}>ادامه</Link></Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={mobile ? "code" : "phone"} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.2 }}>
          {mobile ? (
            <>
              <h1 className="heading text-lg">کد تأیید را وارد کنید</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                کد به <span dir="ltr" className="font-bold text-foreground">{faText(mobile)}</span> ارسال شد.
                <button
                  type="button"
                  className="inline-flex items-center gap-1 py-1 text-brand underline"
                  onClick={() => {
                    setMobile(null);
                    setError("");
                  }}
                >
                  <Pencil className="size-3.5" />
                  تغییر شماره
                </button>
              </p>
              <div dir="ltr" className="my-4 flex justify-center">
                <InputOTP
                  maxLength={CODE_LENGTH}
                  value={code}
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="^[0-9۰-۹٠-٩]+$"
                  pasteTransformer={digitsOnly}
                  aria-label="کد تأیید"
                  onChange={(value) => {
                    const clean = digitsOnly(value);
                    setCode(clean);
                    setError("");
                    if (clean.length === CODE_LENGTH) verify(clean);
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: CODE_LENGTH }, (_, i) => (
                      <InputOTPSlot key={i} index={i} className="size-11 rounded-lg border sm:size-12" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </>
          ) : (
            <>
              <h1 className="heading text-lg">ورود یا ثبت‌نام</h1>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">شماره‌ی موبایل خود را وارد کنید. برای کاربران جدید، حساب کاربری به‌صورت خودکار ایجاد می‌شود.</p>
              <label htmlFor="login-phone" className="mt-5 mb-1.5 block text-xs font-semibold">شماره‌ی موبایل</label>
              <div dir="ltr" className="relative">
                <Smartphone className="pointer-events-none absolute top-4 left-3.5 size-4 text-muted-foreground" />
                <Input
                  id="login-phone"
                  value={phone}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={18}
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  aria-invalid={!!error}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  className="h-12 pl-11 tracking-wider"
                />
              </div>
            </>
          )}

          <p role="alert" className="min-h-7 py-1 text-xs text-danger">{error}</p>
          <Button type="submit" size="lg" variant="brand" className="w-full">{mobile ? "تأیید و ورود" : "ارسال کد تأیید"}</Button>

          {mobile ? (
            <div className="mt-3 text-center text-xs text-muted-foreground">
              {left > 0 ? (
                <p>ارسال دوباره تا <span dir="ltr">{faPlain(Math.floor(left / 60))}:{faPlain(left % 60).padStart(2, "۰")}</span></p>
              ) : (
                <Button type="button" variant="link" onClick={() => send(mobile)}>ارسال دوباره‌ی کد</Button>
              )}
              <p className="mt-2 rounded bg-muted p-2 text-xs">کد آزمایشی: {faText(demo.otp)}</p>
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              با ورود، <Link href="/terms" className="underline">قوانین و مقررات</Link> را می‌پذیرید و تأیید می‌کنید بیش از ۱۸ سال سن دارید.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
