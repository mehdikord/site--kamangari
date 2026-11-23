import type { Metadata } from "next";
import { PageHead } from "@/components/shared/page-head";
import credits from "@/data/image-credits.json";

export const metadata: Metadata = { title: "منابع تصاویر" };

export default function CreditsPage() {
  return (
    <>
      <PageHead title="منابع تصاویر" description="عکس‌ها از ویکی‌انبار و با مجوز آزاد هستند." />
      <div className="shell py-5">
        <p className="max-w-3xl text-xs leading-6">
          پس‌زمینه‌ی بعضی عکس‌ها حذف و اندازه و برش آن‌ها تغییر کرده است. نسخه‌ی ویرایش‌شده‌ی عکس‌های CC BY-SA با همان مجوز منتشر می‌شود. سایر تصاویر، رندرهای سه‌بعدی ساخته‌شده برای همین پروژه‌اند. نام و نشان برندها متعلق به صاحبان آن‌هاست.
        </p>
        <ul dir="ltr" lang="en" className="mt-6 text-left text-xs">
          {credits.map((item) => (
            <li key={item.file} className="border-b py-2 break-words">
              <a href={item.page} target="_blank" rel="noreferrer" className="font-semibold text-brand underline">{item.title}</a>
              {" by "}
              {item.artist || "unknown author"}
              {", "}
              {item.license_url ? (
                <a href={item.license_url} target="_blank" rel="noreferrer" className="underline">{item.license}</a>
              ) : (
                item.license
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
