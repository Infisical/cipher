import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Button } from "./button";
declare function InputGroup({ className, size, invalid, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    size?: "xs" | "sm" | "md" | "lg";
    invalid?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace InputGroup {
    var displayName: string;
}
declare const inputGroupAddonVariants: (props?: ({
    align?: "block-end" | "block-start" | "inline-end" | "inline-start" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function InputGroupAddon({ className, align, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof inputGroupAddonVariants> & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace InputGroupAddon {
    var displayName: string;
}
declare function InputGroupButton({ className, type, variant, size, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof Button>, "size"> & {
    size?: "xs" | "sm" | "icon-xs" | "icon-sm" | null;
} & {
    ref?: React.Ref<React.ComponentRef<typeof Button>>;
}): React.JSX.Element;
declare namespace InputGroupButton {
    var displayName: string;
}
declare function InputGroupText({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace InputGroupText {
    var displayName: string;
}
declare function InputGroupInput({ className, ref, ...props }: React.ComponentProps<"input">): React.JSX.Element;
declare namespace InputGroupInput {
    var displayName: string;
}
declare function InputGroupTextarea({ className, ref, ...props }: React.ComponentProps<"textarea">): React.JSX.Element;
declare namespace InputGroupTextarea {
    var displayName: string;
}
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea };
