import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/data/content";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="gap-2">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="rounded-xl bg-mist px-4 not-last:border-b-0">
          <AccordionTrigger className="py-3.5 text-sm font-semibold hover:no-underline">{item.q}</AccordionTrigger>
          <AccordionContent className="pb-3.5 text-[0.8125rem] leading-7 text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
