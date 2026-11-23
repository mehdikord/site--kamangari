import { Truck } from "lucide-react";
import { toman } from "@/lib/format";
import { FREE_SHIPPING_FROM } from "@/lib/pricing";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  return (
    <div>
      <p className="flex items-center gap-2 text-xs">
        <Truck className="size-4 shrink-0 text-success" aria-hidden="true" />
        {left ? `${toman(left)} تا ارسال رایگان با پست` : "ارسال این سفارش با پست رایگان است"}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full origin-right rounded-full bg-success transition-transform duration-500" style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_SHIPPING_FROM)})` }} />
      </div>
    </div>
  );
}
