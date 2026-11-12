import * as React from "react";
import { type CipherLinkProps } from "../lib/link";
declare function Card({ className, size, variant: requestedVariant, title, description, action, footer, footerPlacement, flush, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    size?: "default" | "sm";
    variant?: "framed" | "plain";
    title?: React.ReactNode;
    description?: string;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    footerPlacement?: "inset" | "frame";
    flush?: boolean;
} & {
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
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };
