"use client";
import { FrameScope, useFrameFoot, useInFrame } from "../lib/frame-context.js";
import { useListFiltered } from "../lib/list-query.js";
import { useSortable } from "../lib/sortable.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu.js";
import { EmptyScope } from "./empty.js";
import { Icon } from "./icon.js";
import { NameLine } from "./name-line.js";
import { Skeleton } from "./skeleton.js";
import { SortableAnnouncer, SortableHandle } from "./sortable-list.js";
import { EditableCell, RowActions, RowContextMenu, Table, TableActionsCell, TableActionsHead, TableBody, TableCell, TableFooter, TableGroupRow, TableHead, TableHeadButton, TableHeader, TableLoadingRows, TableRow, TableRowActions, rowActionSlots } from "./table.js";
import { EmptyValue } from "./text.js";
import { Tooltip } from "./tooltip.js";
import data_module_default from "./data.module.js";
import frame_module_default from "./frame.module.js";
import * as React from "react";
import { createElement } from "react";
import { createPortal, flushSync } from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/data-table.tsx
function DataTable({ label, rows: flatRows, groups, getRowChildren, columns: allColumns, getRowId, rowLabel, variant = "basic", selectable, selectedIds, defaultSelectedIds = [], onSelectionChange, isSelectable: isSelectableProp = () => true, selectionDisabledReason, sort, onSortChange, empty = "No rows", ghost, filtered: filteredProp, height, virtual = false, rowHeight, loadMore, showFewer, end, persistentStatus, onRowActivate, isRowActivatable, pagination, loading = false, loadingRows = 5, refreshing = false, actionBar, focusedRowId, rowActions, rowContextMenu = true, containerRef, containerClassName, isRowMuted, rowTone, getRowRestricted, rowProps, reorder, stackBelow, headerGround }) {
	const embedded = useInFrame("DataTable");
	const frameFoot = useFrameFoot();
	const footId = React.useId();
	const listFiltered = useListFiltered();
	const filtered = filteredProp ?? listFiltered;
	const [ownSelected, setOwnSelected] = React.useState(defaultSelectedIds);
	const [top, setTop] = React.useState(0);
	const scroll = React.useRef(null);
	const attachScroll = React.useCallback((node) => {
		scroll.current = node;
		if (typeof containerRef === "function") containerRef(node);
		else if (containerRef) containerRef.current = node;
	}, [containerRef]);
	const [frameWidth, setFrameWidth] = React.useState(null);
	const stacked = stackBelow !== void 0 && frameWidth !== null && frameWidth < stackBelow;
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (stackBelow === void 0 || !container) return;
		const measure = () => setFrameWidth(container.clientWidth);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(container);
		return () => observer.disconnect();
	}, [stackBelow]);
	const [narrow, setNarrow] = React.useState(null);
	const bare = !loading && !(groups ? groups.some((group) => group.rows.length > 0) : flatRows?.length);
	const droppable = allColumns.some((column) => column.dropFirst);
	const squeezed = bare && narrow !== null && !stacked;
	const primaryColumn = allColumns.find((column) => column.primary);
	const primaryCap = primaryColumn?.width ?? primaryColumn?.maxWidth ?? Infinity;
	let columns = allColumns;
	if (stacked) columns = allColumns.filter((column) => column.stack !== "hidden");
	else if (narrow !== null) columns = allColumns.filter((column) => !column.dropFirst);
	const columnShape = allColumns.map((column) => [
		column.id,
		column.width,
		column.minWidth,
		column.grow,
		column.dropFirst
	].join(":")).join("|");
	React.useLayoutEffect(() => setNarrow(null), [
		columnShape,
		bare,
		stacked
	]);
	const [primaryWidth, setPrimaryWidth] = React.useState();
	const [headWidths, setHeadWidths] = React.useState({});
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
	const isSelectable = (row) => !getRowRestricted?.(row) && isSelectableProp(row) && !selectionDisabledReason?.(row);
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
	const selectAll = (bandLabel) => /* @__PURE__ */ jsx(Checkbox, {
		"aria-label": bandLabel ? void 0 : `Select all available rows in ${label}`,
		label: bandLabel,
		disabled: loading || !eligible.length,
		checked: checked > 0 && checked < eligible.length ? "indeterminate" : eligible.length > 0 && checked === eligible.length,
		onCheckedChange: () => update(checked === eligible.length ? selected.filter((id) => !eligible.includes(id)) : [.../* @__PURE__ */ new Set([...selected, ...eligible])])
	});
	const windowed = Boolean(virtual && !groups);
	const flowing = windowed && !height;
	const pinnedFoot = Boolean((persistentStatus || loadMore || showFewer) && !pagination);
	const wantsFrameFoot = embedded && pinnedFoot;
	const footOwner = frameFoot?.owner;
	const footTarget = wantsFrameFoot && footOwner === footId ? frameFoot?.target ?? null : null;
	const [viewport, setViewport] = React.useState(0);
	const [chrome, setChrome] = React.useState(null);
	const windowSize = windowed && effectiveRowHeight ? Math.ceil((height ?? viewport) / effectiveRowHeight) + 8 : rows.length;
	const wholeRows = windowed && !stacked && height && effectiveRowHeight && chrome ? Math.floor((height - chrome.head - chrome.rest) / effectiveRowHeight) : 0;
	const frameHeight = wholeRows > 0 && effectiveRowHeight && chrome ? chrome.head + chrome.rest + wholeRows * effectiveRowHeight : height;
	const [stackHeights, setStackHeights] = React.useState({});
	let stackOffsets;
	if (stacked && windowed) {
		const measured = Object.values(stackHeights);
		const lines = columns.filter((column) => !column.primary && !column.actions && column.stack !== "meta").length;
		const estimate = rowHeight ?? (measured.length ? measured.reduce((sum, value) => sum + value, 0) / measured.length : (tokenRowHeight ?? 40) * (1 + lines * .75));
		stackOffsets = [0];
		for (const row of rows) stackOffsets.push(stackOffsets[stackOffsets.length - 1] + (stackHeights[getRowId(row)] ?? estimate));
	}
	let start = 0;
	let stop = rows.length;
	if (stackOffsets) {
		start = Math.max(0, rowAt(stackOffsets, top) - 4);
		stop = Math.min(rows.length, rowAt(stackOffsets, top + (height ?? viewport)) + 5);
	} else if (windowed) {
		start = effectiveRowHeight ? Math.max(0, Math.min(Math.floor(top / effectiveRowHeight) - 4, rows.length - windowSize)) : 0;
		stop = effectiveRowHeight ? Math.min(rows.length, start + windowSize) : 0;
	}
	const spacerAbove = stackOffsets ? stackOffsets[start] : start * (effectiveRowHeight ?? 0);
	const spacerBelow = stackOffsets ? stackOffsets[rows.length] - stackOffsets[stop] : (rows.length - stop) * (effectiveRowHeight ?? 0);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		const head = container?.querySelector("thead");
		if (!height || !windowed || !container || !head) return;
		const measure = () => {
			const bands = container.querySelectorAll("[data-slot='data-table-pagination'], [data-slot='data-table-more']");
			const next = {
				head: head.getBoundingClientRect().height,
				rest: container.offsetHeight - container.clientHeight + [...bands].reduce((sum, band) => sum + band.getBoundingClientRect().height, 0)
			};
			setChrome((current) => current?.head === next.head && current.rest === next.rest ? current : next);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(head);
		observer.observe(container);
		container.querySelectorAll("[data-slot='data-table-pagination'], [data-slot='data-table-more']").forEach((band) => observer.observe(band));
		return () => observer.disconnect();
	}, [
		height,
		windowed,
		pinnedFoot,
		Boolean(footTarget),
		Boolean(pagination)
	]);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (!flowing || !container) return;
		let scroller = container.parentElement;
		while (scroller && scroller !== document.documentElement && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
		const sync = () => {
			const box = scroller?.getBoundingClientRect();
			const viewTop = Math.max(0, box?.top ?? 0);
			const viewBottom = Math.min(window.innerHeight, box?.bottom ?? window.innerHeight);
			setTop(Math.max(0, viewTop - container.getBoundingClientRect().top));
			setViewport(Math.max(0, viewBottom - viewTop));
		};
		sync();
		document.addEventListener("scroll", sync, {
			capture: true,
			passive: true
		});
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
		if (rowHeight !== void 0 || !scroll.current) return;
		const token = parseFloat(getComputedStyle(scroll.current).getPropertyValue("--cipher-size-row"));
		if (token > 0) setTokenRowHeight(token);
	}, [rowHeight]);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (!container || !stacked || !windowed) return;
		const visibleRows = Array.from(container.querySelectorAll("tbody tr[data-row-index]"));
		const measure = () => {
			const next = {};
			for (const element of visibleRows) {
				const row = rows[Number(element.dataset.rowIndex)];
				if (row !== void 0) next[getRowId(row)] = element.getBoundingClientRect().height;
			}
			setStackHeights((current) => Object.entries(next).every(([id, value]) => Math.abs((current[id] ?? -1) - value) < .5) ? current : {
				...current,
				...next
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		visibleRows.forEach((row) => observer.observe(row));
		return () => observer.disconnect();
	}, [
		stacked,
		windowed,
		start,
		stop,
		rows,
		columns,
		getRowId
	]);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (!container || stacked || !windowed || !requestedRowHeight || !effectiveRowHeight) return;
		const visibleRows = Array.from(container.querySelectorAll("tbody tr[aria-rowindex]"));
		const measure = () => {
			const actual = Math.max(requestedRowHeight, ...visibleRows.filter((row) => !row.querySelector("[data-editing]")).map((row) => row.getBoundingClientRect().height));
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
		stacked,
		windowed,
		start,
		stop,
		rows,
		columns
	]);
	const landingTop = landing === null ? 0 : stackOffsets?.[landing - 1] ?? (landing - 1) * (effectiveRowHeight ?? 0);
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (landing === null || !container || !effectiveRowHeight || loadMore?.loading || rows.length <= landing) return;
		if (!flowing) {
			container.scrollTop = Math.max(0, landingTop);
			setTop(container.scrollTop);
		}
		focusPending.current = true;
		setFocusRow(landing);
		setLanding(null);
	}, [
		landing,
		landingTop,
		loadMore?.loading,
		rows.length,
		effectiveRowHeight,
		flowing
	]);
	React.useLayoutEffect(() => {
		if (!focusPending.current || focusRow === null) return;
		const row = scroll.current?.querySelector(`tbody tr[data-row-index="${focusRow}"]`);
		if (!row) return;
		focusPending.current = false;
		row.focus({ preventScroll: true });
	}, [focusRow, start]);
	const toggleCounts = (toggle) => {
		const enabled = rows.filter((row) => !getRowRestricted?.(row) && !toggle.absent?.(row) && !toggle.disabledReason?.(row));
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
	const fixedLayout = squeezed || columns.every((column) => column.width !== void 0 || column.grow || column.actions);
	const explicitWidth = (column) => squeezed || column.width === void 0 ? void 0 : Math.max(column.width, headWidths[column.id] ?? 0);
	const primaryMin = flowing ? "var(--cipher-size-cell-min)" : "var(--cipher-size-text-min)";
	const columnFloor = (column) => {
		if (column.minWidth) return `${column.minWidth}px`;
		return column.primary ? primaryMin : "var(--cipher-size-cell-min)";
	};
	const sharing = columns.filter((column) => column.width === void 0 && !column.actions);
	const fixedFloor = [...columns.filter((column) => column.width === void 0 && column.actions).map(() => "var(--cipher-size-row)"), ...sharing.length > 0 ? [`${sharing.length} * max(${sharing.map(columnFloor).join(", ")})`] : []];
	const fixedWidth = columns.reduce((sum, column) => sum + (explicitWidth(column) ?? 0), 0);
	const leading = columns.some((column) => column.pin === "start");
	const headerHidden = !selectable && columns.every((column) => (column.hideHeader || column.actions) && !column.toggle && !(column.sortable && onSortChange));
	const trailing = actionsColumn || columns.some((column) => column.pin === true || column.actions);
	const shrinkColumn = trailing ? columns.find((column) => column.primary && column.width === void 0 && !column.wrap)?.id : void 0;
	const pinOffsets = /* @__PURE__ */ new Map();
	columns.filter((column) => column.pin === "start").reduce((before, column) => {
		pinOffsets.set(column.id, `calc(${selectable ? "var(--cipher-size-row)" : "0px"} + ${before}px)`);
		return before + (explicitWidth(column) ?? 0);
	}, 0);
	const contentSized = fixedLayout && !flowing && !squeezed ? columns.find((column) => column.primary && column.grow && column.width === void 0 && !column.wrap && sharing.some((other) => other !== column && other.grow))?.id : void 0;
	const topByDefault = columns.some((column) => column.wrap);
	const topAligned = (column) => !stacked && (column.valign ?? (topByDefault ? "top" : "center")) === "top";
	const stackTitle = stacked ? (columns.find((column) => column.primary) ?? columns.find((column) => !column.actions))?.id : void 0;
	const stackTrail = stacked ? columns.filter((column) => column.id !== stackTitle && (column.actions || column.stack === "meta")) : [];
	const stackLines = stacked ? columns.filter((column) => column.id !== stackTitle && !stackTrail.includes(column)) : [];
	const bodyStart = selectable ? 2 : 1;
	const stackPlace = (column) => {
		if (column.id === stackTitle) return {
			gridColumn: bodyStart,
			gridRow: 1
		};
		const trail = stackTrail.indexOf(column);
		if (trail >= 0) return {
			gridColumn: bodyStart + 1 + trail,
			gridRow: 1
		};
		return {
			gridColumn: `${bodyStart} / -1`,
			gridRow: 2 + stackLines.indexOf(column)
		};
	};
	const colIndex = (column) => stacked ? columns.indexOf(column) + bodyStart : void 0;
	const role = (name) => stacked ? name : void 0;
	const stackColumns = [
		...selectable ? ["auto"] : [],
		"minmax(0, 1fr)",
		...stackTrail.map(() => "auto"),
		...actionsColumn ? ["auto"] : []
	].join(" ");
	const stackLabelLength = Math.max(0, ...stackLines.map((column) => column.header.length));
	const stackLine = (header, content) => /* @__PURE__ */ jsxs("div", {
		className: data_module_default.tableStackLine,
		children: [header !== void 0 && /* @__PURE__ */ jsx("span", {
			className: data_module_default.tableStackLabel,
			"aria-hidden": true,
			children: header
		}), /* @__PURE__ */ jsx("div", {
			className: data_module_default.tableStackValue,
			children: content
		})]
	});
	const columnStyle = (column) => ({
		width: explicitWidth(column) ?? (column.id === contentSized ? primaryWidth : void 0) ?? (hasGrowingColumn && !squeezed && !column.grow && !column.actions ? "1%" : void 0),
		minWidth: explicitWidth(column) ?? (column.actions || squeezed ? void 0 : column.minWidth ?? (column.primary ? primaryMin : 64)),
		maxWidth: column.maxWidth,
		textAlign: column.align,
		"--cipher-pin-offset": pinOffsets.get(column.id)
	});
	const cellStyle = (column) => stacked ? stackPlace(column) : columnStyle(column);
	const headShape = fixedLayout && !flowing ? JSON.stringify(columns.filter((column) => column.width !== void 0).map((column) => [
		column.id,
		column.header,
		Boolean(column.sortable && onSortChange),
		Boolean(column.hideHeader),
		Boolean(column.toggle)
	])) : "";
	React.useLayoutEffect(() => {
		const head = scroll.current?.querySelector("thead tr");
		if (!headShape || !head) {
			setHeadWidths((current) => Object.keys(current).length ? {} : current);
			return;
		}
		const ids = new Set(JSON.parse(headShape).map(([id]) => id));
		let live = true;
		const measure = () => {
			if (!live) return;
			const next = {};
			for (const cell of head.querySelectorAll("th[data-column]")) {
				const id = cell.dataset.column;
				if (!id || !ids.has(id)) continue;
				const probe = document.createElement("div");
				probe.style.cssText = "position:absolute;visibility:hidden;width:max-content;white-space:nowrap";
				probe.append(...Array.from(cell.childNodes, (node) => node.cloneNode(true)));
				cell.append(probe);
				const style = getComputedStyle(cell);
				next[id] = Math.ceil(probe.getBoundingClientRect().width + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth));
				probe.remove();
			}
			setHeadWidths((current) => Object.keys(next).length === Object.keys(current).length && Object.entries(next).every(([id, width]) => current[id] === width) ? current : next);
		};
		measure();
		const remeasure = () => flushSync(measure);
		document.fonts?.ready.then(remeasure);
		const observer = new ResizeObserver(remeasure);
		observer.observe(head);
		return () => {
			live = false;
			observer.disconnect();
		};
	}, [headShape]);
	const otherGrowing = sharing.filter((column) => column.grow && column.id !== contentSized).map((column) => column.id).join("\n");
	React.useLayoutEffect(() => {
		const container = scroll.current;
		if (stacked || !droppable && !bare || !container || contentSized && primaryWidth === void 0) return;
		const measure = () => {
			const width = container.clientWidth;
			const truncated = Math.max(0, ...Array.from(container.querySelectorAll(`.${data_module_default.tablePrimary}`), (cell) => {
				const name = cell.querySelector("[data-slot=\"name-line-name\"]");
				const overflow = Math.max(cell.scrollWidth - cell.clientWidth, name ? name.scrollWidth - name.clientWidth : 0);
				return Math.min(overflow, primaryCap - cell.clientWidth);
			}));
			const table = container.querySelector("table");
			const floors = () => {
				const tableMin = table ? getComputedStyle(table).minWidth : "";
				const cells = Array.from(table?.tHead?.rows[0]?.cells ?? [], (cell) => {
					const style = getComputedStyle(cell);
					const padding = style.boxSizing === "border-box" ? 0 : parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
					return (parseFloat(style.minWidth) || 0) + padding;
				});
				return Math.max(tableMin.endsWith("px") ? parseFloat(tableMin) : 0, cells.reduce((sum, cell) => sum + cell, 0));
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
	}, [
		stacked,
		droppable,
		bare,
		narrow,
		contentSized,
		primaryWidth,
		primaryCap
	]);
	React.useLayoutEffect(() => {
		const table = scroll.current?.querySelector("table");
		if (!contentSized || !table) {
			setPrimaryWidth(void 0);
			return;
		}
		const header = (id) => table.querySelector(`thead th[data-column="${CSS.escape(id)}"]`);
		const measure = () => {
			const head = header(contentSized);
			if (!head?.parentElement) return;
			const others = otherGrowing.split("\n").map(header).filter((cell) => Boolean(cell));
			const width = (cell) => cell.getBoundingClientRect().width;
			const available = others.reduce((sum, cell) => sum + width(cell), width(head));
			const floor = others.reduce((sum, cell) => sum + (parseFloat(getComputedStyle(cell).minWidth) || 0), 0);
			const span = head.parentElement.cells.length;
			const cells = [head, ...Array.from(table.tBodies).flatMap((body) => Array.from(body.rows).filter((row) => row.cells.length === span).map((row) => row.cells[head.cellIndex]))];
			const range = document.createRange();
			const contentEnd = (cell) => {
				let end = 0;
				const walker = document.createTreeWalker(cell, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
				for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node instanceof Text) {
					if (!node.data.trim()) continue;
					range.selectNodeContents(node);
					end = Math.max(end, range.getBoundingClientRect().right);
				} else if (node instanceof SVGSVGElement || node instanceof HTMLImageElement) end = Math.max(end, node.getBoundingClientRect().right);
				const truncated = Array.from(cell.querySelectorAll(`[data-slot="name-line-name"], .${data_module_default.tablePrimary}, .${data_module_default.tableValue}`), (element) => element.scrollWidth - element.clientWidth);
				return end + Math.max(0, ...truncated);
			};
			const natural = Math.max(...cells.map((cell) => {
				const box = cell.getBoundingClientRect();
				const end = contentEnd(cell);
				return end > box.left ? end - box.left + parseFloat(getComputedStyle(cell).paddingRight) : 0;
			}));
			const next = Math.max(0, Math.min(Math.ceil(natural), Math.floor(available - floor)));
			setPrimaryWidth((current) => current !== void 0 && Math.abs(current - next) < 1 ? current : next);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(table);
		return () => observer.disconnect();
	}, [
		contentSized,
		otherGrowing,
		rows,
		loading
	]);
	const skeletonRows = Math.max(1, Math.floor(loadingRows));
	const showFooter = !loading && rows.length > 0 && columns.some((column) => column.footer !== void 0);
	const rowCount = rows.length + (groups ? sections.length : 0) + 1;
	const tableStyle = {
		maxHeight: frameHeight,
		"--cipher-table-row-height": effectiveRowHeight ? `${effectiveRowHeight}px` : void 0
	};
	const more = loadMore ? /* @__PURE__ */ jsx(Button, {
		type: "button",
		variant: "ghost",
		loading: Boolean(loadMore.loading),
		onClick: () => {
			setLanding(rows.length);
			loadMore.onClick();
		},
		children: loadMore.label ?? "Show more"
	}) : rows.length > 0 && (typeof end === "string" || typeof end === "number" ? end !== "" && /* @__PURE__ */ jsx("span", { children: end }) : end);
	const hasFoot = Boolean(persistentStatus || more || showFewer);
	const claimFoot = frameFoot?.claim;
	const releaseFoot = frameFoot?.release;
	React.useLayoutEffect(() => {
		if (wantsFrameFoot && claimFoot && footOwner === null) claimFoot(footId);
	}, [
		wantsFrameFoot,
		claimFoot,
		footOwner,
		footId
	]);
	React.useLayoutEffect(() => {
		if (!wantsFrameFoot || !releaseFoot) return void 0;
		return () => releaseFoot(footId);
	}, [
		wantsFrameFoot,
		releaseFoot,
		footId
	]);
	const foot = hasFoot && /* @__PURE__ */ jsxs("div", {
		className: data_module_default.tableFootRow,
		"data-slot": "data-table-status",
		children: [persistentStatus && /* @__PURE__ */ jsx("span", {
			className: data_module_default.tableFootStatus,
			children: persistentStatus
		}), (showFewer || more) && /* @__PURE__ */ jsxs("span", {
			className: data_module_default.tableFootActions,
			children: [showFewer && /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				onClick: showFewer.onClick,
				children: showFewer.label ?? "Show fewer"
			}), more]
		})]
	});
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
		loading: action.loading?.(row),
		onSelect: () => action.onSelect(row)
	}));
	const renderRow = ({ row, depth }, position, rowIndex) => {
		const extra = rowProps?.(row, position);
		const restricted = getRowRestricted?.(row);
		const restrictedColumns = stacked ? columns.filter((column) => column.id === stackTitle) : columns;
		if (restricted) return /* @__PURE__ */ createElement(TableRow, {
			...extra,
			key: getRowId(row),
			"aria-rowindex": rowIndex,
			"data-row-index": position,
			tabIndex: position === focusRow ? -1 : extra?.tabIndex,
			onBlur: (event) => {
				extra?.onBlur?.(event);
				if (position === focusRow) setFocusRow(null);
			},
			"data-muted": "",
			"data-restricted": "",
			"data-drop-target": dropEdge(position) ?? extra?.["data-drop-target"],
			"data-stack-row": stacked || void 0,
			"data-depth": stacked && depth > 0 ? depth : void 0,
			role: role("row"),
			style: stacked ? void 0 : { height: effectiveRowHeight }
		}, selectable && /* @__PURE__ */ jsx(TableCell, {
			selection: true,
			pin: leading && !stacked ? "start" : void 0,
			role: role("cell"),
			"aria-colindex": stacked ? 1 : void 0
		}), restrictedColumns.map((column) => /* @__PURE__ */ jsx(TableCell, {
			className: column.actions && !stacked ? data_module_default.tableActions : void 0,
			style: cellStyle(column),
			"data-actions": column.actions || void 0,
			"data-pin": stacked ? void 0 : column.pin ?? column.actions,
			role: role("cell"),
			"aria-colindex": colIndex(column),
			children: column.id === (stackTitle ?? indentColumn) && /* @__PURE__ */ jsx(CellContent, {
				shrink: column.id === shrinkColumn,
				secondary: void 0,
				depth: depth > 0 && !stacked ? depth : void 0,
				maxWidth: column.maxWidth,
				children: /* @__PURE__ */ jsx("div", {
					className: data_module_default.tablePrimary,
					"data-depth": depth > 0 && !stacked ? depth : void 0,
					style: { maxWidth: column.maxWidth },
					children: /* @__PURE__ */ jsx(NameLine, {
						media: /* @__PURE__ */ jsx(Icon, { name: "lock" }),
						title: restricted,
						children: restricted
					})
				})
			})
		}, column.id)), rowActions && /* @__PURE__ */ jsx(TableActionsCell, {
			slots: stacked ? 1 : slots,
			"data-pin": stacked ? void 0 : "true",
			role: role("cell"),
			"aria-colindex": stacked ? columns.length + bodyStart : void 0
		}));
		const activate = onRowActivate && (isRowActivatable?.(row) ?? true) ? onRowActivate : void 0;
		const tableRow = /* @__PURE__ */ createElement(TableRow, {
			...extra,
			key: getRowId(row),
			"aria-rowindex": rowIndex,
			"data-row-index": position,
			tabIndex: activate ? 0 : position === focusRow ? -1 : extra?.tabIndex ?? void 0,
			onBlur: (event) => {
				extra?.onBlur?.(event);
				if (position === focusRow) setFocusRow(null);
			},
			"data-state": selected.includes(getRowId(row)) ? "selected" : void 0,
			focused: typeof focusedRowId === "string" ? focusedRowId === getRowId(row) : Boolean(focusedRowId?.includes(getRowId(row))),
			"data-activatable": activate ? "" : void 0,
			"data-muted": isRowMuted?.(row) || void 0,
			tone: rowTone?.(row),
			"data-drop-target": dropEdge(position) ?? extra?.["data-drop-target"],
			"data-sortable-lifted": sortRows.lift?.key === getRowId(row) || void 0,
			"data-stack-row": stacked || void 0,
			"data-depth": stacked && depth > 0 ? depth : void 0,
			role: role("row"),
			onClick: activate || extra?.onClick ? (event) => {
				extra?.onClick?.(event);
				if (!event.defaultPrevented) activate?.(row);
			} : void 0,
			onKeyDown: (event) => {
				extra?.onKeyDown?.(event);
				if (event.defaultPrevented || event.target !== event.currentTarget) return;
				if (event.key === "Enter" && activate) {
					event.preventDefault();
					activate(row);
				} else if (event.key === " " && selectable && isSelectable(row)) {
					event.preventDefault();
					toggle(getRowId(row));
				}
			},
			style: stacked ? void 0 : { height: effectiveRowHeight }
		}, selectable && /* @__PURE__ */ jsx(TableCell, {
			selection: true,
			pin: leading && !stacked ? "start" : void 0,
			"data-valign": topByDefault && !stacked ? "top" : void 0,
			role: role("cell"),
			"aria-colindex": stacked ? 1 : void 0,
			children: /* @__PURE__ */ jsx(TopBand, {
				top: topByDefault && !stacked,
				children: /* @__PURE__ */ jsx(SelectionBox, {
					label: `Select ${rowLabel(row)}`,
					checked: selected.includes(getRowId(row)),
					disabled: !isSelectable(row),
					reason: selectionDisabledReason?.(row),
					onToggle: () => toggle(getRowId(row))
				})
			})
		}), columns.map((column, columnIndex) => {
			const content = column.toggle ? /* @__PURE__ */ jsx(ToggleCell, {
				toggle: column.toggle,
				row,
				label: `${column.header} for ${rowLabel(row)}`,
				rowId: getRowId(row)
			}) : column.actions ? /* @__PURE__ */ jsx(TableRowActions, {
				style: stacked ? void 0 : { maxWidth: column.maxWidth },
				children: column.render?.(row, position)
			}) : /* @__PURE__ */ jsx(CellContent, {
				shrink: column.id === shrinkColumn,
				secondary: column.secondary?.(row, position),
				wrap: column.wrap,
				depth: depth > 0 && !stacked && column.id === indentColumn ? depth : void 0,
				maxWidth: column.maxWidth,
				children: /* @__PURE__ */ jsx("div", {
					className: column.primary ? data_module_default.tablePrimary : data_module_default.tableValue,
					"data-mono": column.mono || void 0,
					"data-wrap": column.wrap || void 0,
					"data-depth": depth > 0 && !stacked && column.id === indentColumn ? depth : void 0,
					style: { maxWidth: column.maxWidth },
					title: column.wrap ? void 0 : column.text?.(row),
					children: /* @__PURE__ */ jsx(CellValue, {
						badges: column.badges ? column.badges(row, position) ?? null : void 0,
						wrap: column.wrap,
						align: column.align,
						title: column.text?.(row),
						children: cellValue(column.render ? column.render(row, position) : column.text?.(row))
					})
				})
			});
			const edit = column.actions || column.toggle ? void 0 : column.edit?.(row);
			return /* @__PURE__ */ jsx(EditableCell, {
				edit,
				className: column.actions && !stacked ? data_module_default.tableActions : void 0,
				style: cellStyle(column),
				"data-actions": column.actions || void 0,
				"data-pin": stacked ? void 0 : column.pin ?? column.actions,
				"data-wrap": column.wrap || void 0,
				"data-secondary": column.secondary ? true : void 0,
				"data-valign": topAligned(column) ? "top" : void 0,
				"data-row-interactive": column.actions || column.toggle || edit ? true : void 0,
				"data-stack": stacked ? column.id === stackTitle ? "title" : stackTrail.includes(column) ? "meta" : "line" : void 0,
				role: role("cell"),
				"aria-colindex": colIndex(column),
				children: /* @__PURE__ */ jsx(TopBand, {
					top: topAligned(column),
					children: reorder && (stacked ? column.id === stackTitle : columnIndex === 0) ? /* @__PURE__ */ jsxs("div", {
						className: data_module_default.tableSortCell,
						children: [rowHandle(row), content]
					}) : stackLines.includes(column) ? stackLine(column.hideHeader ? void 0 : column.header, content) : content
				})
			}, column.id);
		}), rowActions && /* @__PURE__ */ jsx(TableActionsCell, {
			slots: stacked ? 1 : slots,
			"data-pin": stacked ? void 0 : "true",
			"data-valign": topByDefault && !stacked ? "top" : void 0,
			role: role("cell"),
			"aria-colindex": stacked ? columns.length + bodyStart : void 0,
			children: /* @__PURE__ */ jsx(TopBand, {
				top: topByDefault && !stacked,
				children: /* @__PURE__ */ jsx(RowActions, {
					lazy: true,
					folded: stacked,
					label: rowLabel(row),
					inline: rowInline(row),
					menu: rowActions.renderMenu?.(row),
					menuLabel: rowActions.menuLabel,
					menuDisabledReason: rowActions.menuDisabledReason?.(row)
				})
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
	const sortable = onSortChange ? columns.filter((column) => column.sortable) : [];
	const sortColumn = sortable.find((column) => column.id === sort?.columnId);
	const sortDirection = sort?.direction === "desc" ? "descending" : "ascending";
	const toggles = columns.filter((column) => column.toggle);
	const stackBand = stacked && (selectable || sortable.length > 0 || toggles.length > 0) && /* @__PURE__ */ jsxs("div", {
		className: data_module_default.tableStackBand,
		role: "group",
		"aria-label": `${label} options`,
		"data-slot": "data-table-stack-band",
		children: [
			selectable && selectAll("Select all"),
			toggles.map((column) => column.toggle && /* @__PURE__ */ jsxs("span", {
				className: data_module_default.tableStackToggle,
				children: [/* @__PURE__ */ jsx(ToggleHead, {
					toggle: column.toggle,
					counts: toggleCounts(column.toggle),
					label: column.toggle.label ?? `${column.header} for every row in ${label}`,
					disabled: loading,
					getRowId
				}), /* @__PURE__ */ jsx("span", {
					"aria-hidden": true,
					children: column.header
				})]
			}, column.id)),
			onSortChange && sortable.length > 0 && /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "sm",
					className: data_module_default.tableStackSort,
					icon: sort?.direction === "desc" ? "arrow-down" : "arrow-up",
					"aria-label": sortColumn ? `Sort by ${sortColumn.header}, ${sortDirection}` : "Sort",
					children: sortColumn?.header ?? "Sort"
				})
			}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
				align: "end",
				children: [
					/* @__PURE__ */ jsx(DropdownMenuRadioGroup, {
						value: sortColumn?.id ?? "",
						onValueChange: (columnId) => onSortChange({
							columnId,
							direction: sort?.direction ?? "asc"
						}),
						children: sortable.map((column) => /* @__PURE__ */ jsx(DropdownMenuRadioItem, {
							value: column.id,
							children: column.header
						}, column.id))
					}),
					/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
					/* @__PURE__ */ jsxs(DropdownMenuRadioGroup, {
						value: sortColumn ? sort?.direction ?? "asc" : "",
						onValueChange: (direction) => sortColumn && onSortChange({
							columnId: sortColumn.id,
							direction: direction === "desc" ? "desc" : "asc"
						}),
						children: [/* @__PURE__ */ jsx(DropdownMenuRadioItem, {
							value: "asc",
							disabled: !sortColumn,
							children: "Ascending"
						}), /* @__PURE__ */ jsx(DropdownMenuRadioItem, {
							value: "desc",
							disabled: !sortColumn,
							children: "Descending"
						})]
					})
				]
			})] })
		]
	});
	const stackSkeleton = Array.from({ length: skeletonRows }, (_, index) => /* @__PURE__ */ jsxs(TableRow, {
		"aria-hidden": true,
		"data-loading": true,
		"data-stack-row": "",
		role: "row",
		children: [
			selectable && /* @__PURE__ */ jsx(TableCell, {
				selection: true,
				children: /* @__PURE__ */ jsx("div", {
					className: data_module_default.tableSelection,
					children: /* @__PURE__ */ jsx(Skeleton, {
						width: "var(--cipher-size-icon)",
						height: "var(--cipher-size-icon)"
					})
				})
			}),
			columns.filter((column) => column.id === stackTitle || stackLines.slice(0, 3).includes(column)).map((column) => /* @__PURE__ */ jsx(TableCell, {
				style: stackPlace(column),
				"data-stack": column.id === stackTitle ? "title" : "line",
				children: column.id === stackTitle ? /* @__PURE__ */ jsx(Skeleton, {
					className: data_module_default.tableSkeleton,
					"data-primary": ""
				}) : /* @__PURE__ */ jsxs("div", {
					className: data_module_default.tableStackLine,
					children: [/* @__PURE__ */ jsx(Skeleton, {
						className: data_module_default.tableStackLabelSkeleton,
						height: "var(--cipher-space-12)"
					}), /* @__PURE__ */ jsx(Skeleton, {
						className: data_module_default.tableSkeleton,
						height: "var(--cipher-space-12)"
					})]
				})
			}, column.id)),
			rowActions && /* @__PURE__ */ jsx(TableActionsCell, {
				slots: 1,
				children: /* @__PURE__ */ jsx(TableRowActions, { children: /* @__PURE__ */ jsx(Skeleton, {
					width: "var(--cipher-size-glyph)",
					height: "var(--cipher-size-glyph)"
				}) })
			})
		]
	}, `loading-${index}`));
	const scrollFrame = /* @__PURE__ */ jsxs("div", {
		ref: attachScroll,
		"data-scroll-fade": "x",
		"data-has-start-pin": leading || void 0,
		"data-has-end-pin": trailing || void 0,
		"data-frame-head": (stacked ? Boolean(stackBand) : !(headerHidden || squeezed)) || void 0,
		"data-frame-foot": Boolean(foot && !footTarget || pagination) || void 0,
		className: cn(!embedded && frame_module_default.frame, data_module_default.tableScroll, containerClassName),
		"data-virtual": windowed || void 0,
		"data-flow": flowing || void 0,
		"data-stacked": stacked || void 0,
		style: tableStyle,
		onScroll: flowing ? void 0 : (event) => setTop(event.currentTarget.scrollTop),
		children: [
			stackBand,
			/* @__PURE__ */ jsxs(Table, {
				"aria-label": label,
				"aria-rowcount": rowCount + (showFooter ? 1 : 0),
				"aria-colcount": stacked ? columns.length + bodyStart - 1 + (actionsColumn ? 1 : 0) : void 0,
				"aria-busy": loading || refreshing || void 0,
				role: role("table"),
				"data-variant": variant,
				"data-layout": fixedLayout && !stacked ? "fixed" : void 0,
				style: stacked ? {
					"--cipher-stack-columns": stackColumns,
					"--cipher-stack-label": `${stackLabelLength + 2}ch`
				} : fixedLayout && !squeezed ? { minWidth: `calc(${[
					`${fixedWidth}px`,
					...fixedFloor,
					...selectable ? ["var(--cipher-size-row)"] : [],
					...actionsColumn ? [`var(--cipher-size-row) + ${slots - 1} * var(--cipher-size-row-action-step)`] : []
				].join(" + ")})` } : void 0,
				children: [
					/* @__PURE__ */ jsx(TableHeader, {
						ground: headerGround,
						"data-hidden": headerHidden || squeezed || void 0,
						role: role("rowgroup"),
						children: /* @__PURE__ */ jsxs(TableRow, {
							role: role("row"),
							children: [
								selectable && /* @__PURE__ */ jsx(TableHead, {
									selection: true,
									pin: leading && !stacked ? "start" : void 0,
									role: role("columnheader"),
									"aria-colindex": stacked ? 1 : void 0,
									children: stacked ? /* @__PURE__ */ jsx("span", {
										className: data_module_default.sr,
										children: "Select"
									}) : !squeezed && selectAll()
								}),
								columns.map((column) => /* @__PURE__ */ jsxs(TableHead, {
									scope: "col",
									"data-column": column.id,
									className: column.actions && !stacked ? data_module_default.tableActions : void 0,
									style: stacked ? void 0 : columnStyle(column),
									"data-actions": column.actions || void 0,
									"data-pin": stacked ? void 0 : column.pin ?? column.actions,
									role: role("columnheader"),
									"aria-colindex": colIndex(column),
									"aria-sort": sort?.columnId === column.id ? sort.direction === "asc" ? "ascending" : "descending" : void 0,
									children: [column.toggle && !squeezed && !stacked && /* @__PURE__ */ jsx(ToggleHead, {
										toggle: column.toggle,
										counts: toggleCounts(column.toggle),
										label: column.toggle.label ?? `${column.header} for every row in ${label}`,
										disabled: loading,
										getRowId
									}), column.sortable && onSortChange && !squeezed && !stacked ? /* @__PURE__ */ jsxs(TableHeadButton, {
										"data-active": sort?.columnId === column.id || void 0,
										onClick: () => onSortChange({
											columnId: column.id,
											direction: sort?.columnId === column.id && sort.direction === "asc" ? "desc" : "asc"
										}),
										children: [column.header, /* @__PURE__ */ jsx(Icon, { name: sort?.columnId === column.id && sort.direction === "desc" ? "arrow-down" : "arrow-up" })]
									}) : /* @__PURE__ */ jsx("span", {
										className: squeezed || column.hideHeader || column.actions ? data_module_default.sr : column.toggle && !stacked ? void 0 : data_module_default.tableHeadLabel,
										children: column.header
									})]
								}, column.id)),
								rowActions && actionsColumn && /* @__PURE__ */ jsx(TableActionsHead, {
									slots: stacked ? 1 : slots,
									"data-pin": stacked ? void 0 : "true",
									role: role("columnheader"),
									"aria-colindex": stacked ? columns.length + bodyStart : void 0,
									children: rowActions.header ?? "Actions"
								})
							]
						})
					}),
					(loading || !groups || !rows.length) && /* @__PURE__ */ jsxs(TableBody, {
						role: role("rowgroup"),
						children: [
							loading && stacked && stackSkeleton,
							loading && !stacked && /* @__PURE__ */ jsx(TableLoadingRows, {
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
										height: spacerAbove,
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
										height: spacerBelow,
										padding: 0
									}
								})
							}),
							!loading && !rows.length && /* @__PURE__ */ jsx(TableRow, {
								"data-row-kind": "empty",
								role: role("row"),
								children: /* @__PURE__ */ jsx(TableCell, {
									colSpan: span,
									pin: "viewport",
									role: role("cell"),
									children: /* @__PURE__ */ jsx(EmptyScope, {
										ghost: ghost ?? (embedded || filtered ? false : "rows"),
										size: "sm",
										fill: embedded || void 0,
										children: empty
									})
								})
							})
						]
					}),
					!loading && groups && sections.map(({ group, entries: groupEntries }, index) => {
						const offset = sections.slice(0, index).reduce((sum, section) => sum + section.entries.length + 1, 0);
						const before = sections.slice(0, index).reduce((sum, section) => sum + section.entries.length, 0);
						return /* @__PURE__ */ jsxs(TableBody, {
							"data-group": "",
							role: role("rowgroup"),
							children: [/* @__PURE__ */ jsx(TableGroupRow, {
								"aria-rowindex": offset + 2,
								role: role("row"),
								label: group?.label,
								meta: group?.meta,
								actions: group?.actions,
								colSpan: columns.length,
								actionSlots: rowActions ? stacked ? 1 : slots : void 0,
								selectable,
								checkbox: selectable && group ? groupCheckbox(group, groupEntries) : void 0
							}), groupEntries.map((entry, i) => renderRow(entry, before + i, offset + i + 3))]
						}, group?.id);
					}),
					showFooter && stacked && /* @__PURE__ */ jsx(TableFooter, {
						className: data_module_default.tableFoot,
						"data-slot": "data-table-footer",
						role: "rowgroup",
						children: /* @__PURE__ */ jsx(TableRow, {
							"aria-rowindex": rowCount + 1,
							role: "row",
							"data-stack-row": "",
							children: columns.filter((column) => column.footer !== void 0).map((column, index) => /* @__PURE__ */ jsx(TableCell, {
								style: {
									gridColumn: `${bodyStart} / -1`,
									gridRow: index + 1
								},
								"data-stack": "line",
								role: "cell",
								"aria-colindex": colIndex(column),
								children: stackLine(column.header, /* @__PURE__ */ jsx("div", {
									className: data_module_default.tableValue,
									"data-mono": column.mono || void 0,
									"data-wrap": column.wrap || void 0,
									children: column.footer
								}))
							}, column.id))
						})
					}),
					showFooter && !stacked && /* @__PURE__ */ jsx(TableFooter, {
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
			foot && !footTarget && /* @__PURE__ */ jsx("div", {
				className: cn(frame_module_default.frameFoot, data_module_default.tableMore),
				"data-slot": pinnedFoot ? "data-table-more" : "data-table-end",
				children: foot
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
			foot && footTarget && createPortal(foot, footTarget),
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
function rowAt(offsets, y) {
	let low = 0;
	let high = offsets.length - 1;
	while (low < high) {
		const mid = Math.ceil((low + high) / 2);
		if (offsets[mid] <= y) low = mid;
		else high = mid - 1;
	}
	return low;
}
function TopBand({ top, children }) {
	return top ? /* @__PURE__ */ jsx("div", {
		className: data_module_default.tableBand,
		children
	}) : children;
}
function CellValue({ badges, wrap, align, title, children }) {
	if (badges === void 0) return children;
	if (wrap) return /* @__PURE__ */ jsxs(Fragment, { children: [
		children,
		" ",
		/* @__PURE__ */ jsx("span", {
			"data-slot": "cell-badges",
			children: badges
		})
	] });
	return /* @__PURE__ */ jsx(NameLine, {
		badges,
		"data-align": align,
		title,
		children
	});
}
function cellValue(value) {
	return value === void 0 || value === null || value === "" ? /* @__PURE__ */ jsx(EmptyValue, {}) : value;
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
		children: present ? "✓" : "—"
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
	if (toggle.absent?.(row)) return /* @__PURE__ */ jsx("span", {
		className: data_module_default.tableToggleAbsent,
		"data-slot": "table-toggle-absent",
		children: /* @__PURE__ */ jsx(EmptyValue, { label: `${label}: not applicable` })
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