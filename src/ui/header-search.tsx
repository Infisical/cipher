"use client";

import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";
import { Tooltip } from "./tooltip";

import styles from "./header-search.module.css";

export type HeaderSearchIndicator = "chip" | "ink" | "dot";

export type HeaderSearchProps = {
  /** The applied query. With debounceMs it trails the text in the field. */
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name of the trigger and the field, such as "Search email domains". */
  label: string;
  placeholder?: string;
  /** 0 applies every keystroke, for rows filtered in memory. Above 0, a pause of that many milliseconds applies the query, for a server request. */
  debounceMs?: number;
  /** A request for the applied query is in flight. */
  pending?: boolean;
  /** Shown under the field and announced, such as a no-results message. */
  hint?: React.ReactNode;
  /** How the closed trigger shows an applied query. */
  indicator?: HeaderSearchIndicator;
  /** Where "/" opens the search: while focus is inside the enclosing Card, anywhere on the page, or never. */
  shortcut?: "card" | "page" | false;
  className?: string;
};

const editable = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

export function HeaderSearch({
  value,
  onValueChange,
  label,
  placeholder = "Search",
  debounceMs = 0,
  pending = false,
  hint,
  indicator = "chip",
  shortcut = "card",
  className
}: HeaderSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [synced, setSynced] = React.useState(value);
  if (value !== synced) {
    setSynced(value);
    setDraft(value);
  }
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const field = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  React.useEffect(() => {
    if (!shortcut) return undefined;
    const host = shortcut === "page" ? document : trigger.current?.closest('[data-slot="card"]');
    if (!host) return undefined;
    const onKeyDown = (event: Event) => {
      const key = event as KeyboardEvent;
      if (key.key !== "/" || key.metaKey || key.ctrlKey || key.altKey || key.defaultPrevented)
        return;
      const target = key.target instanceof HTMLElement ? key.target : null;
      if (target?.isContentEditable || target?.closest(editable)) return;
      const dialog = target?.closest('[role="dialog"], [role="alertdialog"]');
      if (dialog && !dialog.contains(trigger.current)) return;
      key.preventDefault();
      setOpen(true);
    };
    host.addEventListener("keydown", onKeyDown);
    return () => host.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  const apply = (next: string) => {
    clearTimeout(timer.current);
    if (next !== value) onValueChange(next);
  };
  const type = (next: string) => {
    setDraft(next);
    if (!debounceMs) {
      apply(next);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onValueChange(next), debounceMs);
  };
  const clear = () => {
    setDraft("");
    apply("");
  };

  const applied = value !== "";
  const busy = pending || draft !== value;
  const chip = indicator === "chip" && applied && !open;
  const name = applied ? `${label}: ${value}` : label;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) apply(draft);
        setOpen(next);
      }}
    >
      <PopoverAnchor asChild>
        <span
          data-slot="header-search"
          data-indicator={indicator}
          data-applied={(applied && !open) || undefined}
          className={cn(styles.root, className)}
        >
          <Tooltip content={label} shortcut={shortcut ? "/" : undefined}>
            <PopoverTrigger asChild>
              <Button
                ref={trigger}
                variant="bare"
                size={chip ? "xs" : "icon-xs"}
                icon="search"
                iconOnly={!chip}
                aria-label={name}
                className={styles.trigger}
                onKeyDown={(event) => {
                  if (event.key !== "Escape" || !applied) return;
                  event.preventDefault();
                  event.stopPropagation();
                  clear();
                }}
              >
                {chip ? <span className={styles.query}>{value}</span> : label}
              </Button>
            </PopoverTrigger>
          </Tooltip>
          {indicator === "dot" && applied && <span aria-hidden className={styles.dot} />}
          {chip && (
            <Button
              variant="bare"
              size="icon-xs"
              icon="x"
              iconOnly
              className={styles.clear}
              onClick={() => {
                clear();
                trigger.current?.focus();
              }}
            >
              Clear search
            </Button>
          )}
        </span>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        aria-label={label}
        className={styles.panel}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          field.current?.focus();
          field.current?.select();
        }}
      >
        <Input
          ref={field}
          type="search"
          size="md"
          icon="search"
          value={draft}
          placeholder={placeholder}
          aria-label={label}
          aria-busy={busy || undefined}
          enterKeyHint="search"
          className={styles.field}
          onChange={(event) => type(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") apply(draft);
          }}
          trailing={
            (busy || draft) && (
              <>
                {busy && <Spinner />}
                {draft && (
                  <Button
                    variant="bare"
                    size="icon-xs"
                    icon="x"
                    iconOnly
                    onClick={() => {
                      clear();
                      field.current?.focus();
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </>
            )
          }
        />
        <div role="status" className={styles.hint} data-empty={hint ? undefined : ""}>
          {hint}
        </div>
      </PopoverContent>
    </Popover>
  );
}
HeaderSearch.displayName = "HeaderSearch";
