import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@infisical/cipher/ui/accordion";
import { Button } from "@infisical/cipher/ui/button";
import { Stack } from "@infisical/cipher/ui/layout";

const versions = [
  "Version 6, edited by maya@acme.test",
  "Version 5, edited by ci-deployer",
  "Version 4, edited by maya@acme.test",
  "Version 3, edited by jordan.lee@acme.test",
  "Version 2, edited by ci-deployer",
  "Version 1, created by jordan.lee@acme.test"
];

export default function Example() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? versions : versions.slice(0, 2);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Accordion type="single" collapsible defaultValue="history">
          <AccordionItem value="history">
            <AccordionTrigger>Version history</AccordionTrigger>
            <AccordionContent>
              <Stack gap={8} align="start">
                {shown.map((version) => (
                  <span key={version}>{version}</span>
                ))}
                <Button variant="link" onClick={() => setExpanded((current) => !current)}>
                  {expanded ? "Show fewer" : `Show all ${versions.length} versions`}
                </Button>
              </Stack>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {expanded ? "All six versions, grown after opening" : "Two of six versions"}
      </figcaption>
    </figure>
  );
}
