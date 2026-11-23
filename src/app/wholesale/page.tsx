import type { Metadata } from "next";
import { FileText, Percent, Truck } from "lucide-react";
import { PageHead } from "@/components/shared/page-head";
import { RequestForm } from "@/components/shared/request-form";

export const metadata: Metadata = { title: "خرید عمده" };

const TIERS = [
  ["کالای زیر ۵۰۰ هزار تومان", "از ۱۰ عدد", "۷٪"],
  ["کالای ۵۰۰ هزار تومان به بالا", "از ۵ عدد", "۸٪"],
  ["قرارداد ماهانه", "با هماهنگی", "لیست اختصاصی"],
];

const BENEFITS = [
  [Percent, "تخفیف خودکار", "به‌صورت خودکار در سبد خرید محاسبه می‌شود."],
  [FileText, "فاکتور رسمی", "با شناسه‌ی ملی یا کد اقتصادی شما."],
  [Truck, "ارسال با باربری", "کارتنی و پالتی به سراسر کشور."],
] as const;

export default function WholesalePage() {
  return (
    <>
      <PageHead title="خرید عمده" description="ویژه‌ی فروشگاه‌ها و توزیع‌کنندگان دارای پروانه‌ی فروش." />
      <div className="shell grid gap-6 py-5 lg:grid-cols-2 lg:gap-8 lg:py-7">
        <div>
          <h2 className="heading title-section">تعرفه‌ی تخفیف عمده</h2>
          <table className="mt-3 w-full overflow-hidden rounded-xl text-xs">
            <thead className="bg-mist">
              <tr>
                {["گروه", "حداقل", "تخفیف"].map((label) => (
                  <th key={label} scope="col" className="p-3 text-start">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIERS.map(([group, min, off]) => (
                <tr key={group} className="border-b">
                  <td className="p-3">{group}</td>
                  <td className="p-3">{min}</td>
                  <td className="p-3 font-bold text-brand">{off}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map(([Icon, title, text]) => (
              <li key={title} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist text-brand"><Icon className="size-4.5" /></span>
                <span>
                  <span className="heading block text-[0.8125rem]">{title}</span>
                  <span className="text-xs text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <RequestForm title="درخواست لیست قیمت" subjectLabel="نوع کسب‌وکار" subjects={["فروشگاه دخانیات", "سوپرمارکت", "کافه و قهوه‌خانه", "پخش و بنکداری", "سایر"]} action="ثبت درخواست" placeholder="شهر، کالاهای موردنیاز و حجم تقریبی ماهانه" />
      </div>
    </>
  );
}
