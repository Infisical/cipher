import * as React from "react";
import type { Locale, Matcher } from "react-day-picker";

import { useFieldControlAttributes } from "../lib/field-context";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import controlStyles from "./controls.module.css";
import styles from "./date-picker.module.css";

export type DatePickerPreset = { label: string; date: Date };

export type DatePickerProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "disabled" | "children" | "placeholder"
> & {
  value: Date | undefined;
  onValueChange: (value: Date | undefined) => void;
  placeholder?: string;
  /** Days that cannot be picked, as Calendar matchers. An open-ended before or after also stops month navigation there. */
  disabled?: Matcher | Matcher[];
  presets?: readonly DatePickerPreset[];
  align?: "start" | "center" | "end";
  locale?: Partial<Locale>;
  formatDate?: (date: Date) => string;
  ref?: React.Ref<HTMLButtonElement>;
};

const sameDay = (a: Date | undefined, b: Date | undefined) =>
  Boolean(a && b && a.toDateString() === b.toDateString());

export function DatePicker({
  value,
  onValueChange,
  placeholder = "Choose a date",
  disabled,
  presets,
  align = "start",
  locale,
  formatDate,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldControlAttributes(props);
  const generatedId = React.useId();
  const id = field.id ?? generatedId;
  const format = (date: Date) =>
    formatDate?.(date) ??
    date.toLocaleDateString(locale?.code, { month: "short", day: "numeric", year: "numeric" });
  const commit = (next: Date | undefined) => {
    onValueChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-picker"
          variant="outline"
          layout="trigger"
          iconRight="calendar"
          className={className}
          {...props}
          {...field}
          id={id}
          aria-labelledby={field["aria-labelledby"] && `${field["aria-labelledby"]} ${id}`}
        >
          {value ? format(value) : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        data-width="content"
        aria-label="Choose a date"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div data-slot="date-picker-panel" className={styles.panel}>
          {presets?.length ? (
            <div
              role="group"
              aria-label="Presets"
              data-slot="date-picker-presets"
              className={styles.presets}
            >
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  className="justify-start"
                  aria-pressed={sameDay(preset.date, value)}
                  onClick={() => commit(preset.date)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          ) : null}
          <div className={styles.main}>
            <Calendar
              mode="single"
              required
              autoFocus
              aria-label="Date"
              locale={locale}
              disabled={disabled}
              defaultMonth={value}
              selected={value}
              onSelect={commit}
            />
            <div data-slot="date-picker-footer" className={styles.footer}>
              <span role="status" className={cn(controlStyles.caption, styles.status)}>
                {value ? format(value) : "Choose a date"}
              </span>
              {value ? (
                <Button variant="ghost" size="xs" onClick={() => commit(undefined)}>
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
DatePicker.displayName = "DatePicker";
