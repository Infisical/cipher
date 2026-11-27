import * as React from "react";
import { createPortal, flushSync } from "react-dom";

import { FrameScope, useFrameFoot, useInFrame } from "../lib/frame-context";
import { useListFiltered } from "../lib/list-query";
import { useSortable } from "../lib/sortable";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { type EmptyGhost, EmptyScope } from "./empty";
import { Icon, type IconSource } from "./icon";
import { NameLine } from "./name-line";
import { Skeleton } from "./skeleton";
import { SortableAnnouncer, SortableHandle } from "./sortable-list";
import {
  rowActionSlots,
  RowActions,
  RowContextMenu,
  Table,
  EditableCell,
  type InlineEdit,
  TableActionsCell,
  TableActionsHead,
  TableBody,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeadButton,
  TableHeader,
  TableLoadingRows,
  TableRow,
  TableRowActions,
  type RowAction,
  type UpToThree
} from "./table";
import { EMPTY_VALUE, EmptyValue } from "./text";
import { Tooltip } from "./tooltip";

import styles from "./data.module.css";
import frame from "./frame.module.css";

export interface DataTableColumn<Row> {
  id: string;
  header: string;
  render?: (row: Row, index: number) => React.ReactNode;
  toggle?: DataTableToggle<Row>;
  /** The cell's plain text: its hover title when the value truncates, and the value itself when the column has no render. */
  text?: (row: Row) => string;
  /** The row's name column. Without a width or minWidth it keeps at least size-text-min, so on a narrow screen the table scrolls sideways instead of squeezing names. A page-scrolling virtual table can't scroll sideways, so there it keeps size-cell-min. */
  primary?: boolean;
  /** Sets the column in mono, for machine values compared character by character: secret keys, key IDs, hashes, hosts. Names people chose stay in the sans. */
  mono?: boolean;
  /** Wraps long text onto more lines and grows the row, instead of truncating it to one line. */
  wrap?: boolean;
  /** Badges or icons right after the value, such as a status badge or a description tooltip. The value truncates before they do; at the narrowest widths, once the value is down to 12 characters, a badge that no longer fits hides whole. */
  badges?: (row: Row, index: number) => React.ReactNode;
  /** A muted second line under the cell's value, such as an email under a name or a key under a label. */
  secondary?: (row: Row, index: number) => React.ReactNode;
  /** The column's cell in a summary row under the body, such as a total. Any column with a footer adds the row. */
  footer?: React.ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  grow?: boolean;
  /** Hides the column while the table is too narrow to show every column, when the primary column's names would truncate or the table would scroll sideways. For secondary columns such as a usage or a description. */
  dropFirst?: boolean;
  align?: "start" | "end" | "center";
  /** Where the cell's content sits in a row taller than one line. Defaults to top when any column wraps, so values line up with the first line of the wrapped text, and to center otherwise. A one-line row looks the same either way. */
  valign?: "top" | "center";
  actions?: boolean;
  /** true pins the column to the inline end (the actions tail); start pins it to the inline start, after a pinned selection column. */
  pin?: boolean | "start";
  hideHeader?: boolean;
  /** Edits the cell in place for this row, or undefined when the row can't be edited. Click the cell, or press Enter or F2 on it, to open the editor. */
  edit?: (row: Row) => InlineEdit | undefined;
  /**
   * How the column renders while the table is stacked (stackBelow). row: a label and value line
   * under the row's title. meta: the value trails the title line, for a short predictable value such as a
   * time or a count. hidden: left out. The primary column is always the title. Defaults to row.
   */
  stack?: "row" | "meta" | "hidden";
}
/** Attributes and handlers for a data row's tr, such as drag and drop handlers that make it a drop target. */
export type DataTableRowProps = Omit<
  React.HTMLAttributes<HTMLTableRowElement>,
  "children" | "dangerouslySetInnerHTML" | "className" | "style"
> & {
  /** Draws a drop indicator: an edge before or after the row, or the whole row as the target. */
  "data-drop-target"?: "before" | "after" | "inside";
  [data: `data-${string}`]: string | number | boolean | undefined;
};
export interface DataTableToggle<Row> {
  checked: (row: Row) => boolean | "indeterminate";
  onChange: (rowIds: string[], checked: boolean) => void;
  disabledReason?: (row: Row) => string | undefined;
  absent?: (row: Row) => boolean;
  adornment?: (row: Row) => React.ReactNode;
  label?: string;
}
export interface DataTableRowAction<Row> {
  label: string | ((row: Row) => string);
  icon: IconSource;
  onSelect: (row: Row) => void;
  disabledReason?: (row: Row) => string | undefined;
  /** True while the action runs on this row: the button shows its spinner and is blocked, at the same size. */
  loading?: (row: Row) => boolean;
}
export interface DataTableRowActions<Row> {
  /** At most three icon actions, the same set on every row; a blocked one stays visible and disabled with its reason. */
  inline?: UpToThree<DataTableRowAction<Row>>;
  /** Items for the More menu after the inline actions, for everything past the first three. */
  renderMenu?: (row: Row) => React.ReactNode;
  menuLabel?: string;
  menuDisabledReason?: (row: Row) => string | undefined;
  header?: string;
}
export interface DataTableGroup<Row> {
  id: string;
  /** The header row's label, such as the parent resource's name or a link to it. */
  label: React.ReactNode;
  /** Plain-text name for the group's checkbox ("Select all in name") when label is not a string. */
  name?: string;
  rows: readonly Row[];
  /** Muted text after the label, such as the group's row count. */
  meta?: React.ReactNode;
  /** The group's own actions, such as a RowActions menu, drawn in the actions tail. Needs rowActions. */
  actions?: React.ReactNode;
}
interface DataTableBaseProps<Row> {
  label: string;
  columns: readonly DataTableColumn<Row>[];
  getRowId: (row: Row) => string;
  rowLabel: (row: Row) => string;
  variant?: "basic" | "striped" | "bordered";
  selectable?: boolean;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectionChange?: (ids: string[]) => void;
  isSelectable?: (row: Row) => boolean;
  selectionDisabledReason?: (row: Row) => string | undefined;
  sort?: { columnId: string; direction: "asc" | "desc" };
  onSortChange?: (sort: { columnId: string; direction: "asc" | "desc" }) => void;
  empty?: React.ReactNode;
  /** The ghost behind an Empty in the empty slot. Defaults to rows, and to none while filtered or when the table sits flush in a framed Card. */
  ghost?: EmptyGhost;
  /** The rows are narrowed by a search or filters, so an empty table means no matches and draws no ghost. Inside a ListQueryScope it follows the FilterBar unless passed. */
  filtered?: boolean;
  /** Caps the table in its own scroll window. With virtual, the window is trimmed to the header plus whole rows, so no row is cut at the bottom edge. */
  height?: number;
  /**
   * Renders only the rows in view. With height it windows the table's own scroll; without height the
   * table flows with the page, its header sticks to the top of the page's scroll area, and rows are
   * windowed against that scroll. Horizontal overflow is clipped then, so size the columns to fit.
   */
  virtual?: boolean;
  rowHeight?: number;
  /**
   * A quiet "Show more" at the end of the footer. In a framed Card with footerPlacement="frame" and no
   * footer of its own, the footer moves into the card's frame band; anywhere else it is the table's own.
   */
  loadMore?: { label?: string; onClick: () => void; loading?: boolean };
  /** Collapses rows that loadMore added, beside "Show more" in the footer. */
  showFewer?: { label?: string; onClick: () => void };
  /** Shown at the end of the footer once loadMore is gone, such as "End of events". */
  end?: React.ReactNode;
  /**
   * State that must stay visible under the rows, such as "Showing 5 of 120 after filter". It starts
   * the footer, muted, before any loadMore. Never an action result: copied, saved, deleted, moved,
   * uploaded and failures go to a toast.
   */
  persistentStatus?: React.ReactNode;
  onRowActivate?: (row: Row) => void;
  /** Rows that return false keep the default cursor, take no row focus stop, and ignore click and Enter. Defaults to every row. */
  isRowActivatable?: (row: Row) => boolean;
  pagination?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  /** A background refetch: the current rows stay, with a thin sweep on the top edge instead of loading's skeleton. */
  refreshing?: boolean;
  actionBar?: React.ReactNode;
  /** Row ids being edited. Their rows render focused and the other rows dim until the value clears. */
  focusedRowId?: string | readonly string[];
  /** Persistent row actions in the sticky tail column: inline icon actions, then the More menu. */
  rowActions?: DataTableRowActions<Row>;
  /** Right-click (and Shift+F10 or the Menu key) on a data row opens its inline actions and More menu items. On by default with rowActions. */
  rowContextMenu?: boolean;
  /** The scroll container (vertical and horizontal), for ports that read scrollTop or observe it. */
  containerRef?: React.Ref<HTMLDivElement>;
  /** Layout classes for the scroll container, such as a flex-fill height. */
  containerClassName?: string;
  /** One level of child rows under a row, indented by space-row-indent. */
  getRowChildren?: (row: Row) => readonly Row[] | undefined;
  /** Rows that stay in the table but read as inactive, such as disabled or archived ones: muted text on the done ground. */
  isRowMuted?: (row: Row) => boolean;
  /** Tints a row by tone: bad marks one that is invalid, such as a row an import cannot take, and colors the icons in its primary cell, other than its badges. */
  rowTone?: (row: Row) => "bad" | undefined;
  /**
   * Rows the viewer may not see, such as a member hidden by their permissions: return the reason to
   * restrict one. It renders muted with a lock and the reason in the primary column, leaves its other
   * cells empty, and takes no selection, actions, editing or activation.
   */
  getRowRestricted?: (row: Row) => string | undefined;
  /** Extra attributes and handlers for each data row's tr. Handlers run before DataTable's own, which skip a default-prevented event. */
  rowProps?: (row: Row, index: number) => DataTableRowProps;
  /**
   * Lets a person put the rows in order: a grip at the start of the first column picks a row up by
   * pointer or keyboard, and a drop edge shows where it lands. Flat rows only; leave sort unset while it
   * is on.
   */
  reorder?: {
    onReorder: (rows: Row[]) => void;
    /** A disabled row keeps its grip inert; other rows can still move past it. */
    isRowDisabled?: (row: Row) => boolean;
  };
  /**
   * Stacks each row while the table's container is narrower than this many CSS pixels: the primary
   * cell becomes a title line with the More menu at its end, and the other columns become label and
   * value lines under it (see column stack). Select all and sort move to a band above the rows.
   */
  stackBelow?: number;
  /** paper sets the header row on its own ground, for a table with a toolbar or notice band stacked above it. */
  headerGround?: "paper";
}
export type DataTableProps<Row> = DataTableBaseProps<Row> &
  (
    | { rows: readonly Row[]; groups?: never }
    | {
        /** Rows under full-width group header rows, one tbody per group. Groups with no rows are not drawn. */
        groups: readonly DataTableGroup<Row>[];
        rows?: never;
      }
  );
