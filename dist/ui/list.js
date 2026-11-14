import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { CipherLink } from "../lib/link.js";
import { cn } from "../lib/utils.js";
import { Checkbox } from "./checkbox.js";
import { Skeleton } from "./skeleton.js";
import data_module_default from "./data.module.js";
import frame_module_default from "./frame.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/list.tsx
var ListContext = React.createContext(null);
function ListRow({ value, title, description, media, badge, meta, actions, error, children, href, link, onClick, current, disabled, selectable = true, unread, resolved, label }) {
	const context = React.useContext(ListContext);
	const register = context?.register;
	const eligible = !disabled && selectable;
	React.useLayoutEffect(() => register?.(value, eligible), [
		register,
		value,
		eligible
	]);
	const fullTitle = typeof title === "string" ? title : void 0;
	const checked = context?.selected.includes(value);
	const anchor = Boolean(href || link);
	const button = !anchor && (onClick || context?.multiple && selectable);
	const click = (event) => {
		if (disabled) {
			event.preventDefault();
			return;
		}
		if (onClick) onClick(event);
		else if (context?.multiple && selectable) context.toggle(value);
	};
	let disabledRole;
	if (disabled && anchor) disabledRole = "link";
	else if (disabled && button) disabledRole = "button";
	const below = context?.actionsPlacement === "below" && context.size !== "sm";
	const [pressed, setPressed] = React.useState(false);
	React.useEffect(() => {
		if (!pressed) return void 0;
		const release = () => setPressed(false);
		window.addEventListener("pointerup", release);
		window.addEventListener("pointercancel", release);
		window.addEventListener("keyup", release);
		window.addEventListener("blur", release);
		return () => {
			window.removeEventListener("pointerup", release);
			window.removeEventListener("pointercancel", release);
			window.removeEventListener("keyup", release);
			window.removeEventListener("blur", release);
		};
	}, [pressed]);
	const press = { onPointerDown: (event) => {
		if (event.button === 0) setPressed(true);
	} };
	return /* @__PURE__ */ jsxs("li", {
		className: data_module_default.listRow,
		"data-list-row": value,
		"data-selected": checked || void 0,
		"data-current": current || void 0,
		"data-disabled": disabled || void 0,
		"data-resolved": resolved || void 0,
		"data-size": context?.size,
		"data-interactive": !disabled && Boolean(anchor || button) || void 0,
		"data-pressed": pressed || void 0,
		children: [
			context?.multiple && /* @__PURE__ */ jsx("span", {
				className: data_module_default.rowCheck,
				children: /* @__PURE__ */ jsx(Checkbox, {
					"aria-label": `Select ${label}`,
					checked,
					disabled: disabled || !selectable,
					onCheckedChange: () => context.toggle(value)
				})
			}),
			media && /* @__PURE__ */ jsxs("span", {
				className: data_module_default.rowMedia,
				children: [media, unread && /* @__PURE__ */ jsx("span", {
					className: data_module_default.unread,
					"aria-hidden": true
				})]
			}),
			unread && /* @__PURE__ */ jsx("span", {
				className: data_module_default.sr,
				children: "Unread"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: data_module_default.listBody,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: data_module_default.titleLine,
						children: [
							unread && !media && /* @__PURE__ */ jsx("span", {
								className: data_module_default.unread,
								"aria-hidden": true
							}),
							link && !disabled ? /* @__PURE__ */ jsx(CipherLink, {
								link,
								className: data_module_default.rowTitle,
								title: fullTitle,
								onClick: click,
								...press,
								"aria-current": current ? "page" : void 0,
								"data-list-target": true,
								children: title
							}) : href && !disabled ? /* @__PURE__ */ jsx("a", {
								className: data_module_default.rowTitle,
								title: fullTitle,
								href,
								onClick: click,
								...press,
								"aria-current": current ? "page" : void 0,
								"data-list-target": true,
								children: title
							}) : button && !disabled ? /* @__PURE__ */ jsx("button", {
								type: "button",
								className: data_module_default.rowTitle,
								title: fullTitle,
								onClick: click,
								...press,
								onKeyDown: (event) => {
									if (event.key === " ") setPressed(true);
								},
								"aria-current": current ? "true" : void 0,
								"data-list-target": true,
								children: title
							}) : /* @__PURE__ */ jsx("span", {
								className: data_module_default.rowTitle,
								title: fullTitle,
								role: disabledRole,
								"aria-disabled": disabledRole ? true : void 0,
								children: title
							}),
							badge && /* @__PURE__ */ jsx("span", {
								className: data_module_default.rowBadge,
								children: badge
							}),
							meta && /* @__PURE__ */ jsx("span", {
								className: data_module_default.rowMeta,
								children: meta
							})
						]
					}),
					description && context?.size !== "sm" && /* @__PURE__ */ jsx("p", {
						className: data_module_default.description,
						children: description
					}),
					error && /* @__PURE__ */ jsx("div", {
						className: data_module_default.rowError,
						role: "alert",
						children: error
					}),
					children,
					below && actions && /* @__PURE__ */ jsx("div", {
						className: data_module_default.rowActions,
						children: actions
					})
				]
			}),
			!below && actions && /* @__PURE__ */ jsx("div", {
				className: data_module_default.rowActions,
				children: actions
			})
		]
	});
}
var ListHeader = () => null;
/** State that must stay visible under the rows, never an action result; those go to a toast. */
var ListFooter = () => null;
function List({ children: content, title: titleProp, count: countProp, action: actionProp, label, variant: requestedVariant, size = "md", actionsPlacement = "end", selection = "none", selectedIds, defaultSelectedIds = [], onSelectionChange, loading, loadingRows = 3, refreshing = false, empty = "No items", footer: footerProp }) {
	let header = {
		title: titleProp,
		count: countProp,
		action: actionProp
	};
	let footer = footerProp;
	let children = content;
	const parts = React.Children.toArray(content);
	if (parts.some((part) => React.isValidElement(part) && (part.type === ListHeader || part.type === ListFooter))) children = parts.filter((part) => {
		if (!React.isValidElement(part)) return true;
		if (part.type === ListHeader) header = part.props;
		else if (part.type === ListFooter) footer = part.props.children;
		else return true;
		return false;
	});
	const { title, count: headerCount, action } = header;
	const variant = requestedVariant ?? "framed";
	const inFrame = useInFrame("List", requestedVariant);
	const embedded = inFrame && variant === "framed";
	const framed = variant === "framed" && !embedded;
	const [own, setOwn] = React.useState(defaultSelectedIds);
	const selected = selectedIds ?? own;
	const list = React.useRef(null);
	const focusedRow = React.useRef(null);
	React.useLayoutEffect(() => {
		const previous = focusedRow.current;
		const container = list.current;
		if (!previous || !container) return;
		const targets = Array.from(container.querySelectorAll("[data-list-target]"));
		if (container.contains(previous.element)) {
			const main = previous.element.closest("[data-list-row]")?.querySelector("[data-list-target]");
			previous.index = main ? targets.indexOf(main) : previous.index;
			return;
		}
		const active = container.ownerDocument.activeElement;
		if (active && active !== container.ownerDocument.body && active !== container.ownerDocument.documentElement) {
			focusedRow.current = null;
			return;
		}
		const next = targets[Math.min(Math.max(0, previous.index), targets.length - 1)];
		focusedRow.current = null;
		(next ?? container).focus({ preventScroll: true });
	});
	const [rows, setRows] = React.useState(() => /* @__PURE__ */ new Map());
	const register = React.useCallback((value, isEligible) => {
		setRows((current) => current.get(value) === isEligible ? current : new Map(current).set(value, isEligible));
		return () => setRows((current) => {
			if (!current.has(value)) return current;
			const next = new Map(current);
			next.delete(value);
			return next;
		});
	}, []);
	const eligible = [...rows].filter(([, isEligible]) => isEligible).map(([value]) => value);
	const count = eligible.filter((id) => selected.includes(id)).length;
	const update = (next) => {
		if (selectedIds === void 0) setOwn(next);
		onSelectionChange?.(next);
	};
	const toggle = (id) => {
		if (eligible.includes(id)) update(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
	};
	const key = (event) => {
		if (!(event.target instanceof HTMLElement) || !event.target.hasAttribute("data-list-target")) return;
		const targets = Array.from(event.currentTarget.querySelectorAll("[data-list-target]"));
		const index = targets.indexOf(event.target);
		let next;
		if (event.key === "ArrowDown") next = Math.min(targets.length - 1, index + 1);
		if (event.key === "ArrowUp") next = Math.max(0, index - 1);
		if (event.key === "Home") next = 0;
		if (event.key === "End") next = targets.length - 1;
		if (next !== void 0) {
			event.preventDefault();
			targets[next]?.focus();
		}
	};
	return /* @__PURE__ */ jsx(FrameScope, {
		framed: inFrame || framed,
		children: /* @__PURE__ */ jsx(ListContext, {
			value: {
				selected,
				multiple: selection === "multiple",
				toggle,
				size,
				actionsPlacement,
				register
			},
			children: /* @__PURE__ */ jsxs("div", {
				className: cn(data_module_default.listShell, framed && frame_module_default.frame),
				"data-slot": "list",
				"data-frame-head": framed && Boolean(title || headerCount || action) || void 0,
				"data-variant": variant,
				"data-embedded": embedded || void 0,
				"data-size": size,
				children: [
					refreshing && !loading && /* @__PURE__ */ jsx("span", {
						className: data_module_default.refreshing,
						"data-slot": "list-refreshing",
						"aria-hidden": true
					}),
					(title || headerCount || action) && /* @__PURE__ */ jsxs("div", {
						className: framed ? frame_module_default.frameHead : data_module_default.listHeader,
						"data-select": selection === "multiple" || void 0,
						children: [
							selection === "multiple" && /* @__PURE__ */ jsx(Checkbox, {
								"aria-label": `Select all ${label}`,
								disabled: !eligible.length,
								checked: count > 0 && count < eligible.length ? "indeterminate" : eligible.length > 0 && count === eligible.length,
								onCheckedChange: () => update(count === eligible.length ? selected.filter((id) => !eligible.includes(id)) : [.../* @__PURE__ */ new Set([...selected, ...eligible])])
							}),
							title && /* @__PURE__ */ jsx("div", {
								className: framed ? frame_module_default.frameTitle : data_module_default.listTitle,
								children: title
							}),
							framed ? (headerCount || action) && /* @__PURE__ */ jsxs("div", {
								className: frame_module_default.frameAction,
								children: [headerCount, action]
							}) : headerCount && /* @__PURE__ */ jsx("div", {
								className: data_module_default.listHeaderCount,
								children: headerCount
							}),
							!framed && action && /* @__PURE__ */ jsx("div", {
								className: data_module_default.listHeaderAction,
								children: action
							})
						]
					}),
					/* @__PURE__ */ jsxs("ul", {
						ref: list,
						className: cn(data_module_default.list, framed && frame_module_default.frameInset),
						"aria-label": label,
						"aria-busy": loading || refreshing || void 0,
						tabIndex: -1,
						onKeyDown: key,
						onFocusCapture: (event) => {
							if (!(event.target instanceof HTMLElement)) return;
							const row = event.target.closest("[data-list-row]");
							const main = row?.querySelector("[data-list-target]");
							if (!row || !main) {
								focusedRow.current = null;
								return;
							}
							const targets = Array.from(event.currentTarget.querySelectorAll("[data-list-target]"));
							focusedRow.current = {
								element: event.target,
								index: targets.indexOf(main)
							};
						},
						onBlurCapture: (event) => {
							if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) focusedRow.current = null;
							else if (!event.relatedTarget && event.target instanceof HTMLElement && event.target.isConnected) focusedRow.current = null;
						},
						children: [
							children,
							loading && Array.from({ length: loadingRows }, (_, index) => /* @__PURE__ */ jsxs("li", {
								className: data_module_default.listRow,
								"aria-hidden": true,
								children: [/* @__PURE__ */ jsx(Skeleton, {}), /* @__PURE__ */ jsx("span", {
									className: data_module_default.sr,
									children: "Loading"
								})]
							}, `loading-${index}`)),
							!rows.size && !loading && /* @__PURE__ */ jsx("li", {
								className: data_module_default.empty,
								children: empty
							})
						]
					}),
					footer && /* @__PURE__ */ jsx("div", {
						className: data_module_default.status,
						children: footer
					}),
					/* @__PURE__ */ jsx("span", {
						className: data_module_default.sr,
						role: "status",
						children: selection === "multiple" ? `${selected.length} selected` : loading ? "Loading items" : ""
					})
				]
			})
		})
	});
}
function ListSection({ label, meta, children }) {
	return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
		className: data_module_default.sectionHead,
		children: [/* @__PURE__ */ jsx("div", {
			className: data_module_default.sectionLabel,
			children: label
		}), meta && /* @__PURE__ */ jsx("div", {
			className: data_module_default.sectionMeta,
			children: meta
		})]
	}), /* @__PURE__ */ jsx("ul", {
		className: data_module_default.list,
		children
	})] });
}
var isHalf = (item) => item?.[2]?.span === "half";
function DataList({ items, variant = "stat", density = "default" }) {
	const halves = /* @__PURE__ */ new Set();
	if (density === "compact") items.forEach((item, index) => {
		if (halves.has(index) || !isHalf(item) || !isHalf(items[index + 1])) return;
		halves.add(index).add(index + 1);
	});
	return /* @__PURE__ */ jsx("dl", {
		className: data_module_default.dataList,
		"data-slot": "data-list",
		"data-variant": variant,
		"data-density": density,
		children: items.map(([term, value], index) => /* @__PURE__ */ jsxs("div", {
			className: data_module_default.dataPair,
			"data-span": halves.has(index) ? "half" : void 0,
			children: [/* @__PURE__ */ jsx("dt", { children: term }), /* @__PURE__ */ jsx("dd", { children: value })]
		}, index))
	});
}
export { DataList, List, ListFooter, ListHeader, ListRow, ListSection };

//# sourceMappingURL=list.js.map