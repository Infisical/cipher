import * as React from "react";
import { type ExternalToast, toast as sonnerToast, type ToasterProps } from "sonner";
export declare const TOASTER_ID = "cipher";
type Message = Parameters<typeof sonnerToast>[0];
export declare const toast: ((message: Message, data?: ExternalToast) => string | number) & {
    success: (message: Message, data?: ExternalToast) => string | number;
    error: (message: Message, data?: ExternalToast) => string | number;
    info: (message: Message, data?: ExternalToast) => string | number;
    warning: (message: Message, data?: ExternalToast) => string | number;
    loading: (message: Message, data?: ExternalToast) => string | number;
    message: (message: Message, data?: ExternalToast) => string | number;
    promise: <T>(promise: Parameters<typeof sonnerToast.promise<T>>[0], data?: Parameters<typeof sonnerToast.promise<T>>[1]) => {
        unwrap: () => Promise<T>;
    } | (string & {
        unwrap: () => Promise<T>;
    }) | (number & {
        unwrap: () => Promise<T>;
    });
    custom: (jsx: Parameters<typeof sonnerToast.custom>[0], data?: ExternalToast) => string | number;
    dismiss: (id?: number | string) => string | number | undefined;
};
declare const Toaster: ({ ...props }: ToasterProps) => React.JSX.Element | null;
export { Toaster };
export { type ToastItem, ToastStack } from "./toast-stack";
