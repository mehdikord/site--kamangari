import Image from "next/image";
import Link from "next/link";
import { Boxes, FileText, Percent, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STACK = ["moassel-doosib", "coal-hobbeh", "toton-oriental"];
const POINTS = [
  [Percent, "تخفیف پلکانی"],
  [FileText, "فاکتور رسمی"],
  [Truck, "ارسال با باربری"],
] as const;

export function WholesaleBand() {
  return (
    <section className="shell pt-9 lg:pt-12">
      <div className="grid items-center overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#131c40,#27409a)] text-white sm:grid-cols-2">
        <div className="p-5 lg:p-9">
          <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-white/10 text-flare">
            <Boxes className="size-5" aria-hidden="true" />
          </span>
          <h2 className="heading title-section">فروش عمده و سازمانی</h2>
          <p className="mt-1 max-w-sm text-xs leading-6 text-white/85 lg:text-[0.8125rem]">ارائه‌ی لیست قیمت همکاری برای فروشگاه‌ها و کسب‌وکارهای دارای پروانه‌ی فروش.</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {POINTS.map(([Icon, label]) => (
              <li key={label} className="flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs">
                <Icon className="size-3.5 text-flare" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="brand">
              <Link href="/wholesale">درخواست لیست قیمت</Link>
            </Button>
            <Button asChild variant="ghostDark">
              <Link href="/contact">تماس با واحد فروش</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-end justify-center px-4 max-sm:-mt-3">
          {STACK.map((key, i) => (
            <Image key={key} src={`/images/catalog/${key}-0.webp`} alt="" width={240} height={240} className={i === 1 ? "aspect-square w-2/5 max-w-56 object-contain" : "aspect-square w-[30%] max-w-44 object-contain"} />
          ))}
        </div>
      </div>
    </section>
  );
}
