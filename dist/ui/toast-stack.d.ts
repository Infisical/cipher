import * as React from "react";
import { type IconName } from "./icon";
export type ToastItem = {
    id: string;
    title: string;
    description?: string;
    tone?: "neutral" | "ok" | "bad" | "loading";
    icon?: IconName;
    action?: {
        label: string;
        onClick: () => void;
    };
    duration?: number;
};
export declare const ToastStack: ({ items, onDismiss, inline, className }: {
    items: readonly ToastItem[];
    onDismiss?: (id: string) => void;
    inline?: boolean;
    className?: string;
}) => React.JSX.Element;
