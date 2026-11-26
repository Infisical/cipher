import * as React from "react";
import type { DateRange, Locale, Matcher } from "react-day-picker";

import { useIsMobile } from "../hooks/use-mobile";
import { useFieldControlAttributes } from "../lib/field-context";
import { cn, titleIfClamped } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

import controlStyles from "./controls.module.css";
import styles from "./date-picker.module.css";

export type CompleteDateRange = { from: Date; to: Date };
export type DateRangePreset = { label: string; range: DateRange };

export type DateRangePickerProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "disabled" | "children" | "placeholder"
> & {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  placeholder?: string;
  /** Days that cannot be picked, as Calendar matchers. An open-ended before or after also stops month navigation there. */
  disabled?: Matcher | Matcher[];
  numberOfMonths?: number;
  presets?: readonly DateRangePreset[];
  /** immediate commits as soon as both ends are picked. apply keeps picks and presets as a draft until Apply, and Cancel or closing discards it. Defaults to apply with presets or more than one month, so a half-picked range never reaches the value, else immediate. */
  commit?: "immediate" | "apply";
  align?: "start" | "center" | "end";
  locale?: Partial<Locale>;
  formatRange?: (range: CompleteDateRange) => string;
  /** A Badge after the range in the trigger, such as "Current" for the period that is still running. */
  badge?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
};

const isComplete = (range: DateRange | undefined): range is CompleteDateRange =>
  Boolean(range?.from && range.to);

const sameDay = (a: Date | undefined, b: Date | undefined) =>
  Boolean(a && b && a.toDateString() === b.toDateString());

/** The range after a click: the first click starts a new range even over a complete one, and the second closes it in either direction. */
export const pickRange = (range: DateRange | undefined, day: Date): DateRange => {
  if (!range?.from || range.to) return { from: day, to: undefined };
  return day < range.from ? { from: day, to: range.from } : { from: range.from, to: day };
};

const defaultFormat = (range: CompleteDateRange, locale?: Partial<Locale>) => {
  const format = (date: Date) =>
    date.toLocaleDateString(locale?.code, { month: "short", day: "numeric", year: "numeric" });
  return `${format(range.from)} to ${format(range.to)}`;
};

export type DateRangePickerContentProps = Pick<
  DateRangePickerProps,
  | "value"
  | "disabled"
  | "numberOfMonths"
  | "presets"
  | "commit"
  | "align"
  | "locale"
  | "formatRange"
> & {
  /** The month shown first when value is empty. Defaults to the current month. */
  defaultMonth?: Date;
  onValueChange: (value: DateRange | undefined) => void;
  onClose: () => void;
  "aria-label"?: string;
};

type DateRangePanelProps = Omit<DateRangePickerContentProps, "align" | "aria-label"> & {
  numberOfMonths: number;
  commit: "immediate" | "apply";
};

