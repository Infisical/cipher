import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@infisical/cipher/ui/accordion";
import { Badge } from "@infisical/cipher/ui/badge";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Accordion type="single" collapsible defaultValue="saml">
            <AccordionItem value="saml">
              <AccordionTrigger>
                SAML single sign-on
                <Badge tone="ok" size="sm">
                  Enabled
                </Badge>
              </AccordionTrigger>
              <AccordionContent>Members sign in through Okta.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="ldap">
              <AccordionTrigger>
                LDAP
                <Badge tone="soft" size="sm">
                  Not configured
                </Badge>
              </AccordionTrigger>
              <AccordionContent>Connect a directory to sync groups.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Text and a badge; hover underlines the text only"}
        </figcaption>
      </figure>
    </div>
  );
}
