import { Button } from "../ui/button.js";
import { Media } from "../ui/item.js";
import { List, ListFooter, ListHeader, ListRow, ListSection } from "../ui/list.js";
import { Skeleton } from "../ui/skeleton.js";
import patterns_module_default from "./patterns.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/patterns/approval-queue.tsx
var ApprovalQueueHeader = () => null;
function itemRow({ request, current, onApprove, onView, onUndo, onRetry }) {
	const pending = request.state === "pending";
	let actions;
	if (request.state === "resolved") actions = onUndo && /* @__PURE__ */ jsx(Button, {
		variant: "link",
		size: "sm",
		onClick: () => onUndo(request.id),
		children: "Undo"
	});
	else if (request.state === "failed") actions = /* @__PURE__ */ jsx(Button, {
		variant: "outline",
		size: "sm",
		onClick: () => onRetry(request.id),
		children: "Retry"
	});
	else actions = /* @__PURE__ */ jsxs(Fragment, { children: [onView && /* @__PURE__ */ jsx(Button, {
		variant: "outline",
		size: "sm",
		disabled: pending,
		onClick: () => onView(request.id),
		children: "View diff"
	}), /* @__PURE__ */ jsx(Button, {
		variant: "accent",
		size: "sm",
		loading: pending,
		onClick: () => onApprove(request.id),
		children: "Approve"
	})] });
	return {
		value: request.id,
		label: request.object,
		href: request.href,
		current,
		unread: request.state === "new",
		resolved: request.state === "resolved",
		media: /* @__PURE__ */ jsx(Media, {
			icon: request.state === "failed" ? "alert" : "inbox",
			tone: request.state === "failed" ? "bad" : void 0
		}),
		title: request.title,
		description: request.description,
		error: request.state === "failed" ? request.error : void 0,
		meta: request.age,
		actions
	};
}
function ApprovalQueueItem(props) {
	return /* @__PURE__ */ jsx(ListRow, { ...itemRow(props) });
}
var ApprovalQueueGroup = () => null;
var ApprovalQueueList = () => null;
var ApprovalQueueFooter = () => null;
function lower(children, list) {
	return React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;
		if (child.type === React.Fragment) return lower(child.props.children, list);
		if (child.type === ApprovalQueueItem) return /* @__PURE__ */ jsx(ListRow, { ...itemRow(child.props) });
		if (child.type === ApprovalQueueGroup) {
			const { label, children: items } = child.props;
			return /* @__PURE__ */ jsx(ListSection, {
				label,
				children: lower(items, list)
			});
		}
		if (child.type === ApprovalQueueList) {
			Object.assign(list, child.props);
			return lower(list.children, list);
		}
		if (child.type === ApprovalQueueHeader) {
			const { title, count, actions } = child.props;
			return /* @__PURE__ */ jsx(ListHeader, {
				title,
				count,
				action: actions
			});
		}
		if (child.type === ApprovalQueueFooter) return /* @__PURE__ */ jsx(ListFooter, { children: child.props.children });
		return child;
	});
}
var loadingRow = (index) => ({
	value: `loading-${index}`,
	label: "",
	media: /* @__PURE__ */ jsx(Skeleton, {
		width: "var(--v4-size-control-lg)",
		height: "var(--v4-size-control-lg)"
	}),
	title: /* @__PURE__ */ jsx("span", {
		className: patterns_module_default.queueTitleLine,
		children: /* @__PURE__ */ jsx(Skeleton, { width: "calc(3 * var(--v4-size-cell-min))" })
	}),
	meta: /* @__PURE__ */ jsx(Skeleton, { width: "var(--v4-space-24)" }),
	children: /* @__PURE__ */ jsx("span", {
		className: patterns_module_default.queueSmallLine,
		children: /* @__PURE__ */ jsx(Skeleton, { width: "70%" })
	}),
	actions: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Skeleton, {
		width: "calc(1.5 * var(--v4-size-cell-min))",
		height: "var(--v4-size-control-default)"
	}), /* @__PURE__ */ jsx(Skeleton, {
		width: "calc(1.25 * var(--v4-size-cell-min))",
		height: "var(--v4-size-control-default)"
	})] })
});
var keepsWhileLoading = (node) => React.isValidElement(node) && (node.type === ListHeader || node.type === ListFooter);
function ApprovalQueue({ variant, loading = false, loadingRows = 3, loadingLabel = "Loading requests", ...props }) {
	let children = props.children;
	if (props.requests) {
		const { requests, current, onApprove, onView, onUndo, onRetry, historyHref } = props;
		children = /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(ApprovalQueueHeader, {
				title: "Needs you",
				count: loading ? void 0 : `${requests.filter((request) => request.state !== "resolved").length} waiting`
			}),
			/* @__PURE__ */ jsx(ApprovalQueueList, { children: requests.map((request) => /* @__PURE__ */ jsx(ApprovalQueueItem, {
				request,
				current: request.id === current,
				onApprove,
				onView,
				onUndo,
				onRetry
			}, request.id)) }),
			historyHref && /* @__PURE__ */ jsx(ApprovalQueueFooter, { children: /* @__PURE__ */ jsx(Button, {
				variant: "link",
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ jsx("a", {
					href: historyHref,
					children: "View history"
				})
			}) })
		] });
	}
	const list = {};
	const lowered = lower(children, list);
	const content = loading ? [...React.Children.toArray(lowered).filter(keepsWhileLoading), ...Array.from({ length: Math.max(1, Math.floor(loadingRows)) }, (_, index) => /* @__PURE__ */ jsx(ListRow, { ...loadingRow(index) }, `loading-${index}`))] : lowered;
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "approval-queue",
		"data-variant": variant ?? "framed",
		"data-loading": loading || void 0,
		"aria-busy": loading || void 0,
		children: [loading && /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			role: "status",
			children: loadingLabel
		}), /* @__PURE__ */ jsx(List, {
			label: list.label ?? "Requests waiting on you",
			variant,
			actionsPlacement: "below",
			empty: list.empty ?? "Nothing is waiting on you.",
			children: content
		})]
	});
}
export { ApprovalQueue, ApprovalQueueFooter, ApprovalQueueGroup, ApprovalQueueHeader, ApprovalQueueItem, ApprovalQueueList };

//# sourceMappingURL=approval-queue.js.map