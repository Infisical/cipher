import * as React from "react";
import { type DayButton, DayPicker, getDefaultClassNames, type Locale } from "react-day-picker";

import { Button, buttonVariants } from "./button";

import { useDescendantFlags } from "../lib/descendant-flags";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

import controlStyles from "./controls.module.css";

const rootFlags = {};
const rootWatch = {
  focus: true,
  marks: {
    "data-child-focus-visible": `.${controlStyles.focusOutlineWithin}:has(> :focus-visible)`
  }
};

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<"div"> & { rootRef?: React.Ref<HTMLDivElement> }) {
  const ref = useDescendantFlags<HTMLDivElement>(rootFlags, rootWatch, rootRef);
  return (
    <div
      data-slot="calendar"
      ref={ref}
      className={cn(className)}
      {...props}
      role={props.role ?? "region"}
      tabIndex={props.tabIndex ?? 0}
      aria-label={props["aria-label"] ?? (props["aria-labelledby"] ? undefined : "Calendar")}
    />
  );
}

/** The open-ended before and after dates in `disabled`, so navigation stops at the months that can be picked. */
function disabledBounds(disabled: React.ComponentProps<typeof DayPicker>["disabled"]) {
  const bounds: { before?: Date; after?: Date } = {};
  for (const matcher of [disabled ?? []].flat()) {
    if (typeof matcher !== "object" || matcher instanceof Date || Array.isArray(matcher)) continue;
    if ("before" in matcher && !("after" in matcher)) bounds.before = matcher.before;
    if ("after" in matcher && !("before" in matcher)) bounds.after = matcher.after;
  }
  return bounds;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();
  const bounds = disabledBounds(props.disabled);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar max-w-full overflow-x-auto bg-background p-2 [--cell-radius:0px] [--cell-size:var(--cipher-size-control-default)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:p-0",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-(--cipher-space-24) md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-(--cipher-space-12)", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          controlStyles.label,
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          controlStyles.focusOutlineWithin,
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          controlStyles.label,
          "select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          controlStyles.caption,
          "flex-1 rounded-(--cell-radius) text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-(--cipher-space-2) flex w-full", defaultClassNames.week),
        footer: cn(controlStyles.body, "mt-3 text-center", defaultClassNames.footer),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          controlStyles.caption,
          "flex h-(--cell-size) w-(--cell-size) items-center justify-center text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          controlStyles.body,
          "group/day relative h-(--cell-size) w-full min-w-(--cell-size) rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) after:absolute after:inset-y-0 after:right-0 after:left-1/2 after:bg-[color:var(--cipher-select)]",
          String.raw`[&.rdp-range\_end]:after:hidden`,
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none bg-[color:var(--cipher-select)]",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) after:absolute after:inset-y-0 after:right-1/2 after:left-0 after:bg-[color:var(--cipher-select)]",
          String.raw`[&.rdp-range\_start]:after:hidden`,
          defaultClassNames.range_end
        ),
        today: cn("text-foreground", defaultClassNames.today),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      }}
      components={{
        Root: CalendarRoot,
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <Icon name="chev-left" className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <Icon name="chev-right" className={cn("size-4", className)} {...props} />;
          }

          return <Icon name="chev-down" className={cn("size-4", className)} {...props} />;
        },
        DayButton: ({ ...props }) => <CalendarDayButton locale={locale} {...props} />,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components
      }}
      {...props}
      startMonth={props.startMonth ?? bounds.before}
      endMonth={props.endMonth ?? bounds.after}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      className={cn(
        "relative isolate z-10 mx-auto flex size-(--cell-size) flex-col gap-1 leading-none font-normal hover:bg-[color:var(--cipher-hover)] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-[color:var(--cipher-focus-ring)]",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:text-foreground",
        "data-[range-end=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-(--cell-radius)",
        "data-[range-end=true]:border-[color:var(--cipher-selected-border)] data-[range-start=true]:border-[color:var(--cipher-selected-border)] data-[selected-single=true]:border-[color:var(--cipher-selected-border)]",
        "data-[range-end=true]:bg-[color:var(--cipher-select)] data-[range-start=true]:bg-[color:var(--cipher-select)] data-[selected-single=true]:bg-[color:var(--cipher-select)]",
        "data-[range-end=true]:font-medium data-[range-start=true]:font-medium data-[selected-single=true]:font-medium data-[range-end=true]:text-foreground data-[range-start=true]:text-foreground data-[selected-single=true]:text-foreground",
        "data-[today=true]:after:absolute data-[today=true]:after:bottom-(--cipher-space-4) data-[today=true]:after:left-1/2 data-[today=true]:after:size-(--cipher-space-3) data-[today=true]:after:-translate-x-1/2 data-[today=true]:after:rounded-full data-[today=true]:after:bg-current",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
