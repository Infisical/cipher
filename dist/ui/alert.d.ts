import * as React from "react";
import { type IconSource } from "./icon";
declare function Alert({ className, variant, tone, title, badges, actions, onDismiss, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    variant?: "default" | "destructive" | null;
    tone?: "neutral" | "info" | "ok" | "warn" | "bad";
    /** Without a title the children are the message, still with the tone icon and actions. Children composed from AlertTitle, AlertDescription and an icon render as given. */
    title?: React.ReactNode;
    /** Right after the title: status badges, and a DocumentationLink so it stays paired with the title. They drop below the title before it wraps. Without a title they sit at the end of the message's first line, the place for its DocumentationLink. */
    badges?: React.ReactNode;
    actions?: React.ReactNode;
    onDismiss?: () => void;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Alert {
    var displayName: string;
}
declare function AlertTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertTitle {
    var displayName: string;
}
declare function AlertDescription({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertDescription {
    var displayName: string;
}
declare function AlertAction({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertAction {
    var displayName: string;
}
export { Alert, AlertAction, AlertDescription, AlertTitle };
export declare const Banner: ({ icon, children, action, onDismiss, className }: {
    icon?: IconSource;
    children: React.ReactNode;
    action?: React.ReactNode;
    onDismiss?: () => void;
    className?: string;
}) => React.JSX.Element;
