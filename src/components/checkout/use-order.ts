"use client";

import { useSearchParams } from "next/navigation";
import { useReady, useShop } from "@/lib/store";

export function useOrder() {
  const id = useSearchParams().get("id");
  const ready = useReady();
  const order = useShop((s) => s.orders.find((o) => o.id === id));
  return { ready, order };
}
