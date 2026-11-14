import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu.js";
import { EmptyState } from "../ui/empty.js";
import { FloatingActionBar } from "../ui/floating-action-bar.js";
import { List, ListRow } from "../ui/list.js";
import { toast } from "../ui/sonner.js";
import patterns_module_default from "./patterns.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/patterns/access-list.tsx
var UNDO_WINDOW_MS = 1e4;
var plural = (count) => `${count} ${count === 1 ? "member" : "members"}`;
var AccessList = ({ project, members, current, onOpen, onAdd, onRevoke, onRestore, onChangeRole }) => {
	const [picked, setPicked] = React.useState([]);
	const stage = React.useRef(null);
	const refocus = React.useRef(null);
	const selectable = new Set(members.filter((member) => !member.owner).map((member) => member.id));
	const selected = picked.filter((id) => selectable.has(id));
	React.useEffect(() => {
		const pending = refocus.current;
		if (!pending || members.some((member) => pending.revoked.includes(member.id))) return;
		refocus.current = null;
		if (document.activeElement && document.activeElement !== document.body) return;
		(pending.next && stage.current?.querySelector(`[data-list-row="${CSS.escape(pending.next)}"] [data-list-target]`) || stage.current?.querySelector("ul[aria-label]"))?.focus();
	});
	const restore = async (ids) => {
		if (!onRestore) return;
		try {
			await onRestore(ids);
			toast.success(`Restored access for ${plural(ids.length)}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Access was not restored. Try again.");
		}
	};
	const revoke = async (ids) => {
		const targets = ids.filter((id) => selectable.has(id));
		if (!targets.length) return;
		const first = members.findIndex((member) => targets.includes(member.id));
		const kept = (member) => !targets.includes(member.id);
		try {
			await onRevoke(targets);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Access was not revoked. Try again.");
			return;
		}
		refocus.current = {
			revoked: targets,
			next: (members.slice(first).find(kept) ?? members.slice(0, first).reverse().find(kept))?.id ?? null
		};
		setPicked((value) => value.filter((id) => !targets.includes(id)));
		toast.success(`Revoked access for ${plural(targets.length)}`, {
			duration: UNDO_WINDOW_MS,
			action: onRestore && {
				label: "Undo",
				onClick: () => restore(targets)
			}
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "access-list",
		className: patterns_module_default.pattern,
		children: [/* @__PURE__ */ jsxs("div", {
			className: patterns_module_default.toolbar,
			children: [/* @__PURE__ */ jsxs("p", {
				className: patterns_module_default.toolbarText,
				children: [
					members.length,
					" with access to ",
					/* @__PURE__ */ jsx("code", { children: project })
				]
			}), onAdd && /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				icon: "user-plus",
				onClick: onAdd,
				children: "Add member"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			ref: stage,
			className: patterns_module_default.stage,
			children: [/* @__PURE__ */ jsx(List, {
				label: "Members",
				title: "Members",
				selection: "multiple",
				selectedIds: selected,
				onSelectionChange: setPicked,
				empty: /* @__PURE__ */ jsx(EmptyState, {
					size: "sm",
					media: "bare",
					icon: "user",
					title: "Nobody else has access yet"
				}),
				children: members.map((member) => /* @__PURE__ */ jsx(ListRow, {
					value: member.id,
					label: member.name,
					href: member.href,
					onClick: () => onOpen?.(member.id),
					current: member.id === current,
					selectable: !member.owner,
					title: member.name,
					badge: /* @__PURE__ */ jsx(Badge, { children: member.role }),
					description: member.via,
					meta: member.lastUsed,
					actions: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon-sm",
							icon: "more",
							iconOnly: true,
							disabled: member.owner,
							children: `Actions for ${member.name}`
						})
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						align: "end",
						children: [onChangeRole && /* @__PURE__ */ jsx(DropdownMenuItem, {
							onSelect: () => onChangeRole(member.id),
							children: "Change role"
						}), /* @__PURE__ */ jsx(DropdownMenuItem, {
							variant: "destructive",
							onSelect: () => revoke([member.id]),
							children: "Revoke access"
						})]
					})] })
				}, member.id))
			}), /* @__PURE__ */ jsx(FloatingActionBar, {
				label: "Member actions",
				count: selected.length,
				onClear: () => setPicked([]),
				actions: [{
					label: "Revoke access",
					icon: "trash",
					danger: true,
					onClick: () => revoke(selected)
				}]
			})]
		})]
	});
};
export { AccessList };

//# sourceMappingURL=access-list.js.map