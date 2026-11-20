"use client";

import * as React from "react";

import { useSlashShortcut } from "../lib/slash-shortcut";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";
import { Tooltip } from "./tooltip";

import styles from "./header-search.module.css";

export type HeaderSearchProps = {
  /** The applied query. With debounceMs it trails the text in the field. A non-empty value puts a dot on the trigger. */
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
  /** Where "/" opens the search: while focus is inside the enclosing Card, anywhere on the page, or never. */
  shortcut?: "card" | "page" | false;
  className?: string;
};

/**
 * An icon trigger for a Card's action slot that opens a popover search. It takes the control height of
 * the slot it sits in (the 28px band tier in a framed card's head), so leave its size unset.
 */
export function HeaderSearch({
  value,
  onValueChange,
  label,
  placeholder = "Search",
  debounceMs = 0,
  pending = false,
  hint,
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

  useSlashShortcut(trigger, {
    enabled: Boolean(shortcut),
    scope: shortcut === "page" ? "page" : "card",
    onTrigger: () => setOpen(true)
  });

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

  const applied = value !== "";
  const busy = pending || draft !== value;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) apply(draft);
        setOpen(next);
      }}
    >
      <span
        data-slot="header-search"
        data-applied={applied || undefined}
        className={cn(styles.root, className)}
      >
        <Tooltip content={label} shortcut={shortcut ? "/" : undefined}>
          <PopoverTrigger asChild>
            <Button
              ref={trigger}
              variant="bare"
              icon="search"
              iconOnly
              aria-label={applied ? `${label}: ${value}` : label}
              applied={applied}
              className={styles.trigger}
            >
              {label}
            </Button>
          </PopoverTrigger>
        </Tooltip>
      </span>
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
                      setDraft("");
                      apply("");
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
