"use client";
import { keyboardModality } from "../lib/input-modality.js";
import { usePresenceCount, useReportPresence } from "../lib/presence-count.js";
import { StretchedLinkContext, useStretchedLinkHost } from "../lib/stretched-link.js";
import { cn } from "../lib/utils.js";
import { Button, buttonVariants } from "./button.js";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "./context-menu.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Icon } from "./icon.js";
import { Skeleton } from "./skeleton.js";
import { Tooltip, TooltipScope } from "./tooltip.js";
import button_geometry_module_default from "./button-geometry.module.js";
import data_module_default from "./data.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/table.tsx
var TablePinContext = React.createContext(null);
var BodyFocusContext = React.createContext(null);
var RowFocusContext = React.createContext(null);
function Table({ className, containerClassName, containerRef, children, ref, ...props }) {
	const [pins, setPins] = React.useState({
		start: 0,
		end: 0,
		viewport: 0
	});
	const reportPin = React.useCallback((kind, delta) => setPins((value) => ({
		...value,
		[kind]: value[kind] + delta
	})), []);
	return /* @__PURE__ */ jsx("div", {
		ref: containerRef,
		"data-slot": "table-container",
		"data-scroll-fade": "x",
		"data-has-start-pin": pins.start > 0 || void 0,
		"data-has-end-pin": pins.end > 0 || void 0,
		"data-has-viewport-cell": pins.viewport > 0 || void 0,
		className: cn("relative w-full", data_module_default.nativeTableContainer, containerClassName),
		children: /* @__PURE__ */ jsx(TablePinContext, {
			value: reportPin,
			children: /* @__PURE__ */ jsx("table", {
				ref,
				"data-slot": "table",
				className: cn("w-full caption-bottom", data_module_default.nativeTable, className),
				...props,
				children: /* @__PURE__ */ jsx(TooltipScope, { children })
			})
		})
	});
}
Table.displayName = "Table";
function TableHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(BodyFocusContext, {
		value: null,
		children: /* @__PURE__ */ jsx("thead", {
			ref,
			"data-slot": "table-header",
			className: cn("[&_tr]:border-b [&_tr]:border-[color:var(--cipher-line-soft)]", className),
			...props
		})
	});
}
TableHeader.displayName = "TableHeader";
/** Marks the body while it holds a focused row at any depth, and tells the row it is nested in. */
function TableBody({ className, ref, ...props }) {
	const [hasFocus, report] = usePresenceCount();
	useReportPresence(React.useContext(RowFocusContext), hasFocus);
	return /* @__PURE__ */ jsx(BodyFocusContext, {
		value: report,
		children: /* @__PURE__ */ jsx("tbody", {
			ref,
			"data-slot": "table-body",
			"data-has-focus": hasFocus || void 0,
			className: cn("[&_tr:last-child]:border-0", className),
			...props
		})
	});
}
TableBody.displayName = "TableBody";
function TableFooter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(BodyFocusContext, {
		value: null,
		children: /* @__PURE__ */ jsx("tfoot", {
			ref,
			"data-slot": "table-footer",
			className: cn("border-t border-[color:var(--cipher-line-soft)] font-medium [&>tr]:last:border-b-0", className),
			...props
		})
	});
}
TableFooter.displayName = "TableFooter";
var interactiveTarget = "a, button, input, select, textarea, label, summary, [contenteditable], [tabindex]:not(tr), [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab], [data-row-interactive]";
var activatesRow = (event) => {
	const row = event.currentTarget;
	const target = event.target;
	if (event.button !== 0 || !row.contains(target)) return false;
	const interactive = target.closest(interactiveTarget);
	if (interactive && row.contains(interactive)) return false;
	const selection = window.getSelection();
	return !(selection && !selection.isCollapsed && row.contains(selection.anchorNode));
};
var setFlag = (element, name, on) => {
	if (element.hasAttribute(name) !== on) element.toggleAttribute(name, on);
};
/**
* Marks what the row's styles depend on in its own DOM: a lone full-width cell, an open popup trigger,
* the last leading pinned cell and cells that hold only text. Rows render arbitrary cells, so the DOM is
* the only place this is known.
*/
var markRow = (row) => {
	const cells = [...row.children];
	const only = cells.length === 1 ? cells[0] : void 0;
	setFlag(row, "data-full-width", only?.tagName === "TD" && only.hasAttribute("colspan"));
	setFlag(row, "data-expanded-within", row.querySelector("[aria-expanded=\"true\"]") !== null);
	const starts = cells.filter((cell) => cell.getAttribute("data-pin") === "start");
	const edge = starts.at(-1);
	cells.forEach((cell) => {
		setFlag(cell, "data-pin-edge", cell === edge && !cell.classList.contains(data_module_default.tableSelectionCell));
		if (cell.tagName === "TD") setFlag(cell, "data-text-only", cell.firstElementChild === null);
	});
	return {
		start: starts.length > 0,
		end: cells.some((cell) => cell.classList.contains(data_module_default.tableActions)),
		viewport: cells.some((cell) => cell.getAttribute("data-pin") === "viewport")
	};
};
/** A row draws its focus ring only when the keyboard moved focus to it, never after a pointer interaction. */
function TableRow({ className, focused, onClick, onFocus, onBlur, ref, children, ...props }) {
	const node = React.useRef(null);
	const reportPin = React.useContext(TablePinContext);
	const reported = React.useRef({
		start: false,
		end: false,
		viewport: false
	});
	const [containsFocus, reportContains] = usePresenceCount();
	const [hasLink, reportLink] = useStretchedLinkHost();
	useReportPresence(React.useContext(BodyFocusContext), Boolean(focused) || containsFocus);
	const setRef = React.useCallback((element) => {
		node.current = element;
		if (typeof ref === "function") ref(element);
		else if (ref) ref.current = element;
	}, [ref]);
	const mark = React.useCallback(() => {
		if (!node.current) return;
		const next = markRow(node.current);
		[
			"start",
			"end",
			"viewport"
		].forEach((kind) => {
			if (next[kind] !== reported.current[kind]) reportPin?.(kind, next[kind] ? 1 : -1);
		});
		reported.current = next;
	}, [reportPin]);
	React.useLayoutEffect(mark);
	React.useLayoutEffect(() => {
		const row = node.current;
		if (!row) return void 0;
		const observer = new MutationObserver(mark);
		observer.observe(row, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [
				"aria-expanded",
				"data-pin",
				"colspan"
			]
		});
		return () => {
			observer.disconnect();
			[
				"start",
				"end",
				"viewport"
			].forEach((kind) => {
				if (reported.current[kind]) reportPin?.(kind, -1);
			});
			reported.current = {
				start: false,
				end: false,
				viewport: false
			};
		};
	}, [mark, reportPin]);
	React.useLayoutEffect(() => {
		const above = containsFocus ? node.current?.previousElementSibling : null;
		if (!above) return void 0;
		above.setAttribute("data-focus-anchor", "");
		return () => above.removeAttribute("data-focus-anchor");
	}, [containsFocus]);
	return /* @__PURE__ */ jsx(RowFocusContext, {
		value: reportContains,
		children: /* @__PURE__ */ jsx(StretchedLinkContext, {
			value: reportLink,
			children: /* @__PURE__ */ jsx("tr", {
				ref: setRef,
				"data-slot": "table-row",
				"data-focused": focused || void 0,
				"data-contains-focus": containsFocus || void 0,
				"data-stretched-link": hasLink || void 0,
				className: cn("border-b border-[color:var(--cipher-line-soft)] transition-colors duration-(--cipher-duration-fast)", data_module_default.nativeTableRow, className),
				onClick: onClick && ((event) => {
					if (activatesRow(event)) onClick(event);
				}),
				onFocus: (event) => {
					onFocus?.(event);
					if (event.target === event.currentTarget && keyboardModality()) event.currentTarget.setAttribute("data-focus-ring", "");
				},
				onBlur: (event) => {
					onBlur?.(event);
					if (event.target === event.currentTarget) event.currentTarget.removeAttribute("data-focus-ring");
				},
				...props,
				children
			})
		})
	});
}
TableRow.displayName = "TableRow";
var pinStyle = (pinOffset, style) => pinOffset === void 0 ? style : {
	"--cipher-pin-offset": pinOffset,
	...style
};
function TableHead({ selection, divider = true, pin, pinOffset, className, style, ref, ...props }) {
	return /* @__PURE__ */ jsx("th", {
		ref,
		"data-slot": selection ? "table-selection" : "table-head",
		"data-divider": selection && !divider ? "false" : void 0,
		"data-pin": pin,
		className: cn(data_module_default.nativeTableHead, selection && data_module_default.tableSelectionCell, className),
		style: pinStyle(pinOffset, style),
		...props
	});
}
TableHead.displayName = "TableHead";
/** The one interactive header: a sort or menu trigger that fills its TableHead and takes hover on that cell alone. */
function TableHeadButton({ className, type = "button", ref, ...props }) {
	return /* @__PURE__ */ jsx("button", {
		ref,
		type,
		"data-slot": "table-head-button",
		"data-table-head-button": "",
		className: cn(data_module_default.tableSort, className),
		...props
	});
}
TableHeadButton.displayName = "TableHeadButton";
function TableCell({ selection, divider = true, pin, pinOffset, className, style, children, ref, ...props }) {
	return /* @__PURE__ */ jsx("td", {
		ref,
		"data-slot": selection ? "table-selection" : "table-cell",
		"data-divider": selection && !divider ? "false" : void 0,
		"data-row-interactive": selection || void 0,
		"data-pin": pin,
		className: cn(data_module_default.nativeTableCell, selection && data_module_default.tableSelectionCell, className),
		style: pinStyle(pinOffset, style),
		...props,
		children: pin === "viewport" ? /* @__PURE__ */ jsx("div", {
			className: data_module_default.viewportContent,
			children
		}) : children
	});
}
TableCell.displayName = "TableCell";
function TableCaption({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("caption", {
		ref,
		"data-slot": "table-caption",
		className: cn(data_module_default.nativeTableCaption, className),
		...props
	});
}
TableCaption.displayName = "TableCaption";
function TableRowActions({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		...props,
		"data-slot": "table-row-actions",
		className: cn(data_module_default.tableRowActions, className)
	});
}
TableRowActions.displayName = "TableRowActions";
function TableRowIndicators({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		...props,
		"data-slot": "table-row-indicators",
		className: cn(data_module_default.tableRowIndicators, className)
	});
}
TableRowIndicators.displayName = "TableRowIndicators";
function TableActionsHead({ slots = 1, className, style, children = "Actions", ref, ...props }) {
	return /* @__PURE__ */ jsx("th", {
		ref,
		scope: "col",
		...props,
		"data-slot": "table-actions-head",
		"data-actions": true,
		className: cn(data_module_default.nativeTableHead, data_module_default.tableActions, className),
		style: {
			"--cipher-row-action-slots": slots,
			...style
		},
		children: /* @__PURE__ */ jsx("span", {
			className: data_module_default.sr,
			children
		})
	});
}
TableActionsHead.displayName = "TableActionsHead";
function TableActionsCell({ slots = 1, className, style, ref, ...props }) {
	return /* @__PURE__ */ jsx("td", {
		ref,
		...props,
		"data-slot": "table-actions-cell",
		"data-actions": true,
		"data-row-interactive": true,
		className: cn(data_module_default.nativeTableCell, data_module_default.tableActions, className),
		style: {
			"--cipher-row-action-slots": slots,
			...style
		}
	});
}
TableActionsCell.displayName = "TableActionsCell";
/** Skeleton rows for a table on screen while its rows load: the same shapes, row height and data-loading marking as DataTable loading. */
function TableLoadingRows({ columns, rows = 5, selectable = false, actionSlots, label }) {
	const cells = typeof columns === "number" ? Array.from({ length: columns }, () => ({})) : columns;
	const leading = cells.some((column) => column.pin === "start");
	return Array.from({ length: Math.max(1, Math.floor(rows)) }, (_, index) => /* @__PURE__ */ jsxs(TableRow, {
		"aria-hidden": index > 0 || !label || void 0,
		"data-loading": true,
		children: [
			selectable && /* @__PURE__ */ jsx(TableCell, {
				selection: true,
				pin: leading ? "start" : void 0,
				children: /* @__PURE__ */ jsx("div", {
					className: data_module_default.tableSelection,
					children: /* @__PURE__ */ jsx(Skeleton, {
						width: "var(--cipher-size-icon)",
						height: "var(--cipher-size-icon)"
					})
				})
			}),
			cells.map((column, cell) => /* @__PURE__ */ jsxs(TableCell, {
				className: column.actions ? data_module_default.tableActions : void 0,
				style: column.style,
				"data-actions": column.actions || void 0,
				"data-pin": column.pin ?? column.actions,
				children: [index === 0 && cell === 0 && label && /* @__PURE__ */ jsx("span", {
					className: data_module_default.sr,
					role: "status",
					children: label
				}), column.actions ? /* @__PURE__ */ jsx(TableRowActions, { children: /* @__PURE__ */ jsx(Skeleton, {
					width: "var(--cipher-size-glyph)",
					height: "var(--cipher-size-glyph)"
				}) }) : /* @__PURE__ */ jsx(Skeleton, {
					className: data_module_default.tableSkeleton,
					"data-primary": column.primary || void 0,
					style: { maxWidth: column.maxWidth }
				})]
			}, cell)),
			actionSlots !== void 0 && /* @__PURE__ */ jsx(TableActionsCell, {
				slots: actionSlots,
				"data-pin": "true",
				children: /* @__PURE__ */ jsx(TableRowActions, { children: Array.from({ length: actionSlots }, (__, slot) => /* @__PURE__ */ jsx("span", {
					className: data_module_default.tableRowActionSkeleton,
					children: /* @__PURE__ */ jsx(Skeleton, {
						width: "var(--cipher-size-glyph)",
						height: "var(--cipher-size-glyph)"
					})
				}, slot)) })
			})
		]
	}, `loading-${index}`));
}
var stop = (event) => event.stopPropagation();
function RowActionButton({ action, label }) {
	const reason = action.disabledReason;
	return /* @__PURE__ */ jsx(Tooltip, {
		content: reason ? void 0 : action.label,
		children: /* @__PURE__ */ jsx("span", {
			className: data_module_default.tableRowActionSlot,
			children: /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "icon-row",
				iconOnly: true,
				disabledReason: reason,
				onClick: (event) => {
					stop(event);
					action.onSelect();
				},
				children: [/* @__PURE__ */ jsx(Icon, {
					name: typeof action.icon === "string" ? action.icon : void 0,
					icon: typeof action.icon === "string" ? void 0 : action.icon
				}), /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: `${action.label} for ${label}`
				})]
			})
		})
	});
}
var ROW_REST_MS = 120;
var menuOpenKeys = /* @__PURE__ */ new Set([
	"Enter",
	" ",
	"ArrowDown"
]);
var groupButtons = (node) => Array.from(node?.querySelectorAll("button") ?? []);
function IdleRowButton({ disabledReason, children, ...props }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"data-slot": "button",
		"data-variant": "ghost",
		"data-size": "icon-row",
		"data-cipher-button": "",
		"data-disabled-reason": disabledReason ? "" : void 0,
		"aria-disabled": disabledReason || props.disabled ? true : void 0,
		"aria-description": disabledReason,
		className: cn(buttonVariants({
			variant: "ghost",
			size: "icon-row"
		}), button_geometry_module_default.iconOnly),
		...props,
		children: /* @__PURE__ */ jsx("span", {
			"data-press": "",
			children
		})
	});
}
function RowActions({ label, inline = [], menu, menuLabel = "More actions", menuDisabledReason, lazy = false, open, defaultOpen, onOpenChange, onMenuCloseAutoFocus, className, ref, ...props }) {
	const [live, setLive] = React.useState(!lazy || Boolean(open || defaultOpen));
	const [openOnMount, setOpenOnMount] = React.useState(false);
	const group = React.useRef(null);
	const restoreFocus = React.useRef(-1);
	if (!live && (!lazy || open)) setLive(true);
	const setGroup = React.useCallback((node) => {
		group.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	React.useEffect(() => {
		const node = group.current;
		if (live || !node) return void 0;
		const row = node.closest("tr") ?? node;
		let rest;
		const wake = () => setLive(true);
		const settle = (event) => {
			if (event.pointerType === "touch") return;
			clearTimeout(rest);
			rest = setTimeout(wake, ROW_REST_MS);
		};
		const leave = () => clearTimeout(rest);
		const enterActions = (event) => {
			if (event.pointerType !== "touch") wake();
		};
		const focus = (event) => {
			restoreFocus.current = groupButtons(node).indexOf(event.target);
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
		const button = live && index >= 0 ? groupButtons(group.current)[index] : void 0;
		if (button) queueMicrotask(() => button.focus({ preventScroll: true }));
	}, [live]);
	if (!live) {
		const openMenu = () => {
			setOpenOnMount(true);
			setLive(true);
			onOpenChange?.(true);
		};
		return /* @__PURE__ */ jsxs(TableRowActions, {
			ref: setGroup,
			className,
			...props,
			children: [inline.map((action) => /* @__PURE__ */ jsx("span", {
				className: data_module_default.tableRowActionSlot,
				children: /* @__PURE__ */ jsxs(IdleRowButton, {
					disabledReason: action.disabledReason,
					onMouseDown: (event) => event.preventDefault(),
					onClick: (event) => {
						stop(event);
						restoreFocus.current = groupButtons(group.current).indexOf(event.currentTarget);
						setLive(true);
						if (!action.disabledReason) action.onSelect();
					},
					children: [/* @__PURE__ */ jsx(Icon, {
						name: typeof action.icon === "string" ? action.icon : void 0,
						icon: typeof action.icon === "string" ? void 0 : action.icon
					}), /* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: `${action.label} for ${label}`
					})]
				})
			}, action.label)), menu !== void 0 && /* @__PURE__ */ jsx("span", {
				className: data_module_default.tableRowActionSlot,
				children: /* @__PURE__ */ jsxs(IdleRowButton, {
					"data-slot": "dropdown-menu-trigger",
					disabled: Boolean(menuDisabledReason),
					"data-disabled": menuDisabledReason ? "" : void 0,
					"aria-haspopup": "menu",
					"aria-expanded": false,
					"aria-description": menuDisabledReason,
					onClick: stop,
					onPointerDown: (event) => {
						if (event.button !== 0 || event.ctrlKey) return;
						event.preventDefault();
						openMenu();
					},
					onKeyDown: (event) => {
						if (!menuOpenKeys.has(event.key)) return;
						event.preventDefault();
						restoreFocus.current = groupButtons(group.current).indexOf(event.currentTarget);
						openMenu();
					},
					children: [/* @__PURE__ */ jsx(Icon, {
						name: "more",
						"data-button-icon": ""
					}), /* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: `${menuLabel} for ${label}`
					})]
				})
			})]
		});
	}
	return /* @__PURE__ */ jsxs(TableRowActions, {
		ref: setGroup,
		className,
		...props,
		children: [inline.map((action) => /* @__PURE__ */ jsx(RowActionButton, {
			action,
			label
		}, action.label)), menu !== void 0 && /* @__PURE__ */ jsxs(DropdownMenu, {
			open,
			defaultOpen: defaultOpen || openOnMount,
			onOpenChange,
			children: [/* @__PURE__ */ jsx(Tooltip, {
				content: menuDisabledReason ?? menuLabel,
				children: /* @__PURE__ */ jsx("span", {
					className: data_module_default.tableRowActionSlot,
					children: /* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						disabled: Boolean(menuDisabledReason),
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon-row",
							icon: "more",
							iconOnly: true,
							"aria-description": menuDisabledReason,
							onClick: stop,
							children: `${menuLabel} for ${label}`
						})
					})
				})
			}), /* @__PURE__ */ jsx(DropdownMenuContent, {
				align: "end",
				onCloseAutoFocus: onMenuCloseAutoFocus,
				children: menu
			})]
		})]
	});
}
RowActions.displayName = "RowActions";
var editableTarget = (target) => target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable=\"\"], [contenteditable=\"true\"]"));
function MountSignal({ onChange }) {
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
function RowContextMenu({ label, inline = [], menu, menuDisabledReason, children }) {
	const [open, setOpen] = React.useState(false);
	const [present, setPresent] = React.useState(false);
	const row = React.useRef(null);
	const showMenu = menu !== void 0 && !menuDisabledReason;
	const rowProps = children.props;
	if (rowProps["data-row-kind"] || rowProps["data-loading"] || rowProps["data-spacer"] || !inline.length && !showMenu) return children;
	const { onContextMenuCapture, tabIndex } = children.props;
	return /* @__PURE__ */ jsxs(ContextMenu, {
		onOpenChange: (next) => {
			setOpen(next);
			if (next) setPresent(true);
		},
		children: [/* @__PURE__ */ jsx(ContextMenuTrigger, {
			ref: row,
			asChild: true,
			className: "select-text",
			children: React.cloneElement(children, {
				tabIndex: tabIndex ?? -1,
				"data-menu-open": open || void 0,
				onContextMenuCapture: (event) => {
					onContextMenuCapture?.(event);
					if (editableTarget(event.target)) event.stopPropagation();
				}
			})
		}), present && /* @__PURE__ */ jsxs(ContextMenuContent, {
			"aria-label": `Actions for ${label}`,
			onCloseAutoFocus: (event) => {
				event.preventDefault();
				row.current?.focus({ preventScroll: true });
			},
			children: [
				inline.map((action) => /* @__PURE__ */ jsxs(DropdownMenuItem, {
					disabled: Boolean(action.disabledReason),
					description: action.disabledReason,
					onSelect: action.onSelect,
					children: [/* @__PURE__ */ jsx(Icon, {
						name: typeof action.icon === "string" ? action.icon : void 0,
						icon: typeof action.icon === "string" ? void 0 : action.icon
					}), action.label]
				}, action.label)),
				inline.length > 0 && showMenu && /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				showMenu && menu,
				/* @__PURE__ */ jsx(MountSignal, { onChange: setPresent })
			]
		})]
	});
}
RowContextMenu.displayName = "RowContextMenu";
var rowActionSlots = (inline, menu) => Math.max(1, inline + (menu ? 1 : 0));
export { RowActions, RowContextMenu, Table, TableActionsCell, TableActionsHead, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeadButton, TableHeader, TableLoadingRows, TableRow, TableRowActions, TableRowIndicators, rowActionSlots };

//# sourceMappingURL=table.js.map