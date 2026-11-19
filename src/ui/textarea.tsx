import * as React from "react";

import { useFieldControlAttributes } from "../lib/field-context";
import { useFittingPlaceholder } from "../lib/fitting-placeholder";
import { cn } from "../lib/utils";

import controlStyles from "./controls.module.css";

function Textarea({
  className,
  mono = false,
  rows,
  maxRows,
  style,
  placeholder,
  placeholderShort,
  ref,
  ...props
}: React.ComponentProps<"textarea"> & {
  mono?: boolean;
  /** A shorter placeholder used when the full one doesn't fit the field on one line. */
  placeholderShort?: string;
  /** The field grows with its content up to this many lines, then scrolls. */
  maxRows?: number;
}) {
  const fieldAttributes = useFieldControlAttributes(props);
  const inner = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLTextAreaElement);
  const shownPlaceholder = useFittingPlaceholder(
    inner,
    placeholder,
    placeholderShort,
    { truncate: true },
  );
  return (
    <textarea
      ref={inner}
      data-slot="textarea"
      placeholder={shownPlaceholder}
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
              ...(maxRows === undefined
                ? {}
                : { "--cipher-textarea-max-rows": maxRows }),
            } as React.CSSProperties)
      }
      className={cn(
        controlStyles.field,
        controlStyles.textarea,
        "flex w-full",
        className,
      )}
      {...props}
      {...fieldAttributes}
    />
  );
}
Textarea.displayName = "Textarea";

export { Textarea };
