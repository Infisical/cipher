import * as React from "react";

import { readBootTheme } from "../lib/boot-theme";
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
};

/** The page loader for app and session boot, themed from storage so it renders before CipherScope. */
export function BootLoader({
  label,
  description,
  theme,
  fill = "viewport",
  delay,
  className,
  ref,
  ...props
}: BootLoaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  const resolved = toTheme(theme) ?? readBootTheme();
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
