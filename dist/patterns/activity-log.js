import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { List, ListRow, ListSection } from "../ui/list.js";
import patterns_module_default from "./patterns.module.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/patterns/activity-log.tsx
var kindLabel = {
	person: "",
	machine: "Machine",
	agent: "Agent"
};
var plural = (count) => `${count} ${count === 1 ? "event" : "events"}`;
var ActivityLog = ({ days, total, hasMore, loading = false, onLoadMore, label = "Activity", empty = "No activity yet" }) => {
	const shown = days.reduce((sum, day) => sum + day.events.length, 0);
	const more = hasMore ?? (total !== void 0 && shown < total);
	let footer;
	if (more && onLoadMore) footer = /* @__PURE__ */ jsx(Button, {
		variant: "outline",
		size: "sm",
		loading,
		onClick: onLoadMore,
		children: "Load more"
	});
	else if (total !== void 0) footer = `Showing ${shown} of ${total} events`;
	else if (shown > 0) footer = `Showing ${plural(shown)}`;
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "activity-log",
		children: /* @__PURE__ */ jsx(List, {
			label,
			variant: "plain",
			size: "sm",
			loading,
			empty,
			footer,
			children: days.map((day) => /* @__PURE__ */ jsx(ListSection, {
				label: day.label,
				meta: plural(day.events.length),
				children: day.events.map((event) => {
					const kind = event.actorKind ?? "person";
					const badges = (kind !== "person" || event.badge) && /* @__PURE__ */ jsxs("span", {
						className: patterns_module_default.activityBadges,
						children: [kind !== "person" && /* @__PURE__ */ jsx(Badge, { children: kindLabel[kind] }), event.badge]
					});
					return /* @__PURE__ */ jsx(ListRow, {
						value: event.id,
						label: event.actor,
						title: /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx("span", {
								"data-slot": "activity-actor",
								className: patterns_module_default.activityActor,
								children: event.actor
							}),
							" ",
							/* @__PURE__ */ jsx("span", {
								className: patterns_module_default.activitySummary,
								children: event.summary
							})
						] }),
						badge: badges || void 0,
						meta: event.time
					}, event.id);
				})
			}, day.label))
		})
	});
};
export { ActivityLog };

//# sourceMappingURL=activity-log.js.map