function DateRangePanel({
  value,
  onValueChange,
  onClose,
  disabled,
  numberOfMonths,
  presets,
  commit: commitMode,
  defaultMonth,
  locale,
  formatRange
}: DateRangePanelProps) {
  const [draft, setDraft] = React.useState(value);
  const [month, setMonth] = React.useState(() => value?.from ?? defaultMonth ?? new Date());
  const apply = commitMode === "apply";
  const format = (range: CompleteDateRange) => formatRange?.(range) ?? defaultFormat(range, locale);
  const commit = (next: DateRange | undefined) => {
    onValueChange(next);
    onClose();
  };
  const choosePreset = (range: DateRange) => {
    if (!apply) return commit(range);
    setDraft(range);
    if (range.from) setMonth(range.from);
  };
  const shown = apply ? draft : value;
  let status = "Choose a start date";
  if (draft?.from && !draft.to) status = "Choose an end date";
  else if (isComplete(draft)) status = format(draft);

  return (
    <div data-slot="date-range-picker-panel" data-commit={commitMode} className={styles.panel}>
      {presets?.length ? (
        <div
          role="group"
          aria-label="Presets"
          data-slot="date-range-picker-presets"
          className={styles.presets}
        >
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              className="justify-start"
              aria-pressed={
                sameDay(preset.range.from, shown?.from) && sameDay(preset.range.to, shown?.to)
              }
              onClick={() => choosePreset(preset.range)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div className={styles.main}>
        <Calendar
          mode="range"
          autoFocus
          aria-label="Date range"
          locale={locale}
          numberOfMonths={numberOfMonths}
          disabled={disabled}
          month={month}
          onMonthChange={setMonth}
          selected={draft}
          onSelect={(_range, day) => {
            const next = pickRange(draft, day);
            setDraft(next);
            if (!apply && isComplete(next)) commit(next);
          }}
        />
        <div data-slot="date-range-picker-footer" className={styles.footer}>
          <span role="status" className={cn(controlStyles.caption, styles.status)}>
            {status}
          </span>
          {apply ? (
            <div className={styles.actions}>
              {draft?.from ? (
                <Button variant="ghost" size="sm" onClick={() => setDraft(undefined)}>
                  Clear
                </Button>
              ) : null}
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                disabled={Boolean(draft?.from) && !isComplete(draft)}
                onClick={() => commit(draft)}
              >
                Apply
              </Button>
            </div>
          ) : value?.from || draft?.from ? (
            <Button variant="ghost" size="xs" onClick={() => commit(undefined)}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** DateRangePicker's popover for your own trigger, such as a filter chip, with the same presets, months and commit rule. Render it inside a Popover. */
export function DateRangePickerContent({
  align = "start",
  numberOfMonths = 1,
  presets,
  commit = numberOfMonths > 1 || presets?.length ? "apply" : "immediate",
  "aria-label": ariaLabel = "Choose a date range",
  ...props
}: DateRangePickerContentProps) {
  const months = useIsMobile() ? 1 : numberOfMonths;
  return (
    <PopoverContent
      align={align}
      data-width={months > 1 ? undefined : "content"}
      className={months > 1 ? styles.wide : undefined}
      aria-label={ariaLabel}
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <DateRangePanel {...props} numberOfMonths={months} presets={presets} commit={commit} />
    </PopoverContent>
  );
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Choose dates",
  disabled,
  numberOfMonths,
  presets,
  commit,
  align,
  locale,
  formatRange,
  badge,
  className,
  ...props
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const field = useFieldControlAttributes(props);
  const generatedId = React.useId();
  const id = field.id ?? generatedId;
  const format = (range: CompleteDateRange) => formatRange?.(range) ?? defaultFormat(range, locale);
  const valueText = React.useRef<HTMLSpanElement>(null);
  const valueLabel = isComplete(value) ? format(value) : undefined;
  React.useLayoutEffect(() => {
    if (valueText.current) titleIfClamped(valueText.current);
  }, [valueLabel]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="date-range-picker"
          variant="outline"
          layout="trigger"
          iconRight="calendar"
          className={className}
          {...props}
          {...field}
          id={id}
          aria-labelledby={field["aria-labelledby"] && `${field["aria-labelledby"]} ${id}`}
        >
          {isComplete(value) && badge !== undefined ? (
            <span className={controlStyles.triggerValue}>
              <span
                ref={valueText}
                data-slot="option-text"
                onPointerEnter={(event) => titleIfClamped(event.currentTarget)}
              >
                {format(value)}
              </span>
              {badge}
            </span>
          ) : isComplete(value) ? (
            format(value)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <DateRangePickerContent
        value={value}
        onValueChange={onValueChange}
        onClose={() => setOpen(false)}
        disabled={disabled}
        numberOfMonths={numberOfMonths}
        presets={presets}
        commit={commit}
        align={align}
        locale={locale}
        formatRange={formatRange}
      />
    </Popover>
  );
}
DateRangePicker.displayName = "DateRangePicker";
