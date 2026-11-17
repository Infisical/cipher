import * as React from "react";

import { useFieldControlAttributes } from "../lib/field-context";
import { cn } from "../lib/utils";

import controlStyles from "./controls.module.css";

function Textarea({
  className,
  mono = false,
  rows,
  maxRows,
  style,
  ref,
  ...props
}: React.ComponentProps<"textarea"> & {
  mono?: boolean;
  /** The field grows with its content up to this many lines, then scrolls. */
  maxRows?: number;
}) {
  const fieldAttributes = useFieldControlAttributes(props);
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      data-size="sm"
      data-mono={mono || undefined}
      data-rows={rows === undefined ? undefined : ""}
      data-max-rows={maxRows === undefined ? undefined : ""}
      rows={rows}
      style={
        rows === undefined && maxRows === undefined
          ? style
          : ({
              ...style,
              ...(rows === undefined ? {} : { "--cipher-textarea-rows": rows }),
              ...(maxRows === undefined ? {} : { "--cipher-textarea-max-rows": maxRows })
            } as React.CSSProperties)
      }
      className={cn(controlStyles.field, controlStyles.textarea, "flex w-full", className)}
      {...props}
      {...fieldAttributes}
    />
  );
}
Textarea.displayName = "Textarea";

export { Textarea };