export function DataTable<Row>({
  label,
  rows: flatRows,
  groups,
  getRowChildren,
  columns: allColumns,
  getRowId,
  rowLabel,
  variant = "basic",
  selectable,
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  isSelectable: isSelectableProp = () => true,
  selectionDisabledReason,
  sort,
  onSortChange,
  empty = "No rows",
  ghost,
  filtered: filteredProp,
  height,
  virtual = false,
  rowHeight,
  loadMore,
  showFewer,
  end,
  persistentStatus,
  onRowActivate,
  isRowActivatable,
  pagination,
  loading = false,
  loadingRows = 5,
  refreshing = false,
  actionBar,
  focusedRowId,
  rowActions,
  rowContextMenu = true,
  containerRef,
  containerClassName,
  isRowMuted,
  rowTone,
  getRowRestricted,
  rowProps,
  reorder,
  stackBelow,
  headerGround
}: DataTableProps<Row>) {
  const embedded = useInFrame("DataTable");
  const frameFoot = useFrameFoot();
  const footId = React.useId();
  const listFiltered = useListFiltered();
  const filtered = filteredProp ?? listFiltered;
  const [ownSelected, setOwnSelected] = React.useState<readonly string[]>(defaultSelectedIds);
  const [top, setTop] = React.useState(0);
  const scroll = React.useRef<HTMLDivElement>(null);
  const attachScroll = React.useCallback(
    (node: HTMLDivElement | null) => {
      scroll.current = node;
      if (typeof containerRef === "function") containerRef(node);
      else if (containerRef) containerRef.current = node;
    },
    [containerRef]
  );
  const [frameWidth, setFrameWidth] = React.useState<number | null>(null);
  const stacked = stackBelow !== undefined && frameWidth !== null && frameWidth < stackBelow;
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (stackBelow === undefined || !container) return;
    const measure = () => setFrameWidth(container.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [stackBelow]);
  const [narrow, setNarrow] = React.useState<number | null>(null);
  const bare =
    !loading && !(groups ? groups.some((group) => group.rows.length > 0) : flatRows?.length);
  const droppable = allColumns.some((column) => column.dropFirst);
  const squeezed = bare && narrow !== null && !stacked;
  const primaryColumn = allColumns.find((column) => column.primary);
  const primaryCap = primaryColumn?.width ?? primaryColumn?.maxWidth ?? Infinity;
  let columns = allColumns;
  if (stacked) columns = allColumns.filter((column) => column.stack !== "hidden");
  else if (narrow !== null) columns = allColumns.filter((column) => !column.dropFirst);
  const columnShape = allColumns
    .map((column) =>
      [column.id, column.width, column.minWidth, column.grow, column.dropFirst].join(":")
    )
    .join("|");
  React.useLayoutEffect(() => setNarrow(null), [columnShape, bare, stacked]);
  const [primaryWidth, setPrimaryWidth] = React.useState<number>();
  const [headWidths, setHeadWidths] = React.useState<Record<string, number>>({});
  const [landing, setLanding] = React.useState<number | null>(null);
  const [focusRow, setFocusRow] = React.useState<number | null>(null);
  const focusPending = React.useRef(false);
  const [tokenRowHeight, setTokenRowHeight] = React.useState<number>();
  const requestedRowHeight = rowHeight ?? tokenRowHeight;
  const [measuredRow, setMeasuredRow] = React.useState({
    requested: requestedRowHeight,
    height: requestedRowHeight
  });
  const effectiveRowHeight =
    measuredRow.requested === requestedRowHeight ? measuredRow.height : requestedRowHeight;
  const expand = (list: readonly Row[], depth: number) =>
    list.flatMap((row) => [
      { row, depth },
      ...(getRowChildren?.(row) ?? []).map((child) => ({ row: child, depth: depth + 1 }))
    ]);
  const sections = groups
    ? groups
        .filter((group) => group.rows.length > 0)
        .map((group) => ({ group, entries: expand(group.rows, 0) }))
    : [{ group: undefined, entries: expand(flatRows ?? [], 0) }];
  const entries = sections.flatMap((section) => section.entries);
  const rows = entries.map((entry) => entry.row);
  const indentColumn = (columns.find((column) => column.primary) ?? columns[0])?.id;
  const isSelectable = (row: Row) =>
    !getRowRestricted?.(row) && isSelectableProp(row) && !selectionDisabledReason?.(row);
  const selected = selectedIds ?? ownSelected;
  const eligible = rows.filter(isSelectable).map(getRowId);
  const checked = eligible.filter((id) => selected.includes(id)).length;
  const update = (next: string[]) => {
    if (selectedIds === undefined) setOwnSelected(next);
    onSelectionChange?.(next);
  };
  const groupCheckbox = (group: DataTableGroup<Row>, groupEntries: readonly { row: Row }[]) => {
    const ids = groupEntries.map((entry) => entry.row).filter(isSelectable).map(getRowId);
    const on = ids.filter((id) => selected.includes(id)).length;
    const name = group.name ?? (typeof group.label === "string" ? group.label : group.id);
    return (
      <Checkbox
        aria-label={`Select all in ${name}`}
        disabled={!ids.length}
        checked={on > 0 && on < ids.length ? "indeterminate" : ids.length > 0 && on === ids.length}
        onCheckedChange={() =>
          update(
            on === ids.length
              ? selected.filter((id) => !ids.includes(id))
              : [...new Set([...selected, ...ids])]
          )
        }
      />
    );
  };
  const toggle = (id: string) =>
    update(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  const selectAll = (bandLabel?: string) => (
    <Checkbox
      aria-label={bandLabel ? undefined : `Select all available rows in ${label}`}
      label={bandLabel}
      disabled={loading || !eligible.length}
      checked={
        checked > 0 && checked < eligible.length
          ? "indeterminate"
          : eligible.length > 0 && checked === eligible.length
      }
      onCheckedChange={() =>
        update(
          checked === eligible.length
            ? selected.filter((id) => !eligible.includes(id))
            : [...new Set([...selected, ...eligible])]
        )
      }
    />
  );
  const windowed = Boolean(virtual && !groups);
  const flowing = windowed && !height;
  const pinnedFoot = Boolean((persistentStatus || loadMore || showFewer) && !pagination);
  const wantsFrameFoot = embedded && pinnedFoot;
  const footOwner = frameFoot?.owner;
  const footTarget = wantsFrameFoot && footOwner === footId ? (frameFoot?.target ?? null) : null;
  const [viewport, setViewport] = React.useState(0);
  const [chrome, setChrome] = React.useState<{ head: number; rest: number } | null>(null);
  const windowSize =
    windowed && effectiveRowHeight
      ? Math.ceil((height ?? viewport) / effectiveRowHeight) + 8
      : rows.length;
  const wholeRows =
    windowed && !stacked && height && effectiveRowHeight && chrome
      ? Math.floor((height - chrome.head - chrome.rest) / effectiveRowHeight)
      : 0;
  const frameHeight =
    wholeRows > 0 && effectiveRowHeight && chrome
      ? chrome.head + chrome.rest + wholeRows * effectiveRowHeight
      : height;
  const [stackHeights, setStackHeights] = React.useState<Record<string, number>>({});
  let stackOffsets: number[] | undefined;
  if (stacked && windowed) {
    const measured = Object.values(stackHeights);
    const lines = columns.filter(
      (column) => !column.primary && !column.actions && column.stack !== "meta"
    ).length;
    const estimate =
      rowHeight ??
      (measured.length
        ? measured.reduce((sum, value) => sum + value, 0) / measured.length
        : (tokenRowHeight ?? 40) * (1 + lines * 0.75));
    stackOffsets = [0];
    for (const row of rows)
      stackOffsets.push(
        stackOffsets[stackOffsets.length - 1] + (stackHeights[getRowId(row)] ?? estimate)
      );
  }
  let start = 0;
  let stop = rows.length;
  if (stackOffsets) {
    start = Math.max(0, rowAt(stackOffsets, top) - 4);
    stop = Math.min(rows.length, rowAt(stackOffsets, top + (height ?? viewport)) + 5);
  } else if (windowed) {
    start = effectiveRowHeight
      ? Math.max(0, Math.min(Math.floor(top / effectiveRowHeight) - 4, rows.length - windowSize))
      : 0;
    stop = effectiveRowHeight ? Math.min(rows.length, start + windowSize) : 0;
  }
  const spacerAbove = stackOffsets ? stackOffsets[start] : start * (effectiveRowHeight ?? 0);
  const spacerBelow = stackOffsets
    ? stackOffsets[rows.length] - stackOffsets[stop]
    : (rows.length - stop) * (effectiveRowHeight ?? 0);
  React.useLayoutEffect(() => {
    const container = scroll.current;
    const head = container?.querySelector("thead");
    if (!height || !windowed || !container || !head) return;
    const measure = () => {
      const bands = container.querySelectorAll<HTMLElement>(
        "[data-slot='data-table-pagination'], [data-slot='data-table-more']"
      );
      const next = {
        head: head.getBoundingClientRect().height,
        rest:
          container.offsetHeight -
          container.clientHeight +
          [...bands].reduce((sum, band) => sum + band.getBoundingClientRect().height, 0)
      };
      setChrome((current) =>
        current?.head === next.head && current.rest === next.rest ? current : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(head);
    observer.observe(container);
    container
      .querySelectorAll("[data-slot='data-table-pagination'], [data-slot='data-table-more']")
      .forEach((band) => observer.observe(band));
    return () => observer.disconnect();
  }, [height, windowed, pinnedFoot, Boolean(footTarget), Boolean(pagination)]);
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (!flowing || !container) return;
    let scroller = container.parentElement;
    while (
      scroller &&
      scroller !== document.documentElement &&
      !/auto|scroll/.test(getComputedStyle(scroller).overflowY)
    )
      scroller = scroller.parentElement;
    const sync = () => {
      const box = scroller?.getBoundingClientRect();
      const viewTop = Math.max(0, box?.top ?? 0);
      const viewBottom = Math.min(window.innerHeight, box?.bottom ?? window.innerHeight);
      setTop(Math.max(0, viewTop - container.getBoundingClientRect().top));
      setViewport(Math.max(0, viewBottom - viewTop));
    };
    sync();
    document.addEventListener("scroll", sync, { capture: true, passive: true });
    window.addEventListener("resize", sync);
    const observer = new ResizeObserver(sync);
    observer.observe(container);
    if (scroller) observer.observe(scroller);
    return () => {
      document.removeEventListener("scroll", sync, { capture: true });
      window.removeEventListener("resize", sync);
      observer.disconnect();
    };
  }, [flowing]);
  React.useLayoutEffect(() => {
    if (rowHeight !== undefined || !scroll.current) return;
    const token = parseFloat(getComputedStyle(scroll.current).getPropertyValue("--cipher-size-row"));
    if (token > 0) setTokenRowHeight(token);
  }, [rowHeight]);
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (!container || !stacked || !windowed) return;
    const visibleRows = Array.from(
      container.querySelectorAll<HTMLElement>("tbody tr[data-row-index]")
    );
    const measure = () => {
      const next: Record<string, number> = {};
      for (const element of visibleRows) {
        const row = rows[Number(element.dataset.rowIndex)];
        if (row !== undefined) next[getRowId(row)] = element.getBoundingClientRect().height;
      }
      setStackHeights((current) =>
        Object.entries(next).every(([id, value]) => Math.abs((current[id] ?? -1) - value) < 0.5)
          ? current
          : { ...current, ...next }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    visibleRows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [stacked, windowed, start, stop, rows, columns, getRowId]);
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (!container || stacked || !windowed || !requestedRowHeight || !effectiveRowHeight) return;
    const visibleRows = Array.from(
      container.querySelectorAll<HTMLElement>("tbody tr[aria-rowindex]")
    );
    const measure = () => {
      const actual = Math.max(
        requestedRowHeight,
        ...visibleRows
          .filter((row) => !row.querySelector("[data-editing]"))
          .map((row) => row.getBoundingClientRect().height)
      );
      if (actual > effectiveRowHeight + 0.5)
        setMeasuredRow({ requested: requestedRowHeight, height: actual });
    };
    measure();
    const observer = new ResizeObserver(measure);
    visibleRows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [requestedRowHeight, effectiveRowHeight, stacked, windowed, start, stop, rows, columns]);
  const landingTop =
    landing === null
      ? 0
      : (stackOffsets?.[landing - 1] ?? (landing - 1) * (effectiveRowHeight ?? 0));
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (
      landing === null ||
      !container ||
      !effectiveRowHeight ||
      loadMore?.loading ||
      rows.length <= landing
    )
      return;
    if (!flowing) {
      container.scrollTop = Math.max(0, landingTop);
      setTop(container.scrollTop);
    }
    focusPending.current = true;
    setFocusRow(landing);
    setLanding(null);
  }, [landing, landingTop, loadMore?.loading, rows.length, effectiveRowHeight, flowing]);
  React.useLayoutEffect(() => {
    if (!focusPending.current || focusRow === null) return;
    const row = scroll.current?.querySelector<HTMLElement>(
      `tbody tr[data-row-index="${focusRow}"]`
    );
    if (!row) return;
    focusPending.current = false;
    row.focus({ preventScroll: true });
  }, [focusRow, start]);
  const toggleCounts = (toggle: DataTableToggle<Row>) => {
    const enabled = rows.filter(
      (row) => !getRowRestricted?.(row) && !toggle.absent?.(row) && !toggle.disabledReason?.(row)
    );
    return {
      enabled,
      on: enabled.filter((row) => toggle.checked(row) === true).length,
      off: enabled.filter((row) => toggle.checked(row) === false).length
    };
  };
  const slots = rowActions
    ? rowActionSlots(rowActions.inline?.length ?? 0, Boolean(rowActions.renderMenu))
    : 0;
  const actionsColumn = Boolean(rowActions) && (loading || rows.length > 0);
  const span = columns.length + (selectable ? 1 : 0) + (actionsColumn ? 1 : 0);
  const hasGrowingColumn = columns.some((column) => column.grow && column.width === undefined);
  const fixedLayout =
    squeezed ||
    columns.every((column) => column.width !== undefined || column.grow || column.actions);
  const explicitWidth = (column: DataTableColumn<Row>) =>
    squeezed || column.width === undefined
      ? undefined
      : Math.max(column.width, headWidths[column.id] ?? 0);
  const primaryMin = flowing ? "var(--cipher-size-cell-min)" : "var(--cipher-size-text-min)";
  const columnFloor = (column: DataTableColumn<Row>) => {
    if (column.minWidth) return `${column.minWidth}px`;
    return column.primary ? primaryMin : "var(--cipher-size-cell-min)";
  };
  const sharing = columns.filter((column) => column.width === undefined && !column.actions);
  const fixedFloor = [
    ...columns
      .filter((column) => column.width === undefined && column.actions)
      .map(() => "var(--cipher-size-row)"),
    ...(sharing.length > 0 ? [`${sharing.length} * max(${sharing.map(columnFloor).join(", ")})`] : [])
  ];
  const fixedWidth = columns.reduce((sum, column) => sum + (explicitWidth(column) ?? 0), 0);
  const leading = columns.some((column) => column.pin === "start");
  const headerHidden =
    !selectable &&
    columns.every(
      (column) =>
        (column.hideHeader || column.actions) &&
        !column.toggle &&
        !(column.sortable && onSortChange)
    );
  const trailing =
    actionsColumn || columns.some((column) => column.pin === true || column.actions);
  const shrinkColumn = trailing
    ? columns.find((column) => column.primary && column.width === undefined && !column.wrap)?.id
    : undefined;
  const pinOffsets = new Map<string, string>();
  columns
    .filter((column) => column.pin === "start")
    .reduce((before, column) => {
      pinOffsets.set(column.id, `calc(${selectable ? "var(--cipher-size-row)" : "0px"} + ${before}px)`);
      return before + (explicitWidth(column) ?? 0);
    }, 0);
  const contentSized =
    fixedLayout && !flowing && !squeezed
      ? columns.find(
          (column) =>
            column.primary &&
            column.grow &&
            column.width === undefined &&
            !column.wrap &&
            sharing.some((other) => other !== column && other.grow)
        )?.id
      : undefined;
  const topByDefault = columns.some((column) => column.wrap);
  const topAligned = (column: DataTableColumn<Row>) =>
    !stacked && (column.valign ?? (topByDefault ? "top" : "center")) === "top";
  const stackTitle = stacked
    ? (columns.find((column) => column.primary) ?? columns.find((column) => !column.actions))?.id
    : undefined;
  const stackTrail = stacked
    ? columns.filter(
        (column) => column.id !== stackTitle && (column.actions || column.stack === "meta")
      )
    : [];
  const stackLines = stacked
    ? columns.filter((column) => column.id !== stackTitle && !stackTrail.includes(column))
    : [];
  const bodyStart = selectable ? 2 : 1;
  const stackPlace = (column: DataTableColumn<Row>): React.CSSProperties => {
    if (column.id === stackTitle) return { gridColumn: bodyStart, gridRow: 1 };
    const trail = stackTrail.indexOf(column);
    if (trail >= 0) return { gridColumn: bodyStart + 1 + trail, gridRow: 1 };
    return { gridColumn: `${bodyStart} / -1`, gridRow: 2 + stackLines.indexOf(column) };
  };
  const colIndex = (column: DataTableColumn<Row>) =>
    stacked ? columns.indexOf(column) + bodyStart : undefined;
  const role = <Role extends string>(name: Role) => (stacked ? name : undefined);
  const stackColumns = [
    ...(selectable ? ["auto"] : []),
    "minmax(0, 1fr)",
    ...stackTrail.map(() => "auto"),
    ...(actionsColumn ? ["auto"] : [])
  ].join(" ");
  const stackLabelLength = Math.max(0, ...stackLines.map((column) => column.header.length));
  const stackLine = (header: string | undefined, content: React.ReactNode) => (
    <div className={styles.tableStackLine}>
      {header !== undefined && (
        <span className={styles.tableStackLabel} aria-hidden>
          {header}
        </span>
      )}
      <div className={styles.tableStackValue}>{content}</div>
    </div>
  );
  const columnStyle = (
    column: DataTableColumn<Row>
  ): React.CSSProperties & {
    "--cipher-pin-offset"?: string;
  } => ({
    width:
      explicitWidth(column) ??
      (column.id === contentSized ? primaryWidth : undefined) ??
      (hasGrowingColumn && !squeezed && !column.grow && !column.actions ? "1%" : undefined),
    minWidth:
      explicitWidth(column) ??
      (column.actions || squeezed
        ? undefined
        : (column.minWidth ?? (column.primary ? primaryMin : 64))),
    maxWidth: column.maxWidth,
    textAlign: column.align,
    "--cipher-pin-offset": pinOffsets.get(column.id)
  });
  const cellStyle = (column: DataTableColumn<Row>) =>
    stacked ? stackPlace(column) : columnStyle(column);
  const headShape =
    fixedLayout && !flowing
      ? JSON.stringify(
          columns
            .filter((column) => column.width !== undefined)
            .map((column) => [
              column.id,
              column.header,
              Boolean(column.sortable && onSortChange),
              Boolean(column.hideHeader),
              Boolean(column.toggle)
            ])
        )
      : "";
  React.useLayoutEffect(() => {
    const head = scroll.current?.querySelector("thead tr");
    if (!headShape || !head) {
      setHeadWidths((current) => (Object.keys(current).length ? {} : current));
      return;
    }
    const ids = new Set((JSON.parse(headShape) as [string][]).map(([id]) => id));
    let live = true;
    const measure = () => {
      if (!live) return;
      const next: Record<string, number> = {};
      for (const cell of head.querySelectorAll<HTMLTableCellElement>("th[data-column]")) {
        const id = cell.dataset.column;
        if (!id || !ids.has(id)) continue;
        const probe = document.createElement("div");
        probe.style.cssText =
          "position:absolute;visibility:hidden;width:max-content;white-space:nowrap";
        probe.append(...Array.from(cell.childNodes, (node) => node.cloneNode(true)));
        cell.append(probe);
        const style = getComputedStyle(cell);
        next[id] = Math.ceil(
          probe.getBoundingClientRect().width +
            parseFloat(style.paddingLeft) +
            parseFloat(style.paddingRight) +
            parseFloat(style.borderLeftWidth) +
            parseFloat(style.borderRightWidth)
        );
        probe.remove();
      }
      setHeadWidths((current) =>
        Object.keys(next).length === Object.keys(current).length &&
        Object.entries(next).every(([id, width]) => current[id] === width)
          ? current
          : next
      );
    };
    measure();
    const remeasure = () => flushSync(measure);
    void document.fonts?.ready.then(remeasure);
    const observer = new ResizeObserver(remeasure);
    observer.observe(head);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [headShape]);
  const otherGrowing = sharing
    .filter((column) => column.grow && column.id !== contentSized)
    .map((column) => column.id)
    .join("\n");
  React.useLayoutEffect(() => {
    const container = scroll.current;
    if (
      stacked ||
      (!droppable && !bare) ||
      !container ||
      (contentSized && primaryWidth === undefined)
    )
      return;
    const measure = () => {
      const width = container.clientWidth;
      const truncated = Math.max(
        0,
        ...Array.from(
          container.querySelectorAll<HTMLElement>(`.${styles.tablePrimary}`),
          (cell) => {
          const name = cell.querySelector<HTMLElement>('[data-slot="name-line-name"]');
          const overflow = Math.max(
            cell.scrollWidth - cell.clientWidth,
            name ? name.scrollWidth - name.clientWidth : 0
          );
          return Math.min(overflow, primaryCap - cell.clientWidth);
          }
        )
      );
      const table = container.querySelector("table");
      const floors = () => {
        const tableMin = table ? getComputedStyle(table).minWidth : "";
        const cells = Array.from(table?.tHead?.rows[0]?.cells ?? [], (cell) => {
          const style = getComputedStyle(cell);
          const padding =
            style.boxSizing === "border-box"
              ? 0
              : parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
          return (parseFloat(style.minWidth) || 0) + padding;
        });
        return Math.max(
          tableMin.endsWith("px") ? parseFloat(tableMin) : 0,
          cells.reduce((sum, cell) => sum + cell, 0)
        );
      };
      const needed = bare ? floors() : container.scrollWidth + truncated;
      setNarrow((current) => {
        if (current === null) return needed > width + 1 ? needed : null;
        return width >= current ? null : current;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    const table = container.querySelector("table");
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [stacked, droppable, bare, narrow, contentSized, primaryWidth, primaryCap]);
  React.useLayoutEffect(() => {
    const table = scroll.current?.querySelector("table");
    if (!contentSized || !table) {
      setPrimaryWidth(undefined);
      return;
    }
    const header = (id: string) =>
      table.querySelector<HTMLTableCellElement>(`thead th[data-column="${CSS.escape(id)}"]`);
    const measure = () => {
      const head = header(contentSized);
      if (!head?.parentElement) return;
      const others = otherGrowing
        .split("\n")
        .map(header)
        .filter((cell): cell is HTMLTableCellElement => Boolean(cell));
      const width = (cell: Element) => cell.getBoundingClientRect().width;
      const available = others.reduce((sum, cell) => sum + width(cell), width(head));
      const floor = others.reduce(
        (sum, cell) => sum + (parseFloat(getComputedStyle(cell).minWidth) || 0),
        0
      );
      const span = (head.parentElement as HTMLTableRowElement).cells.length;
      const cells = [
        head,
        ...Array.from(table.tBodies).flatMap((body) =>
          Array.from(body.rows)
            .filter((row) => row.cells.length === span)
            .map((row) => row.cells[head.cellIndex])
        )
      ];
      const range = document.createRange();
      const contentEnd = (cell: HTMLTableCellElement) => {
        let end = 0;
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (node instanceof Text) {
            if (!node.data.trim()) continue;
            range.selectNodeContents(node);
            end = Math.max(end, range.getBoundingClientRect().right);
          } else if (node instanceof SVGSVGElement || node instanceof HTMLImageElement) {
            end = Math.max(end, node.getBoundingClientRect().right);
          }
        }
        const truncated = Array.from(
          cell.querySelectorAll<HTMLElement>(
            `[data-slot="name-line-name"], .${styles.tablePrimary}, .${styles.tableValue}`
          ),
          (element) => element.scrollWidth - element.clientWidth
        );
        return end + Math.max(0, ...truncated);
      };
      const natural = Math.max(
        ...cells.map((cell) => {
          const box = cell.getBoundingClientRect();
          const end = contentEnd(cell);
          return end > box.left
            ? end - box.left + parseFloat(getComputedStyle(cell).paddingRight)
            : 0;
        })
      );
      const next = Math.max(0, Math.min(Math.ceil(natural), Math.floor(available - floor)));
      setPrimaryWidth((current) =>
        current !== undefined && Math.abs(current - next) < 1 ? current : next
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    return () => observer.disconnect();
  }, [contentSized, otherGrowing, rows, loading]);
  const skeletonRows = Math.max(1, Math.floor(loadingRows));
  const showFooter =
    !loading && rows.length > 0 && columns.some((column) => column.footer !== undefined);
  const rowCount = rows.length + (groups ? sections.length : 0) + 1;
  const tableStyle: React.CSSProperties & { "--cipher-table-row-height"?: string } = {
    maxHeight: frameHeight,
    "--cipher-table-row-height": effectiveRowHeight ? `${effectiveRowHeight}px` : undefined
  };
  const more = loadMore ? (
    <Button
      type="button"
      variant="ghost"
      loading={Boolean(loadMore.loading)}
      onClick={() => {
        setLanding(rows.length);
        loadMore.onClick();
      }}
    >
      {loadMore.label ?? "Show more"}
    </Button>
  ) : (
    rows.length > 0 &&
    (typeof end === "string" || typeof end === "number" ? end !== "" && <span>{end}</span> : end)
  );
  const hasFoot = Boolean(persistentStatus || more || showFewer);
  const claimFoot = frameFoot?.claim;
  const releaseFoot = frameFoot?.release;
  React.useLayoutEffect(() => {
    if (wantsFrameFoot && claimFoot && footOwner === null) claimFoot(footId);
  }, [wantsFrameFoot, claimFoot, footOwner, footId]);
  React.useLayoutEffect(() => {
    if (!wantsFrameFoot || !releaseFoot) return undefined;
    return () => releaseFoot(footId);
  }, [wantsFrameFoot, releaseFoot, footId]);
  const foot = hasFoot && (
    <div className={styles.tableFootRow} data-slot="data-table-status">
      {persistentStatus && <span className={styles.tableFootStatus}>{persistentStatus}</span>}
      {(showFewer || more) && (
        <span className={styles.tableFootActions}>
          {showFewer && (
            <Button type="button" variant="ghost" onClick={showFewer.onClick}>
              {showFewer.label ?? "Show fewer"}
            </Button>
          )}
          {more}
        </span>
      )}
    </div>
  );
  const sortRows = useSortable({
    items: flatRows ?? [],
    getKey: getRowId,
    getLabel: rowLabel,
    onReorder: (next) => reorder?.onReorder(next)
  });
  const dropEdge = (position: number) => {
    const lift = sortRows.lift;
    if (!reorder || !lift || lift.to === lift.from || position !== lift.to) return undefined;
    return lift.to < lift.from ? "before" : "after";
  };
  const startRowDrag = (row: Row, body: HTMLElement | null) => {
    sortRows.pick(row, true);
    const follow = (event: PointerEvent) => {
      const lift = sortRows.liftRef.current;
      const hit = Array.from(body?.querySelectorAll<HTMLElement>("tr[data-row-index]") ?? []).find(
        (element) => {
          const box = element.getBoundingClientRect();
          return event.clientY >= box.top && event.clientY <= box.bottom;
        }
      );
      if (!lift || !hit) return;
      const box = hit.getBoundingClientRect();
      const slot = Number(hit.dataset.rowIndex) + (event.clientY > box.top + box.height / 2 ? 1 : 0);
      sortRows.moveTo(slot > lift.from ? slot - 1 : slot);
    };
    const stop = () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", follow);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };
  const rowHandle = (row: Row) => {
    const key = getRowId(row);
    const lifted = sortRows.lift?.key === key;
    return (
      <SortableHandle
        itemKey={key}
        label={rowLabel(row)}
        instructions={sortRows.instructions}
        lifted={lifted && !sortRows.lift?.pointer}
        disabled={Boolean(reorder?.isRowDisabled?.(row))}
        onPointerDown={(event) => {
          sortRows.container.current = event.currentTarget.closest("table");
          if (!sortRows.lift) startRowDrag(row, event.currentTarget.closest("tbody"));
        }}
        onKeyDown={(event) => {
          sortRows.container.current = (event.currentTarget as HTMLElement).closest("table");
          sortRows.keyDown(event, row, event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0);
        }}
        onBlur={(event) => sortRows.blur(event, row)}
      />
    );
  };
  const rowInline = (row: Row) =>
    rowActions?.inline?.map((action) => ({
      label: typeof action.label === "string" ? action.label : action.label(row),
      icon: action.icon,
      disabledReason: action.disabledReason?.(row),
      loading: action.loading?.(row),
      onSelect: () => action.onSelect(row)
    })) as UpToThree<RowAction> | undefined;
  const renderRow = (
    { row, depth }: { row: Row; depth: number },
    position: number,
    rowIndex: number
  ) => {
    const extra = rowProps?.(row, position);
    const restricted = getRowRestricted?.(row);
    const restrictedColumns = stacked
      ? columns.filter((column) => column.id === stackTitle)
      : columns;
    if (restricted)
      return (
        <TableRow
          {...extra}
          key={getRowId(row)}
          aria-rowindex={rowIndex}
          data-row-index={position}
          tabIndex={position === focusRow ? -1 : extra?.tabIndex}
          onBlur={(event) => {
            extra?.onBlur?.(event);
            if (position === focusRow) setFocusRow(null);
          }}
          data-muted=""
          data-restricted=""
          data-drop-target={dropEdge(position) ?? extra?.["data-drop-target"]}
          data-stack-row={stacked || undefined}
          data-depth={stacked && depth > 0 ? depth : undefined}
          role={role("row")}
          style={stacked ? undefined : { height: effectiveRowHeight }}
        >
          {selectable && (
            <TableCell
              selection
              pin={leading && !stacked ? "start" : undefined}
              role={role("cell")}
              aria-colindex={stacked ? 1 : undefined}
            />
          )}
          {restrictedColumns.map((column) => (
            <TableCell
              key={column.id}
              className={column.actions && !stacked ? styles.tableActions : undefined}
              style={cellStyle(column)}
              data-actions={column.actions || undefined}
              data-pin={stacked ? undefined : (column.pin ?? column.actions)}
              role={role("cell")}
              aria-colindex={colIndex(column)}
            >
              {column.id === (stackTitle ?? indentColumn) && (
                <CellContent
                  shrink={column.id === shrinkColumn}
                  secondary={undefined}
                  depth={depth > 0 && !stacked ? depth : undefined}
                  maxWidth={column.maxWidth}
                >
                  <div
                    className={styles.tablePrimary}
                    data-depth={depth > 0 && !stacked ? depth : undefined}
                    style={{ maxWidth: column.maxWidth }}
                  >
                    <NameLine media={<Icon name="lock" />} title={restricted}>
                      {restricted}
                    </NameLine>
                  </div>
                </CellContent>
              )}
            </TableCell>
          ))}
          {rowActions && (
            <TableActionsCell
              slots={stacked ? 1 : slots}
              data-pin={stacked ? undefined : "true"}
              role={role("cell")}
              aria-colindex={stacked ? columns.length + bodyStart : undefined}
            />
          )}
        </TableRow>
      );
    const activate = onRowActivate && (isRowActivatable?.(row) ?? true) ? onRowActivate : undefined;
    const tableRow = (
      <TableRow
        {...extra}
        key={getRowId(row)}
        aria-rowindex={rowIndex}
        data-row-index={position}
        tabIndex={activate ? 0 : position === focusRow ? -1 : (extra?.tabIndex ?? undefined)}
        onBlur={(event) => {
          extra?.onBlur?.(event);
          if (position === focusRow) setFocusRow(null);
        }}
        data-state={selected.includes(getRowId(row)) ? "selected" : undefined}
        focused={
          typeof focusedRowId === "string"
            ? focusedRowId === getRowId(row)
            : Boolean(focusedRowId?.includes(getRowId(row)))
        }
        data-activatable={activate ? "" : undefined}
        data-muted={isRowMuted?.(row) || undefined}
        tone={rowTone?.(row)}
        data-drop-target={dropEdge(position) ?? extra?.["data-drop-target"]}
        data-sortable-lifted={sortRows.lift?.key === getRowId(row) || undefined}
        data-stack-row={stacked || undefined}
        data-depth={stacked && depth > 0 ? depth : undefined}
        role={role("row")}
        onClick={
          activate || extra?.onClick
            ? (event) => {
                extra?.onClick?.(event);
                if (!event.defaultPrevented) activate?.(row);
              }
            : undefined
        }
        onKeyDown={(event) => {
          extra?.onKeyDown?.(event);
          if (event.defaultPrevented || event.target !== event.currentTarget) return;
          if (event.key === "Enter" && activate) {
            event.preventDefault();
            activate(row);
          } else if (event.key === " " && selectable && isSelectable(row)) {
            event.preventDefault();
            toggle(getRowId(row));
          }
        }}
        style={stacked ? undefined : { height: effectiveRowHeight }}
      >
        {selectable && (
          <TableCell
            selection
            pin={leading && !stacked ? "start" : undefined}
            data-valign={topByDefault && !stacked ? "top" : undefined}
            role={role("cell")}
            aria-colindex={stacked ? 1 : undefined}
          >
            <TopBand top={topByDefault && !stacked}>
              <SelectionBox
                label={`Select ${rowLabel(row)}`}
                checked={selected.includes(getRowId(row))}
                disabled={!isSelectable(row)}
                reason={selectionDisabledReason?.(row)}
                onToggle={() => toggle(getRowId(row))}
              />
            </TopBand>
          </TableCell>
        )}
        {columns.map((column, columnIndex) => {
          const content = column.toggle ? (
            <ToggleCell
              toggle={column.toggle}
              row={row}
              label={`${column.header} for ${rowLabel(row)}`}
              rowId={getRowId(row)}
            />
          ) : column.actions ? (
            <TableRowActions style={stacked ? undefined : { maxWidth: column.maxWidth }}>
              {column.render?.(row, position)}
            </TableRowActions>
          ) : (
            <CellContent
              shrink={column.id === shrinkColumn}
              secondary={column.secondary?.(row, position)}
              wrap={column.wrap}
              depth={depth > 0 && !stacked && column.id === indentColumn ? depth : undefined}
              maxWidth={column.maxWidth}
            >
              <div
                className={column.primary ? styles.tablePrimary : styles.tableValue}
                data-mono={column.mono || undefined}
                data-wrap={column.wrap || undefined}
                data-depth={depth > 0 && !stacked && column.id === indentColumn ? depth : undefined}
                style={{ maxWidth: column.maxWidth }}
                title={column.wrap ? undefined : column.text?.(row)}
              >
                <CellValue
                  badges={column.badges ? (column.badges(row, position) ?? null) : undefined}
                  wrap={column.wrap}
                  align={column.align}
                  title={column.text?.(row)}
                >
                  {cellValue(column.render ? column.render(row, position) : column.text?.(row))}
                </CellValue>
              </div>
            </CellContent>
          );
          const edit = column.actions || column.toggle ? undefined : column.edit?.(row);
          return (
            <EditableCell
              key={column.id}
              edit={edit}
              className={column.actions && !stacked ? styles.tableActions : undefined}
              style={cellStyle(column)}
              data-actions={column.actions || undefined}
              data-pin={stacked ? undefined : (column.pin ?? column.actions)}
              data-wrap={column.wrap || undefined}
              data-secondary={column.secondary ? true : undefined}
              data-valign={topAligned(column) ? "top" : undefined}
              data-row-interactive={column.actions || column.toggle || edit ? true : undefined}
              data-stack={
                stacked
                  ? column.id === stackTitle
                    ? "title"
                    : stackTrail.includes(column)
                      ? "meta"
                      : "line"
                  : undefined
              }
              role={role("cell")}
              aria-colindex={colIndex(column)}
            >
              <TopBand top={topAligned(column)}>
                {reorder && (stacked ? column.id === stackTitle : columnIndex === 0) ? (
                  <div className={styles.tableSortCell}>
                    {rowHandle(row)}
                    {content}
                  </div>
                ) : stackLines.includes(column) ? (
                  stackLine(column.hideHeader ? undefined : column.header, content)
                ) : (
                  content
                )}
              </TopBand>
            </EditableCell>
          );
        })}
        {rowActions && (
          <TableActionsCell
            slots={stacked ? 1 : slots}
            data-pin={stacked ? undefined : "true"}
            data-valign={topByDefault && !stacked ? "top" : undefined}
            role={role("cell")}
            aria-colindex={stacked ? columns.length + bodyStart : undefined}
          >
            <TopBand top={topByDefault && !stacked}>
              <RowActions
                lazy
                folded={stacked}
                label={rowLabel(row)}
                inline={rowInline(row)}
                menu={rowActions.renderMenu?.(row)}
                menuLabel={rowActions.menuLabel}
                menuDisabledReason={rowActions.menuDisabledReason?.(row)}
              />
            </TopBand>
          </TableActionsCell>
        )}
      </TableRow>
    );
    if (!rowActions || rowContextMenu === false) return tableRow;
    return (
      <RowContextMenu
        key={getRowId(row)}
        label={rowLabel(row)}
        inline={rowInline(row)}
        menu={rowActions.renderMenu?.(row)}
        menuDisabledReason={rowActions.menuDisabledReason?.(row)}
      >
        {tableRow}
      </RowContextMenu>
    );
  };
  const sortable = onSortChange ? columns.filter((column) => column.sortable) : [];
  const sortColumn = sortable.find((column) => column.id === sort?.columnId);
  const sortDirection = sort?.direction === "desc" ? "descending" : "ascending";
  const toggles = columns.filter((column) => column.toggle);
  const stackBand = stacked && (selectable || sortable.length > 0 || toggles.length > 0) && (
    <div
      className={styles.tableStackBand}
      role="group"
      aria-label={`${label} options`}
      data-slot="data-table-stack-band"
    >
      {selectable && selectAll("Select all")}
      {toggles.map(
        (column) =>
          column.toggle && (
            <span key={column.id} className={styles.tableStackToggle}>
              <ToggleHead
                toggle={column.toggle}
                counts={toggleCounts(column.toggle)}
                label={column.toggle.label ?? `${column.header} for every row in ${label}`}
                disabled={loading}
                getRowId={getRowId}
              />
              <span aria-hidden>{column.header}</span>
            </span>
          )
      )}
      {onSortChange && sortable.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={styles.tableStackSort}
              icon={sort?.direction === "desc" ? "arrow-down" : "arrow-up"}
              aria-label={
                sortColumn
                  ? `Sort by ${sortColumn.header}, ${sortDirection}`
                  : "Sort"
              }
            >
              {sortColumn?.header ?? "Sort"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={sortColumn?.id ?? ""}
              onValueChange={(columnId) =>
                onSortChange({ columnId, direction: sort?.direction ?? "asc" })
              }
            >
              {sortable.map((column) => (
                <DropdownMenuRadioItem key={column.id} value={column.id}>
                  {column.header}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sortColumn ? (sort?.direction ?? "asc") : ""}
              onValueChange={(direction) =>
                sortColumn &&
                onSortChange({
                  columnId: sortColumn.id,
                  direction: direction === "desc" ? "desc" : "asc"
                })
              }
            >
              <DropdownMenuRadioItem value="asc" disabled={!sortColumn}>
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc" disabled={!sortColumn}>
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
  const stackSkeleton = Array.from({ length: skeletonRows }, (_, index) => (
    <TableRow key={`loading-${index}`} aria-hidden data-loading data-stack-row="" role="row">
      {selectable && (
        <TableCell selection>
          <div className={styles.tableSelection}>
            <Skeleton width="var(--cipher-size-icon)" height="var(--cipher-size-icon)" />
          </div>
        </TableCell>
      )}
      {columns
        .filter((column) => column.id === stackTitle || stackLines.slice(0, 3).includes(column))
        .map((column) => (
          <TableCell
            key={column.id}
            style={stackPlace(column)}
            data-stack={column.id === stackTitle ? "title" : "line"}
          >
            {column.id === stackTitle ? (
              <Skeleton className={styles.tableSkeleton} data-primary="" />
            ) : (
              <div className={styles.tableStackLine}>
                <Skeleton
                  className={styles.tableStackLabelSkeleton}
                  height="var(--cipher-space-12)"
                />
                <Skeleton className={styles.tableSkeleton} height="var(--cipher-space-12)" />
              </div>
            )}
          </TableCell>
        ))}
      {rowActions && (
        <TableActionsCell slots={1}>
          <TableRowActions>
            <Skeleton width="var(--cipher-size-glyph)" height="var(--cipher-size-glyph)" />
          </TableRowActions>
        </TableActionsCell>
      )}
    </TableRow>
  ));
  const scrollFrame = (
    <div
      ref={attachScroll}
      data-scroll-fade="x"
      data-has-start-pin={leading || undefined}
      data-has-end-pin={trailing || undefined}
      data-frame-foot={Boolean((foot && !footTarget) || pagination) || undefined}
      className={cn(!embedded && frame.frame, styles.tableScroll, containerClassName)}
      data-virtual={windowed || undefined}
      data-flow={flowing || undefined}
      data-stacked={stacked || undefined}
      style={tableStyle}
      onScroll={flowing ? undefined : (event) => setTop(event.currentTarget.scrollTop)}
    >
      {stackBand}
      <Table
        aria-label={label}
        aria-rowcount={rowCount + (showFooter ? 1 : 0)}
        aria-colcount={
          stacked ? columns.length + bodyStart - 1 + (actionsColumn ? 1 : 0) : undefined
        }
        aria-busy={loading || refreshing || undefined}
        role={role("table")}
        data-variant={variant}
        data-layout={fixedLayout && !stacked ? "fixed" : undefined}
        style={
          stacked
            ? ({
                "--cipher-stack-columns": stackColumns,
                "--cipher-stack-label": `${stackLabelLength + 2}ch`
              } as React.CSSProperties)
            : fixedLayout && !squeezed
            ? {
                minWidth: `calc(${[
                  `${fixedWidth}px`,
                  ...fixedFloor,
                  ...(selectable ? ["var(--cipher-size-row)"] : []),
                  ...(actionsColumn
                    ? [`var(--cipher-size-row) + ${slots - 1} * var(--cipher-size-row-action-step)`]
                    : [])
                ].join(" + ")})`
              }
            : undefined
        }
      >
        <TableHeader
          ground={headerGround}
          data-hidden={headerHidden || squeezed || undefined}
          role={role("rowgroup")}
        >
          <TableRow role={role("row")}>
            {selectable && (
              <TableHead
                selection
                pin={leading && !stacked ? "start" : undefined}
                role={role("columnheader")}
                aria-colindex={stacked ? 1 : undefined}
              >
                {stacked ? <span className={styles.sr}>Select</span> : !squeezed && selectAll()}
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.id}
                scope="col"
                data-column={column.id}
                className={column.actions && !stacked ? styles.tableActions : undefined}
                style={stacked ? undefined : columnStyle(column)}
                data-actions={column.actions || undefined}
                data-pin={stacked ? undefined : (column.pin ?? column.actions)}
                role={role("columnheader")}
                aria-colindex={colIndex(column)}
                aria-sort={
                  sort?.columnId === column.id
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                {column.toggle && !squeezed && !stacked && (
                  <ToggleHead
                    toggle={column.toggle}
                    counts={toggleCounts(column.toggle)}
                    label={column.toggle.label ?? `${column.header} for every row in ${label}`}
                    disabled={loading}
                    getRowId={getRowId}
                  />
                )}
                {column.sortable && onSortChange && !squeezed && !stacked ? (
                  <TableHeadButton
                    data-active={sort?.columnId === column.id || undefined}
                    onClick={() =>
                      onSortChange({
                        columnId: column.id,
                        direction:
                          sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc"
                      })
                    }
                  >
                    {column.header}
                    <Icon
                      name={
                        sort?.columnId === column.id && sort.direction === "desc"
                          ? "arrow-down"
                          : "arrow-up"
                      }
                    />
                  </TableHeadButton>
                ) : (
                  <span
                    className={
                      squeezed || column.hideHeader || column.actions
                        ? styles.sr
                        : column.toggle && !stacked
                          ? undefined
                          : styles.tableHeadLabel
                    }
                  >
                    {column.header}
                  </span>
                )}
              </TableHead>
            ))}
            {rowActions && actionsColumn && (
              <TableActionsHead
                slots={stacked ? 1 : slots}
                data-pin={stacked ? undefined : "true"}
                role={role("columnheader")}
                aria-colindex={stacked ? columns.length + bodyStart : undefined}
              >
                {rowActions.header ?? "Actions"}
              </TableActionsHead>
            )}
          </TableRow>
        </TableHeader>
        {(loading || !groups || !rows.length) && (
          <TableBody role={role("rowgroup")}>
            {loading && stacked && stackSkeleton}
            {loading && !stacked && (
              <TableLoadingRows
                rows={skeletonRows}
                selectable={selectable}
                actionSlots={rowActions ? slots : undefined}
                columns={columns.map((column) => ({
                  primary: column.primary,
                  actions: column.actions,
                  pin: column.pin,
                  maxWidth: column.maxWidth,
                  style: columnStyle(column)
                }))}
              />
            )}
            {!loading && start > 0 && (
              <TableRow aria-hidden data-spacer>
                <TableCell
                  colSpan={span}
                  style={{ height: spacerAbove, padding: 0 }}
                />
              </TableRow>
            )}
            {!loading &&
              !groups &&
              entries
                .slice(start, stop)
                .map((entry, i) => renderRow(entry, start + i, start + i + 2))}
            {!loading && stop < rows.length && (
              <TableRow aria-hidden data-spacer>
                <TableCell
                  colSpan={span}
                  style={{ height: spacerBelow, padding: 0 }}
                />
              </TableRow>
            )}
            {!loading && !rows.length && (
              <TableRow data-row-kind="empty" role={role("row")}>
                <TableCell colSpan={span} pin="viewport" role={role("cell")}>
                  <EmptyScope
                    ghost={ghost ?? (embedded || filtered ? false : "rows")}
                    size="sm"
                    fill={embedded || undefined}
                  >
                    {empty}
                  </EmptyScope>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
        {!loading &&
          groups &&
          sections.map(({ group, entries: groupEntries }, index) => {
            const offset = sections
              .slice(0, index)
              .reduce((sum, section) => sum + section.entries.length + 1, 0);
            const before = sections
              .slice(0, index)
              .reduce((sum, section) => sum + section.entries.length, 0);
            return (
              <TableBody key={group?.id} data-group="" role={role("rowgroup")}>
                <TableGroupRow
                  aria-rowindex={offset + 2}
                  role={role("row")}
                  label={group?.label}
                  meta={group?.meta}
                  actions={group?.actions}
                  colSpan={columns.length}
                  actionSlots={rowActions ? (stacked ? 1 : slots) : undefined}
                  selectable={selectable}
                  checkbox={selectable && group ? groupCheckbox(group, groupEntries) : undefined}
                />
                {groupEntries.map((entry, i) => renderRow(entry, before + i, offset + i + 3))}
              </TableBody>
            );
          })}
        {showFooter && stacked && (
          <TableFooter
            className={styles.tableFoot}
            data-slot="data-table-footer"
            role="rowgroup"
          >
            <TableRow aria-rowindex={rowCount + 1} role="row" data-stack-row="">
              {columns
                .filter((column) => column.footer !== undefined)
                .map((column, index) => (
                  <TableCell
                    key={column.id}
                    style={{ gridColumn: `${bodyStart} / -1`, gridRow: index + 1 }}
                    data-stack="line"
                    role="cell"
                    aria-colindex={colIndex(column)}
                  >
                    {stackLine(
                      column.header,
                      <div
                        className={styles.tableValue}
                        data-mono={column.mono || undefined}
                        data-wrap={column.wrap || undefined}
                      >
                        {column.footer}
                      </div>
                    )}
                  </TableCell>
                ))}
            </TableRow>
          </TableFooter>
        )}
        {showFooter && !stacked && (
          <TableFooter className={styles.tableFoot} data-slot="data-table-footer">
            <TableRow aria-rowindex={rowCount + 1}>
              {selectable && <TableCell selection pin={leading ? "start" : undefined} />}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={column.actions ? styles.tableActions : undefined}
                  style={columnStyle(column)}
                  data-actions={column.actions || undefined}
                  data-pin={column.pin ?? column.actions}
                  data-wrap={column.wrap || undefined}
                >
                  {column.footer !== undefined && (
                    <div
                      className={column.primary ? styles.tablePrimary : styles.tableValue}
                      data-mono={column.mono || undefined}
                      data-wrap={column.wrap || undefined}
                      style={{ maxWidth: column.maxWidth }}
                    >
                      {column.footer}
                    </div>
                  )}
                </TableCell>
              ))}
              {rowActions && actionsColumn && <TableActionsCell slots={slots} data-pin="true" />}
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {foot && !footTarget && (
        <div
          className={cn(frame.frameFoot, styles.tableMore)}
          data-slot={pinnedFoot ? "data-table-more" : "data-table-end"}
        >
          {foot}
        </div>
      )}
      {pagination && (
        <div
          className={cn(frame.frameFoot, styles.tablePagination)}
          data-slot="data-table-pagination"
        >
          {pagination}
        </div>
      )}
    </div>
  );
  return (
    <div
      className={styles.tableShell}
      data-slot="data-table"
      data-variant={variant}
      data-embedded={embedded || undefined}
    >
      {refreshing && !loading && (
        <span className={styles.refreshing} data-slot="data-table-refreshing" aria-hidden />
      )}
      <FrameScope framed>{scrollFrame}</FrameScope>
      {foot && footTarget && createPortal(foot, footTarget)}
      <span className={styles.sr} role="status">
        {loading ? (
          "Loading rows"
        ) : (
          <>
            {selectable ? `${selected.length} selected. ` : ""}
            {rows.length} rows available{loadMore?.loading ? ". Loading more rows" : ""}
          </>
        )}
      </span>
      {reorder && (
        <SortableAnnouncer instructions={sortRows.instructions} announcement={sortRows.announcement}>
          Press Space or Enter to pick up a row, then use the arrow keys to move it. Alt with an arrow key moves one step.
        </SortableAnnouncer>
      )}
      {actionBar}
    </div>
  );
}
function rowAt(offsets: readonly number[], y: number) {
  let low = 0;
  let high = offsets.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (offsets[mid] <= y) low = mid;
    else high = mid - 1;
  }
  return low;
}
function TopBand({ top, children }: { top: boolean; children: React.ReactNode }) {
  return top ? <div className={styles.tableBand}>{children}</div> : children;
}
function CellValue({
  badges,
  wrap,
  align,
  title,
  children
}: {
  badges: React.ReactNode;
  wrap?: boolean;
  align?: DataTableColumn<unknown>["align"];
  title?: string;
  children: React.ReactNode;
}) {
  if (badges === undefined) return children;
  if (wrap)
    return (
      <>
        {children} <span data-slot="cell-badges">{badges}</span>
      </>
    );
  return (
    <NameLine badges={badges} data-align={align} title={title}>
      {children}
    </NameLine>
  );
}

function cellValue(value: React.ReactNode) {
  return value === undefined || value === null || value === "" ? <EmptyValue /> : value;
}

function CellContent({
  shrink,
  secondary,
  wrap,
  depth,
  maxWidth,
  children
}: {
  shrink: boolean;
  secondary: React.ReactNode;
  wrap?: boolean;
  depth?: number;
  maxWidth?: number;
  children: React.ReactNode;
}) {
  const content =
    secondary === undefined || secondary === null || secondary === false ? (
      children
    ) : (
      <div className={styles.tableLines}>
        {children}
        <div
          className={styles.tableSecondary}
          data-wrap={wrap || undefined}
          data-depth={depth}
          style={{ maxWidth }}
        >
          {secondary}
        </div>
      </div>
    );
  return shrink ? <div className={styles.tableShrink}>{content}</div> : content;
}
export function EnvMark({ present, env }: { present: boolean; env?: string }) {
  return (
    <span aria-label={`${env ?? "Environment"}: ${present ? "present" : "missing"}`}>
      {present ? "✓" : EMPTY_VALUE}
    </span>
  );
}

function ToggleHead<Row>({
  toggle,
  counts,
  label,
  disabled,
  getRowId
}: {
  toggle: DataTableToggle<Row>;
  counts: { enabled: Row[]; on: number; off: number };
  label: string;
  disabled: boolean;
  getRowId: (row: Row) => string;
}) {
  const { enabled, on, off } = counts;
  const all = enabled.length > 0 && on === enabled.length;
  const none = off === enabled.length;
  return (
    <span className={styles.tableToggle} data-slot="table-column-toggle">
      <Checkbox
        aria-label={label}
        disabled={disabled || !enabled.length}
        checked={all || (none ? false : "indeterminate")}
        onCheckedChange={() =>
          toggle.onChange(enabled.filter((row) => toggle.checked(row) !== !all).map(getRowId), !all)
        }
      />
    </span>
  );
}

function ToggleCell<Row>({
  toggle,
  row,
  label,
  rowId
}: {
  toggle: DataTableToggle<Row>;
  row: Row;
  label: string;
  rowId: string;
}) {
  if (toggle.absent?.(row))
    return (
      <span className={styles.tableToggleAbsent} data-slot="table-toggle-absent">
        <EmptyValue label={`${label}: not applicable`} />
      </span>
    );
  const reason = toggle.disabledReason?.(row);
  const adornment = toggle.adornment?.(row);
  const box = (
    <span className={styles.tableToggle}>
      <Checkbox
        aria-label={label}
        aria-description={reason}
        checked={toggle.checked(row)}
        disabled={Boolean(reason)}
        onCheckedChange={(next) => toggle.onChange([rowId], next === true)}
      />
    </span>
  );
  return (
    <span className={styles.tableToggleCell}>
      {reason ? <Tooltip content={reason}>{box}</Tooltip> : box}
      {adornment}
    </span>
  );
}

function SelectionBox({
  label,
  checked,
  disabled,
  reason,
  onToggle
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  reason?: string;
  onToggle: () => void;
}) {
  const box = (
    <div className={styles.tableSelection}>
      <Checkbox
        aria-label={label}
        aria-description={reason}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
  return reason ? <Tooltip content={reason}>{box}</Tooltip> : box;
}
