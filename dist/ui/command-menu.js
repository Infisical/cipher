import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Command as Command$1, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "./command.js";
import { Icon } from "./icon.js";
import { Kbd } from "./kbd.js";
import { Spinner } from "./spinner.js";
import { Highlight } from "./text.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Columns2, LayoutTemplate, Palette, SquareCode, Zap } from "lucide-react";
// src/ui/command-menu.tsx
var kindIcons = {
	page: "file",
	component: "apps",
	pattern: LayoutTemplate,
	foundation: Palette,
	comparison: Columns2,
	example: SquareCode,
	action: Zap,
	secret: "key",
	setting: "settings",
	project: "folder",
	organization: "building",
	person: "user"
};
var kindLabel = (kind) => kind.charAt(0).toUpperCase() + kind.slice(1);
var CommandMenu = ({ groups, recent = [], pages = {}, open: controlledOpen, defaultOpen = false, onOpenChange, hotkey = "mod+k", onQueryChange, loading = false, filter = true, emptyHint, footer, inline = false, label = "Search workspace" }) => {
	const [open, setOpen] = useControllableState({
		value: controlledOpen,
		defaultValue: defaultOpen,
		onChange: onOpenChange
	});
	const [query, setQuery] = React.useState("");
	const [path, setPath] = React.useState([]);
	const [active, setActive] = React.useState("");
	const [error, setError] = React.useState("");
	const epoch = React.useRef(0);
	const mounted = React.useRef(true);
	const inFlight = React.useRef(/* @__PURE__ */ new Set());
	const [pendingActions, setPendingActions] = React.useState([]);
	const previousOpen = React.useRef(open);
	const queryListener = React.useEffectEvent((next, pageId) => onQueryChange?.(next, pageId));
	React.useLayoutEffect(() => {
		if (previousOpen.current !== open) epoch.current += 1;
		if (previousOpen.current && !open && !inline) {
			setPath([]);
			setQuery("");
			setActive("");
			setError("");
			queryListener("", void 0);
		}
		previousOpen.current = open;
	}, [inline, open]);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
			epoch.current += 1;
		};
	}, []);
	const pageId = path[path.length - 1];
	const page = pageId ? pages[pageId] : void 0;
	const updateQuery = (next) => {
		epoch.current += 1;
		setQuery(next);
		setError("");
		onQueryChange?.(next, pageId);
	};
	const back = () => {
		epoch.current += 1;
		setError("");
		setPath((previous) => previous.slice(0, -1));
		setQuery("");
		onQueryChange?.("", path[path.length - 2]);
	};
	React.useEffect(() => {
		if (!hotkey || inline) return;
		const listener = (event) => {
			if (event.defaultPrevented || event.isComposing || event.repeat) return;
			if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen(!open);
			}
		};
		document.addEventListener("keydown", listener);
		return () => document.removeEventListener("keydown", listener);
	}, [
		hotkey,
		inline,
		open,
		setOpen
	]);
	const visibleGroups = page?.groups ?? groups;
	const allGroups = !page && !query && recent.length ? [{
		label: "Recent",
		items: recent
	}, ...visibleGroups] : visibleGroups;
	const rank = (item) => {
		const q = query.trim().toLowerCase();
		const text = item.label.toLowerCase();
		if (!q) return 1;
		if (text.startsWith(q)) return 4;
		if (text.split(/[\s_\-./:]+/).some((word) => word.startsWith(q))) return 3;
		if (text.includes(q)) return 2;
		return [item.description, ...item.keywords ?? []].some((value) => value?.toLowerCase().includes(q)) ? 1 : 0;
	};
	const selectedItem = allGroups.flatMap((group) => group.items).find((item) => item.id === active);
	const activate = async (item) => {
		if (item.disabled || inFlight.current.has(item.id)) return;
		if (item.page) {
			const nextPage = item.page;
			if (!pages[nextPage]) {
				setError("This command page is unavailable.");
				return;
			}
			epoch.current += 1;
			setPath((previous) => [...previous, nextPage]);
			setQuery("");
			onQueryChange?.("", nextPage);
			return;
		}
		const turn = epoch.current;
		inFlight.current.add(item.id);
		setPendingActions([...inFlight.current]);
		setError("");
		try {
			await item.onSelect?.();
			if (turn !== epoch.current) return;
			if (item.href) window.location.assign(item.href);
			if (!item.keepOpen) setOpen(false);
		} catch (cause) {
			if (turn !== epoch.current || cause instanceof DOMException && cause.name === "AbortError") return;
			setError(`Could not ${item.label.toLowerCase()}. Try again.`);
		} finally {
			inFlight.current.delete(item.id);
			if (mounted.current) setPendingActions([...inFlight.current]);
		}
	};
	const panel = /* @__PURE__ */ jsxs(Command$1, {
		label,
		shouldFilter: false,
		loop: true,
		value: active,
		onValueChange: setActive,
		onKeyDown: (event) => {
			if (event.nativeEvent.isComposing || event.keyCode === 229) return;
			if (inline && event.key === "Escape" && path.length) {
				event.preventDefault();
				event.stopPropagation();
				back();
			}
			if (event.key === "Backspace" && !query && path.length) {
				event.preventDefault();
				back();
			}
			if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && selectedItem?.href) {
				event.preventDefault();
				if (selectedItem.disabled || inFlight.current.has(selectedItem.id)) return;
				window.open(selectedItem.href, "_blank", "noopener,noreferrer");
			}
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: picker_module_default.commandSearch,
				children: [page && /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Back",
					onClick: back,
					children: /* @__PURE__ */ jsx(Icon, { name: "chev-left" })
				}), /* @__PURE__ */ jsx(CommandInput, {
					value: query,
					onValueChange: updateQuery,
					placeholder: page?.placeholder ?? label,
					"aria-label": page?.title ?? label,
					onKeyDown: (event) => {
						if (event.nativeEvent.isComposing || event.keyCode === 229) event.stopPropagation();
					},
					trailing: loading ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(Kbd, {
						size: "sm",
						keys: "esc"
					})
				})]
			}),
			/* @__PURE__ */ jsxs(CommandEmpty, { children: [/* @__PURE__ */ jsx("p", {
				role: "status",
				children: loading ? "Searching…" : `No results${query ? ` for "${query}"` : ""}`
			}), emptyHint && /* @__PURE__ */ jsx("p", { children: emptyHint })] }),
			/* @__PURE__ */ jsx(CommandList, { children: allGroups.filter((group) => !group.searchOnly || query).map((group) => {
				const items = group.items.map((item, index) => ({
					item,
					score: rank(item),
					index
				})).filter(({ score }) => !filter || score > 0).sort((a, b) => filter ? b.score - a.score || a.index - b.index : a.index - b.index).slice(0, query && group.limit ? group.limit : void 0);
				return items.length ? /* @__PURE__ */ jsx(CommandGroup, {
					heading: group.label,
					children: items.map(({ item }) => /* @__PURE__ */ jsxs(CommandItem, {
						value: item.id,
						disabled: item.disabled || pendingActions.includes(item.id),
						"aria-busy": pendingActions.includes(item.id) || void 0,
						"data-danger": item.danger || void 0,
						onSelect: () => {
							activate(item);
						},
						children: [
							item.media ? /* @__PURE__ */ jsx("span", {
								"data-menu-icon": "",
								children: item.media
							}) : (() => {
								const glyph = item.icon ?? (item.kind && kindIcons[item.kind]);
								if (!glyph) return null;
								return typeof glyph === "string" ? /* @__PURE__ */ jsx(Icon, { name: glyph }) : /* @__PURE__ */ jsx(Icon, { icon: glyph });
							})(),
							/* @__PURE__ */ jsxs("span", {
								"data-command-label": true,
								className: cn(menu_module_default.text, picker_module_default.commandText),
								children: [/* @__PURE__ */ jsx("span", {
									className: cn(menu_module_default.title, item.mono && picker_module_default.mono),
									children: /* @__PURE__ */ jsx(Highlight, {
										text: item.label,
										query
									})
								}), item.description && item.description !== group.label && /* @__PURE__ */ jsx("span", {
									className: menu_module_default.description,
									children: item.description
								})]
							}),
							(item.meta ?? (group.label === "Recent" && item.kind && kindLabel(item.kind))) && /* @__PURE__ */ jsx("span", {
								className: menu_module_default.meta,
								children: item.meta ?? (item.kind && kindLabel(item.kind))
							}),
							item.shortcut && /* @__PURE__ */ jsx(CommandShortcut, { children: item.shortcut })
						]
					}, item.id))
				}, group.label) : null;
			}) }),
			error && /* @__PURE__ */ jsx("p", {
				role: "alert",
				className: picker_module_default.error,
				children: error
			}),
			/* @__PURE__ */ jsxs("div", {
				className: menu_module_default.hints,
				"data-slot": "command-menu-hints",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: menu_module_default.hint,
						children: [
							/* @__PURE__ */ jsx(Kbd, {
								size: "sm",
								keys: ["up"]
							}),
							/* @__PURE__ */ jsx(Kbd, {
								size: "sm",
								keys: ["down"]
							}),
							"Move"
						]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: menu_module_default.hint,
						children: [/* @__PURE__ */ jsx(Kbd, {
							size: "sm",
							keys: "enter"
						}), "Open"]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: menu_module_default.hint,
						children: [/* @__PURE__ */ jsx(Kbd, {
							size: "sm",
							keys: "esc"
						}), page ? "Back" : "Close"]
					}),
					footer && /* @__PURE__ */ jsx("span", {
						className: menu_module_default.hintsExtra,
						children: footer
					})
				]
			})
		]
	});
	return inline ? panel : /* @__PURE__ */ jsx(CommandDialog, {
		onEscapeKeyDown: (event) => {
			if (path.length) {
				event.preventDefault();
				back();
			}
		},
		open,
		onOpenChange: setOpen,
		title: label,
		description: "Search pages, objects and actions",
		children: panel
	});
};
export { CommandMenu };

//# sourceMappingURL=command-menu.js.map