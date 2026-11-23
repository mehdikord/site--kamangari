import type { Metadata } from "next";
import { CompareView } from "@/components/account/compare-view";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "مقایسه‌ی محصولات" };

export default function ComparePage() {
  return (
    <>
      <PageHead title="مقایسه‌ی محصولات" description="مقایسه‌ی هم‌زمان مشخصات حداکثر چهار کالا." />
      <CompareView />
    </>
  );
}
