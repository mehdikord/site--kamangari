import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/login-form";
import { Mark } from "@/components/brand/logo";
import { Loading } from "@/components/shared/loading";

export const metadata: Metadata = { title: "ورود یا ثبت‌نام" };

export default function LoginPage() {
  return (
    <div className="shell pt-3">
      <div className="grid place-items-center rounded-3xl bg-mist px-3 py-12 lg:min-h-[34rem]">
        <div className="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-7">
          <Mark className="mb-4 size-10" />
          <Suspense fallback={<Loading />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
