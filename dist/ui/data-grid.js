import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { canEditColumn, encodeTsv, parseGridValue, pasteGrid } from "./data-grid-model.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";
import data_module_default from "./data.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/data-grid.tsx
var gridColumnTypes = [
	"text",
	"int8",
	"bool",
	"timestamp",
	"json"
];
var AddColumn = ({ onAdd, disabled }) => {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [type, setType] = React.useState("text");
	const [nullable, setNullable] = React.useState(true);
	const nameId = React.useId();
	const reset = () => {
		setName("");
		setType("text");
		setNullable(true);
	};
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) reset();
		},
		children: [/* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "icon-xs",
				iconOnly: true,
				icon: "plus",
				"aria-label": "Add column",
				disabled,
				className: data_module_default.gridAddColumn
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align: "end",
			children: /* @__PURE__ */ jsxs("form", {
				className: data_module_default.gridAddForm,
				onSubmit: (event) => {
					event.preventDefault();
					if (!name.trim()) return;
					onAdd({
						name: name.trim(),
						type,
						nullable
					});
					setOpen(false);
					reset();
				},
				children: [
					/* @__PURE__ */ jsx("span", {
						id: nameId,
						children: "Name"
					}),
					/* @__PURE__ */ jsx(Input, {
						"aria-labelledby": nameId,
						mono: true,
						autoFocus: true,
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ jsx("span", { children: "Type" }),
					/* @__PURE__ */ jsxs(Select, {
						value: type,
						onValueChange: (value) => setType(value),
						children: [/* @__PURE__ */ jsx(SelectTrigger, {
							"aria-label": "Type",
							children: /* @__PURE__ */ jsx(SelectValue, {})
						}), /* @__PURE__ */ jsx(SelectContent, { children: gridColumnTypes.map((option) => /* @__PURE__ */ jsx(SelectItem, {
							value: option,
							children: option
						}, option)) })]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: data_module_default.gridAddCheck,
						children: [/* @__PURE__ */ jsx(Checkbox, {
							"aria-labelledby": `${nameId}-nullable`,
							checked: nullable,
							onCheckedChange: (value) => setNullable(value === true)
						}), /* @__PURE__ */ jsx("span", {
							id: `${nameId}-nullable`,
							children: "Nullable"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: data_module_default.gridAddActions,
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: !name.trim(),
							children: "Add column"
						})]
					})
				]
			})
		})]
	});
};
function DataGrid({ rows, columns, getRowId, label, editable = false, onCellsChange, onSelectionChange, dirty, height, rowHeight = 32, rowNumberStart = 1, sort, onSortChange, onColumnResize, onCopy, footer, empty = "No rows", onAddColumn, onAddRow, onAddRowCancel }) {
	const added = React.useRef(null);
	const [selection, setSelection] = React.useState(null);
	const [edit, setEdit] = React.useState(null);
	const [status, setStatus] = React.useState("");
	const [busy, setBusy] = React.useState(false);
	const [widths, setWidths] = React.useState({});
	const [scrollTop, setScrollTop] = React.useState(0);
	const history = React.useRef([]);
	const generation = React.useRef(0);
	const pending = React.useRef(null);
	const resizeCleanup = React.useRef(null);
	const grid = React.useRef(null);
	const input = React.useRef(null);
	const uid = React.useId();
	const [contentRowHeight, setContentRowHeight] = React.useState(rowHeight);
	const effectiveRowHeight = Math.max(rowHeight, contentRowHeight);
	React.useLayoutEffect(() => {
		const container = grid.current;
		const header = container?.querySelector("[aria-rowindex=\"1\"]");
		if (!container || !header) return;
		const measure = () => {
			const cell = container.querySelector("[role=\"gridcell\"]");
			if (!cell) return;
			const style = getComputedStyle(cell);
			const lineHeight = Number.parseFloat(style.lineHeight);
			const inset = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom) + Number.parseFloat(style.borderTopWidth) + Number.parseFloat(style.borderBottomWidth);
			if (Number.isFinite(lineHeight + inset)) setContentRowHeight(Math.ceil(lineHeight + inset));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(header);
		return () => observer.disconnect();
	}, [rows.length, columns]);
	React.useEffect(() => () => {
		generation.current += 1;
		pending.current?.abort();
		resizeCleanup.current?.();
	}, []);
	React.useEffect(() => {
		onSelectionChange?.(selection);
	}, [selection, onSelectionChange]);
	const rowIndex = selection ? rows.findIndex((row) => getRowId(row) === selection.active.rowId) : -1;
	const colIndex = selection ? columns.findIndex((column) => column.id === selection.active.columnId) : -1;
	React.useLayoutEffect(() => {
		const container = grid.current;
		const active = container?.querySelector("[data-active]");
		if (!container || !active) return;
		const bounds = container.getBoundingClientRect();
		const cell = active.getBoundingClientRect();
		const gutterWidth = container.querySelector("[role=\"rowheader\"]")?.getBoundingClientRect().width ?? 0;
		const left = bounds.left + container.clientLeft + gutterWidth;
		const right = bounds.left + container.clientLeft + container.clientWidth;
		const headerBottom = container.querySelector("[aria-rowindex=\"1\"]")?.getBoundingClientRect().bottom ?? bounds.top;
		const bottom = bounds.top + container.clientTop + container.clientHeight;
		if (cell.top < headerBottom) container.scrollTop -= headerBottom - cell.top;
		else if (cell.bottom > bottom) container.scrollTop += cell.bottom - bottom;
		if (cell.left < left) container.scrollLeft -= left - cell.left;
		else if (cell.right > right) container.scrollLeft += cell.right - right;
	}, [
		rowIndex,
		colIndex,
		columns,
		effectiveRowHeight
	]);
	const anchorRow = selection ? rows.findIndex((row) => getRowId(row) === selection.anchor.rowId) : -1;
	const anchorCol = selection ? columns.findIndex((column) => column.id === selection.anchor.columnId) : -1;
	const range = rowIndex >= 0 && colIndex >= 0 ? {
		r0: Math.min(rowIndex, anchorRow < 0 ? rowIndex : anchorRow),
		r1: Math.max(rowIndex, anchorRow),
		c0: Math.min(colIndex, anchorCol < 0 ? colIndex : anchorCol),
		c1: Math.max(colIndex, anchorCol)
	} : null;
	const cellId = (r, c) => `${uid}-${r}-${c}`;
	const focusGrid = () => grid.current?.focus({ preventScroll: true });
	const select = (r, c, extend = false) => {
		const row = rows[Math.max(0, Math.min(rows.length - 1, r))];
		const column = columns[Math.max(0, Math.min(columns.length - 1, c))];
		if (!row || !column || busy) return;
		const cell = {
			rowId: getRowId(row),
			columnId: column.id
		};
		setSelection((old) => ({
			active: cell,
			anchor: extend && old ? old.anchor : cell
		}));
	};
	const change = async (changes, undo = false) => {
		if (!changes.length) return true;
		if (!onCellsChange || busy || pending.current) return false;
		const controller = new AbortController();
		pending.current = controller;
		generation.current += 1;
		const turn = generation.current;
		setBusy(true);
		setStatus("Applying changes");
		try {
			await onCellsChange(changes, { signal: controller.signal });
			if (generation.current !== turn || controller.signal.aborted) return false;
			if (!undo) history.current.push(changes);
			setStatus(`${changes.length} ${changes.length === 1 ? "cell changed" : "cells changed"}`);
			return true;
		} catch {
			if (generation.current === turn) setStatus("Changes were not applied. Your draft is kept. Retry or cancel.");
			return false;
		} finally {
			if (generation.current === turn) {
				setBusy(false);
				pending.current = null;
			}
		}
	};
	const startEdit = (r, c, text) => {
		const row = rows[r];
		const column = columns[c];
		if (!row || !column || !editable || !canEditColumn(column) || busy) return;
		const cell = {
			rowId: getRowId(row),
			columnId: column.id
		};
		const previous = column.getValue(row);
		setEdit({
			cell,
			text: text ?? previous ?? "",
			previous,
			error: null
		});
		setSelection({
			active: cell,
			anchor: cell
		});
	};
	React.useLayoutEffect(() => {
		const field = input.current;
		if (!edit || !field) return;
		field.focus();
		field.setSelectionRange(field.value.length, field.value.length);
	}, [edit?.cell.rowId, edit?.cell.columnId]);
	React.useEffect(() => {
		const active = document.activeElement;
		if (!busy && edit && input.current && (!active || active === document.body)) input.current.focus();
	}, [busy]);
	React.useEffect(() => {
		if (!edit || rows.some((row) => getRowId(row) === edit.cell.rowId) && columns.some((column) => column.id === edit.cell.columnId)) return;
		generation.current += 1;
		pending.current?.abort();
		pending.current = null;
		setBusy(false);
		setEdit(null);
		setStatus("The edited cell is no longer available. The draft was not applied.");
	}, [
		rows,
		columns,
		getRowId,
		edit?.cell.rowId,
		edit?.cell.columnId
	]);
	const cancelEdit = () => {
		const fresh = added.current;
		if (fresh && edit?.cell.rowId === fresh.id) {
			added.current = null;
			onAddRowCancel?.(fresh.id);
		}
		setEdit(null);
		focusGrid();
	};
	React.useEffect(() => {
		const fresh = added.current;
		if (!fresh || fresh.started) return;
		const r = rows.findIndex((row) => getRowId(row) === fresh.id);
		const c = columns.findIndex((column) => canEditColumn(column));
		if (r < 0 || c < 0) return;
		fresh.started = true;
		startEdit(r, c);
	});
	const commit = async (dr = 0, dc = 0) => {
		if (!edit || busy) return;
		const row = rows.find((item) => getRowId(item) === edit.cell.rowId);
		const column = columns.find((item) => item.id === edit.cell.columnId);
		if (!row || !column) {
			setEdit(null);
			setStatus("The edited cell is no longer available.");
			return;
		}
		if (!editable || !onCellsChange || !canEditColumn(column)) {
			setEdit(null);
			setStatus("The cell is no longer editable. The draft was not applied.");
			focusGrid();
			return;
		}
		if (column.getValue(row) !== edit.previous) {
			const error = "The value changed while you were editing. Cancel and review the current value before trying again.";
			setEdit({
				...edit,
				error
			});
			setStatus(error);
			return;
		}
		const parsed = parseGridValue(column, edit.text, row);
		if ("error" in parsed) {
			setEdit({
				...edit,
				error: parsed.error
			});
			return;
		}
		if (await change([{
			...edit.cell,
			row,
			previous: edit.previous,
			value: parsed.value
		}])) {
			if (added.current?.id === edit.cell.rowId) added.current = null;
			setEdit(null);
			focusGrid();
			if (dr || dc) select(rowIndex + dr, colIndex + dc);
		}
	};
	const selectedChanges = (value) => {
		if (!range) return [];
		const changes = [];
		for (let r = range.r0; r <= range.r1; r += 1) for (let c = range.c0; c <= range.c1; c += 1) {
			const row = rows[r];
			const column = columns[c];
			if (!row || !column || !canEditColumn(column)) {
				setStatus("The selected range includes read-only or protected cells.");
				return null;
			}
			const parsed = parseGridValue(column, value === null && !column.nullable ? "" : value, row);
			if ("error" in parsed) {
				setStatus(parsed.error);
				return null;
			}
			changes.push({
				rowId: getRowId(row),
				columnId: column.id,
				row,
				previous: column.getValue(row),
				value: parsed.value
			});
		}
		return changes;
	};
	const onKeyDown = (event) => {
		if (event.target !== event.currentTarget || busy || edit) return;
		const navigation = event.key.startsWith("Arrow") || [
			"Home",
			"End",
			"PageUp",
			"PageDown"
		].includes(event.key);
		if ((rowIndex < 0 || colIndex < 0) && navigation) {
			event.preventDefault();
			select(0, 0);
			return;
		}
		const mod = event.ctrlKey || event.metaKey;
		const r = rowIndex < 0 ? 0 : rowIndex;
		const c = colIndex < 0 ? 0 : colIndex;
		let next = null;
		if (event.key === "ArrowDown") next = [mod ? rows.length - 1 : r + 1, c];
		if (event.key === "ArrowUp") next = [mod ? 0 : r - 1, c];
		if (event.key === "ArrowRight") next = [r, mod ? columns.length - 1 : c + 1];
		if (event.key === "ArrowLeft") next = [r, mod ? 0 : c - 1];
		if (event.key === "Home") next = [mod ? 0 : r, 0];
		if (event.key === "End") next = [mod ? rows.length - 1 : r, columns.length - 1];
		if (event.key === "PageDown") next = [r + Math.max(1, Math.floor((height ?? 320) / effectiveRowHeight) - 1), c];
		if (event.key === "PageUp") next = [r - Math.max(1, Math.floor((height ?? 320) / effectiveRowHeight) - 1), c];
		if (next) {
			event.preventDefault();
			select(...next, event.shiftKey);
		} else if (mod && event.key.toLowerCase() === "a") {
			event.preventDefault();
			const first = rows[0];
			const last = rows[rows.length - 1];
			const fc = columns[0];
			const lc = columns[columns.length - 1];
			if (first && last && fc && lc) setSelection({
				anchor: {
					rowId: getRowId(first),
					columnId: fc.id
				},
				active: {
					rowId: getRowId(last),
					columnId: lc.id
				}
			});
		} else if (mod && event.key.toLowerCase() === "z" && editable) {
			event.preventDefault();
			const last = history.current[history.current.length - 1];
			if (last && last.some((cell) => {
				const row = rows.find((item) => getRowId(item) === cell.rowId);
				const column = columns.find((item) => item.id === cell.columnId);
				return !row || !column || !canEditColumn(column) || column.getValue(row) !== cell.value;
			})) {
				setStatus("Cannot undo because the affected cells changed or are no longer editable.");
				return;
			}
			if (last) change(last.map((cell) => ({
				...cell,
				previous: cell.value,
				value: cell.previous
			})), true).then((ok) => {
				if (ok) history.current.pop();
			});
		} else if (event.key === " " && selection && (event.shiftKey || mod)) {
			event.preventDefault();
			const first = rows[0];
			const last = rows[rows.length - 1];
			const fc = columns[0];
			const lc = columns[columns.length - 1];
			if (event.shiftKey && fc && lc) setSelection({
				anchor: {
					rowId: selection.active.rowId,
					columnId: fc.id
				},
				active: {
					rowId: selection.active.rowId,
					columnId: lc.id
				}
			});
			else if (mod && first && last) setSelection({
				anchor: {
					rowId: getRowId(first),
					columnId: selection.active.columnId
				},
				active: {
					rowId: getRowId(last),
					columnId: selection.active.columnId
				}
			});
		} else if (event.key === "Escape") {
			event.preventDefault();
			setSelection((old) => old && {
				active: old.active,
				anchor: old.active
			});
		} else if (["Enter", "F2"].includes(event.key)) {
			event.preventDefault();
			startEdit(r, c);
		} else if ((event.key === "Delete" || event.key === "Backspace") && editable) {
			event.preventDefault();
			const changes = selectedChanges(event.altKey ? "" : null);
			if (changes) change(changes);
		} else if (event.key.length === 1 && !event.nativeEvent.isComposing && !mod && !event.altKey) {
			event.preventDefault();
			startEdit(r, c, event.key);
		}
	};
	const copy = (event) => {
		if (event.target !== event.currentTarget || !range) return;
		const values = [];
		for (let r = range.r0; r <= range.r1; r += 1) {
			const row = rows[r];
			if (!row) return;
			const line = [];
			for (let c = range.c0; c <= range.c1; c += 1) {
				const column = columns[c];
				if (!column) return;
				if (column.sensitive) {
					event.preventDefault();
					setStatus("Protected cells cannot be copied from the grid.");
					return;
				}
				line.push(column.getValue(row));
			}
			values.push(line);
		}
		event.preventDefault();
		const text = encodeTsv(values);
		event.clipboardData.setData("text/plain", text);
		const count = values.reduce((sum, line) => sum + line.length, 0);
		setStatus(`Copied ${count} cells`);
		onCopy?.(text, count);
	};
	const paste = (event) => {
		if (event.target !== event.currentTarget || !selection || !editable || busy) return;
		event.preventDefault();
		const result = pasteGrid({
			rows,
			columns,
			getRowId,
			active: selection.active,
			text: event.clipboardData.getData("text/plain")
		});
		if ("error" in result) setStatus(result.error);
		else change(result.changes);
	};
	const resize = (id, width) => {
		setWidths((old) => {
			const next = { ...old };
			if (width === null) delete next[id];
			else next[id] = width;
			return next;
		});
		onColumnResize?.(id, width);
	};
	const effectiveWidths = new Map(columns.map((column) => {
		const autoWidth = Math.max(column.minWidth ?? 64, Math.min(column.maxWidth ?? 240, Math.max(column.header.length, ...rows.slice(0, 200).map((row) => column.sensitive ? 8 : column.getValue(row)?.length ?? 4)) * 8 + 32));
		return [column.id, widths[column.id] ?? column.width ?? autoWidth];
	}));
	const effectiveWidth = (column) => effectiveWidths.get(column.id) ?? 64;
	const template = `max-content ${columns.map((column) => `${effectiveWidth(column)}px`).join(" ")}${onAddColumn ? " var(--v4-size-control-sm)" : ""}`;
	const start = height ? Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - 5) : 0;
	const end = height ? Math.min(rows.length, start + Math.ceil(height / effectiveRowHeight) + 10) : rows.length;
	const visible = rows.map((_, i) => i).filter((i) => i >= start && i < end || i === rowIndex || edit && getRowId(rows[i]) === edit.cell.rowId);
	const renderRow = (r) => {
		const row = rows[r];
		if (!row) return null;
		return /* @__PURE__ */ jsxs("div", {
			role: "row",
			"aria-rowindex": r + 2,
			"data-last": r === rows.length - 1 || void 0,
			className: data_module_default.gridRow,
			style: {
				gridTemplateColumns: template,
				height: effectiveRowHeight,
				...height ? {
					position: "absolute",
					top: r * effectiveRowHeight,
					minWidth: "100%"
				} : {}
			},
			children: [/* @__PURE__ */ jsx("div", {
				role: "rowheader",
				className: data_module_default.gutter,
				"data-selected": !!range && r >= range.r0 && r <= range.r1 || void 0,
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					tabIndex: -1,
					onClick: () => {
						const first = columns[0];
						const last = columns[columns.length - 1];
						if (first && last) setSelection({
							anchor: {
								rowId: getRowId(row),
								columnId: first.id
							},
							active: {
								rowId: getRowId(row),
								columnId: last.id
							}
						});
					},
					children: r + rowNumberStart
				})
			}), columns.map((column, c) => {
				const active = rowIndex === r && colIndex === c;
				const selected = !!range && r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1;
				const editing = editable && canEditColumn(column) && edit?.cell.rowId === getRowId(row) && edit.cell.columnId === column.id;
				const value = column.sensitive ? null : column.getValue(row);
				const shown = column.sensitive ? "Protected value" : column.format?.(value, row) ?? value;
				const text = shown ?? "NULL";
				const rangeEdge = selected ? [
					r === range.r0 && "inset 0 1px 0 var(--v4-accent-line)",
					r === range.r1 && "inset 0 -1px 0 var(--v4-accent-line)",
					c === range.c0 && "inset 1px 0 0 var(--v4-accent-line)",
					c === range.c1 && "inset -1px 0 0 var(--v4-accent-line)"
				].filter(Boolean).join(", ") : void 0;
				return /* @__PURE__ */ jsx("div", {
					id: cellId(r, c),
					role: "gridcell",
					tabIndex: -1,
					"aria-colindex": c + 2,
					"aria-selected": selected,
					"aria-readonly": !editable || !canEditColumn(column),
					"data-active": active || void 0,
					"data-selected": selected || void 0,
					"data-dirty": dirty?.[getRowId(row)] && Object.prototype.hasOwnProperty.call(dirty[getRowId(row)] ?? {}, column.id) || void 0,
					className: data_module_default.gridCell,
					style: {
						textAlign: column.align,
						boxShadow: rangeEdge || void 0
					},
					title: column.sensitive ? void 0 : text,
					onMouseDown: (event) => {
						if (editing || busy) return;
						event.preventDefault();
						if (edit) {
							setStatus("Finish or cancel the current edit first.");
							return;
						}
						select(r, c, event.shiftKey);
						focusGrid();
					},
					onDoubleClick: () => startEdit(r, c),
					onMouseEnter: (event) => {
						if (event.buttons === 1 && !edit && !busy) select(r, c, true);
					},
					children: editing ? /* @__PURE__ */ jsx("textarea", {
						ref: input,
						"aria-label": `${column.header}, row ${r + rowNumberStart}`,
						"aria-invalid": !!edit.error,
						"aria-describedby": edit.error ? `${uid}-error` : void 0,
						value: edit.text,
						disabled: busy,
						onChange: (event) => setEdit({
							...edit,
							text: event.target.value,
							error: null
						}),
						onKeyDown: (event) => {
							if (event.nativeEvent.isComposing) return;
							if (event.key === "Escape") {
								event.preventDefault();
								event.stopPropagation();
								cancelEdit();
							} else if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								commit(1, 0);
							} else if (event.key === "Tab") {
								event.preventDefault();
								commit(0, event.shiftKey ? -1 : 1);
							}
						}
					}) : shown === null || shown === void 0 ? /* @__PURE__ */ jsx("span", {
						className: data_module_default.gridNull,
						children: "NULL"
					}) : text
				}, column.id);
			})]
		}, getRowId(row));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: data_module_default.gridShell,
		"data-footer": footer || onAddRow ? "" : void 0,
		role: "group",
		"aria-label": `${label} workspace`,
		"data-v4-escape-owner": edit ? "" : void 0,
		onKeyDown: (event) => {
			if (event.key === "Escape" && edit && !busy) {
				event.preventDefault();
				event.stopPropagation();
				cancelEdit();
			}
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				ref: grid,
				role: "grid",
				tabIndex: 0,
				"aria-label": label,
				"aria-rowcount": rows.length + 1,
				"aria-colcount": columns.length + 1,
				"aria-multiselectable": true,
				"aria-readonly": !editable,
				"aria-busy": busy,
				"aria-activedescendant": rowIndex >= 0 && colIndex >= 0 && !edit ? cellId(rowIndex, colIndex) : void 0,
				"data-scroll-fade": "both",
				className: data_module_default.gridScroll,
				style: { maxHeight: height },
				onKeyDown,
				onCopy: copy,
				onPaste: paste,
				onScroll: (event) => setScrollTop(event.currentTarget.scrollTop),
				children: [
					/* @__PURE__ */ jsxs("div", {
						role: "row",
						"aria-rowindex": 1,
						className: data_module_default.gridHead,
						style: { gridTemplateColumns: template },
						children: [
							/* @__PURE__ */ jsx("div", {
								role: "columnheader",
								className: data_module_default.gutter,
								children: "#"
							}),
							columns.map((column) => /* @__PURE__ */ jsxs("div", {
								role: "columnheader",
								"aria-colindex": columns.indexOf(column) + 2,
								"aria-sort": sort?.columnId === column.id ? sort.direction === "asc" ? "ascending" : "descending" : void 0,
								className: data_module_default.gridHeader,
								"data-selected": !!range && columns.indexOf(column) >= range.c0 && columns.indexOf(column) <= range.c1 || void 0,
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: data_module_default.gridHeaderLabel,
										title: column.type ? `${column.header}, ${column.type}` : void 0,
										children: [/* @__PURE__ */ jsxs("span", { children: [column.primaryKey && /* @__PURE__ */ jsx(Icon, {
											name: "key",
											size: 12,
											label: "Primary key",
											className: data_module_default.gridKey
										}), column.header] }), effectiveWidth(column) >= 160 && /* @__PURE__ */ jsx("small", { children: column.type })]
									}),
									onSortChange && /* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "ghost",
										size: "icon-xs",
										iconOnly: true,
										"aria-label": `Sort ${column.header}`,
										"data-active": sort?.columnId === column.id || void 0,
										className: data_module_default.gridSort,
										disabled: busy,
										onClick: () => onSortChange({
											columnId: column.id,
											direction: sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc"
										}),
										children: /* @__PURE__ */ jsx(Icon, { name: sort?.columnId === column.id && sort.direction === "desc" ? "arrow-down" : "arrow-up" })
									}),
									/* @__PURE__ */ jsx("span", {
										role: "slider",
										tabIndex: 0,
										"aria-orientation": "horizontal",
										"aria-label": `Resize ${column.header}`,
										"aria-valuemin": column.minWidth ?? 64,
										"aria-valuemax": column.maxWidth ?? 800,
										"aria-valuenow": effectiveWidth(column),
										className: data_module_default.resize,
										onKeyDown: (event) => {
											const w = effectiveWidth(column);
											if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
												event.preventDefault();
												resize(column.id, Math.max(column.minWidth ?? 64, Math.min(column.maxWidth ?? 800, w + (event.key === "ArrowLeft" ? -8 : 8))));
											} else if (event.key === "Home") {
												event.preventDefault();
												resize(column.id, null);
											}
										},
										onDoubleClick: () => resize(column.id, null),
										onPointerDown: (event) => {
											event.preventDefault();
											resizeCleanup.current?.();
											const left = event.clientX;
											const width = effectiveWidth(column);
											const move = (e) => resize(column.id, Math.max(column.minWidth ?? 64, Math.min(column.maxWidth ?? 800, width + e.clientX - left)));
											const stop = () => {
												window.removeEventListener("pointermove", move);
												window.removeEventListener("pointerup", stop);
												window.removeEventListener("pointercancel", stop);
												resizeCleanup.current = null;
											};
											resizeCleanup.current = stop;
											window.addEventListener("pointermove", move);
											window.addEventListener("pointerup", stop);
											window.addEventListener("pointercancel", stop);
										}
									})
								]
							}, column.id)),
							onAddColumn && /* @__PURE__ */ jsx("div", {
								role: "columnheader",
								className: data_module_default.gridAddHeader,
								children: /* @__PURE__ */ jsx(AddColumn, {
									onAdd: onAddColumn,
									disabled: busy || !!edit
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						role: "rowgroup",
						style: height ? {
							position: "relative",
							height: rows.length * effectiveRowHeight
						} : void 0,
						children: visible.map(renderRow)
					}),
					!rows.length && /* @__PURE__ */ jsx("div", {
						className: data_module_default.empty,
						children: empty
					})
				]
			}),
			edit && /* @__PURE__ */ jsxs("div", {
				className: data_module_default.actions,
				children: [
					/* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						disabled: busy,
						onClick: cancelEdit,
						children: "Cancel edit"
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "button",
						disabled: busy,
						onClick: () => commit(),
						children: "Apply cell"
					}),
					/* @__PURE__ */ jsx("span", {
						id: `${uid}-error`,
						role: "alert",
						children: edit.error
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				role: "status",
				className: data_module_default.status,
				children: status || /* @__PURE__ */ jsxs(Fragment, { children: [
					rows.length,
					" ",
					rows.length === 1 ? "row" : "rows",
					".",
					rows.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
						" ",
						"Select a cell.",
						" ",
						editable && onCellsChange && "Enter edits, Shift+Enter adds a line and Escape cancels."
					] })
				] })
			}),
			(footer || onAddRow) && /* @__PURE__ */ jsxs("div", {
				className: data_module_default.gridFooter,
				children: [onAddRow && /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "xs",
					icon: "plus",
					disabled: busy || !!edit,
					onClick: () => {
						const id = onAddRow();
						if (id) added.current = {
							id,
							started: false,
							committed: false
						};
					},
					children: "New row"
				}), footer]
			})
		]
	});
}
export { DataGrid, gridColumnTypes };

//# sourceMappingURL=data-grid.js.map