"use client";

import * as React from "react";

import { keyboardModality } from "../lib/input-modality";
import { type PresenceReport, usePresenceCount, useReportPresence } from "../lib/presence-count";
import {
  CellLinkContext,
  StretchedLinkContext,
  useCellLinkHost,
  useStretchedLinkHost
} from "../lib/stretched-link";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./button";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "./context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { FieldError } from "./field";
import { Icon, type IconSource } from "./icon";
import { Input } from "./input";
import { Skeleton } from "./skeleton";
import { Textarea } from "./textarea";
import { Tooltip, TooltipScope } from "./tooltip";

import geometry from "./button-geometry.module.css";
import styles from "./data.module.css";

type PinKind = "start" | "end" | "viewport";
type PinCounts = Record<PinKind, number>;

const TablePinContext = React.createContext<((kind: PinKind, delta: number) => void) | null>(null);
const BodyFocusContext = React.createContext<PresenceReport | null>(null);
const RowFocusContext = React.createContext<PresenceReport | null>(null);

function Table({
  className,
  containerClassName,
  containerRef,
  children,
  ref,
  ...props
}: React.ComponentProps<"table"> & {
  /** Layout classes for the scroll container (height caps, flex sizing). ref targets the table element itself. */
  containerClassName?: string;
  /** The horizontal scroll container. */
  containerRef?: React.Ref<HTMLDivElement>;
}) {
  const [pins, setPins] = React.useState<PinCounts>({ start: 0, end: 0, viewport: 0 });
  const reportPin = React.useCallback(
    (kind: PinKind, delta: number) =>
      setPins((value) => ({ ...value, [kind]: value[kind] + delta })),
    []
  );
  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      data-scroll-fade="x"
      data-has-start-pin={pins.start > 0 || undefined}
      data-has-end-pin={pins.end > 0 || undefined}
      data-has-viewport-cell={pins.viewport > 0 || undefined}
      className={cn("relative w-full", styles.nativeTableContainer, containerClassName)}
    >
      <TablePinContext value={reportPin}>
        <table
          ref={ref}
          data-slot="table"
          className={cn("w-full caption-bottom", styles.nativeTable, className)}
          {...props}
        >
          <TooltipScope>{children}</TooltipScope>
        </table>
      </TablePinContext>
    </div>
  );
}
Table.displayName = "Table";

function TableHeader({ className, ref, ...props }: React.ComponentProps<"thead">) {
  return (
    <BodyFocusContext value={null}>
      <thead
        ref={ref}
        data-slot="table-header"
        className={cn("[&_tr]:border-b [&_tr]:border-[color:var(--cipher-line-soft)]", className)}
        {...props}
      />
    </BodyFocusContext>
  );
}
TableHeader.displayName = "TableHeader";

/** Marks the body while it holds a focused row at any depth, and tells the row it is nested in. */
function TableBody({ className, ref, ...props }: React.ComponentProps<"tbody">) {
  const [hasFocus, report] = usePresenceCount();
  useReportPresence(React.useContext(RowFocusContext), hasFocus);
  return (
    <BodyFocusContext value={report}>
      <tbody
        ref={ref}
        data-slot="table-body"
        data-has-focus={hasFocus || undefined}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      />
    </BodyFocusContext>
  );
}
TableBody.displayName = "TableBody";

function TableFooter({ className, ref, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <BodyFocusContext value={null}>
      <tfoot
        ref={ref}
        data-slot="table-footer"
        className={cn(
          "border-t border-[color:var(--cipher-line-soft)] font-medium [&>tr]:last:border-b-0",
          className
        )}
        {...props}
      />
    </BodyFocusContext>
  );
}
TableFooter.displayName = "TableFooter";

const interactiveTarget =
  "a, button, input, select, textarea, label, summary, [contenteditable], [tabindex]:not(tr), [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab], [data-row-interactive]";
const activatesRow = (event: React.MouseEvent<HTMLTableRowElement>) => {
  const row = event.currentTarget;
  const target = event.target as Element;
  if (event.button !== 0 || !row.contains(target)) return false;
  const interactive = target.closest(interactiveTarget);
  if (interactive && row.contains(interactive)) return false;
  const selection = window.getSelection();
  return !(selection && !selection.isCollapsed && row.contains(selection.anchorNode));
};

