import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceView } from "@/components/checkout/invoice-view";
import { Steps } from "@/components/checkout/steps";
import { Loading } from "@/components/shared/loading";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "فاکتور سفارش" };

export default function InvoicePage() {
  return (
    <>
      <PageHead title="فاکتور و جزییات پرداخت" className="no-print">
        <Steps current={2} />
      </PageHead>
      <Suspense fallback={<Loading />}>
        <InvoiceView />
      </Suspense>
    </>
  );
}
