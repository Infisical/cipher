import { Badge } from "../ui/badge.js";
import { Button } from "../ui/button.js";
import { List, ListRow, ListSection } from "../ui/list.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/patterns/activity-log.tsx
var kindLabel = {
	person: "",
	machine: "Machine",
	agent: "Agent"
};
var ActivityLog = ({ days, total, loading = false, onLoadMore, label = "Activity" }) => {
	const shown = days.reduce((sum, day) => sum + day.events.length, 0);
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "activity-log",
		children: /* @__PURE__ */ jsx(List, {
			label,
			variant: "plain",
			size: "sm",
			loading,
			empty: "No activity yet",
			footer: shown < total && onLoadMore ? /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "sm",
				loading,
				onClick: onLoadMore,
				children: "Load more"
			}) : `Showing ${shown} of ${total} events`,
			children: days.map((day) => /* @__PURE__ */ jsx(ListSection, {
				label: day.label,
				meta: `${day.events.length} ${day.events.length === 1 ? "event" : "events"}`,
				children: day.events.map((event) => {
					const kind = event.actorKind ?? "person";
					return /* @__PURE__ */ jsx(ListRow, {
						value: event.id,
						label: event.actor,
						title: event.summary,
						badge: kind !== "person" ? /* @__PURE__ */ jsx(Badge, { children: kindLabel[kind] }) : void 0,
						meta: event.time
					}, event.id);
				})
			}, day.label))
		})
	});
};
export { ActivityLog };

//# sourceMappingURL=activity-log.js.map