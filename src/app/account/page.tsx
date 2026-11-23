import type { Metadata } from "next";
import { AccountView } from "@/components/account/account-view";
import { PageHead } from "@/components/shared/page-head";

export const metadata: Metadata = { title: "حساب کاربری" };

export default function AccountPage() {
  return (
    <>
      <PageHead title="حساب کاربری" />
      <AccountView />
    </>
  );
}
