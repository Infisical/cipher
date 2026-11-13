import * as React from "react";
import { type CipherLinkProps } from "../lib/link";
declare function Card({ className, size, variant: requestedVariant, title, description, hint, action, footer, footerPlacement, flush, backdrop, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    size?: "default" | "sm";
    title?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    footerPlacement?: "inset" | "frame";
    flush?: boolean;
    /** Decoration such as a Halftone, painted under the surface that holds the title and the card link: the inset of a framed card with a frame footer, otherwise the card itself. That surface becomes the stacking context, so the link overlay and the controls above it stay in one layer. */
    backdrop?: React.ReactNode;
} & ({
    variant?: "plain";
    description?: string;
    hint?: never;
} | {
    variant: "framed";
    /** A frame holds a small contained table or list, so its head is a title and actions only. A section that needs a description belongs in a plain Card or a SettingsCard. */
    description?: never;
    /** One short plain-text sentence about the section. The title takes a dotted underline, becomes focusable and shows this in a tooltip on hover and keyboard focus. */
    hint?: string;
}) & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Card {
    var displayName: string;
}
declare function CardHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardHeader {
    var displayName: string;
}
declare function CardTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardTitle {
    var displayName: string;
}
declare function CardDescription({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardDescription {
    var displayName: string;
}
declare function CardAction({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardAction {
    var displayName: string;
}
declare function CardContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardContent {
    var displayName: string;
}
declare function CardFooter({ className, placement, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    placement?: "inset" | "frame";
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace CardFooter {
    var displayName: string;
}
declare function CardLink({ className, disabled, title, children, ref, ...props }: CipherLinkProps & {
    disabled?: boolean;
}): React.JSX.Element;
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle, };
