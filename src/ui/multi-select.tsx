import * as React from "react";

import { useFieldControlAttributes } from "../lib/field-context";
import { ListHighlight } from "../lib/list-highlight";
import { useControllableState } from "../lib/use-controllable-state";
import { type OptionCreateHandler, useOptionCreation } from "../lib/use-option-creation";
import { cn, titleIfClamped } from "../lib/utils";
import { Button } from "./button";
import { Icon, type IconSource } from "./icon";
import { useMenuInset } from "./menu-inset";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";

import controlStyles from "./controls.module.css";
import menu from "./menu.module.css";
import styles from "./picker.module.css";

export type MultiSelectOption = {
  value: string;
  label: string;
  /** A muted line under the label. Search matches it as well as the label. */
  description?: string;
  /** A short muted value at the row's end, such as a count. */
  meta?: string;
  /** A glyph at the row's start. */
  icon?: IconSource;
  /** A logo or image at the row's start, sized like an icon, such as an app connection's logo. Ignored when icon is set. */
  media?: React.ReactNode;
  disabled?: boolean;
  /** Search matches the group's heading too. */
  group?: string;
  /** Extra words the search matches but never shows, such as an ID or an alias. */
  keywords?: readonly string[];
};
export type MultiSelectCreateAction = {
  /** The row's text, for example Create connection. */
  label: string;
  /** Closes the menu and hands over to your own flow. query is the trimmed search text; complete selects the option it made, which you add to options too. */
  onSelect: (props: { query: string; complete: (option: MultiSelectOption) => void }) => void;
  /** Keeps the row visible but disabled, with this reason beside it. */
  disabledReason?: string;
};
type Shared = {
  onCreate?: OptionCreateHandler;
  /** A Create row at the end of the list that starts your own flow, such as a dialog that makes a connection. */
  createAction?: MultiSelectCreateAction;
  /** The Create row's text for the trimmed search, for example (query) => `Create tag "${query}"`. */
  createLabel?: (query: string) => string;
  onEmptyBackspace?: () => void;
  options: readonly MultiSelectOption[];
  label: string;
  id?: string;
  "aria-describedby"?: string;
  placeholder?: string;
  allLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Searches on the server: called with each query (and with "" when the menu closes), while options holds the results as they arrive. It turns on the search field. Include the selected options in options on first render so their labels show. */
  onSearch?: (query: string) => void;
  /** While onSearch is in flight: a spinner in the search field, and Searching… in place of No options found. */
  loading?: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  renderValue?: (selected: readonly MultiSelectOption[]) => React.ReactNode;
  trigger?: React.ReactElement<React.ButtonHTMLAttributes<HTMLElement>>;
  size?: "sm" | "md";
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  menuWidth?: React.CSSProperties["width"];
  quickActions?: boolean;
  closeOnFocusOutside?: boolean;
  className?: string;
};
export type MultiSelectProps = Shared &
  (
    | {
        multiple?: true;
        value?: string[];
        defaultValue?: string[];
        onChange?: (value: string[]) => void;
      }
    | {
        multiple: false;
        value?: string | null;
        defaultValue?: string | null;
        onChange?: (value: string | null) => void;
      }
  );
