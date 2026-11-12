import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@infisical/cipher/ui/accordion";

export default function Example() {
  const [open, setOpen] = useState("versions");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Accordion type="single" value={open} onValueChange={setOpen} collapsible>
        {["versions", "policy"].map((value) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>
              {value === "versions" ? "Version retention" : "Access policy"}
            </AccordionTrigger>
            <AccordionContent>Managed by project settings.</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p role="status" className="sr-only">
        {open ? `Open section: ${open}` : "All sections closed"}
      </p>
    </div>
  );
}
