import * as React from "react";
import { type ThemeStorageKeys } from "../lib/boot-theme";
export type BootLoaderProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    label: string;
    description?: string;
    theme?: string;
    fill?: "viewport" | "container";
    delay?: number;
    /** Storage keys to read the theme from. Defaults to Cipher's own keys. */
    storageKeys?: ThemeStorageKeys;
    /** Honors a ?theme= or session preview. Defaults to true. */
    allowPreview?: boolean;
};
/** The page loader for app and session boot, themed from storage so it renders before CipherScope. */
export declare function BootLoader({ label, description, theme, fill, delay, storageKeys, allowPreview, className, ref, ...props }: BootLoaderProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace BootLoader {
    var displayName: string;
}
