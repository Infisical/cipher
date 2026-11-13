import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Calendar } from "../ui/calendar";
import { pickRange } from "../ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

import styles from "./filter-bar.module.css";

export type FilterBarOption = { value: string; label: string; group?: string };
type FilterBarChoiceField = {
  key: string;
  label: string;
  options: readonly FilterBarOption[];
  searchable?: boolean;
};
export type FilterBarField =
  | (FilterBarChoiceField & { type: "select" })
  | (FilterBarChoiceField & { type: "multi-select" })
  | { key: string; label: string; type: "date"; defaultMonth?: Date }
  | { key: string; label: string; type: "date-range"; defaultMonth?: Date }
  | { key: string; label: string; type: "text"; placeholder?: string };
export type FilterBarFilter = {
  field: string;
  operator?: "before" | "after";
  /** ISO dates for date fields: one for date, [from, to] for date-range. */
  values: string[];
};
export type FilterBarProps = {
  label: string;
  fields: readonly FilterBarField[];
  /** Applied filters. Only filters with values arrive here: one just added stays in the bar until its picker closes, and leaves without a change if none was picked. */
  value: readonly FilterBarFilter[];
  onChange: (value: FilterBarFilter[]) => void;
  search?: React.ReactNode;
  /** The search stops at size-search-max; fill stretches it across the row up to the filters and actions. */
  width?: "fill";
  actions?: React.ReactNode;
};

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const parseDate = (value: string | undefined) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const shortRange = (from: Date, to: Date) => {
  const withYear =
    from.getFullYear() !== to.getFullYear() || from.getFullYear() !== new Date().getFullYear();
  const format = (date: Date) =>
    date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: withYear ? "numeric" : undefined
    });
  return from.getTime() === to.getTime() ? format(from) : `${format(from)} to ${format(to)}`;
};

export const describeFilter = (field: FilterBarField, filter: FilterBarFilter) => {
  if (field.type === "date")
    return { verb: filter.operator ?? "before", value: filter.values[0] ?? "any date" };
  if (field.type === "date-range") {
    const from = parseDate(filter.values[0]);
    const to = parseDate(filter.values[1]);
    if (!from || !to) return { verb: "is", value: "any date" };
    return { verb: from.getTime() === to.getTime() ? "on" : "from", value: shortRange(from, to) };
  }
  if (field.type === "text") return { verb: "contains", value: filter.values[0] ?? "anything" };
  const labels = filter.values.map(
    (value) => field.options.find((option) => option.value === value)?.label ?? value
  );
  let value = "any";
  if (labels.length === 1) [value] = labels;
  else if (labels.length === 2) value = `${labels[0]} or ${labels[1]}`;
  else if (labels.length > 2) value = `${labels[0]} or ${labels.length - 1} more`;
  return { verb: "is", value };
};

const DateRangeFilter = ({
  label,
  defaultMonth,
  values,
  onPick
}: {
  label: string;
  defaultMonth?: Date;
  values: readonly string[];
  onPick: (values: [string, string]) => void;
}) => {
  const [draft, setDraft] = React.useState<DateRange | undefined>(() => {
    const from = parseDate(values[0]);
    const to = parseDate(values[1]);
    return from && to ? { from, to } : undefined;
  });
  return (
    <Calendar
      mode="range"
      autoFocus
      aria-label={label}
      defaultMonth={draft?.from ?? defaultMonth}
      selected={draft}
      onSelect={(_range, day) => {
        const next = pickRange(draft, day);
        setDraft(next);
        if (next.from && next.to) onPick([isoDate(next.from), isoDate(next.to)]);
      }}
    />
  );
};

type Draft = { filter: FilterBarFilter; index: number };
const withDraft = (list: readonly FilterBarFilter[], draft: Draft | null) => {
  if (!draft) return list;
  if (list.some((filter) => filter.field === draft.filter.field))
    return list.map((filter) => (filter.field === draft.filter.field ? draft.filter : filter));
  const next = [...list];
  next.splice(Math.min(draft.index, next.length), 0, draft.filter);
  return next;
};

