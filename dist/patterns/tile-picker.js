import { useListFiltered } from "../lib/list-query.js";
import { cn } from "../lib/utils.js";
import { Button } from "../ui/button.js";
import { EmptyGhostScope, EmptyState } from "../ui/empty.js";
import { Input } from "../ui/input.js";
import { Media, Tile } from "../ui/item.js";
import { List, ListRow, ListSection } from "../ui/list.js";
import data_module_default from "../ui/data.module.js";
import tile_picker_module_default from "./tile-picker.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/patterns/tile-picker.tsx
var categoryOf = (item) => item.category ?? item.eyebrow;
var matches = (item, query) => [
	item.title,
	categoryOf(item),
	typeof item.description === "string" ? item.description : void 0,
	...item.keywords ?? []
].some((text) => text?.toLowerCase().includes(query));
/**
* Search plus a responsive grid of Tiles, or a List of rows. With an empty search, popular items
* come first (as a section or a featured strip), then pinned items under pinnedLabel, then every
* item, grouped by category with groupBy. A search lists its matches flat, then the pinned items,
* and finding nothing offers to clear it above them. The grid adds columns as the container
* widens, so it fits a sheet or a page without a frame of its own.
*/
function TilePicker({ items, onSelect, layout = "grid", density = "comfortable", groupBy, popular: popularStyle = "section", pinnedLabel, searchable = true, value, searchLabel = "Search", searchPlaceholder, popularLabel = "Popular", allLabel = "All", noun = "items", empty, ghost, filtered: filteredProp, className, ref, ...props }) {
	const [search, setSearch] = React.useState("");
	const listFiltered = useListFiltered();
	const filtered = filteredProp ?? listFiltered;
	const inputRef = React.useRef(null);
	const query = searchable ? search.trim().toLowerCase() : "";
	const compact = layout === "grid" && density === "compact";
	const media = (item) => (item.icon || item.media) && /* @__PURE__ */ jsx(Media, {
		icon: item.icon,
		size: compact ? "sm" : "md",
		children: item.media
	});
	const tile = (item, featured, pinned) => {
		let detail = item.description ?? categoryOf(item);
		if (featured) detail = item.description && /* @__PURE__ */ jsx("span", {
			className: tile_picker_module_default.host,
			children: item.description
		});
		else if (compact && !pinned && !(query && groupBy)) detail = void 0;
		const shared = {
			layout: featured ? "stacked" : "inline",
			title: item.title,
			description: detail,
			badge: item.badge,
			disabledReason: item.disabledReason,
			selected: value === void 0 ? void 0 : value === item.value,
			media: media(item),
			className: cn(featured && tile_picker_module_default.featured, pinned && tile_picker_module_default.pinned)
		};
		return item.href ? /* @__PURE__ */ jsx(Tile, {
			...shared,
			href: item.href,
			external: item.external
		}, item.value) : /* @__PURE__ */ jsx(Tile, {
			...shared,
			onClick: () => onSelect?.(item.value)
		}, item.value);
	};
	const row = (item) => {
		const shared = {
			value: item.value,
			label: item.title,
			title: item.title,
			description: item.disabledReason ?? item.description ?? categoryOf(item),
			media: media(item),
			badge: item.badge,
			disabled: Boolean(item.disabledReason),
			current: value === item.value
		};
		return item.href ? /* @__PURE__ */ jsx(ListRow, {
			...shared,
			href: item.href,
			external: item.external
		}, item.value) : /* @__PURE__ */ jsx(ListRow, {
			...shared,
			onClick: () => onSelect?.(item.value)
		}, item.value);
	};
	const grid = (group) => /* @__PURE__ */ jsx("div", {
		className: tile_picker_module_default.grid,
		"data-density": compact ? "compact" : void 0,
		children: group.items.map((item) => tile(item, false, Boolean(group.pinned)))
	});
	const head = (label, count) => /* @__PURE__ */ jsxs("div", {
		className: tile_picker_module_default.head,
		children: [/* @__PURE__ */ jsx("h3", {
			className: data_module_default.sectionLabel,
			children: label
		}), count !== void 0 && /* @__PURE__ */ jsx("span", {
			className: data_module_default.sectionMeta,
			children: count
		})]
	});
	const render = (groups) => {
		const visible = groups.filter((group) => group.items.length > 0);
		if (layout === "list") return /* @__PURE__ */ jsx(List, {
			label: searchLabel,
			children: visible.map((group) => group.label ? /* @__PURE__ */ jsx(ListSection, {
				label: group.label,
				meta: group.counted ? String(group.items.length) : void 0,
				children: group.items.map(row)
			}, group.id) : /* @__PURE__ */ jsx(React.Fragment, { children: group.items.map(row) }, group.id))
		});
		return visible.map((group) => group.label ? /* @__PURE__ */ jsxs("section", {
			className: tile_picker_module_default.section,
			"aria-label": group.label,
			children: [head(group.label, group.counted ? group.items.length : void 0), grid(group)]
		}, group.id) : /* @__PURE__ */ jsx(React.Fragment, { children: grid(group) }, group.id));
	};
	const ownPinned = pinnedLabel ? items.filter((item) => item.pinned) : [];
	const pinnedGroup = {
		id: "pinned",
		label: pinnedLabel,
		items: ownPinned,
		pinned: true
	};
	let body;
	if (!query && items.length === 0 && empty !== void 0) body = /* @__PURE__ */ jsx(EmptyGhostScope, {
		ghost: ghost ?? (filtered ? false : "cards"),
		children: empty
	});
	else if (query) {
		const found = items.filter((item) => matches(item, query) && !ownPinned.includes(item));
		const trailing = pinnedLabel ? [] : items.filter((item) => item.pinned && !matches(item, query));
		body = /* @__PURE__ */ jsxs(Fragment, { children: [found.length === 0 && /* @__PURE__ */ jsx(EmptyState, {
			ghost: false,
			size: "sm",
			media: "bare",
			icon: "search",
			title: `No ${noun} match "${search.trim()}"`,
			actions: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				onClick: () => {
					setSearch("");
					inputRef.current?.focus();
				},
				children: "Clear search"
			})
		}), render([{
			id: "results",
			items: [...found, ...trailing]
		}, pinnedGroup])] });
	} else {
		const popular = items.filter((item) => item.popular && !ownPinned.includes(item));
		const featured = popularStyle === "featured" && layout === "grid" ? popular : [];
		const rest = items.filter((item) => !ownPinned.includes(item) && !featured.includes(item));
		const lead = [{
			id: "popular",
			label: popularLabel,
			items: featured.length > 0 ? [] : popular
		}, pinnedGroup];
		let catalog = [{
			id: "all",
			label: featured.length > 0 || lead.some((group) => group.items.length > 0) ? allLabel : void 0,
			items: rest
		}];
		if (groupBy) {
			const groups = /* @__PURE__ */ new Map();
			for (const item of rest) {
				const label = categoryOf(item) ?? allLabel;
				groups.set(label, [...groups.get(label) ?? [], item]);
			}
			catalog = [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([label, members]) => ({
				id: `category:${label}`,
				label,
				items: members,
				counted: true
			}));
		}
		body = /* @__PURE__ */ jsxs(Fragment, { children: [featured.length > 0 && /* @__PURE__ */ jsxs("section", {
			className: tile_picker_module_default.section,
			"aria-label": popularLabel,
			children: [head(popularLabel), /* @__PURE__ */ jsx("div", {
				className: tile_picker_module_default.strip,
				children: featured.map((item) => tile(item, true, false))
			})]
		}), render([...lead, ...catalog])] });
	}
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "tile-picker",
		className: cn(tile_picker_module_default.picker, className),
		...props,
		children: [searchable && /* @__PURE__ */ jsx(Input, {
			ref: inputRef,
			icon: "search",
			"aria-label": searchLabel,
			placeholder: searchPlaceholder ?? searchLabel,
			value: search,
			"data-cipher-escape-owner": search ? "" : void 0,
			onChange: (event) => setSearch(event.target.value),
			onKeyDown: (event) => {
				if (event.key === "Escape" && search) {
					event.preventDefault();
					event.stopPropagation();
					setSearch("");
				}
			}
		}), body]
	});
}
TilePicker.displayName = "TilePicker";
export { TilePicker };

//# sourceMappingURL=tile-picker.js.map