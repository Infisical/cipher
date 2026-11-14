import * as React from "react";
import { type IconName } from "./icon";
declare function Alert({ className, variant, tone, title, actions, onDismiss, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    variant?: "default" | "destructive" | null;
    tone?: "neutral" | "info" | "ok" | "warn" | "bad";
    title?: string;
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
    icon?: IconName;
    children: React.ReactNode;
    action?: React.ReactNode;
    onDismiss?: () => void;
    className?: string;
}) => React.JSX.Element;