export const FilterBar = ({
  label,
  fields,
  value,
  onChange,
  search,
  width,
  actions
}: FilterBarProps) => {
  const [draft, setDraftState] = React.useState<Draft | null>(null);
  const draftRef = React.useRef(draft);
  const setDraft = (next: Draft | null) => {
    draftRef.current = next;
    setDraftState(next);
  };
  const shown = withDraft(value, draft);
  const [open, setOpen] = React.useState<string | null>(null);
  const [focusTarget, setFocusTarget] = React.useState<string | null>(null);
  const picked = React.useRef<string | null>(null);
  const addButton = React.useRef<HTMLButtonElement>(null);
  const triggers = React.useRef(new Map<string, HTMLButtonElement>());

  React.useEffect(() => {
    if (!focusTarget) return;
    (focusTarget === "add" ? addButton.current : triggers.current.get(focusTarget))?.focus();
    setFocusTarget(null);
  }, [focusTarget]);

  const latest = React.useRef(value);
  React.useLayoutEffect(() => {
    latest.current = value;
  }, [value]);
  const commit = (next: FilterBarFilter[]) => {
    latest.current = next;
    onChange(next);
  };
  const update = (key: string, patch: Partial<FilterBarFilter>) => {
    const current = latest.current;
    const pending = draftRef.current?.filter.field === key ? draftRef.current : null;
    const index = current.findIndex((filter) => filter.field === key);
    const base = index >= 0 ? current[index] : pending?.filter;
    if (!base) return;
    const next = { ...base, ...patch };
    const at = index >= 0 ? index : (pending?.index ?? current.length);
    if (pending || !next.values.length) setDraft({ filter: next, index: at });
    if (next.values.length)
      commit(
        index >= 0
          ? current.map((filter) => (filter.field === key ? next : filter))
          : [...current.slice(0, at), next, ...current.slice(at)]
      );
    else if (index >= 0) commit(current.filter((filter) => filter.field !== key));
  };
  const remove = (key: string) => {
    const before = withDraft(latest.current, draftRef.current);
    const index = before.findIndex((filter) => filter.field === key);
    const next = before.filter((filter) => filter.field !== key);
    if (draftRef.current?.filter.field === key) setDraft(null);
    if (latest.current.some((filter) => filter.field === key))
      commit(latest.current.filter((filter) => filter.field !== key));
    setFocusTarget((next[index] ?? next[index - 1])?.field ?? "add");
  };
  const add = (field: FilterBarField) => {
    picked.current = field.key;
    setDraft({
      filter: {
        field: field.key,
        operator: field.type === "date" ? "before" : undefined,
        values: []
      },
      index: latest.current.length
    });
  };
  const changeOpen = (key: string, next: boolean) => {
    setOpen(next ? key : null);
    if (next) return;
    const applied = latest.current.find((filter) => filter.field === key)?.values.length;
    if (!applied) remove(key);
    else if (draftRef.current?.filter.field === key) setDraft(null);
  };

  return (
    <div className={styles.bar} data-slot="filter-bar" role="search" aria-label={label}>
      <div className={styles.top}>
        {search && (
          <div className={styles.search} data-width={width}>
            {search}
          </div>
        )}
        {fields.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button ref={addButton} variant="outline" icon="plus">
                Add filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(event) => {
                if (!picked.current) return;
                event.preventDefault();
                setOpen(picked.current);
                picked.current = null;
              }}
            >
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              {fields.map((field) => {
                const applied = shown.some((filter) => filter.field === field.key);
                return (
                  <DropdownMenuItem
                    key={field.key}
                    disabled={applied}
                    description={applied ? "Already applied" : undefined}
                    onSelect={() => add(field)}
                  >
                    {field.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {shown.length > 0 && (
        <div className={styles.applied}>
          <ul className={styles.chips} aria-label="Applied filters">
            {shown.map((filter) => {
              const field = fields.find((entry) => entry.key === filter.field);
              if (!field) return null;
              const text = describeFilter(field, filter);
              const trigger = (
                <Button
                  ref={(node) => {
                    if (node) triggers.current.set(field.key, node);
                    else triggers.current.delete(field.key);
                  }}
                  variant="outline"
                  iconRight="chev-down"
                  aria-label={`${field.label} ${text.verb} ${text.value}`}
                >
                  <span className={styles.field}>{`${field.label} ${text.verb}`}</span>
                  <span className={styles.value}>{text.value}</span>
                </Button>
              );
              const isOpen = open === field.key;
              const openChange = (next: boolean) => changeOpen(field.key, next);
              let picker: React.ReactNode;
              if (field.type === "select")
                picker = (
                  <MultiSelect
                    multiple={false}
                    label={field.label}
                    options={field.options}
                    searchable={field.searchable}
                    value={filter.values[0] ?? null}
                    onChange={(next) => update(field.key, { values: next ? [next] : [] })}
                    open={isOpen}
                    onOpenChange={openChange}
                    trigger={trigger}
                  />
                );
              else if (field.type === "multi-select")
                picker = (
                  <MultiSelect
                    label={field.label}
                    options={field.options}
                    searchable={field.searchable}
                    value={filter.values}
                    onChange={(next) => update(field.key, { values: next })}
                    open={isOpen}
                    onOpenChange={openChange}
                    trigger={trigger}
                  />
                );
              else
                picker = (
                  <Popover open={isOpen} onOpenChange={openChange}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    <PopoverContent
                      align="start"
                      data-width={field.type === "date-range" ? "content" : undefined}
                      aria-label={`${field.label} filter`}
                      onOpenAutoFocus={(event) => {
                        if (field.type === "date-range") event.preventDefault();
                      }}
                    >
                      {field.type === "date-range" && (
                        <DateRangeFilter
                          label={field.label}
                          defaultMonth={field.defaultMonth}
                          values={filter.values}
                          onPick={(next) => {
                            update(field.key, { values: next });
                            openChange(false);
                          }}
                        />
                      )}
                      {field.type === "date" && (
                        <div className={styles.date}>
                          <ToggleGroup
                            type="single"
                            size="sm"
                            aria-label={`${field.label} comparison`}
                            value={filter.operator ?? "before"}
                            onValueChange={(next) => {
                              if (next === "before" || next === "after")
                                update(field.key, { operator: next });
                            }}
                          >
                            <ToggleGroupItem value="before">Before</ToggleGroupItem>
                            <ToggleGroupItem value="after">After</ToggleGroupItem>
                          </ToggleGroup>
                          <Calendar
                            mode="single"
                            aria-label={field.label}
                            defaultMonth={parseDate(filter.values[0]) ?? field.defaultMonth}
                            selected={parseDate(filter.values[0])}
                            onSelect={(date) =>
                              update(field.key, { values: date ? [isoDate(date)] : [] })
                            }
                          />
                        </div>
                      )}
                      {field.type === "text" && (
                        <Input
                          aria-label={field.label}
                          placeholder={field.placeholder}
                          value={filter.values[0] ?? ""}
                          onChange={(event) =>
                            update(field.key, {
                              values: event.target.value ? [event.target.value] : []
                            })
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") openChange(false);
                          }}
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                );
              return (
                <li key={field.key}>
                  <ButtonGroup label={`${field.label} filter`}>
                    {picker}
                    <Button
                      variant="outline"
                      icon="x"
                      iconOnly
                      onClick={() => remove(field.key)}
                    >{`Remove ${field.label} filter`}</Button>
                  </ButtonGroup>
                </li>
              );
            })}
          </ul>
          <Button
            variant="link"
            onClick={() => {
              setDraft(null);
              commit([]);
              setFocusTarget("add");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
