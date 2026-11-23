import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { Steps } from "@/components/checkout/steps";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "تسویه حساب" };

export default function CheckoutPage() {
  return (
    <>
      <PageHead title="تسویه حساب" crumbs={[{ label: "سبد خرید", href: "/cart" }, { label: "تسویه حساب" }]}>
        <Steps current={1} />
      </PageHead>
      <CheckoutView />
    </>
  );
}
