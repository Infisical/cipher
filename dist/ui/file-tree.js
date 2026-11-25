"use client";
import { useControllableState } from "../lib/use-controllable-state.js";
import { AnimatedCollapse } from "./animated-collapse.js";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "./context-menu.js";
import { EmptyScope } from "./empty.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { MiddleTruncate } from "./middle-truncate.js";
import data_module_default from "./data.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/file-tree.tsx
var folder = (node) => node.type ? node.type === "folder" : node.children !== void 0;
var expandable = (node, foldersOnly) => folder(node) && (node.children ?? []).some((child) => !foldersOnly || folder(child));
function selectedAncestors(nodes, selected) {
	if (selected === null) return [];
	for (let index = 0; index < nodes.length; index += 1) {
		const node = nodes[index];
		if (!node) return null;
		if (node.id === selected) return [];
		const childPath = selectedAncestors(node.children ?? [], selected);
		if (childPath) return [node.id, ...childPath];
	}
	return null;
}
function FileTree({ items, label, expanded, defaultExpanded = [], onExpandedChange, selected, defaultSelected = null, onSelect, selectable = "all", foldersOnly = false, size = "md", maxHeight, truncate = "middle", empty = "No files", renderActions, renderContextMenu, renaming, onRenamingChange, onRename }) {
	const [editing, setEditing] = useControllableState({
		value: renaming,
		defaultValue: null,
		onChange: onRenamingChange
	});
	const [renameError, setRenameError] = React.useState();
	const editingRef = React.useRef(editing);
	React.useLayoutEffect(() => {
		editingRef.current = editing;
	});
	const error = renameError && renameError.id === editing ? renameError.message : void 0;
	const [renamePending, setRenamePending] = React.useState(false);
	const [ownExpanded, setOwnExpanded] = React.useState(() => [.../* @__PURE__ */ new Set([...defaultExpanded, ...selectedAncestors(items, selected ?? defaultSelected) ?? []])]);
	const [ownSelected, setOwnSelected] = React.useState(defaultSelected);
	const [focused, setFocused] = React.useState(null);
	const open = expanded ?? ownExpanded;
	const current = selected === void 0 ? ownSelected : selected;
	const revealedSelection = React.useRef(void 0);
	React.useEffect(() => {
		if (revealedSelection.current === current) return;
		const ancestors = selectedAncestors(items, current);
		if (!ancestors) return;
		revealedSelection.current = current;
		const next = [.../* @__PURE__ */ new Set([...open, ...ancestors])];
		if (next.length !== open.length) {
			if (expanded === void 0) setOwnExpanded(next);
			onExpandedChange?.(next);
		}
	}, [
		current,
		items,
		open,
		expanded,
		onExpandedChange
	]);
	const targets = React.useRef(/* @__PURE__ */ new Map());
	const tree = React.useRef(null);
	const focusWithin = React.useRef(false);
	const search = React.useRef({
		text: "",
		time: 0
	});
	const uid = React.useId();
	const visible = [];
	const flatten = (nodes, parent) => {
		nodes.forEach((node) => {
			if (foldersOnly && !folder(node)) return;
			visible.push({
				node,
				parent
			});
			if (open.includes(node.id)) flatten(node.children ?? [], node.id);
		});
	};
	flatten(items, null);
	const first = visible[0]?.node.id;
	const focusId = focused && visible.some(({ node }) => node.id === focused) ? focused : current && visible.some(({ node }) => node.id === current) ? current : first;
	const expand = (id, value) => {
		const next = value ? [...open.filter((x) => x !== id), id] : open.filter((x) => x !== id);
		if (expanded === void 0) setOwnExpanded(next);
		onExpandedChange?.(next);
	};
	const focus = (id) => {
		if (id) {
			setFocused(id);
			targets.current.get(id)?.focus();
		}
	};
	React.useLayoutEffect(() => {
		if (!focused || visible.some(({ node }) => node.id === focused)) return;
		const parents = /* @__PURE__ */ new Map();
		const visit = (nodes, parent) => nodes.forEach((node) => {
			parents.set(node.id, parent);
			visit(node.children ?? [], node.id);
		});
		visit(items, null);
		const visibleIds = new Set(visible.map(({ node }) => node.id));
		let next = parents.get(focused);
		while (next && !visibleIds.has(next)) next = parents.get(next);
		const target = next ?? first;
		if (target) {
			setFocused(target);
			if (focusWithin.current) targets.current.get(target)?.focus();
		}
	}, [
		focused,
		open,
		items,
		foldersOnly
	]);
	const canSelect = (node) => !node.disabled && (selectable === "all" || selectable === "files" && !folder(node) || selectable === "folders" && folder(node));
	const pick = (node) => {
		if (canSelect(node)) {
			if (selected === void 0) setOwnSelected(node.id);
			onSelect?.(node.id, node);
		} else if (expandable(node, foldersOnly) && !node.disabled) expand(node.id, !open.includes(node.id));
	};
	const startRename = (id) => {
		setRenameError(void 0);
		setEditing(id);
	};
	const stopRename = (id) => {
		setRenameError(void 0);
		setEditing(null);
		requestAnimationFrame(() => focus(id));
	};
	const commitRename = async (node, input) => {
		const name = input.value.trim();
		if (renamePending) return;
		if (!name || name === node.name || !onRename) {
			stopRename(node.id);
			return;
		}
		setRenamePending(true);
		let message;
		try {
			message = await onRename(node.id, name, node);
		} catch (failure) {
			message = failure instanceof Error ? failure.message : "Couldn't rename. Try again.";
		} finally {
			setRenamePending(false);
		}
		if (editingRef.current !== node.id) return;
		if (message) setRenameError({
			id: node.id,
			message
		});
		else if (input.value.trim() === name) stopRename(node.id);
	};
	const onKey = (event, node) => {
		if (event.target !== event.currentTarget) return;
		const index = visible.findIndex((entry) => entry.node.id === node.id);
		const parent = visible[index]?.parent;
		let handled = true;
		switch (event.key) {
			case "ArrowDown":
				focus(visible[Math.min(visible.length - 1, index + 1)]?.node.id);
				break;
			case "ArrowUp":
				focus(visible[Math.max(0, index - 1)]?.node.id);
				break;
			case "Home":
				focus(visible[0]?.node.id);
				break;
			case "End":
				focus(visible[visible.length - 1]?.node.id);
				break;
			case "ArrowRight":
				if (expandable(node, foldersOnly) && !node.disabled) {
					if (!open.includes(node.id)) expand(node.id, true);
					else focus(visible[index + 1]?.parent === node.id ? visible[index + 1]?.node.id : void 0);
				}
				break;
			case "ArrowLeft":
				if (expandable(node, foldersOnly) && open.includes(node.id)) expand(node.id, false);
				else focus(parent ?? void 0);
				break;
			case "Enter":
			case " ":
				pick(node);
				break;
			case "F2":
				if (onRename && !node.disabled) startRename(node.id);
				else handled = false;
				break;
			default:
				handled = false;
				if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.nativeEvent.isComposing) {
					const now = Date.now();
					search.current = {
						text: now - search.current.time < 500 ? search.current.text + event.key : event.key,
						time: now
					};
					const rest = [...visible.slice(index + 1), ...visible.slice(0, index + 1)];
					focus(rest.find((entry) => entry.node.name.toLowerCase().startsWith(search.current.text.toLowerCase()))?.node.id);
				}
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	};
	const withMenu = (node, item) => renderContextMenu ? /* @__PURE__ */ jsxs(ContextMenu, { children: [/* @__PURE__ */ jsx(ContextMenuTrigger, {
		asChild: true,
		disabled: editing === node.id,
		children: item
	}), /* @__PURE__ */ jsx(ContextMenuContent, {
		"aria-label": `Actions for ${node.name}`,
		onClick: (event) => event.stopPropagation(),
		onCloseAutoFocus: (event) => {
			event.preventDefault();
			const row = targets.current.get(node.id);
			if (editingRef.current === node.id) row?.querySelector("input")?.focus();
			else row?.focus();
		},
		children: renderContextMenu(node)
	})] }, node.id) : item;
	const render = (nodes, level) => nodes.filter((node) => !foldersOnly || folder(node)).map((node, index, shown) => withMenu(node, /* @__PURE__ */ jsxs("li", {
		ref: (element) => {
			if (element) targets.current.set(node.id, element);
			else targets.current.delete(node.id);
		},
		role: "treeitem",
		"aria-level": level,
		"aria-setsize": shown.length,
		"aria-posinset": index + 1,
		"aria-expanded": expandable(node, foldersOnly) ? open.includes(node.id) : void 0,
		"aria-selected": current === node.id,
		"aria-disabled": node.disabled || void 0,
		"aria-label": node.label ?? node.name,
		tabIndex: focusId === node.id ? 0 : -1,
		onFocus: (event) => {
			if (event.target === event.currentTarget) setFocused(node.id);
		},
		onKeyDown: (event) => onKey(event, node),
		onClick: (event) => {
			event.stopPropagation();
			focus(node.id);
			pick(node);
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: data_module_default.treeRow,
			"data-size": size,
			"data-selected": current === node.id,
			"aria-disabled": node.disabled || void 0,
			children: [
				expandable(node, foldersOnly) && /* @__PURE__ */ jsxs("button", {
					type: "button",
					tabIndex: -1,
					disabled: node.disabled,
					"aria-label": `${open.includes(node.id) ? "Collapse" : "Expand"} ${node.name}`,
					"aria-expanded": open.includes(node.id),
					"aria-controls": `${uid}-${node.id}`,
					onMouseDown: (event) => event.preventDefault(),
					onClick: (event) => {
						event.stopPropagation();
						focus(node.id);
						expand(node.id, !open.includes(node.id));
					},
					children: [
						" ",
						open.includes(node.id) ? "▾" : "▸",
						" "
					]
				}),
				/* @__PURE__ */ jsx(Icon, {
					icon: node.icon ?? (folder(node) ? open.includes(node.id) ? "folder-open" : "folder" : "file"),
					className: node.icon === void 0 && folder(node) || node.icon === "folder" || node.icon === "folder-open" ? data_module_default.treeFolder : void 0
				}),
				editing === node.id ? /* @__PURE__ */ jsx(Input, {
					size: "xs",
					"aria-label": `Rename ${node.name}`,
					defaultValue: node.name,
					"aria-busy": renamePending || void 0,
					"aria-invalid": error ? true : void 0,
					"aria-describedby": error ? `${uid}-${node.id}-error` : void 0,
					className: data_module_default.treeRename,
					ref: (input) => {
						if (!input || input.dataset.ready) return;
						input.dataset.ready = "true";
						input.focus();
						const dot = folder(node) ? -1 : node.name.lastIndexOf(".");
						input.setSelectionRange(0, dot > 0 ? dot : node.name.length);
					},
					onClick: (event) => event.stopPropagation(),
					onContextMenu: (event) => event.stopPropagation(),
					onKeyDown: (event) => {
						event.stopPropagation();
						if (event.nativeEvent.isComposing) return;
						if (event.key === "Enter") {
							event.preventDefault();
							commitRename(node, event.currentTarget);
						} else if (event.key === "Escape") {
							event.preventDefault();
							stopRename(node.id);
						}
					},
					onChange: () => setRenameError(void 0),
					onBlur: (event) => {
						if (!error) commitRename(node, event.currentTarget);
					}
				}) : /* @__PURE__ */ jsx("span", {
					className: data_module_default.treeName,
					title: node.name,
					children: truncate === "middle" ? /* @__PURE__ */ jsx(MiddleTruncate, {
						text: node.name,
						keepEnd: 8
					}) : node.name
				}),
				editing === node.id && error ? /* @__PURE__ */ jsx("span", {
					id: `${uid}-${node.id}-error`,
					role: "alert",
					title: error,
					className: data_module_default.treeError,
					children: error
				}) : node.meta && /* @__PURE__ */ jsx("span", {
					className: data_module_default.treeMeta,
					children: node.meta
				}),
				renderActions && editing !== node.id && /* @__PURE__ */ jsx("span", {
					className: data_module_default.treeActions,
					onClick: (event) => event.stopPropagation(),
					onKeyDown: (event) => event.stopPropagation(),
					children: renderActions(node)
				})
			]
		}), expandable(node, foldersOnly) && /* @__PURE__ */ jsx(AnimatedCollapse, {
			open: open.includes(node.id),
			lazy: true,
			children: /* @__PURE__ */ jsx("ul", {
				role: "group",
				id: `${uid}-${node.id}`,
				children: render(node.children ?? [], level + 1)
			})
		})]
	}, node.id)));
	return visible.length ? /* @__PURE__ */ jsx("ul", {
		ref: tree,
		role: "tree",
		"aria-label": label,
		"data-slot": "file-tree",
		"data-size": size,
		"data-scroll-fade": "both",
		className: data_module_default.tree,
		style: { maxHeight },
		onFocusCapture: () => {
			focusWithin.current = true;
		},
		onBlurCapture: (event) => {
			if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) focusWithin.current = false;
		},
		children: render(items, 1)
	}) : /* @__PURE__ */ jsx("div", {
		className: data_module_default.empty,
		children: /* @__PURE__ */ jsx(EmptyScope, {
			size: "sm",
			children: empty
		})
	});
}
export { FileTree };

//# sourceMappingURL=file-tree.js.map