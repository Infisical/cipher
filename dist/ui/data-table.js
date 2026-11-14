import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { useSortable } from "../lib/sortable.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { Icon } from "./icon.js";
import { SortableAnnouncer, SortableHandle } from "./sortable-list.js";
import { RowActions, RowContextMenu, Table, TableActionsCell, TableActionsHead, TableBody, TableCell, TableFooter, TableGroupRow, TableHead, TableHeadButton, TableHeader, TableLoadingRows, TableRow, TableRowActions, rowActionSlots } from "./table.js";
import { Tooltip } from "./tooltip.js";
import data_module_default from "./data.module.js";
import frame_module_default from "./frame.module.js";
import * as React from "react";
import { createElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/data-table.tsx
function DataTable({ label, rows: flatRows, groups, getRowChildren, columns, getRowId, rowLabel, variant = "basic", selectable, selectedIds, defaultSelectedIds = [], onSelectionChange, isSelectable: isSelectableProp = () => true, selectionDisabledReason, sort, onSortChange, empty = "No rows", height, virtual = false, rowHeight, loadMore, end, persistentStatus, onRowActivate, pagination, loading = false, loadingRows = 5, refreshing = false, actionBar, focusedRowId, rowActions, rowContextMenu = true, containerRef, containerClassName, isRowMuted, rowProps, reorder }) {
	const embedded = useInFrame("DataTable");
	const [ownSelected, setOwnSelected] = React.useState(defaultSelectedIds);
	const [top, setTop] = React.useState(0);
	const scroll = React.useRef(null);
	const attachScroll = React.useCallback((node) => {
		scroll.current = node;
		if (typeof containerRef === "function") containerRef(node);
		else if (containerRef) containerRef.current = node;
	}, [containerRef]);
	const [landing, setLanding] = React.useState(null);
	const [focusRow, setFocusRow] = React.useState(null);
	const focusPending = React.useRef(false);
	const [tokenRowHeight, setTokenRowHeight] = React.useState();
	const requestedRowHeight = rowHeight ?? tokenRowHeight;
	const [measuredRow, setMeasuredRow] = React.useState({
		requested: requestedRowHeight,
		height: requestedRowHeight
	});
	const effectiveRowHeight = measuredRow.requested === requestedRowHeight ? measuredRow.height : requestedRowHeight;
	const expand = (list, depth) => list.flatMap((row) => [{
		row,
		depth
	}, ...(getRowChildren?.(row) ?? []).map((child) => ({
		row: child,
		depth: depth + 1
	}))]);
	const sections = groups ? groups.filter((group) => group.rows.length > 0).map((group) => ({
		group,
		entries: expand(group.rows, 0)
	})) : [{
		group: void 0,
		entries: expand(flatRows ?? [], 0)
	}];
	const entries = sections.flatMap((section) => section.entries);
	const rows = entries.map((entry) => entry.row);
	const indentColumn = (columns.find((column) => column.primary) ?? columns[0])?.id;
	const isSelectable = (row) => isSelectableProp(row) && !selectionDisabledReason?.(row);
	const selected = selectedIds ?? ownSelected;
	const eligible = rows.filter(isSelectable).map(getRowId);
	const checked = eligible.filter((id) => selected.includes(id)).length;
	const update = (next) => {
		if (selectedIds === void 0) setOwnSelected(next);
		onSelectionChange?.(next);
	};
	const groupCheckbox = (group, groupEntries) => {
		const ids = groupEntries.map((entry) => entry.row).filter(isSelectable).map(getRowId);
		const on = ids.filter((id) => selected.includes(id)).length;
		const name = group.name ?? (typeof group.label === "string" ? group.label : group.id);
		return /* @__PURE__ */ jsx(Checkbox, {
			"aria-label": `Select all in ${name}`,
			disabled: !ids.length,
			checked: on > 0 && on < ids.length ? "indeterminate" : ids.length > 0 && on === ids.length,
			onCheckedChange: () => update(on === ids.length ? selected.filter((id) => !ids.includes(id)) : [.../* @__PURE__ */ new Set([...selected, ...ids])])
		});
	};
	const toggle = (id) => update(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
	const windowed = Boolean(height && virtual && !groups);
	const windowSize = height && effectiveRowHeight ? Math.ceil(height / effectiveRowHeight) + 8 : rows.length;
	const start = windowed && effectiveRowHeight ? Math.max(0, Math.min(Math.floor(top / effectiveRowHeight) - 4, rows.length - windowSize)) : 0;
	let stop = rows.length;
	if (windowed) stop = effectiveRowHeight ? Math.min(rows.length, start + windowSize) : 0;
	React.useLayoutEffect(() => {
		if (rowHeight !== void 0 || !scroll.current) return;
		const token = parseFloat(getComputedStyle(scroll.current).getPropertyValue("--cipher-size-row"));
		if (token > 0) setTokenRowHeight(token);
	}, [rowHeight]);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (!container || !windowed || !requestedRowHeight || !effectiveRowHeight) return;
		const visibleRows = Array.from(container.querySelectorAll("tbody tr[aria-rowindex]"));
		const measure = () => {
			const actual = Math.max(requestedRowHeight, ...visibleRows.map((row) => row.getBoundingClientRect().height));
			if (actual > effectiveRowHeight + .5) setMeasuredRow({
				requested: requestedRowHeight,
				height: actual
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		visibleRows.forEach((row) => observer.observe(row));
		return () => observer.disconnect();
	}, [
		requestedRowHeight,
		effectiveRowHeight,
		windowed,
		start,
		stop,
		rows,
		columns
	]);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (landing === null || !container || !effectiveRowHeight || loadMore?.loading || rows.length <= landing) return;
		container.scrollTop = Math.max(0, (landing - 1) * effectiveRowHeight);
		setTop(container.scrollTop);
		focusPending.current = true;
		setFocusRow(landing);
		setLanding(null);
	}, [
		landing,
		loadMore?.loading,
		rows.length,
		effectiveRowHeight
	]);
	React.useLayoutEffect(() => {
		if (!focusPending.current || focusRow === null) return;
		const row = scroll.current?.querySelector(`tbody tr[data-row-index="${focusRow}"]`);
		if (!row) return;
		focusPending.current = false;
		row.focus({ preventScroll: true });
	}, [focusRow, start]);
	const toggleCounts = (toggle) => {
		const enabled = rows.filter((row) => !toggle.absent?.(row) && !toggle.disabledReason?.(row));
		return {
			enabled,
			on: enabled.filter((row) => toggle.checked(row) === true).length,
			off: enabled.filter((row) => toggle.checked(row) === false).length
		};
	};
	const slots = rowActions ? rowActionSlots(rowActions.inline?.length ?? 0, Boolean(rowActions.renderMenu)) : 0;
	const actionsColumn = Boolean(rowActions) && (loading || rows.length > 0);
	const span = columns.length + (selectable ? 1 : 0) + (actionsColumn ? 1 : 0);
	const hasGrowingColumn = columns.some((column) => column.grow && column.width === void 0);
	const fixedLayout = columns.every((column) => column.width !== void 0 || column.grow || column.actions);
	const fixedFloor = columns.filter((column) => column.width === void 0).map((column) => {
		if (column.actions) return "var(--cipher-size-row)";
		return column.minWidth ? `${column.minWidth}px` : "var(--cipher-size-cell-min)";
	});
	const fixedWidth = columns.reduce((sum, column) => sum + (column.width ?? 0), 0);
	const leading = columns.some((column) => column.pin === "start");
	const trailing = actionsColumn || columns.some((column) => column.pin === true || column.actions);
	const shrinkColumn = trailing ? columns.find((column) => column.primary && column.width === void 0 && !column.wrap)?.id : void 0;
	const pinOffsets = /* @__PURE__ */ new Map();
	columns.filter((column) => column.pin === "start").reduce((before, column) => {
		pinOffsets.set(column.id, `calc(${selectable ? "var(--cipher-size-row)" : "0px"} + ${before}px)`);
		return before + (column.width ?? 0);
	}, 0);
	const columnStyle = (column) => ({
		width: column.width ?? (hasGrowingColumn && !column.grow && !column.actions ? "1%" : void 0),
		minWidth: column.width ?? (column.actions ? void 0 : column.minWidth ?? 64),
		maxWidth: column.maxWidth,
		textAlign: column.align,
		"--cipher-pin-offset": pinOffsets.get(column.id)
	});
	const skeletonRows = Math.max(1, Math.floor(loadingRows));
	const showFooter = !loading && rows.length > 0 && columns.some((column) => column.footer !== void 0);
	const rowCount = rows.length + (groups ? sections.length : 0) + 1;
	const tableStyle = {
		maxHeight: height,
		"--cipher-table-row-height": effectiveRowHeight ? `${effectiveRowHeight}px` : void 0
	};
	const more = loadMore ? /* @__PURE__ */ jsx(Button, {
		type: "button",
		variant: "outline",
		loading: Boolean(loadMore.loading),
		onClick: () => {
			setLanding(rows.length);
			loadMore.onClick();
		},
		children: loadMore.label
	}) : rows.length > 0 && end;
	const sortRows = useSortable({
		items: flatRows ?? [],
		getKey: getRowId,
		getLabel: rowLabel,
		onReorder: (next) => reorder?.onReorder(next)
	});
	const dropEdge = (position) => {
		const lift = sortRows.lift;
		if (!reorder || !lift || lift.to === lift.from || position !== lift.to) return void 0;
		return lift.to < lift.from ? "before" : "after";
	};
	const startRowDrag = (row, body) => {
		sortRows.pick(row, true);
		const follow = (event) => {
			const lift = sortRows.liftRef.current;
			const hit = Array.from(body?.querySelectorAll("tr[data-row-index]") ?? []).find((element) => {
				const box = element.getBoundingClientRect();
				return event.clientY >= box.top && event.clientY <= box.bottom;
			});
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
	const rowHandle = (row) => {
		const key = getRowId(row);
		const lifted = sortRows.lift?.key === key;
		return /* @__PURE__ */ jsx(SortableHandle, {
			itemKey: key,
			label: rowLabel(row),
			instructions: sortRows.instructions,
			lifted: lifted && !sortRows.lift?.pointer,
			disabled: Boolean(reorder?.isRowDisabled?.(row)),
			onPointerDown: (event) => {
				sortRows.container.current = event.currentTarget.closest("table");
				if (!sortRows.lift) startRowDrag(row, event.currentTarget.closest("tbody"));
			},
			onKeyDown: (event) => {
				sortRows.container.current = event.currentTarget.closest("table");
				sortRows.keyDown(event, row, event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0);
			},
			onBlur: (event) => sortRows.blur(event, row)
		});
	};
	const rowInline = (row) => rowActions?.inline?.map((action) => ({
		label: typeof action.label === "string" ? action.label : action.label(row),
		icon: action.icon,
		disabledReason: action.disabledReason?.(row),
		onSelect: () => action.onSelect(row)
	}));
	const renderRow = ({ row, depth }, position, rowIndex) => {
		const extra = rowProps?.(row, position);
		const tableRow = /* @__PURE__ */ createElement(TableRow, {
			...extra,
			key: getRowId(row),
			"aria-rowindex": rowIndex,
			"data-row-index": position,
			tabIndex: onRowActivate ? 0 : position === focusRow ? -1 : extra?.tabIndex ?? void 0,
			onBlur: (event) => {
				extra?.onBlur?.(event);
				if (position === focusRow) setFocusRow(null);
			},
			"data-state": selected.includes(getRowId(row)) ? "selected" : void 0,
			focused: typeof focusedRowId === "string" ? focusedRowId === getRowId(row) : Boolean(focusedRowId?.includes(getRowId(row))),
			"data-activatable": onRowActivate ? "" : void 0,
			"data-muted": isRowMuted?.(row) || void 0,
			"data-drop-target": dropEdge(position) ?? extra?.["data-drop-target"],
			"data-sortable-lifted": sortRows.lift?.key === getRowId(row) || void 0,
			onClick: onRowActivate || extra?.onClick ? (event) => {
				extra?.onClick?.(event);
				if (!event.defaultPrevented) onRowActivate?.(row);
			} : void 0,
			onKeyDown: (event) => {
				extra?.onKeyDown?.(event);
				if (event.defaultPrevented || event.target !== event.currentTarget) return;
				if (event.key === "Enter" && onRowActivate) {
					event.preventDefault();
					onRowActivate(row);
				} else if (event.key === " " && selectable && isSelectable(row)) {
					event.preventDefault();
					toggle(getRowId(row));
				}
			},
			style: { height: effectiveRowHeight }
		}, selectable && /* @__PURE__ */ jsx(TableCell, {
			selection: true,
			pin: leading ? "start" : void 0,
			children: /* @__PURE__ */ jsx(SelectionBox, {
				label: `Select ${rowLabel(row)}`,
				checked: selected.includes(getRowId(row)),
				disabled: !isSelectable(row),
				reason: selectionDisabledReason?.(row),
				onToggle: () => toggle(getRowId(row))
			})
		}), columns.map((column, columnIndex) => {
			const content = column.toggle ? /* @__PURE__ */ jsx(ToggleCell, {
				toggle: column.toggle,
				row,
				label: `${column.header} for ${rowLabel(row)}`,
				rowId: getRowId(row)
			}) : column.actions ? /* @__PURE__ */ jsx(TableRowActions, {
				style: { maxWidth: column.maxWidth },
				children: column.render?.(row, position)
			}) : /* @__PURE__ */ jsx(CellContent, {
				shrink: column.id === shrinkColumn,
				secondary: column.secondary?.(row, position),
				wrap: column.wrap,
				depth: depth > 0 && column.id === indentColumn ? depth : void 0,
				maxWidth: column.maxWidth,
				children: /* @__PURE__ */ jsx("div", {
					className: column.primary ? data_module_default.tablePrimary : data_module_default.tableValue,
					"data-mono": column.mono || void 0,
					"data-wrap": column.wrap || void 0,
					"data-depth": depth > 0 && column.id === indentColumn ? depth : void 0,
					style: { maxWidth: column.maxWidth },
					title: column.wrap ? void 0 : column.text?.(row),
					children: column.render?.(row, position)
				})
			});
			return /* @__PURE__ */ jsx(TableCell, {
				className: column.actions ? data_module_default.tableActions : void 0,
				style: columnStyle(column),
				"data-actions": column.actions || void 0,
				"data-pin": column.pin ?? column.actions,
				"data-wrap": column.wrap || void 0,
				"data-secondary": column.secondary ? true : void 0,
				"data-row-interactive": column.actions || column.toggle ? true : void 0,
				children: reorder && columnIndex === 0 ? /* @__PURE__ */ jsxs("div", {
					className: data_module_default.tableSortCell,
					children: [rowHandle(row), content]
				}) : content
			}, column.id);
		}), rowActions && /* @__PURE__ */ jsx(TableActionsCell, {
			slots,
			"data-pin": "true",
			children: /* @__PURE__ */ jsx(RowActions, {
				lazy: true,
				label: rowLabel(row),
				inline: rowInline(row),
				menu: rowActions.renderMenu?.(row),
				menuLabel: rowActions.menuLabel,
				menuDisabledReason: rowActions.menuDisabledReason?.(row)
			})
		}));
		if (!rowActions || rowContextMenu === false) return tableRow;
		return /* @__PURE__ */ jsx(RowContextMenu, {
			label: rowLabel(row),
			inline: rowInline(row),
			menu: rowActions.renderMenu?.(row),
			menuDisabledReason: rowActions.menuDisabledReason?.(row),
			children: tableRow
		}, getRowId(row));
	};
	const scrollFrame = /* @__PURE__ */ jsxs("div", {
		ref: attachScroll,
		"data-scroll-fade": "x",
		"data-has-start-pin": leading || void 0,
		"data-has-end-pin": trailing || void 0,
		"data-frame-foot": Boolean(height && more || pagination) || void 0,
		className: cn(!embedded && frame_module_default.frame, data_module_default.tableScroll, containerClassName),
		"data-virtual": windowed || void 0,
		style: tableStyle,
		onScroll: (event) => setTop(event.currentTarget.scrollTop),
		children: [
			/* @__PURE__ */ jsxs(Table, {
				"aria-label": label,
				"aria-rowcount": rowCount + (showFooter ? 1 : 0),
				"aria-busy": loading || refreshing || void 0,
				"data-variant": variant,
				"data-layout": fixedLayout ? "fixed" : void 0,
				style: fixedLayout ? { minWidth: `calc(${[
					`${fixedWidth}px`,
					...fixedFloor,
					...selectable ? ["var(--cipher-size-row)"] : [],
					...actionsColumn ? [`var(--cipher-size-row) + ${slots - 1} * var(--cipher-size-row-action-step)`] : []
				].join(" + ")})` } : void 0,
				children: [
					/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						selectable && /* @__PURE__ */ jsx(TableHead, {
							selection: true,
							pin: leading ? "start" : void 0,
							children: /* @__PURE__ */ jsx(Checkbox, {
								"aria-label": `Select all available rows in ${label}`,
								disabled: loading || !eligible.length,
								checked: checked > 0 && checked < eligible.length ? "indeterminate" : eligible.length > 0 && checked === eligible.length,
								onCheckedChange: () => update(checked === eligible.length ? selected.filter((id) => !eligible.includes(id)) : [.../* @__PURE__ */ new Set([...selected, ...eligible])])
							})
						}),
						columns.map((column) => /* @__PURE__ */ jsxs(TableHead, {
							scope: "col",
							className: column.actions ? data_module_default.tableActions : void 0,
							style: columnStyle(column),
							"data-actions": column.actions || void 0,
							"data-pin": column.pin ?? column.actions,
							"aria-sort": sort?.columnId === column.id ? sort.direction === "asc" ? "ascending" : "descending" : void 0,
							children: [column.toggle && /* @__PURE__ */ jsx(ToggleHead, {
								toggle: column.toggle,
								counts: toggleCounts(column.toggle),
								label: column.toggle.label ?? `${column.header} for every row in ${label}`,
								disabled: loading,
								getRowId
							}), column.sortable && onSortChange ? /* @__PURE__ */ jsxs(TableHeadButton, {
								"data-active": sort?.columnId === column.id || void 0,
								onClick: () => onSortChange({
									columnId: column.id,
									direction: sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc"
								}),
								children: [column.header, /* @__PURE__ */ jsx(Icon, { name: sort?.columnId === column.id && sort.direction === "desc" ? "arrow-down" : "arrow-up" })]
							}) : /* @__PURE__ */ jsx("span", {
								className: column.hideHeader || column.actions ? data_module_default.sr : void 0,
								children: column.header
							})]
						}, column.id)),
						rowActions && actionsColumn && /* @__PURE__ */ jsx(TableActionsHead, {
							slots,
							"data-pin": "true",
							children: rowActions.header ?? "Actions"
						})
					] }) }),
					(loading || !groups || !rows.length) && /* @__PURE__ */ jsxs(TableBody, { children: [
						loading && /* @__PURE__ */ jsx(TableLoadingRows, {
							rows: skeletonRows,
							selectable,
							actionSlots: rowActions ? slots : void 0,
							columns: columns.map((column) => ({
								primary: column.primary,
								actions: column.actions,
								pin: column.pin,
								maxWidth: column.maxWidth,
								style: columnStyle(column)
							}))
						}),
						!loading && start > 0 && /* @__PURE__ */ jsx(TableRow, {
							"aria-hidden": true,
							"data-spacer": true,
							children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: span,
								style: {
									height: start * (effectiveRowHeight ?? 0),
									padding: 0
								}
							})
						}),
						!loading && !groups && entries.slice(start, stop).map((entry, i) => renderRow(entry, start + i, start + i + 2)),
						!loading && stop < rows.length && /* @__PURE__ */ jsx(TableRow, {
							"aria-hidden": true,
							"data-spacer": true,
							children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: span,
								style: {
									height: (rows.length - stop) * (effectiveRowHeight ?? 0),
									padding: 0
								}
							})
						}),
						!loading && !rows.length && /* @__PURE__ */ jsx(TableRow, {
							"data-row-kind": "empty",
							children: /* @__PURE__ */ jsx(TableCell, {
								colSpan: span,
								children: empty
							})
						})
					] }),
					!loading && groups && sections.map(({ group, entries: groupEntries }, index) => {
						const offset = sections.slice(0, index).reduce((sum, section) => sum + section.entries.length + 1, 0);
						const before = sections.slice(0, index).reduce((sum, section) => sum + section.entries.length, 0);
						return /* @__PURE__ */ jsxs(TableBody, {
							"data-group": "",
							children: [/* @__PURE__ */ jsx(TableGroupRow, {
								"aria-rowindex": offset + 2,
								label: group?.label,
								meta: group?.meta,
								actions: group?.actions,
								colSpan: columns.length,
								actionSlots: rowActions ? slots : void 0,
								selectable,
								checkbox: selectable && group ? groupCheckbox(group, groupEntries) : void 0
							}), groupEntries.map((entry, i) => renderRow(entry, before + i, offset + i + 3))]
						}, group?.id);
					}),
					showFooter && /* @__PURE__ */ jsx(TableFooter, {
						className: data_module_default.tableFoot,
						"data-slot": "data-table-footer",
						children: /* @__PURE__ */ jsxs(TableRow, {
							"aria-rowindex": rowCount + 1,
							children: [
								selectable && /* @__PURE__ */ jsx(TableCell, {
									selection: true,
									pin: leading ? "start" : void 0
								}),
								columns.map((column) => /* @__PURE__ */ jsx(TableCell, {
									className: column.actions ? data_module_default.tableActions : void 0,
									style: columnStyle(column),
									"data-actions": column.actions || void 0,
									"data-pin": column.pin ?? column.actions,
									"data-wrap": column.wrap || void 0,
									children: column.footer !== void 0 && /* @__PURE__ */ jsx("div", {
										className: column.primary ? data_module_default.tablePrimary : data_module_default.tableValue,
										"data-mono": column.mono || void 0,
										"data-wrap": column.wrap || void 0,
										style: { maxWidth: column.maxWidth },
										children: column.footer
									})
								}, column.id)),
								rowActions && actionsColumn && /* @__PURE__ */ jsx(TableActionsCell, {
									slots,
									"data-pin": "true"
								})
							]
						})
					})
				]
			}),
			height && more && /* @__PURE__ */ jsx("div", {
				className: cn(frame_module_default.frameFoot, data_module_default.tableMore),
				children: more
			}),
			pagination && /* @__PURE__ */ jsx("div", {
				className: cn(frame_module_default.frameFoot, data_module_default.tablePagination),
				"data-slot": "data-table-pagination",
				children: pagination
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: data_module_default.tableShell,
		"data-slot": "data-table",
		"data-variant": variant,
		"data-embedded": embedded || void 0,
		children: [
			refreshing && !loading && /* @__PURE__ */ jsx("span", {
				className: data_module_default.refreshing,
				"data-slot": "data-table-refreshing",
				"aria-hidden": true
			}),
			/* @__PURE__ */ jsx(FrameScope, {
				framed: true,
				children: scrollFrame
			}),
			!height && more && /* @__PURE__ */ jsx("div", {
				className: data_module_default.actions,
				children: more
			}),
			persistentStatus && /* @__PURE__ */ jsx("div", {
				className: data_module_default.status,
				children: persistentStatus
			}),
			/* @__PURE__ */ jsx("span", {
				className: data_module_default.sr,
				role: "status",
				children: loading ? "Loading rows" : /* @__PURE__ */ jsxs(Fragment, { children: [
					selectable ? `${selected.length} selected. ` : "",
					rows.length,
					" rows available",
					loadMore?.loading ? ". Loading more rows" : ""
				] })
			}),
			reorder && /* @__PURE__ */ jsx(SortableAnnouncer, {
				instructions: sortRows.instructions,
				announcement: sortRows.announcement,
				children: "Press Space or Enter to pick up a row, then use the arrow keys to move it. Alt with an arrow key moves one step."
			}),
			actionBar
		]
	});
}
function CellContent({ shrink, secondary, wrap, depth, maxWidth, children }) {
	const content = secondary === void 0 || secondary === null || secondary === false ? children : /* @__PURE__ */ jsxs("div", {
		className: data_module_default.tableLines,
		children: [children, /* @__PURE__ */ jsx("div", {
			className: data_module_default.tableSecondary,
			"data-wrap": wrap || void 0,
			"data-depth": depth,
			style: { maxWidth },
			children: secondary
		})]
	});
	return shrink ? /* @__PURE__ */ jsx("div", {
		className: data_module_default.tableShrink,
		children: content
	}) : content;
}
function EnvMark({ present, env }) {
	return /* @__PURE__ */ jsx("span", {
		"aria-label": `${env ?? "Environment"}: ${present ? "present" : "missing"}`,
		children: present ? "✓" : "−"
	});
}
function ToggleHead({ toggle, counts, label, disabled, getRowId }) {
	const { enabled, on, off } = counts;
	const all = enabled.length > 0 && on === enabled.length;
	const none = off === enabled.length;
	return /* @__PURE__ */ jsx("span", {
		className: data_module_default.tableToggle,
		"data-slot": "table-column-toggle",
		children: /* @__PURE__ */ jsx(Checkbox, {
			"aria-label": label,
			disabled: disabled || !enabled.length,
			checked: all || (none ? false : "indeterminate"),
			onCheckedChange: () => toggle.onChange(enabled.filter((row) => toggle.checked(row) !== !all).map(getRowId), !all)
		})
	});
}
function ToggleCell({ toggle, row, label, rowId }) {
	if (toggle.absent?.(row)) return /* @__PURE__ */ jsxs("span", {
		className: data_module_default.tableToggleAbsent,
		"data-slot": "table-toggle-absent",
		children: [/* @__PURE__ */ jsx("span", {
			"aria-hidden": true,
			children: "−"
		}), /* @__PURE__ */ jsx("span", {
			className: data_module_default.sr,
			children: `${label}: not applicable`
		})]
	});
	const reason = toggle.disabledReason?.(row);
	const adornment = toggle.adornment?.(row);
	const box = /* @__PURE__ */ jsx("span", {
		className: data_module_default.tableToggle,
		children: /* @__PURE__ */ jsx(Checkbox, {
			"aria-label": label,
			"aria-description": reason,
			checked: toggle.checked(row),
			disabled: Boolean(reason),
			onCheckedChange: (next) => toggle.onChange([rowId], next === true)
		})
	});
	return /* @__PURE__ */ jsxs("span", {
		className: data_module_default.tableToggleCell,
		children: [reason ? /* @__PURE__ */ jsx(Tooltip, {
			content: reason,
			children: box
		}) : box, adornment]
	});
}
function SelectionBox({ label, checked, disabled, reason, onToggle }) {
	const box = /* @__PURE__ */ jsx("div", {
		className: data_module_default.tableSelection,
		children: /* @__PURE__ */ jsx(Checkbox, {
			"aria-label": label,
			"aria-description": reason,
			checked,
			disabled,
			onCheckedChange: onToggle
		})
	});
	return reason ? /* @__PURE__ */ jsx(Tooltip, {
		content: reason,
		children: box
	}) : box;
}
export { DataTable, EnvMark };

//# sourceMappingURL=data-table.js.map