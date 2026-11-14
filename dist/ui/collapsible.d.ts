import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
declare function Collapsible({ ref, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>): React.JSX.Element;
declare namespace Collapsible {
    var displayName: string;
}
declare function CollapsibleTrigger({ ref, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): React.JSX.Element;
declare namespace CollapsibleTrigger {
    var displayName: string;
}
declare function CollapsibleContent({ ref, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): React.JSX.Element;
declare namespace CollapsibleContent {
    var displayName: string;
}
export { Collapsible, CollapsibleContent, CollapsibleTrigger };
