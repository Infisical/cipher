import { Button } from "./button.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Select } from "./select.js";
import { Spinner } from "./spinner.js";
import pagination_module_default from "./pagination.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/pagination.tsx
function paginationPages(page, pageCount) {
	const candidates = [...new Set([
		1,
		page - 1,
		page,
		page + 1,
		pageCount
	].filter((value) => value >= 1 && value <= pageCount))].sort((a, b) => a - b);
	const result = [];
	candidates.forEach((value, index) => {
		const previous = candidates[index - 1];
		if (previous !== void 0 && value - previous > 1) result.push("gap");
		result.push(value);
	});
	return result;
}
function Pagination({ className, children, variant = "numbered", page, defaultPage = 1, onPageChange, pageCount, total, pageSize = 25, pageSizeOptions, onPageSizeChange, loading, onLoadMore, label = "Pagination", ref, ...props }) {
	const [ownPage, setOwnPage] = React.useState(defaultPage);
	const sizeId = React.useId();
	const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 25;
	const count = total === void 0 || !Number.isFinite(total) ? void 0 : Math.max(0, Math.floor(total));
	const pages = Math.max(1, count !== void 0 ? Math.ceil(count / size) : pageCount !== void 0 && Number.isFinite(pageCount) ? Math.floor(pageCount) : 1);
	const inputPage = page ?? ownPage;
	const current = Math.max(1, Math.min(pages, Number.isFinite(inputPage) ? Math.floor(inputPage) : 1));
	const change = (next) => {
		const safe = Math.max(1, Math.min(pages, next));
		if (safe === current || loading) return;
		if (page === void 0) setOwnPage(safe);
		onPageChange?.(safe);
	};
	const empty = count === 0;
	const remaining = count === void 0 ? size : Math.max(0, count - current * size);
	let range = variant === "compact" ? void 0 : `Page ${current} of ${pages}`;
	if (count !== void 0) range = empty ? "No results" : variant === "more" ? `Showing ${Math.min(count, current * size)} of ${count}` : `${(current - 1) * size + 1}–${Math.min(count, current * size)} of ${count}`;
	const step = (direction) => /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsx(Button, {
		type: "button",
		variant: "ghost",
		icon: direction === "previous" ? "chev-left" : void 0,
		iconRight: direction === "next" ? "chev-right" : void 0,
		disabled: loading || (direction === "previous" ? current <= 1 : current >= pages),
		"aria-label": direction === "previous" ? "Go to previous page" : "Go to next page",
		className: pagination_module_default.step,
		onClick: () => change(direction === "previous" ? current - 1 : current + 1),
		children: /* @__PURE__ */ jsx("span", {
			className: pagination_module_default.stepLabel,
			children: direction === "previous" ? "Previous" : "Next"
		})
	}) });
	const controls = variant === "more" ? current < pages && /* @__PURE__ */ jsx(Button, {
		type: "button",
		variant: "outline",
		loading: Boolean(loading),
		onClick: () => {
			if (onLoadMore) onLoadMore();
			else change(current + 1);
		},
		children: `Show ${Math.min(size, remaining)} more`
	}) : /* @__PURE__ */ jsxs(PaginationContent, { children: [
		step("previous"),
		variant === "compact" ? /* @__PURE__ */ jsx(PaginationItem, { children: /* @__PURE__ */ jsxs("span", {
			className: pagination_module_default.pageOf,
			children: [
				"Page ",
				current,
				" of ",
				pages
			]
		}) }) : paginationPages(current, pages).map((value, index) => /* @__PURE__ */ jsx(PaginationItem, { children: value === "gap" ? /* @__PURE__ */ jsx(PaginationEllipsis, {}) : /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon",
			"aria-label": `Page ${value}`,
			"aria-current": value === current ? "page" : void 0,
			disabled: loading,
			onClick: () => change(value),
			children: value
		}) }, value === "gap" ? `gap-${index}` : value)),
		step("next")
	] });
	return /* @__PURE__ */ jsx("nav", {
		ref,
		"aria-label": label,
		"data-slot": "pagination",
		"data-variant": variant,
		className: cn(children === void 0 ? pagination_module_default.root : "mx-auto flex w-full justify-center", className),
		...props,
		children: children === void 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
			role: "status",
			className: pagination_module_default.range,
			children: [loading && variant !== "more" && /* @__PURE__ */ jsx(Spinner, {}), range]
		}), !empty && /* @__PURE__ */ jsxs("div", {
			className: pagination_module_default.controls,
			children: [pageSizeOptions && onPageSizeChange && /* @__PURE__ */ jsxs("div", {
				className: pagination_module_default.pageSize,
				children: [/* @__PURE__ */ jsx("label", {
					htmlFor: sizeId,
					children: "Rows per page"
				}), /* @__PURE__ */ jsx(Select, {
					id: sizeId,
					size: "sm",
					value: String(size),
					disabled: loading,
					options: [.../* @__PURE__ */ new Set([...pageSizeOptions, size])].filter((value) => Number.isInteger(value) && value > 0).sort((a, b) => a - b).map((value) => ({
						value: String(value),
						label: String(value)
					})),
					onValueChange: (value) => {
						onPageSizeChange(Number(value));
						if (page === void 0) setOwnPage(1);
						onPageChange?.(1);
					}
				})]
			}), controls]
		})] }) : children
	});
}
Pagination.displayName = "Pagination";
function PaginationContent({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("ul", {
		ref,
		"data-slot": "pagination-content",
		className: cn(pagination_module_default.content, className),
		...props
	});
}
PaginationContent.displayName = "PaginationContent";
function PaginationItem({ ref, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		ref,
		"data-slot": "pagination-item",
		...props
	});
}
PaginationItem.displayName = "PaginationItem";
function PaginationLink({ className, isActive, size = "icon", href, onClick, ref, ...props }) {
	const disabled = props["aria-disabled"] === true || props["aria-disabled"] === "true";
	return /* @__PURE__ */ jsx(Button, {
		asChild: true,
		variant: "ghost",
		size,
		className: cn(disabled && pagination_module_default.unavailable, className),
		children: /* @__PURE__ */ jsx("a", {
			ref,
			"aria-current": isActive ? "page" : void 0,
			"data-slot": "pagination-link",
			"data-active": isActive,
			...props,
			role: props.role ?? (disabled ? "link" : void 0),
			href: disabled ? void 0 : href,
			tabIndex: disabled ? -1 : props.tabIndex,
			onClick: (event) => {
				if (disabled) event.preventDefault();
				else onClick?.(event);
			}
		})
	});
}
PaginationLink.displayName = "PaginationLink";
function PaginationPrevious({ className, text = "Previous", ref, ...props }) {
	return /* @__PURE__ */ jsxs(PaginationLink, {
		ref,
		"aria-label": "Go to previous page",
		className: cn(pagination_module_default.step, className),
		...props,
		size: "default",
		children: [/* @__PURE__ */ jsx(Icon, { name: "chev-left" }), /* @__PURE__ */ jsx("span", {
			className: pagination_module_default.stepLabel,
			children: text
		})]
	});
}
PaginationPrevious.displayName = "PaginationPrevious";
function PaginationNext({ className, text = "Next", ref, ...props }) {
	return /* @__PURE__ */ jsxs(PaginationLink, {
		ref,
		"aria-label": "Go to next page",
		className: cn(pagination_module_default.step, className),
		...props,
		size: "default",
		children: [/* @__PURE__ */ jsx("span", {
			className: pagination_module_default.stepLabel,
			children: text
		}), /* @__PURE__ */ jsx(Icon, { name: "chev-right" })]
	});
}
PaginationNext.displayName = "PaginationNext";
function PaginationEllipsis({ className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("span", {
		ref,
		"aria-hidden": true,
		"data-slot": "pagination-ellipsis",
		className: cn(pagination_module_default.ellipsis, className),
		...props,
		children: [/* @__PURE__ */ jsx(Icon, { name: "more" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "More pages"
		})]
	});
}
PaginationEllipsis.displayName = "PaginationEllipsis";
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, paginationPages };

//# sourceMappingURL=pagination.js.map