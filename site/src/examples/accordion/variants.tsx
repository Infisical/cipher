import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@infisical/cipher/ui/accordion";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Accordion type="single" defaultValue="versions">
            <AccordionItem value="versions">
              <AccordionTrigger>Version retention</AccordionTrigger>
              <AccordionContent>Versions remain available for 30 days.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="policy">
              <AccordionTrigger>Access policy</AccordionTrigger>
              <AccordionContent>Read access expires after one hour.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Single, noncollapsible"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Accordion type="multiple" defaultValue={["versions", "policy"]}>
            {["versions", "policy"].map((value) => (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger>
                  {value === "versions" ? "Version retention" : "Access policy"}
                </AccordionTrigger>
                <AccordionContent>
                  {value === "versions"
                    ? "Versions remain available for 30 days."
                    : "Read access expires after one hour."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Multiple, both open"}</figcaption>
      </figure>
    </div>
  );
}
