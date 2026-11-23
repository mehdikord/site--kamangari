"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { Direction } from "radix-ui";
import { Toaster } from "@/components/ui/sonner";
import { STORAGE_KEY, useShop } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useShop.persist.rehydrate();
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) void useShop.persist.rehydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <Direction.Provider dir="rtl">
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster dir="rtl" position="top-center" offset={{ top: "calc(var(--header-h) + .75rem)" }} mobileOffset={{ top: "calc(var(--header-h) + .5rem)" }} style={{ fontFamily: "inherit" }} />
      </MotionConfig>
    </Direction.Provider>
  );
}
