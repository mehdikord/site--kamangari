import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultView } from "@/components/checkout/result-view";
import { Loading } from "@/components/shared/loading";

export const metadata: Metadata = { title: "نتیجه‌ی پرداخت" };

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultView />
    </Suspense>
  );
}
