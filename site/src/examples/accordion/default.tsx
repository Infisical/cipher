import * as UI from "@infisical/cipher/ui/accordion";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Accordion type="single" collapsible>
        <UI.AccordionItem value="retention">
          <UI.AccordionTrigger>Retention policy</UI.AccordionTrigger>
          <UI.AccordionContent>Versions remain available for 30 days.</UI.AccordionContent>
        </UI.AccordionItem>
        <UI.AccordionItem value="locked" disabled>
          <UI.AccordionTrigger>Organization policy</UI.AccordionTrigger>
          <UI.AccordionContent>Managed by administrators.</UI.AccordionContent>
        </UI.AccordionItem>
      </UI.Accordion>
    </div>
  );
}