export function MultiSelect({
  ref,
  ...props
}: MultiSelectProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const {
    options,
    label,
    placeholder = "Select options",
    allLabel,
    disabled,
    invalid,
    searchable: searchableProp = false,
    searchPlaceholder = "Search options",
    onSearch,
    loading = false,
    anchorRef,
    renderValue,
    trigger,
    size = "sm",
    align = "start",
    side = "bottom",
    menuWidth,
    quickActions = true,
    closeOnFocusOutside = true,
    createAction,
    className
  } = props;
  const optionValues = new Set<string>();
  options.forEach((option) => {
    if (optionValues.has(option.value))
      throw new Error("MultiSelect option values must be unique.");
    optionValues.add(option.value);
  });
  const searchable = searchableProp || Boolean(onSearch);
  const field = useFieldControlAttributes(props);
  const generated = React.useId();
  const listId = `${generated}-list`;
  const [internal, setInternal] = React.useState<string[] | string | null>(
    props.defaultValue ?? (props.multiple === false ? null : [])
  );
  const current = props.value === undefined ? internal : props.value;
  const selected = Array.isArray(current) ? current : current ? [current] : [];
  const [open, setOpen] = useControllableState({
    value: props.open,
    defaultValue: props.defaultOpen ?? false,
    onChange: props.onOpenChange
  });
  const [query, setQuery] = React.useState("");
  const creation = useOptionCreation(props.onCreate, () => {
    setQuery("");
    onSearch?.("");
    search.current?.focus();
  });
  const { creating, error: createError } = creation;
  const changeQuery = (next: string) => {
    creation.cancel();
    setQuery(next);
    onSearch?.(next);
  };
  const changeOpen = (next: boolean) => {
    if (disabled && next) return;
    creation.cancel();
    setOpen(next);
    if (next || !query) return;
    setQuery("");
    onSearch?.("");
  };
  const [remembered, setRemembered] = React.useState<readonly MultiSelectOption[]>([]);
  React.useLayoutEffect(() => {
    creation.cancel();
  }, [open, disabled, creation.cancel]);
  const canCreate = Boolean(
    props.onCreate &&
    query.trim() &&
    !options.some((option) => option.label.toLowerCase() === query.trim().toLowerCase())
  );
  const create = () => {
    if (canCreate && !creating && !disabled) creation.create(query.trim());
  };
  const [active, setActive] = React.useState("");
  const prefix = React.useRef({ value: "", at: 0 });
  const list = React.useRef<HTMLDivElement>(null);
  const listInset = useMenuInset(list);
  const search = React.useRef<HTMLInputElement>(null);
  const apply = (values: string[], keepOrder = false) => {
    if (disabled) return;
    if (props.multiple === false) {
      const next = values[0] ?? null;
      if (props.value === undefined) setInternal(next);
      props.onChange?.(next);
    } else {
      const included = new Set(values);
      const ordered =
        onSearch || keepOrder
          ? [...included]
          : options.filter((option) => included.has(option.value)).map((option) => option.value);
      if (props.value === undefined) setInternal(ordered);
      props.onChange?.(ordered);
    }
  };
  const shown = options.filter((option) => selected.includes(option.value));
  if (onSearch && shown.some((option) => !remembered.includes(option)))
    setRemembered((known) => [
      ...known.filter((item) => !shown.some((option) => option.value === item.value)),
      ...shown
    ]);
  const chosen = onSearch
    ? selected.flatMap(
        (value) =>
          options.find((option) => option.value === value) ??
          remembered.find((option) => option.value === value) ??
          []
      )
    : shown;
  const firstChosen = chosen[0];
  const eligible = options.filter((option) => !option.disabled);
  const allSelected =
    eligible.length > 0 && eligible.every((option) => selected.includes(option.value));
  const noneSelected = !eligible.some((option) => selected.includes(option.value));
  const multiple = props.multiple !== false;
  let summary: React.ReactNode = placeholder;
  if (renderValue) summary = renderValue(chosen);
  else if (firstChosen) {
    summary =
      props.multiple !== false && allLabel && allSelected && !onSearch ? (
        allLabel
      ) : (
        <span className={styles.summary}>
          <span>{firstChosen.label}</span>
          {chosen.length > 1 && (
            <span className={styles.more} aria-label={`${chosen.length - 1} more selected`}>
              +{chosen.length - 1}
            </span>
          )}
        </span>
      );
  }
  const filtered = onSearch
    ? options
    : options.filter((option) =>
        [option.label, option.description, option.meta, option.group, ...(option.keywords ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
  const enabled = filtered.filter((option) => !option.disabled && !disabled);
  const createId = `${generated}-create`;
  const createBlocked = createAction?.disabledReason || undefined;
  const navigable = [
    ...enabled.map((option) => option.value),
    ...(createAction && !createBlocked && !disabled ? [createId] : [])
  ];
  const activeKey = navigable.includes(active) ? active : navigable[0];
  const createActive = activeKey === createId;
  const currentActive = createActive
    ? undefined
    : enabled.find((option) => option.value === activeKey);
  const optionId = (value: string) =>
    `${generated}-option-${options.findIndex((option) => option.value === value)}`;
  const activeId = createActive ? createId : currentActive && optionId(currentActive.value);
  React.useEffect(() => {
    if (open && activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [open, activeId]);
  const latestComplete = React.useRef((_option: MultiSelectOption) => {});
  React.useLayoutEffect(() => {
    latestComplete.current = (option) => {
      if (onSearch)
        setRemembered((known) => [...known.filter((item) => item.value !== option.value), option]);
      apply(
        props.multiple === false
          ? [option.value]
          : [...selected.filter((value) => value !== option.value), option.value],
        true
      );
    };
  });
  const startCreate = () => {
    if (!createAction || createBlocked || disabled) return;
    const started = query.trim();
    changeOpen(false);
    createAction.onSelect({
      query: started,
      complete: (option) => latestComplete.current(option)
    });
  };
  const groups = [...new Set(filtered.map((option) => option.group ?? ""))];
  const all = () => apply([...selected, ...eligible.map((option) => option.value)]);
  const none = () =>
    apply(selected.filter((value) => !eligible.some((option) => option.value === value)));
  const toggle = (option: MultiSelectOption) => {
    if (option.disabled || disabled) return;
    if (onSearch)
      setRemembered((known) => [...known.filter((item) => item.value !== option.value), option]);
    if (props.multiple === false) {
      apply([option.value]);
      changeOpen(false);
    } else
      apply(
        selected.includes(option.value)
          ? selected.filter((value) => value !== option.value)
          : [...selected, option.value]
      );
  };
  const keydown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "a" &&
      props.multiple !== false
    ) {
      event.preventDefault();
      if (allSelected) none();
      else all();
      return;
    }
    if (event.target instanceof HTMLButtonElement) return;
    if (event.key === "Backspace" && !query && props.onEmptyBackspace) {
      event.preventDefault();
      props.onEmptyBackspace();
      return;
    }
    if (event.key === "Enter" && activeKey === undefined && canCreate) {
      event.preventDefault();
      create();
      return;
    }
    const index = activeKey === undefined ? -1 : navigable.indexOf(activeKey);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        navigable[
          (index + (event.key === "ArrowDown" ? 1 : -1) + navigable.length) % navigable.length
        ] ?? ""
      );
    } else if ((event.key === "Home" || event.key === "End") && event.target !== search.current) {
      event.preventDefault();
      setActive((event.key === "Home" ? navigable[0] : navigable[navigable.length - 1]) ?? "");
    } else if (
      (event.key === "Enter" || (event.key === " " && event.target !== search.current)) &&
      activeKey !== undefined
    ) {
      event.preventDefault();
      if (currentActive) toggle(currentActive);
      else startCreate();
    } else if (
      !searchable &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const now = Date.now();
      prefix.current = {
        value:
          (now - prefix.current.at < 500 ? prefix.current.value : "") + event.key.toLowerCase(),
        at: now
      };
      const found = enabled.find((option) =>
        option.label.toLowerCase().startsWith(prefix.current.value)
      );
      if (found) setActive(found.value);
    }
  };
  return (
    <Popover open={open && !disabled} onOpenChange={changeOpen}>
      {anchorRef && <PopoverAnchor virtualRef={anchorRef} />}
      <PopoverTrigger
        ref={ref}
        asChild
        disabled={disabled}
        {...field}
        aria-label={label}
        aria-invalid={invalid || field["aria-invalid"] || undefined}
      >
        {trigger ? (
          React.cloneElement(trigger, {
            ...field,
            disabled: disabled || trigger.props.disabled,
            "aria-disabled": disabled || trigger.props.disabled || trigger.props["aria-disabled"],
            "aria-haspopup": "listbox",
            tabIndex: disabled ? -1 : trigger.props.tabIndex,
            onClickCapture: (event: React.MouseEvent<HTMLElement>) => {
              if (disabled) {
                event.preventDefault();
                event.stopPropagation();
              } else trigger.props.onClickCapture?.(event);
            },
            onKeyDownCapture: (event: React.KeyboardEvent<HTMLElement>) => {
              if (disabled && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                event.stopPropagation();
              } else trigger.props.onKeyDownCapture?.(event);
            },
            id: field.id ?? trigger.props.id,
            "aria-labelledby": field["aria-labelledby"] ?? trigger.props["aria-labelledby"],
            "aria-describedby":
              [field["aria-describedby"], trigger.props["aria-describedby"]]
                .filter(Boolean)
                .join(" ") || undefined,
            "aria-invalid": invalid || field["aria-invalid"] || trigger.props["aria-invalid"]
          })
        ) : (
          <button
            {...field}
            type="button"
            aria-label={label}
            aria-haspopup="listbox"
            disabled={disabled}
            data-slot="multi-select"
            data-side={side}
            data-align={align}
            data-size={size}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
              event.preventDefault();
              changeOpen(true);
            }}
            className={cn(
              controlStyles.field,
              controlStyles.trigger,
              controlStyles.triggerHover,
              className
            )}
          >
            <span
              className={styles.triggerValue}
              data-slot="multi-select-value"
              data-placeholder={!chosen.length || undefined}
            >
              {summary}
            </span>
            <Icon name="chev-down" className={controlStyles.chevron} data-chevron="" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        surface="menu"
        className={styles.panelColumn}
        style={{ width: menuWidth }}
        onFocusOutside={(event) => {
          if (!closeOnFocusOutside) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          const clear =
            event.target instanceof Element && event.target.closest('[data-slot="combobox-clear"]');
          if (clear && (!clear.isConnected || anchorRef?.current?.contains(clear)))
            event.preventDefault();
        }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (searchable ? search.current : list.current)?.focus();
        }}
        onKeyDown={keydown}
      >
        {searchable && (
          <div className={controlStyles.searchRow} data-slot="multi-select-search">
            <Icon name="search" />
            <input
              ref={search}
              role="combobox"
              aria-label={`Search ${label}`}
              aria-controls={listId}
              aria-expanded={open}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder={searchPlaceholder}
            />
            {loading && <Spinner />}
          </div>
        )}
        {multiple && quickActions ? (
          <div className={styles.quickBar} data-slot="multi-select-actions">
            <span role="status" aria-live="polite" className={styles.quickStatus}>
              {onSearch
                ? `${selected.length} selected`
                : `${chosen.length} of ${options.length} selected`}
            </span>
            {[
              { text: "Select all", disabled: allSelected, run: all },
              { text: "Deselect all", disabled: noneSelected, run: none }
            ].map((action) => (
              <Button
                key={action.text}
                type="button"
                variant="ghost"
                size="xs"
                disabled={disabled || action.disabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  action.run();
                  list.current?.focus();
                }}
              >
                {action.text}
              </Button>
            ))}
          </div>
        ) : (
          <span role="status" aria-live="polite" className="sr-only">
            {selected.length} selected
          </span>
        )}
        {!filtered.length && (
          <p role={onSearch ? "status" : undefined} className={menu.empty}>
            {loading ? "Searching…" : "No options found"}
          </p>
        )}
        <div
          ref={listInset}
          id={listId}
          role="listbox"
          aria-label={label}
          aria-busy={loading || undefined}
          aria-multiselectable={multiple || undefined}
          tabIndex={0}
          aria-activedescendant={activeId}
          aria-owns={createAction ? createId : undefined}
          data-scroll-fade="y"
          className={cn(menu.list, menu.inset)}
        >
          {groups.map((group) => (
            <div key={group} role="group" aria-label={group || undefined}>
              {group && <div className={menu.label}>{group}</div>}
              {filtered
                .filter((option) => (option.group ?? "") === group)
                .map((option) => (
                  <div
                    key={option.value}
                    id={optionId(option.value)}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected.includes(option.value)}
                    aria-disabled={option.disabled || undefined}
                    data-active={currentActive?.value === option.value || undefined}
                    className={cn(menu.row, styles.option)}
                    onPointerMove={() => {
                      if (!option.disabled) setActive(option.value);
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => toggle(option)}
                  >
                    {multiple && (
                      <span
                        aria-hidden
                        data-state={selected.includes(option.value) ? "checked" : "unchecked"}
                        className={cn(controlStyles.choiceMark, styles.optionBox)}
                      >
                        {selected.includes(option.value) && (
                          <Icon name="check" size={13} strokeWidth={2.6} />
                        )}
                      </span>
                    )}
                    {option.icon ? (
                      <Icon icon={option.icon} />
                    ) : (
                      option.media && <span data-menu-icon="">{option.media}</span>
                    )}
                    {option.description ? (
                      <span className={cn(menu.text, styles.optionLabel)}>
                        <span className={menu.title}>{option.label}</span>
                        <span
                          className={menu.description}
                          onPointerEnter={(event) => titleIfClamped(event.currentTarget)}
                        >
                          {option.description}
                        </span>
                      </span>
                    ) : (
                      <span className={styles.optionLabel}>{option.label}</span>
                    )}
                    {option.meta && <span className={styles.optionMeta}>{option.meta}</span>}
                    {!multiple && (
                      <span className={styles.optionCheck}>
                        {selected.includes(option.value) && <Icon name="check" />}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          ))}
          <ListHighlight />
        </div>
        {createAction && (
          <div className={cn(menu.inset, menu.actionFooter)} data-slot="multi-select-create-footer">
            <div
              id={createId}
              role="option"
              tabIndex={-1}
              aria-selected={false}
              aria-disabled={createBlocked || disabled ? true : undefined}
              data-active={createActive || undefined}
              data-slot="multi-select-create"
              className={cn(menu.row, styles.option)}
              onPointerMove={() => {
                if (!createBlocked) setActive(createId);
              }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={startCreate}
            >
              <Icon name="plus" />
              <span className={styles.optionLabel}>{createAction.label}</span>
              {createBlocked && <span className={styles.optionMeta}>{createBlocked}</span>}
            </div>
          </div>
        )}
        {canCreate && (
          <div className={menu.footer} data-slot="multi-select-footer">
            {canCreate && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                loading={creating}
                disabled={disabled}
                onClick={create}
              >
                {props.createLabel?.(query.trim()) ?? `Create "${query.trim()}"`}
              </Button>
            )}
          </div>
        )}
        {createError && (
          <p role="alert" className={styles.error}>
            {createError}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
MultiSelect.displayName = "MultiSelect";
