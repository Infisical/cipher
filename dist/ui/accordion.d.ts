import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
declare function Accordion({ className, ref, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>): React.JSX.Element;
declare namespace Accordion {
    var displayName: string;
}
declare function AccordionItem({ className, ref, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>): React.JSX.Element;
declare namespace AccordionItem {
    var displayName: string;
}
declare function AccordionTrigger({ className, children, ref, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>): React.JSX.Element;
declare namespace AccordionTrigger {
    var displayName: string;
}
declare function AccordionContent({ className, children, ref, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>): React.JSX.Element;
declare namespace AccordionContent {
    var displayName: string;
}
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
