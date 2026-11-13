import * as React from "react";

import { readBootTheme, type ThemeStorageKeys } from "../lib/boot-theme";
import { toTheme, themeScheme } from "../lib/theme-registry";
import { cn } from "../lib/utils";
import { Loader } from "./loader";

import "../base.css";
import styles from "./boot-loader.module.css";

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
export function BootLoader({
  label,
  description,
  theme,
  fill = "viewport",
  delay,
  storageKeys,
  allowPreview,
  className,
  ref,
  ...props
}: BootLoaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  const resolved = toTheme(theme) ?? readBootTheme({ keys: storageKeys, allowPreview });
  return (
    <div
      ref={ref}
      data-slot="boot-loader"
      data-fill={fill}
      data-theme={resolved}
      data-scheme={themeScheme(resolved)}
      className={cn("cipher", styles.boot, className)}
      {...props}
    >
      <Loader size="page" label={label} description={description} delay={delay} />
    </div>
  );
}
BootLoader.displayName = "BootLoader";
