import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { overlayCollisionPadding, useCollisionBoundary, usePortalContainer } from "../scope";

import { useFieldControlAttributes } from "../lib/field-context";
import { ListHighlight } from "../lib/list-highlight";
import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";
import type { FieldWidth } from "./input";
import { useMenuInset } from "./menu-inset";
import { Tooltip, TooltipProvider } from "./tooltip";

import controlStyles from "./controls.module.css";
import menu from "./menu.module.css";
import picker from "./picker.module.css";

const SelectSettingsContext = React.createContext<{
  wrap: boolean;
  descriptionLayout: "inline" | "stacked";
}>({ wrap: false, descriptionLayout: "inline" });

function titleIfTruncated(element: HTMLElement | null | undefined) {
  if (!element) return;
  const text = element.querySelector<HTMLElement>('[data-slot="option-text"]') ?? element;
  if (text.scrollWidth > text.clientWidth || element.scrollWidth > element.clientWidth)
    element.title = text.textContent ?? "";
  else element.removeAttribute("title");
}

const SelectNameContext = React.createContext<{
  "aria-label"?: string;
  "aria-labelledby"?: string;
}>({});

const SelectRootContext = React.createContext<{ open: boolean; disabledReason?: string }>({
  open: false
});

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  group?: string;
  /** A Badge after the label, in the menu row and in the trigger while this option is selected, such as "Current". */
  badge?: React.ReactNode;
  /** A logo or image before the label, sized like an icon, in the menu row and in the trigger while this option is selected. It never shrinks; the label truncates first. */
  media?: React.ReactNode;
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
  descriptionLayout = "inline",
  disabledReason,
  disabled,
  open: openProp,
  defaultOpen,
  onOpenChange,
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
  /** inline puts an option's description after its label on one line; stacked puts it on the lines below, wrapping in full, for descriptions longer than a few words such as what a role allows. */
  descriptionLayout?: "inline" | "stacked";
  /** Blocks choosing and says why: the trigger looks disabled but stays focusable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. */
  disabledReason?: string;
  onChange?: (value: string) => void;
  id?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const groups = [...new Set(options?.map((option) => option.group ?? ""))];
  const [localOpen, setLocalOpen] = React.useState(defaultOpen ?? false);
  const reason = disabledReason || undefined;
  if (reason && localOpen) setLocalOpen(false);
  const open = !reason && (openProp ?? localOpen);
  return (
    <SelectPrimitive.Root
      data-slot="select"
      open={open}
      onOpenChange={(next) => {
        setLocalOpen(next);
        onOpenChange?.(next);
      }}
      onValueChange={(value) => {
        if (reason) return;
        onValueChange?.(value);
        onChange?.(value);
      }}
      disabled={reason ? undefined : disabled}
      {...props}
    >
      <SelectRootContext value={{ open, disabledReason: reason }}>
        <SelectSettingsContext value={{ wrap: wrap ?? false, descriptionLayout }}>
          {options ? (
            <>
              <SelectTrigger
                id={id}
                size={size ?? "default"}
                icon={icon}
                width={width}
                disabledReason={disabledReason}
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
                          badge={option.badge}
                          media={option.media}
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
        </SelectSettingsContext>
      </SelectRootContext>
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
  disabledReason,
  children,
  onPointerEnter,
  onFocus,
  onPointerDown,
  onClick,
  onKeyDown,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "md" | "lg";
  icon?: IconSource;
  /** A fixed token width that doesn't shrink. Unset fills the row. */
  width?: FieldWidth;
  /** Blocks choosing and says why: the trigger looks disabled but stays focusable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. */
  disabledReason?: string;
} & { ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>> }) {
  const name = React.useContext(SelectNameContext);
  const fieldAttributes = useFieldControlAttributes({
    ...props,
    "aria-labelledby": props["aria-labelledby"] ?? name["aria-labelledby"]
  });
  const reasonId = React.useId();
  const root = React.useContext(SelectRootContext);
  const reason = (disabledReason ?? root.disabledReason) || undefined;
  const [tipOpen, setTipOpen] = React.useState(false);
  if (!reason && tipOpen) setTipOpen(false);
  const trigger = (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      data-state={root.open ? "open" : "closed"}
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
      disabled={reason ? undefined : props.disabled}
      aria-disabled={reason ? true : props["aria-disabled"]}
      aria-describedby={
        [fieldAttributes["aria-describedby"], reason && reasonId].filter(Boolean).join(" ") ||
        undefined
      }
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (reason) event.preventDefault();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (reason) event.preventDefault();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        const typeahead =
          event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
        if (reason && (typeahead || ["Enter", "ArrowUp", "ArrowDown"].includes(event.key)))
          event.preventDefault();
      }}
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
  return (
    <>
      {/* The tooltip always renders, closed and blank without a reason, so adding or removing one keeps the same trigger and its focus. */}
      <TooltipProvider>
        <Tooltip
          content={reason || " "}
          open={Boolean(reason) && tipOpen}
          onOpenChange={setTipOpen}
        >
          {trigger}
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
SelectTrigger.displayName = "SelectTrigger";

function SelectContent({
  className,
  collisionPadding = overlayCollisionPadding,
  children,
  align = "start",
  sideOffset = 4,
  style,
  wrap,
  descriptionLayout,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position"> & {
  /** Wrap long option labels instead of truncating them. Defaults to the Select's `wrap`; items can override it. */
  wrap?: boolean;
  /** Where option descriptions go: after the label on one line, or stacked below it and wrapping in full. Defaults to the Select's descriptionLayout. */
  descriptionLayout?: "inline" | "stacked";
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Content>>;
}) {
  const inset = useMenuInset<HTMLDivElement>();
  const inherited = React.useContext(SelectSettingsContext);
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
          <SelectSettingsContext
            value={{
              wrap: wrap ?? inherited.wrap,
              descriptionLayout: descriptionLayout ?? inherited.descriptionLayout
            }}
          >
            {children}
          </SelectSettingsContext>
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
  badge,
  media,
  wrap,
  onFocus,
  "aria-describedby": describedBy,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  description?: string;
  /** A Badge after the label, shown in the menu row and in the trigger while this item is selected. The label truncates before the badge does. */
  badge?: React.ReactNode;
  /** A logo or image before the label, sized like an icon, shown in the menu row and in the trigger while this item is selected. */
  media?: React.ReactNode;
  /** Wrap this label instead of truncating it. Defaults to the content's `wrap`. */
  wrap?: boolean;
} & {
  ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Item>>;
}) {
  const descriptionId = React.useId();
  const label = React.useRef<HTMLSpanElement>(null);
  const inherited = React.useContext(SelectSettingsContext);
  const wrapped = wrap ?? inherited.wrap;
  const stacked = inherited.descriptionLayout === "stacked" && Boolean(description);
  React.useLayoutEffect(() => {
    const node = label.current;
    if (node?.title && node.title !== node.textContent) titleIfTruncated(node);
  });
  const labelText = (
    <span
      ref={label}
      className={picker.optionLabel}
      onPointerEnter={(event) => titleIfTruncated(event.currentTarget)}
    >
      <SelectPrimitive.ItemText>
        {badge === undefined && !media ? (
          children
        ) : (
          <>
            {Boolean(media) && (
              <span data-slot="option-media" className={cn(picker.optionMedia, "cipher-lead-line")}>
                {media}
              </span>
            )}
            <span data-slot="option-text">{children}</span>
            {badge}
          </>
        )}
      </SelectPrimitive.ItemText>
    </span>
  );
  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      aria-describedby={
        [describedBy, description ? descriptionId : undefined].filter(Boolean).join(" ") ||
        undefined
      }
      data-wrap={wrapped || undefined}
      data-description={stacked ? "stacked" : undefined}
      className={cn(menu.row, picker.option, className)}
      onFocus={(event) => {
        onFocus?.(event);
        titleIfTruncated(label.current);
      }}
      {...props}
    >
      {stacked ? (
        <span className={menu.text}>
          {labelText}
          <span id={descriptionId} className={cn(menu.description, picker.optionDescription)}>
            {description}
          </span>
        </span>
      ) : (
        <>
          {labelText}
          {description && (
            <span id={descriptionId} className={picker.optionMeta}>
              {description}
            </span>
          )}
        </>
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
