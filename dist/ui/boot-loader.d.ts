import * as React from "react";
export type BootLoaderProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    label: string;
    description?: string;
    theme?: string;
    fill?: "viewport" | "container";
    delay?: number;
};
/** The page loader for app and session boot, themed from storage so it renders before V4Scope. */
export declare function BootLoader({ label, description, theme, fill, delay, className, ref, ...props }: BootLoaderProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace BootLoader {
    var displayName: string;
}