const setFlag = (element: Element, name: string, on: boolean) => {
  if (element.hasAttribute(name) !== on) element.toggleAttribute(name, on);
};

/**
 * Marks what the row's styles depend on in its own DOM: a lone full-width cell, an open popup trigger,
 * the last leading pinned cell and cells that hold only text. Rows render arbitrary cells, so the DOM is
 * the only place this is known.
 */
const markRow = (row: HTMLTableRowElement): Record<PinKind, boolean> => {
  const cells = [...row.children];
  const only = cells.length === 1 ? cells[0] : undefined;
  setFlag(row, "data-full-width", only?.tagName === "TD" && only.hasAttribute("colspan"));
  setFlag(
    row,
    "data-expanded-within",
    row.querySelector(
      ':is([aria-haspopup]:not([aria-haspopup="false"]), [role="combobox"])[aria-expanded="true"]'
    ) !== null
  );
  const starts = cells.filter((cell) => cell.getAttribute("data-pin") === "start");
  const edge = starts.at(-1);
  cells.forEach((cell) => {
    setFlag(
      cell,
      "data-pin-edge",
      cell === edge && !cell.classList.contains(styles.tableSelectionCell)
    );
    if (cell.tagName === "TD") setFlag(cell, "data-text-only", cell.firstElementChild === null);
  });
  return {
    start: starts.length > 0,
    end: cells.some((cell) => cell.classList.contains(styles.tableActions)),
    viewport: cells.some((cell) => cell.getAttribute("data-pin") === "viewport")
  };
};

/** A row draws its focus ring only when the keyboard moved focus to it, never after a pointer interaction. */
function TableRow({
  className,
  focused,
  onClick,
  onFocus,
  onBlur,
  ref,
  children,
  ...props
}: React.ComponentProps<"tr"> & {
  /** The row is being edited: every other row in the same body dims its cell contents until this clears. */
  focused?: boolean;
}) {
  const node = React.useRef<HTMLTableRowElement | null>(null);
  const reportPin = React.useContext(TablePinContext);
  const reported = React.useRef<Record<PinKind, boolean>>({
    start: false,
    end: false,
    viewport: false
  });
  const [containsFocus, reportContains] = usePresenceCount();
  const [hasLink, reportLink] = useStretchedLinkHost();
  useReportPresence(React.useContext(BodyFocusContext), Boolean(focused) || containsFocus);
  const setRef = React.useCallback(
    (element: HTMLTableRowElement | null) => {
      node.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref]
  );
  const mark = React.useCallback(() => {
    if (!node.current) return;
    const next = markRow(node.current);
    (["start", "end", "viewport"] as const).forEach((kind) => {
      if (next[kind] !== reported.current[kind]) reportPin?.(kind, next[kind] ? 1 : -1);
    });
    reported.current = next;
  }, [reportPin]);
  React.useLayoutEffect(mark);
  React.useLayoutEffect(() => {
    const row = node.current;
    if (!row) return undefined;
    const observer = new MutationObserver(mark);
    observer.observe(row, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-expanded", "data-pin", "colspan"]
    });
    return () => {
      observer.disconnect();
      (["start", "end", "viewport"] as const).forEach((kind) => {
        if (reported.current[kind]) reportPin?.(kind, -1);
      });
      reported.current = { start: false, end: false, viewport: false };
    };
  }, [mark, reportPin]);
  React.useLayoutEffect(() => {
    const above = containsFocus ? node.current?.previousElementSibling : null;
    if (!above) return undefined;
    above.setAttribute("data-focus-anchor", "");
    return () => above.removeAttribute("data-focus-anchor");
  }, [containsFocus]);
  return (
    <RowFocusContext value={reportContains}>
      <StretchedLinkContext value={reportLink}>
        <tr
          ref={setRef}
          data-slot="table-row"
          data-focused={focused || undefined}
          data-contains-focus={containsFocus || undefined}
          data-stretched-link={hasLink || undefined}
          className={cn(
            "border-b border-[color:var(--cipher-line-soft)] transition-colors duration-(--cipher-duration-fast)",
            styles.nativeTableRow,
            className
          )}
          onClick={
            onClick &&
            ((event) => {
              if (activatesRow(event)) onClick(event);
            })
          }
          onFocus={(event) => {
            onFocus?.(event);
            if (event.target === event.currentTarget && keyboardModality())
              event.currentTarget.setAttribute("data-focus-ring", "");
          }}
          onBlur={(event) => {
            onBlur?.(event);
            if (event.target === event.currentTarget)
              event.currentTarget.removeAttribute("data-focus-ring");
          }}
          {...props}
        >
          {children}
        </tr>
      </StretchedLinkContext>
    </RowFocusContext>
  );
}
TableRow.displayName = "TableRow";

