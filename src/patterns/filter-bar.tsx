import * as React from "react";
import { useReportListQuery } from "../lib/list-query";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Calendar } from "../ui/calendar";
import { DateRangePickerContent, type DateRangePickerProps } from "../ui/date-range-picker";
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

export type FilterBarOption = {
  value: string;
  label: string;
  group?: string;
  /** A logo or image before the label, sized like an icon, in the option row and in the applied chip. It never shrinks; the value truncates first. */
  media?: React.ReactNode;
};
type FilterBarChoiceField = {
  key: string;
  label: string;
  options: readonly FilterBarOption[];
  searchable?: boolean;
  /** Searches on the server: called with each query (and with "" when the picker closes), while options holds the results as they arrive. Options are not filtered locally. Applied values keep the labels of options seen earlier, so include them in options on first render. */
  onSearch?: (query: string) => void;
  /** While onSearch is in flight: a spinner in the search field, and Searching… in place of the empty text. */
  loading?: boolean;
};
export type FilterBarField =
  | (FilterBarChoiceField & { type: "select" })
  | (FilterBarChoiceField & { type: "multi-select" })
  | { key: string; label: string; type: "date"; defaultMonth?: Date }
  | ({ key: string; label: string; type: "date-range"; defaultMonth?: Date } & Pick<
      DateRangePickerProps,
      "presets" | "numberOfMonths"
    >)
  | {
      key: string;
      label: string;
      type: "text";
      placeholder?: string;
      /** How the chip reads the value, such as "is" for an exact match. Defaults to "contains". */
      verb?: string;
    }
  | {
      key: string;
      label: string;
      type: "key-value";
      keyPlaceholder?: string;
      valuePlaceholder?: string;
      /** The most pairs a person can add. */
      max?: number;
      /** How the chip reads the pairs. Defaults to "has". */
      verb?: string;
    };
export type FilterBarFilter = {
  field: string;
  operator?: "before" | "after";
  /** ISO dates for date fields: one for date, [from, to] for date-range. Key-value fields alternate key and value: [key, value, key, value]. */
  values: string[];
};
export type FilterBarProps = {
  label: string;
  /** Leave out for a bar that is only a search box. */
  fields?: readonly FilterBarField[];
  /** Applied filters. Only filters with values arrive here: one just added stays in the bar until its picker closes, and leaves without a change if none was picked. */
  value?: readonly FilterBarFilter[];
  onChange?: (value: FilterBarFilter[]) => void;
  /** Your own search control. Leave out and pass searchValue and onSearchChange for the built-in one. Pass searchValue with it too, so a ListQueryScope knows the list is searched. */
  search?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** The built-in search's accessible name, and its placeholder unless searchPlaceholder is set. */
  searchLabel?: string;
  searchPlaceholder?: string;
  /** "/" focuses the built-in search from anywhere on the page. Turn it off on a second FilterBar so only the main search answers "/". */
  slashShortcut?: boolean;
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

export const describeFilter = (
  field: FilterBarField,
  filter: FilterBarFilter,
  remembered: readonly FilterBarOption[] = []
) => {
  if (field.type === "date")
    return { verb: filter.operator ?? "before", value: filter.values[0] ?? "any date" };
  if (field.type === "date-range") {
    const from = parseDate(filter.values[0]);
    const to = parseDate(filter.values[1]);
    if (!from || !to) return { verb: "is", value: "any date" };
    return { verb: from.getTime() === to.getTime() ? "on" : "from", value: shortRange(from, to) };
  }
  if (field.type === "text")
    return { verb: field.verb ?? "contains", value: filter.values[0] ?? "anything" };
  if (field.type === "key-value") {
    const pairs = toPairs(filter.values).map((pair) => `${pair.key}=${pair.value}`);
    let value = "anything";
    if (pairs.length === 1) [value] = pairs;
    else if (pairs.length === 2) value = `${pairs[0]} and ${pairs[1]}`;
    else if (pairs.length > 2) value = `${pairs[0]} and ${pairs.length - 1} more`;
    return { verb: field.verb ?? "has", value };
  }
  const labels = filter.values.map(
    (value) =>
      (
        field.options.find((option) => option.value === value) ??
        remembered.find((option) => option.value === value)
      )?.label ?? value
  );
  let value = "any";
  if (labels.length === 1) [value] = labels;
  else if (labels.length === 2) value = `${labels[0]} or ${labels[1]}`;
  else if (labels.length > 2) {
    const more = `or ${labels.length - 1} more`;
    return { verb: "is", value: `${labels[0]} ${more}`, first: labels[0], more };
  }
  return { verb: "is", value };
};

type Pair = { id: number; key: string; value: string };
const toPairs = (values: readonly string[]) =>
  Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({
    id: index,
    key: values[index * 2],
    value: values[index * 2 + 1]
  }));

