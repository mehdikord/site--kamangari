import { Star } from "lucide-react";
import { cn } from "cn";
import { faRating } from "@/lib/format";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span role="img" aria-label={`امتیاز ${faRating(value)} از ۵`} className={cn("inline-flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden="true" className={cn("size-4", n <= Math.round(value) ? "fill-star text-star" : "text-input")} />
      ))}
    </span>
  );
}
