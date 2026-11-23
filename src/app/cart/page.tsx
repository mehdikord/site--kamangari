import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Steps } from "@/components/checkout/steps";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "سبد خرید" };

export default function CartPage() {
  return (
    <>
      <PageHead title="سبد خرید">
        <Steps current={0} />
      </PageHead>
      <CartView />
    </>
  );
}
