import type { Metadata } from "next";
import { HealthWarning } from "@/components/shared/health-warning";
import { PageHead } from "@/components/shared/page-head";
import { terms } from "@/data/content";
import { fa } from "@/lib/format";

export const metadata: Metadata = { title: "قوانین و مقررات" };

export default function TermsPage() {
  return (
    <>
      <PageHead title="قوانین و مقررات" description="پیش‌نویس نمایشی، پیش از انتشار نیازمند تأیید حقوقی." />
      <div className="shell grid gap-x-8 gap-y-5 py-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-7">
        <nav aria-label="فهرست قوانین" className="self-start lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
          <ol>
            {terms.map((section, i) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="block py-1.5 text-xs hover:text-brand">{fa(i + 1)}. {section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-3xl space-y-5">
          <HealthWarning />
          {terms.map((section, i) => (
            <section key={section.id} id={section.id}>
              <h2 className="heading text-sm lg:text-base">{fa(i + 1)}. {section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-1 text-[0.8125rem] leading-7 text-muted-foreground">{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
