import { cn } from "cn";
import { site } from "@/config/site";

export function HealthWarning({ className }: { className?: string }) {
  return (
    <div role="note" className={cn("border-[3px] border-black bg-white px-3 py-2 text-xs leading-6 text-black", className)}>
      <strong className="block font-extrabold">هشدار سلامت</strong>
      {site.healthWarning} {site.quitLine}
    </div>
  );
}
