import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackView } from "@/components/account/track-view";
import { Loading } from "@/components/shared/loading";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "پیگیری سفارش" };

export default function TrackPage() {
  return (
    <>
      <PageHead title="پیگیری سفارش" />
      <Suspense fallback={<Loading />}>
        <TrackView />
      </Suspense>
    </>
  );
}
