import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { useCollisionBoundary, usePortalContainer } from "../scope";

import { useFieldControlAttributes } from "../lib/field-context";
import { ListHighlight } from "../lib/list-highlight";
import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";
import type { FieldWidth } from "./input";
import { useMenuInset } from "./menu-inset";

import controlStyles from "./controls.module.css";
import menu from "./menu.module.css";
import picker from "./picker.module.css";

const SelectWrapContext = React.createContext(false);

function titleIfTruncated(element: HTMLElement | null | undefined) {
  if (!element) return;
  if (element.scrollWidth > element.clientWidth) element.title = element.textContent ?? "";
  else element.removeAttribute("title");
}

const SelectNameContext = React.createContext<{
  "aria-label"?: string;
  "aria-labelledby"?: string;
}>({});

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
};
function Select({
  options,
  label,
  placeholder = "Choose an option",
  size,
  width,
  invalid,
  align = "start",
  menuWidth,
  icon,
  wrap,
  onChange,
  onValueChange,
  children,
  id,
  "aria-describedby": describedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  options?: readonly SelectOption[];
  label?: string;
  placeholder?: string;
  size?: "sm" | "default" | "md" | "lg";
  /** A fixed token width for the trigger that doesn't shrink. Unset fills the row. */
  width?: FieldWidth;
  invalid?: boolean;
  align?: "start" | "center" | "end";
  menuWidth?: React.CSSProperties["width"];
  /** A glyph at the trigger's start, such as the kind of value it picks. */
  icon?: IconSource;
  /** Wrap long option labels in the list instead of truncating them. The trigger stays on one line. */
  wrap?: boolean;
  onChange?: (value: string) => void;
  id?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const groups = [...new Set(options?.map((option) => option.group ?? ""))];
  return (
    <SelectPrimitive.Root
      data-slot="select"
      onValueChange={(value) => {
        onValueChange?.(value);
        onChange?.(value);
      }}
      {...props}
    >
      <SelectWrapContext value={wrap ?? false}>
        {options ? (
          <>
            <SelectTrigger
              id={id}
              size={size ?? "default"}
              icon={icon}
              width={width}
              aria-label={ariaLabel ?? label}
              aria-labelledby={labelledBy}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
              align={align}
              style={
                menuWidth
                  ? { width: menuWidth, maxWidth: "var(--radix-select-content-available-width)" }
                  : undefined
              }
            >
              {groups.map((group) => (
                <SelectGroup key={group}>
                  {group && <SelectLabel>{group}</SelectLabel>}
                  {options
                    .filter((option) => (option.group ?? "") === group)
                    .map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                      >
                        <span data-slot="select-option-label">{option.label}</span>
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </>
        ) : (
          <SelectNameContext value={{ "aria-label": ariaLabel, "aria-labelledby": labelledBy }}>
            {children}
          </SelectNameContext>
        )}
      </SelectWrapContext>
    </SelectPrimitive.Root>
  );
}

function SelectGroup({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group ref={ref} data-slot="select-group" className={className} {...props} />
  );
}
SelectGroup.displayName = "SelectGroup";

function SelectValue({ ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value ref={ref} data-slot="select-value" {...props} />;
}
SelectValue.displayName = "SelectValue";

function SelectTrigger({
  className,
  size = "default",
  icon,
  width,
  children,
  onPointerEnter,
  onFocus,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "md" | "lg";
  icon?: IconSource;
  /** A fixed token width that doesn't shrink. Unset fills the row. */
  width?: FieldWidth;
} & { ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>> }) {
  const name = React.useContext(SelectNameContext);
  const fieldAttributes = useFieldControlAttributes({
    ...props,
    "aria-labelledby": props["aria-labelledby"] ?? name["aria-labelledby"]
  });
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-size={size}
      data-width={width}
      className={cn(
        controlStyles.field,
        controlStyles.trigger,
        controlStyles.triggerHover,
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        controlStyles.selectTrigger,
        className
      )}
      aria-label={name["aria-label"]}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        titleIfTruncated(
          event.currentTarget.querySelector<HTMLElement>('[data-slot="select-value"]')
        );
      }}
      onFocus={(event) => {
        onFocus?.(event);
        titleIfTruncated(
          event.currentTarget.querySelector<HTMLElement>('[data-slot="select-value"]')
        );
      }}
      {...props}
      {...fieldAttributes}
    >
      {icon && (
        <span className={controlStyles.leading} data-slot="select-icon">
          <Icon icon={icon} />
        </span>
      )}
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon name="chev-down" className={controlStyles.chevron} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
SelectTrigger.displayName = "SelectTrigger";

function SelectContent({
  className,
  collisionPadding = 8,
  children,
  align = "start",
  sideOffset = 4,
  style,
  wrap,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position"> & {
  /** Wrap long option labels instead of truncating them. Defaults to the Select's `wrap`; items can override it. */
  wrap?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Content>>;
}) {
  const inset = useMenuInset<HTMLDivElement>();
  const inherited = React.useContext(SelectWrapContext);
  return (
    <SelectPrimitive.Portal container={usePortalContainer()}>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        collisionPadding={collisionPadding}
        collisionBoundary={useCollisionBoundary()}
        className={cn("relative z-50", menu.surface, menu.panel, menu.motion, className)}
        position="popper"
        align={align}
        sideOffset={sideOffset}
        style={{ width: "var(--radix-select-trigger-width)", ...style }}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport ref={inset} className={menu.inset} data-scroll-fade="y">
          <SelectWrapContext value={wrap ?? inherited}>{children}</SelectWrapContext>
          <ListHighlight />
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
SelectContent.displayName = "SelectContent";

function SelectLabel({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      data-slot="select-label"
      className={cn(menu.label, className)}
      {...props}
    />
  );
}
SelectLabel.displayName = "SelectLabel";

function SelectItem({
  className,
  children,
  description,
  wrap,
  onFocus,
  "aria-describedby": describedBy,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  description?: string;
  /** Wrap this label instead of truncating it. Defaults to the content's `wrap`. */
  wrap?: boolean;
} & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Item>>;
}) {
  const descriptionId = React.useId();
  const label = React.useRef<HTMLSpanElement>(null);
  const inherited = React.useContext(SelectWrapContext);
  const wrapped = wrap ?? inherited;
  React.useLayoutEffect(() => {
    const node = label.current;
    if (node?.title && node.title !== node.textContent) titleIfTruncated(node);
  });
  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      aria-describedby={
        [describedBy, description ? descriptionId : undefined].filter(Boolean).join(" ") ||
        undefined
      }
      data-wrap={wrapped || undefined}
      className={cn(menu.row, picker.option, className)}
      onFocus={(event) => {
        onFocus?.(event);
        titleIfTruncated(label.current);
      }}
      {...props}
    >
      <span
        ref={label}
        className={picker.optionLabel}
        onPointerEnter={(event) => titleIfTruncated(event.currentTarget)}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </span>
      {description && (
        <span id={descriptionId} className={picker.optionMeta}>
          {description}
        </span>
      )}
      <span className={picker.optionCheck}>
        <SelectPrimitive.ItemIndicator>
          <Icon name="check" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}
SelectItem.displayName = "SelectItem";

function SelectSeparator({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      data-slot="select-separator"
      className={cn(menu.separator, className)}
      {...props}
    />
  );
}
SelectSeparator.displayName = "SelectSeparator";

function SelectScrollUpButton({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <Icon name="chev-down" className="rotate-180" />
    </SelectPrimitive.ScrollUpButton>
  );
}
SelectScrollUpButton.displayName = "SelectScrollUpButton";

function SelectScrollDownButton({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <Icon name="chev-down" />
    </SelectPrimitive.ScrollDownButton>
  );
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};
