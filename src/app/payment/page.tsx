import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentView } from "@/components/checkout/payment-view";
import { Steps } from "@/components/checkout/steps";
import { Loading } from "@/components/shared/loading";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "پرداخت آنلاین" };

export default function PaymentPage() {
  return (
    <>
      <PageHead title="پرداخت آنلاین">
        <Steps current={3} />
      </PageHead>
      <Suspense fallback={<Loading />}>
        <PaymentView />
      </Suspense>
    </>
  );
}
