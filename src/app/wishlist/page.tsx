import type { Metadata } from "next";
import { WishlistView } from "@/components/account/wishlist-view";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها" };

export default function WishlistPage() {
  return (
    <>
      <PageHead title="علاقه‌مندی‌ها" />
      <WishlistView />
    </>
  );
}