type PinStyle = React.CSSProperties & { "--cipher-pin-offset"?: string };

type PinProps = {
  /** start sticks the cell to the inline start while the table scrolls sideways; viewport keeps a full-width cell's content inside the visible width. */
  pin?: "start" | "viewport";
  /** Inline-start offset of a start-pinned cell, as a CSS length: the width of the pinned columns before it. A cell after a pinned selection cell gets size-row without it. */
  pinOffset?: string;
};

const pinStyle = (pinOffset: string | undefined, style: React.CSSProperties | undefined) =>
  pinOffset === undefined ? style : ({ "--cipher-pin-offset": pinOffset, ...style } as PinStyle);

type SelectionProps = {
  /** Draws the selection column: size-row wide, a centered Checkbox and a persistent line-soft divider on its right. */
  selection?: boolean;
  /** With selection, false drops the divider, for an icon or expand column that doubles as selection. */
  divider?: boolean;
};

function TableHead({
  selection,
  divider = true,
  pin,
  pinOffset,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<"th"> & SelectionProps & PinProps) {
  return (
    <th
      ref={ref}
      data-slot={selection ? "table-selection" : "table-head"}
      data-divider={selection && !divider ? "false" : undefined}
      data-pin={pin}
      className={cn(styles.nativeTableHead, selection && styles.tableSelectionCell, className)}
      style={pinStyle(pinOffset, style)}
      {...props}
    />
  );
}
TableHead.displayName = "TableHead";

/** The one interactive header: a sort or menu trigger that fills its TableHead and takes hover on that cell alone. */
function TableHeadButton({
  className,
  type = "button",
  children,
  ref,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="table-head-button"
      data-table-head-button=""
      className={cn(styles.tableSort, className)}
      {...props}
    >
      {React.Children.map(children, (child) =>
        typeof child === "string" || typeof child === "number" ? (
          <span>{child}</span>
        ) : (
          child
        )
      )}
    </button>
  );
}
TableHeadButton.displayName = "TableHeadButton";

function TableCell({
  selection,
  divider = true,
  pin,
  pinOffset,
  className,
  style,
  children,
  ref,
  ...props
}: React.ComponentProps<"td"> & SelectionProps & PinProps) {
  const [hasLink, reportLink] = useCellLinkHost();
  return (
    <CellLinkContext value={reportLink}>
      <td
        ref={ref}
        data-slot={selection ? "table-selection" : "table-cell"}
        data-divider={selection && !divider ? "false" : undefined}
        data-row-interactive={selection || undefined}
        data-pin={pin}
        data-cell-link={hasLink || undefined}
        className={cn(styles.nativeTableCell, selection && styles.tableSelectionCell, className)}
        style={pinStyle(pinOffset, style)}
        {...props}
      >
        {pin === "viewport" ? <div className={styles.viewportContent}>{children}</div> : children}
      </td>
    </CellLinkContext>
  );
}
TableCell.displayName = "TableCell";

export type InlineEdit = {
  /** Names the field for assistive tech, such as "Value of API_KEY". */
  label: string;
  /** The value the editor opens with, or a loader for one fetched on open, such as a secret's value. A loader that resolves undefined leaves the cell closed. */
  value: string | (() => Promise<string | undefined>);
  /** Runs with the new value once validate passes. It doesn't run when the value is unchanged. */
  onCommit: (value: string) => void;
  /** Returns a message to keep the editor open with that error under the field. A result that arrives after a newer edit, a cancel or a close is ignored. */
  validate?: (value: string) => string | undefined | Promise<string | undefined>;
  /** Runs when focus leaves while the value is invalid. The edit is discarded. */
  onInvalidBlur?: (message: string) => void;
  /** Rewrites each change, such as uppercasing a key. */
  transform?: (value: string) => string;
  /** A textarea that grows with the value, where Shift+Enter adds a line. Single-line values are trimmed before they commit. */
  multiline?: boolean;
  placeholder?: string;
  mono?: boolean;
};

function CellEditor({
  edit,
  initial,
  onDone
}: {
  edit: InlineEdit;
  initial: string;
  onDone: (refocus: boolean) => void;
}) {
  const [draft, setDraft] = React.useState(initial);
  const [error, setError] = React.useState<string>();
  const attempt = React.useRef(0);
  const closed = React.useRef(false);
  const errorId = React.useId();
  React.useEffect(() => {
    closed.current = false;
    return () => {
      closed.current = true;
      attempt.current += 1;
    };
  }, []);
  const close = (refocus: boolean) => {
    closed.current = true;
    attempt.current += 1;
    onDone(refocus);
  };
  const finish = async (blurred: boolean) => {
    if (closed.current) return;
    const next = edit.multiline ? draft : draft.trim();
    if (next === initial) return close(!blurred);
    attempt.current += 1;
    const started = attempt.current;
    const problem = await edit.validate?.(next);
    if (started !== attempt.current || closed.current) return;
    if (problem && !blurred) return setError(problem);
    if (problem) edit.onInvalidBlur?.(problem);
    else edit.onCommit(next);
    close(!blurred);
  };
  const control = {
    autoFocus: true,
    value: draft,
    placeholder: edit.placeholder,
    mono: edit.mono,
    "aria-label": edit.label,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    autoComplete: "off",
    spellCheck: false,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      attempt.current += 1;
      setDraft(edit.transform ? edit.transform(event.target.value) : event.target.value);
      setError(undefined);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        finish(false);
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    },
    onBlur: () => finish(true)
  };
  return (
    <div className={styles.cellEditor} data-invalid={error ? "" : undefined}>
      {edit.multiline ? (
        <Textarea {...control} rows={1} maxRows={6} />
      ) : (
        <Input {...control} invalid={Boolean(error)} />
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

/** A TableCell that edits its value in place: click it, or press Enter or F2 on it, to open the editor. Enter or leaving the field commits, and Escape cancels. Without edit it is a plain TableCell. */
function EditableCell({
  edit,
  children,
  className,
  onClick,
  onKeyDown,
  onBlur,
  tabIndex,
  ref,
  ...props
}: React.ComponentProps<typeof TableCell> & { edit?: InlineEdit }) {
  const [initial, setInitial] = React.useState<string>();
  const cell = React.useRef<HTMLTableCellElement>(null);
  const opening = React.useRef(0);
  const open = async () => {
    if (!edit || initial !== undefined) return;
    opening.current += 1;
    const request = opening.current;
    const loaded = typeof edit.value === "string" ? edit.value : await edit.value();
    if (request === opening.current && loaded !== undefined) setInitial(loaded);
  };
  return (
    <TableCell
      ref={(node: HTMLTableCellElement | null) => {
        cell.current = node;
        if (typeof ref === "function") return ref(node);
        if (ref) ref.current = node;
      }}
      data-row-interactive={edit ? true : undefined}
      {...props}
      className={cn(edit && styles.editableCell, className)}
      data-editing={initial !== undefined || undefined}
      tabIndex={edit ? (initial === undefined ? 0 : -1) : tabIndex}
      onClick={(event) => {
        onClick?.(event);
        if (!edit || initial !== undefined || event.defaultPrevented) return;
        const hit = (event.target as HTMLElement).closest(interactiveTarget);
        if (hit && hit !== event.currentTarget) return;
        event.preventDefault();
        open();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!edit || event.defaultPrevented || event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== "F2") return;
        event.preventDefault();
        open();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (initial === undefined) opening.current += 1;
      }}
    >
      {edit && initial !== undefined ? (
        <CellEditor
          edit={edit}
          initial={initial}
          onDone={(refocus) => {
            opening.current += 1;
            setInitial(undefined);
            if (refocus) cell.current?.focus();
          }}
        />
      ) : (
        children
      )}
    </TableCell>
  );
}
EditableCell.displayName = "EditableCell";

function TableCaption({ className, ref, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn(styles.nativeTableCaption, className)}
      {...props}
    />
  );
}
TableCaption.displayName = "TableCaption";

function TableRowActions({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      {...props}
      data-slot="table-row-actions"
      className={cn(styles.tableRowActions, className)}
    />
  );
}
TableRowActions.displayName = "TableRowActions";

function TableRowIndicators({ className, ref, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      ref={ref}
      {...props}
      data-slot="table-row-indicators"
      className={cn(styles.tableRowIndicators, className)}
    />
  );
}
TableRowIndicators.displayName = "TableRowIndicators";

type SlotStyle = React.CSSProperties & { "--cipher-row-action-slots"?: number };

function TableActionsHead({
  slots = 1,
  className,
  style,
  children = "Actions",
  ref,
  ...props
}: React.ComponentProps<"th"> & { slots?: number }) {
  return (
    <th
      ref={ref}
      scope="col"
      {...props}
      data-slot="table-actions-head"
      data-actions
      className={cn(styles.nativeTableHead, styles.tableActions, className)}
      style={{ "--cipher-row-action-slots": slots, ...style } as SlotStyle}
    >
      <span className={styles.sr}>{children}</span>
    </th>
  );
}
TableActionsHead.displayName = "TableActionsHead";

function TableActionsCell({
  slots = 1,
  className,
  style,
  ref,
  ...props
}: React.ComponentProps<"td"> & { slots?: number }) {
  return (
    <td
      ref={ref}
      {...props}
      data-slot="table-actions-cell"
      data-actions
      data-row-interactive
      className={cn(styles.nativeTableCell, styles.tableActions, className)}
      style={{ "--cipher-row-action-slots": slots, ...style } as SlotStyle}
    />
  );
}
TableActionsCell.displayName = "TableActionsCell";

/** A full-width header row that names the rows under it. Put it first in its own TableBody, one body per group. */
function TableGroupRow({
  label,
  meta,
  actions,
  checkbox,
  selectable = checkbox !== undefined,
  colSpan,
  actionSlots,
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<"tr">, "children"> & {
  label: React.ReactNode;
  /** Muted text after the label, such as the group's row count. */
  meta?: React.ReactNode;
  /** The group's own actions, drawn in the actions column. Needs actionSlots. */
  actions?: React.ReactNode;
  /** A Checkbox that selects the group's rows, drawn in the selection column. */
  checkbox?: React.ReactNode;
  /** Keeps the selection column when the group has no checkbox, so the label lines up with the rows. */
  selectable?: boolean;
  /** Columns the label spans, not counting the selection and actions columns. */
  colSpan: number;
  /** Width of the table's actions column. Omit when the table has none. */
  actionSlots?: number;
}) {
  return (
    <tr
      ref={ref}
      data-slot="table-group-row"
      className={cn(styles.tableGroupRow, className)}
      {...props}
    >
      {selectable && <TableCell selection>{checkbox}</TableCell>}
      <th scope="rowgroup" colSpan={colSpan} className={styles.tableGroupHead}>
        <div className={styles.tableGroupLabel}>
          {label}
          {meta !== undefined && <span className={styles.tableGroupMeta}>{meta}</span>}
        </div>
      </th>
      {actionSlots !== undefined && (
        <TableActionsCell slots={actionSlots} data-pin="true">
          {actions}
        </TableActionsCell>
      )}
    </tr>
  );
}
TableGroupRow.displayName = "TableGroupRow";

export type TableLoadingColumn = {
  /** Draws a shorter bar, as for the column that names the row. */
  primary?: boolean;
  /** The column holds row actions: one glyph-sized bar in the actions tail. */
  actions?: boolean;
  pin?: boolean | "start";
  maxWidth?: React.CSSProperties["maxWidth"];
  style?: React.CSSProperties;
};

/** Skeleton rows for a table on screen while its rows load: the same shapes, row height and data-loading marking as DataTable loading. */
function TableLoadingRows({
  columns,
  rows = 5,
  selectable = false,
  actionSlots,
  label
}: {
  /** One entry per body column, or a count of plain text columns. */
  columns: number | readonly TableLoadingColumn[];
  rows?: number;
  selectable?: boolean;
  /** Adds a TableActionsCell tail with this many action slots. */
  actionSlots?: number;
  /** Announced while loading, naming what loads, such as Loading secrets. DataTable announces its own. */
  label?: string;
}) {
  const cells: readonly TableLoadingColumn[] =
    typeof columns === "number" ? Array.from({ length: columns }, () => ({})) : columns;
  const leading = cells.some((column) => column.pin === "start");
  return Array.from({ length: Math.max(1, Math.floor(rows)) }, (_, index) => (
    <TableRow key={`loading-${index}`} aria-hidden={index > 0 || !label || undefined} data-loading>
      {selectable && (
        <TableCell selection pin={leading ? "start" : undefined}>
          <div className={styles.tableSelection}>
            <Skeleton width="var(--cipher-size-icon)" height="var(--cipher-size-icon)" />
          </div>
        </TableCell>
      )}
      {cells.map((column, cell) => (
        <TableCell
          key={cell}
          className={column.actions ? styles.tableActions : undefined}
          style={column.style}
          data-actions={column.actions || undefined}
          data-pin={column.pin ?? column.actions}
        >
          {index === 0 && cell === 0 && label && (
            <span className={styles.sr} role="status">
              {label}
            </span>
          )}
          {column.actions ? (
            <TableRowActions>
              <Skeleton width="var(--cipher-size-glyph)" height="var(--cipher-size-glyph)" />
            </TableRowActions>
          ) : (
            <Skeleton
              className={styles.tableSkeleton}
              data-primary={column.primary || undefined}
              style={{ maxWidth: column.maxWidth }}
            />
          )}
        </TableCell>
      ))}
      {actionSlots !== undefined && (
        <TableActionsCell slots={actionSlots} data-pin="true">
          <TableRowActions>
            {Array.from({ length: actionSlots }, (__, slot) => (
              <span key={slot} className={styles.tableRowActionSkeleton}>
                <Skeleton width="var(--cipher-size-glyph)" height="var(--cipher-size-glyph)" />
              </span>
            ))}
          </TableRowActions>
        </TableActionsCell>
      )}
    </TableRow>
  ));
}

export type RowAction = {
  label: string;
  icon: IconSource;
  onSelect: () => void;
  disabledReason?: string;
};
export type UpToThree<T> = readonly [] | readonly [T] | readonly [T, T] | readonly [T, T, T];
export type RowActionList = UpToThree<RowAction>;

const stop = (event: React.MouseEvent) => event.stopPropagation();

function RowActionButton({ action, label }: { action: RowAction; label: string }) {
  const reason = action.disabledReason;
  return (
    <Tooltip content={reason ? undefined : action.label}>
      <span className={styles.tableRowActionSlot}>
        <Button
          variant="ghost"
          size="icon-row"
          iconOnly
          disabledReason={reason}
          onClick={(event) => {
            stop(event);
            action.onSelect();
          }}
        >
          <Icon icon={action.icon} />
          <span className="sr-only">{`${action.label} for ${label}`}</span>
        </Button>
      </span>
    </Tooltip>
  );
}

const ROW_REST_MS = 120;
const menuOpenKeys = new Set(["Enter", " ", "ArrowDown"]);
const groupButtons = (node: HTMLElement | null) =>
  Array.from(node?.querySelectorAll("button") ?? []);

function IdleRowButton({
  disabledReason,
  children,
  ...props
}: React.ComponentProps<"button"> & { disabledReason?: string }) {
  return (
    <button
      type="button"
      data-slot="button"
      data-variant="ghost"
      data-size="icon-row"
      data-cipher-button=""
      data-disabled-reason={disabledReason ? "" : undefined}
      aria-disabled={disabledReason || props.disabled ? true : undefined}
      aria-description={disabledReason}
      className={cn(buttonVariants({ variant: "ghost", size: "icon-row" }), geometry.iconOnly)}
      {...props}
    >
      <span data-press="">{children}</span>
    </button>
  );
}

function RowActions({
  label,
  inline = [],
  menu,
  menuLabel = "More actions",
  menuDisabledReason,
  lazy = false,
  open,
  defaultOpen,
  onOpenChange,
  onMenuCloseAutoFocus,
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: string;
  inline?: RowActionList;
  menu?: React.ReactNode;
  menuLabel?: string;
  menuDisabledReason?: string;
  /** Renders plain buttons with the same DOM, classes and names, and no tooltips or menu, until the row is hovered or something in it takes focus, then swaps in the real parts in place. A press while idle still runs the action or opens the menu. For long tables. */
  lazy?: boolean;
  /** The More menu's open state, for opening it from outside the row actions. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The More menu's close focus handler: preventDefault keeps focus where a menu item moved it. */
  onMenuCloseAutoFocus?: (event: Event) => void;
}) {
  const [live, setLive] = React.useState(!lazy || Boolean(open || defaultOpen));
  const [openOnMount, setOpenOnMount] = React.useState(false);
  const group = React.useRef<HTMLDivElement | null>(null);
  const restoreFocus = React.useRef(-1);
  if (!live && (!lazy || open)) setLive(true);
  const setGroup = React.useCallback(
    (node: HTMLDivElement | null) => {
      group.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );
  React.useEffect(() => {
    const node = group.current;
    if (live || !node) return undefined;
    const row = node.closest("tr") ?? node;
    let rest: ReturnType<typeof setTimeout> | undefined;
    const wake = () => setLive(true);
    const settle = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      clearTimeout(rest);
      rest = setTimeout(wake, ROW_REST_MS);
    };
    const leave = () => clearTimeout(rest);
    const enterActions = (event: PointerEvent) => {
      if (event.pointerType !== "touch") wake();
    };
    const focus = (event: FocusEvent) => {
      restoreFocus.current = groupButtons(node).indexOf(event.target as HTMLButtonElement);
      wake();
    };
    row.addEventListener("pointerenter", settle);
    row.addEventListener("pointermove", settle);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("focusin", focus);
    node.addEventListener("pointerenter", enterActions);
    return () => {
      clearTimeout(rest);
      row.removeEventListener("pointerenter", settle);
      row.removeEventListener("pointermove", settle);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("focusin", focus);
      node.removeEventListener("pointerenter", enterActions);
    };
  }, [live]);
  React.useLayoutEffect(() => {
    const index = restoreFocus.current;
    restoreFocus.current = -1;
    const button = live && index >= 0 ? groupButtons(group.current)[index] : undefined;
    if (button) queueMicrotask(() => button.focus({ preventScroll: true }));
  }, [live]);

  if (!live) {
    const openMenu = () => {
      setOpenOnMount(true);
      setLive(true);
      onOpenChange?.(true);
    };
    return (
      <TableRowActions ref={setGroup} className={className} {...props}>
        {inline.map((action) => (
          <span key={action.label} className={styles.tableRowActionSlot}>
            <IdleRowButton
              disabledReason={action.disabledReason}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                stop(event);
                restoreFocus.current = groupButtons(group.current).indexOf(event.currentTarget);
                setLive(true);
                if (!action.disabledReason) action.onSelect();
              }}
            >
              <Icon icon={action.icon} />
              <span className="sr-only">{`${action.label} for ${label}`}</span>
            </IdleRowButton>
          </span>
        ))}
        {menu !== undefined && (
          <span className={styles.tableRowActionSlot}>
            <IdleRowButton
              data-slot="dropdown-menu-trigger"
              disabled={Boolean(menuDisabledReason)}
              data-disabled={menuDisabledReason ? "" : undefined}
              aria-haspopup="menu"
              aria-expanded={false}
              aria-description={menuDisabledReason}
              onClick={stop}
              onPointerDown={(event) => {
                if (event.button !== 0 || event.ctrlKey) return;
                event.preventDefault();
                openMenu();
              }}
              onKeyDown={(event) => {
                if (!menuOpenKeys.has(event.key)) return;
                event.preventDefault();
                restoreFocus.current = groupButtons(group.current).indexOf(event.currentTarget);
                openMenu();
              }}
            >
              <Icon name="more" data-button-icon="" />
              <span className="sr-only">{`${menuLabel} for ${label}`}</span>
            </IdleRowButton>
          </span>
        )}
      </TableRowActions>
    );
  }
  return (
    <TableRowActions ref={setGroup} className={className} {...props}>
      {inline.map((action) => (
        <RowActionButton key={action.label} action={action} label={label} />
      ))}
      {menu !== undefined && (
        <DropdownMenu
          open={open}
          defaultOpen={defaultOpen || openOnMount}
          onOpenChange={onOpenChange}
        >
          <Tooltip content={menuDisabledReason ?? menuLabel}>
            <span className={styles.tableRowActionSlot}>
              <DropdownMenuTrigger asChild disabled={Boolean(menuDisabledReason)}>
                <Button
                  variant="ghost"
                  size="icon-row"
                  icon="more"
                  iconOnly
                  aria-description={menuDisabledReason}
                  onClick={stop}
                >
                  {`${menuLabel} for ${label}`}
                </Button>
              </DropdownMenuTrigger>
            </span>
          </Tooltip>
          <DropdownMenuContent align="end" onCloseAutoFocus={onMenuCloseAutoFocus}>
            {menu}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </TableRowActions>
  );
}
RowActions.displayName = "RowActions";

const editableTarget = (target: EventTarget) =>
  target instanceof Element &&
  Boolean(
    target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
  );

function MountSignal({ onChange }: { onChange: (mounted: boolean) => void }) {
  React.useEffect(() => {
    onChange(true);
    return () => onChange(false);
  }, [onChange]);
  return null;
}

/**
 * Opens a row's actions as a right-click menu on the whole row: the inline actions first, then the
 * More menu items after a separator, from the same nodes RowActions renders. Shift+F10 and the Menu key
 * open it on a focused row; inputs and editable cells keep the browser's own menu.
 */
function RowContextMenu({
  label,
  inline = [],
  menu,
  menuDisabledReason,
  children
}: {
  label: string;
  inline?: RowActionList;
  menu?: React.ReactNode;
  menuDisabledReason?: string;
  children: React.ReactElement<React.ComponentProps<"tr">>;
}) {
  const [open, setOpen] = React.useState(false);
  const [present, setPresent] = React.useState(false);
  const row = React.useRef<HTMLTableRowElement>(null);
  const showMenu = menu !== undefined && !menuDisabledReason;
  const rowProps = children.props as Record<string, unknown>;
  const nonData = rowProps["data-row-kind"] || rowProps["data-loading"] || rowProps["data-spacer"];
  if (nonData || (!inline.length && !showMenu)) return children;
  const { onContextMenuCapture, tabIndex } = children.props;
  return (
    <ContextMenu
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setPresent(true);
      }}
    >
      <ContextMenuTrigger ref={row} asChild className="select-text">
        {React.cloneElement(children, {
          tabIndex: tabIndex ?? -1,
          "data-menu-open": open || undefined,
          onContextMenuCapture: (event: React.MouseEvent<HTMLTableRowElement>) => {
            onContextMenuCapture?.(event);
            if (editableTarget(event.target)) event.stopPropagation();
          }
        } as React.ComponentProps<"tr">)}
      </ContextMenuTrigger>
      {present && (
        <ContextMenuContent
          aria-label={`Actions for ${label}`}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            row.current?.focus({ preventScroll: true });
          }}
        >
          {inline.map((action) => (
            <DropdownMenuItem
              key={action.label}
              disabled={Boolean(action.disabledReason)}
              description={action.disabledReason}
              onSelect={action.onSelect}
            >
              <Icon icon={action.icon} />
              {action.label}
            </DropdownMenuItem>
          ))}
          {inline.length > 0 && showMenu && <DropdownMenuSeparator />}
          {showMenu && menu}
          <MountSignal onChange={setPresent} />
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
RowContextMenu.displayName = "RowContextMenu";

const rowActionSlots = (inline: number, menu: boolean) => Math.max(1, inline + (menu ? 1 : 0));

export {
  EditableCell,
  rowActionSlots,
  RowActions,
  RowContextMenu,
  Table,
  TableActionsCell,
  TableActionsHead,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeadButton,
  TableHeader,
  TableLoadingRows,
  TableRow,
  TableRowActions,
  TableRowIndicators
};
