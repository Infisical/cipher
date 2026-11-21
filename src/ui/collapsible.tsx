"use client";

import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

import { cn } from "../lib/utils";

function Collapsible({ ref, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />;
}
Collapsible.displayName = "Collapsible";

function CollapsibleTrigger({
  ref,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger ref={ref} data-slot="collapsible-trigger" {...props} />
  );
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

function CollapsibleContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      data-slot="collapsible-content"
      className={cn(
        "overflow-clip duration-(--cipher-duration-moderate) ease-(--cipher-ease-spring) data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none!",
        className
      )}
      {...props}
    />
  );
}
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
