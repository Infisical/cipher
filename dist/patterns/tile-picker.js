import { useListFiltered } from "../lib/list-query.js";
import { cn } from "../lib/utils.js";
import { Button } from "../ui/button.js";
import { EmptyGhostScope, EmptyState } from "../ui/empty.js";
import { Input } from "../ui/input.js";
import { Media, Tile } from "../ui/item.js";
import tile_picker_module_default from "./tile-picker.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/patterns/tile-picker.tsx
var matches = (item, query) => [
	item.title,
	item.eyebrow,
	item.description,
	...item.keywords ?? []
].some((text) => text?.toLowerCase().includes(query));
/**
* Search plus a responsive grid of stacked Tiles. With an empty search, popular items come first
* under their own label and every item follows; a search lists its matches flat, then any
* pinned items, and finding nothing offers to clear it above the pinned items. The grid adds
* columns as the container widens, so it fits a sheet or a page without a frame of its own.
*/
function TilePicker({ items, onSelect, searchLabel = "Search", searchPlaceholder, popularLabel = "Popular", allLabel = "All", noun = "items", empty, ghost, filtered: filteredProp, className, ref, ...props }) {
	const [search, setSearch] = React.useState("");
	const listFiltered = useListFiltered();
	const filtered = filteredProp ?? listFiltered;
	const inputRef = React.useRef(null);
	const query = search.trim().toLowerCase();
	const popular = query ? [] : items.filter((item) => item.popular);
	const grid = (list) => /* @__PURE__ */ jsx("div", {
		className: tile_picker_module_default.grid,
		children: list.map((item) => {
			const shared = {
				layout: "stacked",
				title: item.title,
				description: item.description,
				eyebrow: item.eyebrow,
				disabledReason: item.disabledReason,
				media: (item.icon || item.media) && /* @__PURE__ */ jsx(Media, {
					icon: item.icon,
					children: item.media
				})
			};
			return item.href ? /* @__PURE__ */ jsx(Tile, {
				...shared,
				href: item.href,
				external: item.external
			}, item.value) : /* @__PURE__ */ jsx(Tile, {
				...shared,
				onClick: () => onSelect?.(item.value)
			}, item.value);
		})
	});
	const section = (label, list) => /* @__PURE__ */ jsxs("section", {
		className: tile_picker_module_default.section,
		"aria-label": label,
		children: [/* @__PURE__ */ jsx("h3", {
			className: tile_picker_module_default.label,
			children: label
		}), grid(list)]
	});
	const found = query ? items.filter((item) => matches(item, query)) : items;
	const pinned = query ? items.filter((item) => item.pinned && !matches(item, query)) : [];
	let body;
	if (!query && items.length === 0 && empty !== void 0) body = /* @__PURE__ */ jsx(EmptyGhostScope, {
		ghost: ghost ?? (filtered ? false : "cards"),
		children: empty
	});
	else if (query && found.length === 0) body = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(EmptyState, {
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
	}), pinned.length > 0 && grid(pinned)] });
	else if (popular.length > 0) body = /* @__PURE__ */ jsxs(Fragment, { children: [section(popularLabel, popular), section(allLabel, items)] });
	else body = grid([...found, ...pinned]);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "tile-picker",
		className: cn(tile_picker_module_default.picker, className),
		...props,
		children: [/* @__PURE__ */ jsx(Input, {
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