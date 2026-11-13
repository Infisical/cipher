import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
declare function RadioGroup({ className, value, defaultValue, onValueChange, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>): React.JSX.Element;
declare namespace RadioGroup {
    var displayName: string;
}
declare function RadioGroupItem({ className, label, description, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
}): React.JSX.Element;
declare namespace RadioGroupItem {
    var displayName: string;
}
declare function RadioGroupCard({ className, title, description, media, ref, ...props }: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "title" | "children" | "asChild"> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    /** An icon or logo inline before the title, sized to the title's line height and hidden from assistive technology; anything it means belongs in title. */
    media?: React.ReactNode;
}): React.JSX.Element;
declare namespace RadioGroupCard {
    var displayName: string;
}
export { RadioGroup, RadioGroupCard, RadioGroupItem };
