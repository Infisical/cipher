import * as React from "react";

import { useDescendantFlags } from "../lib/descendant-flags";
import { useFieldControlAttributes } from "../lib/field-context";
import { useFittingPlaceholder } from "../lib/fitting-placeholder";
import { useSlashShortcut } from "../lib/slash-shortcut";
import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";
import { Kbd } from "./kbd";
import { Tooltip, TooltipProvider } from "./tooltip";

import styles from "./controls.module.css";

const field = `.${styles.field}`;
/** The state a field box draws from its slotted control or nested field: focus, invalid, disabled and read-only. */
export const fieldBoxFlags = {
  "data-control-focus": `[data-field-control]:focus-visible, ${field}:is(:focus-visible, [aria-expanded="true"])`,
  "data-control-invalid": `:is([data-field-control], ${field})[aria-invalid="true"]`,
  "data-control-input-focus": "[data-field-control]:focus-visible",
  "data-control-invalid-focus": `[data-field-control][aria-invalid="true"]:focus-visible, ${field}[aria-invalid="true"]:is(:focus-visible, [aria-expanded="true"])`,
  "data-control-disabled": '[data-field-control]:is(:disabled, [aria-disabled="true"])',
  "data-control-readonly": '[data-field-control][readonly]:not([aria-disabled="true"])'
};
export const fieldBoxWatch = {
  attributes: ["aria-invalid", "aria-expanded", "aria-disabled", "disabled", "readonly"],
  focus: true
};

export type FieldWidth = "xs" | "sm" | "md";

export type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "width"> & {
  size?: number | "xs" | "sm" | "md" | "lg";
  /** A fixed token width that doesn't shrink: xs for short numbers, sm for dates, md for short names. Unset fills the row. */
  width?: FieldWidth;
  icon?: IconSource;
  mono?: boolean;
  invalid?: boolean;
  kbd?: string;
  trailing?: React.ReactNode;
  /** "/" focuses this field from anywhere on the page, for a page's main search. No hint is drawn. */
  slashShortcut?: boolean;
  /** Shown as the placeholder. While the field is empty, Tab or the Tab key cap fills it in, such as a generated name. */
  suggestedValue?: string;
  /** Blocks editing and says why: the field looks disabled but stays focusable and selectable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. It replaces readOnly's lock. */
  disabledReason?: string;
  /** A shorter placeholder used when the full one doesn't fit the field on one line. */
  placeholderShort?: string;
};
export function Input({
  className,
  type,
  size = "sm",
  icon,
  mono = false,
  invalid,
  kbd,
  trailing,
  width,
  slashShortcut = false,
  suggestedValue,
  disabledReason,
  placeholder,
  placeholderShort,
  onKeyDown,
  onClick,
  ref,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const field = useFieldControlAttributes(props);
  const inner = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  const shownPlaceholder = useFittingPlaceholder(inner, placeholder, placeholderShort);
  useSlashShortcut(inner, {
    enabled: slashShortcut,
    onTrigger: () => {
      inner.current?.focus();
      inner.current?.select();
    }
  });
  const hintId = React.useId();
  const reasonId = React.useId();
  const reason = disabledReason || undefined;
  const suggesting = Boolean(suggestedValue) && !props.readOnly && !props.disabled && !reason;
  const accept = () => {
    const element = inner.current;
    if (!element || !suggestedValue || element.value) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
      element,
      suggestedValue
    );
    element.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const fieldSize = typeof size === "number" ? "sm" : size;
  const leading = icon ?? (props.readOnly && !reason ? "lock" : undefined);
  const trailed = Boolean(kbd || trailing || suggesting);
  const boxed = Boolean(leading || kbd || trailing || suggestedValue);
  const boxRef = useDescendantFlags<HTMLSpanElement>(fieldBoxFlags, fieldBoxWatch);
  const input = (
    <input
      ref={inner}
      type={type}
      data-slot="input"
      data-size={fieldSize}
      data-field-control={boxed ? "" : undefined}
      data-width={boxed ? undefined : width}
      size={typeof size === "number" ? size : undefined}
      aria-keyshortcuts={slashShortcut ? "/" : undefined}
      className={cn(
        boxed ? styles.bare : [styles.field, "w-full min-w-0"],
        mono && styles.mono,
        className
      )}
      placeholder={suggestedValue || shownPlaceholder}
      {...props}
      {...field}
      disabled={reason ? undefined : props.disabled}
      readOnly={reason ? true : props.readOnly}
      aria-disabled={reason ? true : props["aria-disabled"]}
      aria-invalid={invalid || field["aria-invalid"] || undefined}
      aria-describedby={
        [field["aria-describedby"], suggesting && hintId, reason && reasonId]
          .filter(Boolean)
          .join(" ") || undefined
      }
      onClick={(event) => {
        onClick?.(event);
        if (reason) event.preventDefault();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          !suggesting ||
          event.currentTarget.value ||
          event.defaultPrevented ||
          event.key !== "Tab" ||
          event.shiftKey
        )
          return;
        event.preventDefault();
        accept();
      }}
    />
  );
  const control = boxed ? (
    <span
      ref={boxRef}
      className={cn(styles.field, styles.fieldBox)}
      data-size={fieldSize}
      data-field-box=""
      data-width={width}
      data-trailing={trailed || undefined}
      onPointerDown={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        inner.current?.focus();
      }}
    >
      {leading && (
        <span className={styles.leading}>
          <Icon icon={leading} />
        </span>
      )}
      {input}
      {(trailed || suggestedValue) && (
        <span className={styles.trailing}>
          {kbd && <Kbd>{kbd}</Kbd>}
          {suggesting && (
            <button
              type="button"
              tabIndex={-1}
              className={styles.suggestion}
              aria-label={`Use suggested value ${suggestedValue}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                accept();
                inner.current?.focus();
              }}
            >
              <Kbd>Tab</Kbd>
            </button>
          )}
          {trailing}
        </span>
      )}
      {suggesting && (
        <span id={hintId} className="sr-only">
          When the field is empty, press Tab to use the suggested value.
        </span>
      )}
    </span>
  ) : (
    input
  );
  return (
    <>
      {/* The tooltip always renders, closed and blank without a reason, so adding or removing one keeps the same input and its typed value. Its own provider keeps that from requiring one around every Input. */}
      <TooltipProvider>
        <Tooltip content={reason || " "} open={reason ? undefined : false} defaultOpen={false}>
          {control}
        </Tooltip>
      </TooltipProvider>
      {reason && (
        <span id={reasonId} className="sr-only">
          {reason}
        </span>
      )}
    </>
  );
}
Input.displayName = "Input";
