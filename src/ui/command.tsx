import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { Icon } from "./icon";

import { ListHighlight } from "../lib/list-highlight";
import { cn } from "../lib/utils";
import { menuShortcutContent } from "./menu-content";
import { useMenuInset } from "./menu-inset";
import { ScrollBar } from "./scroll-area";

import controlStyles from "./controls.module.css";
import menu from "./menu.module.css";
import overlay from "./overlay.module.css";

function Command({ className, ref, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      ref={ref}
      data-slot="command"
      className={cn("flex size-full flex-col overflow-hidden text-foreground", className)}
      {...props}
    />
  );
}
Command.displayName = "Command";

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  stableHeight = false,
  onEscapeKeyDown,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  /**
   * Holds the palette at size-palette-height while results change, so typing never makes it jump
   * and the no results state centres in the same space. Use it for a palette a person reopens to
   * scan results; a short list of fixed commands can fit its content. Render CommandEmpty beside
   * CommandList, as CommandMenu does, so it can fill the body.
   */
  stableHeight?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}) {
  const opener = React.useRef<Element | null>(null);
  React.useLayoutEffect(() => {
    if (props.open) opener.current = document.activeElement;
  }, [props.open]);
  return (
    <Dialog {...props}>
      <DialogContent
        data-command-dialog=""
        data-stable-height={stableHeight || undefined}
        className={cn(overlay.palette, className)}
        showCloseButton={showCloseButton}
        onEscapeKeyDown={onEscapeKeyDown}
        onCloseAutoFocus={(event) => {
          const target = opener.current;
          if (!(target instanceof HTMLElement) || !target.isConnected) return;
          event.preventDefault();
          target.focus();
        }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  trailing,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
  trailing?: React.ReactNode;
} & { ref?: React.Ref<React.ComponentRef<typeof CommandPrimitive.Input>> }) {
  return (
    <div data-slot="command-input-wrapper" className={controlStyles.searchRow}>
      <Icon name="search" />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={className}
        {...props}
      />
      {trailing && (
        <span data-slot="command-input-trailing" className={controlStyles.searchTrailing}>
          {trailing}
        </span>
      )}
    </div>
  );
}
CommandInput.displayName = "CommandInput";

function CommandList({
  className,
  children,
  ref,
  style,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const { maxHeight, ...listStyle } = style ?? {};
  const insetRef = useMenuInset(ref);
  return (
    <ScrollAreaPrimitive.Root
      data-slot="command-scroll"
      className={menu.scroll}
      style={maxHeight === undefined ? undefined : { maxHeight }}
    >
      <ScrollAreaPrimitive.Viewport data-scroll-fade="y" className={menu.viewport}>
        <CommandPrimitive.List
          ref={insetRef}
          data-slot="command-list"
          className={cn(menu.inset, className)}
          style={style ? listStyle : undefined}
          {...props}
        >
          {children}
          <ListHighlight />
        </CommandPrimitive.List>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
    </ScrollAreaPrimitive.Root>
  );
}
CommandList.displayName = "CommandList";

function CommandEmpty({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      data-slot="command-empty"
      className={cn(menu.empty, className)}
      {...props}
    />
  );
}
CommandEmpty.displayName = "CommandEmpty";

function CommandGroup({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      data-slot="command-group"
      className={cn(menu.group, className)}
      {...props}
    />
  );
}
CommandGroup.displayName = "CommandGroup";

function CommandSeparator({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      data-slot="command-separator"
      className={cn(menu.separator, className)}
      {...props}
    />
  );
}
CommandSeparator.displayName = "CommandSeparator";

function CommandItem({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & { "data-checked"?: boolean } & {
  ref?: React.Ref<React.ComponentRef<typeof CommandPrimitive.Item>>;
}) {
  const checkable = props["data-checked"] !== undefined;
  return (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="command-item"
      className={cn(menu.row, className)}
      {...props}
    >
      {checkable ? (
        <>
          <span className={menu.indicator} data-command="">
            <Icon name="check" />
          </span>
          {children}
        </>
      ) : (
        children
      )}
    </CommandPrimitive.Item>
  );
}
CommandItem.displayName = "CommandItem";

function CommandShortcut({ className, children, ref, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      ref={ref}
      data-slot="command-shortcut"
      className={cn(menu.shortcut, className)}
      {...props}
    >
      {menuShortcutContent(children)}
    </span>
  );
}
CommandShortcut.displayName = "CommandShortcut";

/** Pinned under CommandList as its sibling, such as a footer action or a hint. Its keys stay out of the list, so its controls are reached with Tab. */
function CommandFooter({
  className,
  children,
  onKeyDown,
  ref,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="command-footer"
      className={cn(menu.inset, menu.actionFooter, className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        event.stopPropagation();
      }}
      {...props}
    >
      {children}
      <ListHighlight />
    </div>
  );
}
CommandFooter.displayName = "CommandFooter";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
};