const KeyValuePairs = ({
  field,
  values,
  onChange,
  onDone
}: {
  field: Extract<FilterBarField, { type: "key-value" }>;
  values: readonly string[];
  onChange: (values: string[]) => void;
  onDone: () => void;
}) => {
  const nextId = React.useRef(values.length);
  const fromValues = (source: readonly string[]) => {
    const applied = toPairs(source).map((pair) => ({ ...pair, id: nextId.current++ }));
    return applied.length ? applied : [{ id: nextId.current++, key: "", value: "" }];
  };
  const [pairs, setPairs] = React.useState<Pair[]>(() => fromValues(values));
  const signature = values.join("\u0000");
  const [synced, setSynced] = React.useState(signature);
  if (signature !== synced) {
    setSynced(signature);
    setPairs(fromValues(values));
  }
  const focusId = React.useRef<number | null>(null);
  const change = (next: Pair[]) => {
    const emitted = next
      .filter((pair) => pair.key.trim() && pair.value.trim())
      .flatMap((pair) => [pair.key.trim(), pair.value.trim()]);
    setPairs(next);
    setSynced(emitted.join("\u0000"));
    onChange(emitted);
  };
  const edit = (id: number, patch: Partial<Pair>) =>
    change(pairs.map((pair) => (pair.id === id ? { ...pair, ...patch } : pair)));
  const full = field.max !== undefined && pairs.length >= field.max;

  return (
    <div className={styles.pairs}>
      {pairs.map((pair, index) => {
        const enter = (event: React.KeyboardEvent) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) onDone();
        };
        return (
          <div key={pair.id} className={styles.pair}>
            <Input
              ref={(node) => {
                if (node && focusId.current === pair.id) {
                  focusId.current = null;
                  node.focus();
                }
              }}
              aria-label={`${field.label} key ${index + 1}`}
              placeholder={field.keyPlaceholder ?? "Key"}
              value={pair.key}
              onChange={(event) => edit(pair.id, { key: event.target.value })}
              onKeyDown={enter}
            />
            <Input
              aria-label={`${field.label} value ${index + 1}`}
              placeholder={field.valuePlaceholder ?? "Value"}
              value={pair.value}
              onChange={(event) => edit(pair.id, { value: event.target.value })}
              onKeyDown={enter}
            />
            <Button
              variant="ghost"
              icon="x"
              iconOnly
              disabled={pairs.length === 1 && !pair.key && !pair.value}
              onClick={() => {
                const rest = pairs.filter((entry) => entry.id !== pair.id);
                const next = rest.length ? rest : [{ id: nextId.current++, key: "", value: "" }];
                focusId.current = (next[index] ?? next[index - 1]).id;
                change(next);
              }}
            >{`Remove pair ${index + 1}`}</Button>
          </div>
        );
      })}
      <Button
        variant="ghost"
        icon="plus"
        disabled={full}
        onClick={() => {
          const id = nextId.current++;
          focusId.current = id;
          setPairs([...pairs, { id, key: "", value: "" }]);
        }}
      >
        Add pair
      </Button>
    </div>
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
  fields = [],
  value: valueProp,
  onChange,
  search,
  searchValue,
  onSearchChange,
  searchLabel = "Search",
  searchPlaceholder,
  slashShortcut = true,
  width,
  actions
}: FilterBarProps) => {
  const [uncontrolled, setUncontrolled] = React.useState<readonly FilterBarFilter[]>([]);
  const value = valueProp ?? uncontrolled;
  useReportListQuery(searchValue ?? "", value.length);
  const [draft, setDraftState] = React.useState<Draft | null>(null);
  const draftRef = React.useRef(draft);
  const setDraft = (next: Draft | null) => {
    draftRef.current = next;
    setDraftState(next);
  };
  const shown = withDraft(value, draft);
  const [remembered, setRemembered] = React.useState<
    ReadonlyMap<string, readonly FilterBarOption[]>
  >(() => new Map());
  const unseen = fields.flatMap((field) => {
    if ((field.type !== "select" && field.type !== "multi-select") || !field.onSearch) return [];
    const values = shown.find((filter) => filter.field === field.key)?.values ?? [];
    const known = remembered.get(field.key) ?? [];
    const visible = field.options.filter(
      (option) =>
        values.includes(option.value) &&
        !known.some((item) => item.value === option.value && item.label === option.label)
    );
    return visible.length ? [{ key: field.key, visible }] : [];
  });
  const remember = (entries: readonly { key: string; visible: readonly FilterBarOption[] }[]) =>
    setRemembered((current) => {
      const next = new Map(current);
      for (const { key, visible } of entries)
        next.set(key, [
          ...(current.get(key) ?? []).filter(
            (item) => !visible.some((option) => option.value === item.value)
          ),
          ...visible
        ]);
      return next;
    });
  if (unseen.length) remember(unseen);
  const choose = (field: FilterBarChoiceField, values: string[]) => {
    if (field.onSearch)
      remember([
        { key: field.key, visible: field.options.filter((option) => values.includes(option.value)) }
      ]);
    update(field.key, { values });
  };
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
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(next);
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
    setOpen((current) => (current === key ? null : current));
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
  const searchControl =
    search ??
    (onSearchChange || searchValue !== undefined ? (
      <Input
        icon="search"
        aria-label={searchLabel}
        placeholder={searchPlaceholder ?? searchLabel}
        slashShortcut={slashShortcut}
        value={searchValue ?? ""}
        onChange={(event) => onSearchChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && searchValue) {
            event.preventDefault();
            onSearchChange?.("");
          }
        }}
      />
    ) : null);

  return (
    <div className={styles.bar} data-slot="filter-bar" role="search" aria-label={label}>
      <div className={styles.top}>
        {searchControl && (
          <div className={styles.search} data-width={width}>
            {searchControl}
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
              const text = describeFilter(field, filter, remembered.get(field.key));
              const media =
                field.type === "select" || field.type === "multi-select"
                  ? [...field.options, ...(remembered.get(field.key) ?? [])].find(
                      (option) => option.value === filter.values[0]
                    )?.media
                  : undefined;
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
                  {Boolean(media) && (
                    <span data-slot="filter-media" className={cn(styles.media, "cipher-lead-line")}>
                      {media}
                    </span>
                  )}
                  <span className={styles.value}>
                    <span className={styles.label}>
                      {"first" in text ? text.first : text.value}
                    </span>
                    {"more" in text && <span className={styles.more}>{text.more}</span>}
                  </span>
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
                    onSearch={field.onSearch}
                    loading={field.loading}
                    value={filter.values[0] ?? null}
                    onChange={(next) => choose(field, next ? [next] : [])}
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
                    onSearch={field.onSearch}
                    loading={field.loading}
                    value={filter.values}
                    onChange={(next) => choose(field, next)}
                    open={isOpen}
                    onOpenChange={openChange}
                    trigger={trigger}
                  />
                );
              else if (field.type === "date-range") {
                const from = parseDate(filter.values[0]);
                const to = parseDate(filter.values[1]);
                picker = (
                  <Popover open={isOpen} onOpenChange={openChange}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    <DateRangePickerContent
                      aria-label={`${field.label} filter`}
                      value={from && to ? { from, to } : undefined}
                      onValueChange={(next) =>
                        update(field.key, {
                          values:
                            next?.from && next.to ? [isoDate(next.from), isoDate(next.to)] : []
                        })
                      }
                      onClose={() => openChange(false)}
                      defaultMonth={field.defaultMonth}
                      presets={field.presets}
                      numberOfMonths={field.numberOfMonths}
                    />
                  </Popover>
                );
              } else
                picker = (
                  <Popover open={isOpen} onOpenChange={openChange}>
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                    <PopoverContent
                      align="start"
                      data-width={
                        field.type === "date"
                          ? "content"
                          : field.type === "key-value"
                            ? "sm"
                            : undefined
                      }
                      aria-label={`${field.label} filter`}
                    >
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
                      {field.type === "key-value" && (
                        <KeyValuePairs
                          field={field}
                          values={filter.values}
                          onChange={(values) => update(field.key, { values })}
                          onDone={() => openChange(false)}
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
              setOpen(null);
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
