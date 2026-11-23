import { Mark } from "@/components/brand/logo";

export function Loading({ label = "در حال بارگذاری" }: { label?: string }) {
  return (
    <div role="status" className="grid min-h-[55svh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Mark className="size-10 animate-pulse" />
        {label}
      </div>
    </div>
  );
}
