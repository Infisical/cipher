import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { ToggleGroup as ToggleGroup$1, ToggleGroupItem } from "./toggle-group.js";
import controls_module_default from "./controls.module.js";
import session_replay_module_default from "./session-replay.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slider } from "radix-ui";
import { Pause, Play } from "lucide-react";
// src/ui/session-replay.tsx
var SPEEDS = [
	.5,
	1,
	2,
	4
];
var formatTime = (ms, withHours) => {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const hours = Math.floor(total / 3600);
	const minutes = String(Math.floor(total % 3600 / 60)).padStart(2, "0");
	const seconds = String(total % 60).padStart(2, "0");
	return withHours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};
var lastIndexAtOrBefore = (times, time) => {
	let low = 0;
	let high = times.length - 1;
	let found = -1;
	while (low <= high) {
		const middle = low + high >> 1;
		if (times[middle] <= time) {
			found = middle;
			low = middle + 1;
		} else high = middle - 1;
	}
	return found;
};
function SessionReplay({ events, duration: durationProp, viewport, "aria-label": label = "Session replay", defaultSpeed = 1, seekStep = 5e3, emptyLabel = "No events recorded", className }) {
	const duration = Math.max(0, durationProp ?? events.at(-1)?.time ?? 0);
	const withHours = duration >= 36e5;
	const [clock, setClock] = React.useState(0);
	const time = Math.min(clock, duration);
	const [playing, setPlaying] = React.useState(false);
	const [speed, setSpeed] = React.useState(defaultSpeed);
	const [announcement, setAnnouncement] = React.useState("");
	const listRef = React.useRef(null);
	const clockRef = React.useRef(0);
	const moveTo = (next) => {
		clockRef.current = next;
		setClock(next);
	};
	const times = React.useMemo(() => events.map((event) => event.time), [events]);
	const listed = React.useMemo(() => events.flatMap((event, index) => event.listed === false ? [] : [{
		event,
		index
	}]), [events]);
	const listedTimes = React.useMemo(() => listed.map(({ event }) => event.time), [listed]);
	const reached = lastIndexAtOrBefore(times, time);
	const viewportEvents = React.useMemo(() => events.slice(0, reached + 1), [events, reached]);
	const activeRow = lastIndexAtOrBefore(listedTimes, time);
	const markers = React.useMemo(() => {
		if (duration <= 0) return [];
		const byPosition = /* @__PURE__ */ new Map();
		listed.forEach(({ event }) => {
			const position = Math.round(Math.min(event.time, duration) / duration * 200) / 2;
			const existing = byPosition.get(position);
			if (!existing || event.tone === "bad" || event.tone === "warn" && !existing.tone) byPosition.set(position, {
				position,
				tone: event.tone
			});
		});
		return [...byPosition.values()];
	}, [listed, duration]);
	React.useEffect(() => {
		if (!playing) return void 0;
		let frame = 0;
		let previous = performance.now();
		const tick = (now) => {
			const next = Math.min(duration, clockRef.current + (now - previous) * speed);
			previous = now;
			clockRef.current = next;
			setClock(next);
			if (next >= duration) {
				setPlaying(false);
				setAnnouncement(`Ended at ${formatTime(next, withHours)}`);
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [
		playing,
		speed,
		duration,
		withHours
	]);
	React.useEffect(() => {
		const list = listRef.current;
		const row = list?.querySelector("[aria-current=\"true\"]");
		if (!list || !row) return;
		const top = row.offsetTop - list.offsetTop;
		if (top < list.scrollTop) list.scrollTop = top;
		else if (top + row.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + row.offsetHeight - list.clientHeight;
	}, [activeRow]);
	const disabled = duration <= 0;
	const seek = React.useCallback((next, announce = false) => {
		const clamped = Math.min(duration, Math.max(0, next));
		clockRef.current = clamped;
		setClock(clamped);
		if (announce) setAnnouncement(`${formatTime(clamped, withHours)} of ${formatTime(duration, withHours)}`);
	}, [duration, withHours]);
	const seekToEvent = React.useCallback((next) => seek(next, true), [seek]);
	const togglePlaying = () => {
		if (disabled) return;
		if (playing) {
			setPlaying(false);
			setAnnouncement(`Paused at ${formatTime(time, withHours)}`);
			return;
		}
		if (time >= duration) moveTo(0);
		else clockRef.current = time;
		setPlaying(true);
		setAnnouncement("Playing");
	};
	const onKeyDown = (event) => {
		if (disabled || event.defaultPrevented) return;
		const onRoot = event.target === event.currentTarget;
		if (!onRoot && event.target.getAttribute("role") !== "slider") return;
		if (event.key === " ") {
			event.preventDefault();
			togglePlaying();
		} else if (onRoot) {
			if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
				event.preventDefault();
				seek(time + (event.key === "ArrowLeft" ? -seekStep : seekStep), true);
			} else if (event.key === "Home" || event.key === "End") {
				event.preventDefault();
				seek(event.key === "Home" ? 0 : duration, true);
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		role: "region",
		"aria-label": label,
		"aria-keyshortcuts": "Space ArrowLeft ArrowRight Home End",
		tabIndex: 0,
		"data-slot": "session-replay",
		className: cn(session_replay_module_default.replay, controls_module_default.focusOutline, className),
		onKeyDown,
		children: [/* @__PURE__ */ jsxs("div", {
			className: session_replay_module_default.layout,
			children: [/* @__PURE__ */ jsxs("div", {
				className: session_replay_module_default.stage,
				children: [/* @__PURE__ */ jsx("div", {
					"data-slot": "session-replay-viewport",
					className: session_replay_module_default.viewport,
					onClick: togglePlaying,
					children: viewport({
						time,
						events: viewportEvents,
						playing,
						speed
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: session_replay_module_default.controls,
					children: [
						/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon-sm",
							iconOnly: true,
							icon: playing ? Pause : Play,
							disabled,
							"aria-keyshortcuts": "Space",
							onClick: togglePlaying,
							children: playing ? "Pause" : "Play"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: session_replay_module_default.time,
							children: [/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Current time "
							}), formatTime(time, withHours)]
						}),
						/* @__PURE__ */ jsxs(Slider.Root, {
							"data-slot": "session-replay-timeline",
							className: session_replay_module_default.timeline,
							min: 0,
							max: Math.max(duration, 1),
							step: 1e3,
							value: [time],
							disabled,
							onValueChange: ([next]) => seek(next),
							children: [
								/* @__PURE__ */ jsx(Slider.Track, {
									className: cn(controls_module_default.sliderTrack, session_replay_module_default.track),
									children: /* @__PURE__ */ jsx(Slider.Range, { className: cn(controls_module_default.sliderRange, session_replay_module_default.range) })
								}),
								/* @__PURE__ */ jsx("span", {
									"aria-hidden": true,
									className: session_replay_module_default.markers,
									children: markers.map((marker) => /* @__PURE__ */ jsx("span", {
										className: session_replay_module_default.marker,
										"data-tone": marker.tone,
										style: { insetInlineStart: `${marker.position}%` }
									}, marker.position))
								}),
								/* @__PURE__ */ jsx(Slider.Thumb, {
									"data-slot": "session-replay-thumb",
									"aria-label": "Seek",
									"aria-valuetext": `${formatTime(time, withHours)} of ${formatTime(duration, withHours)}`,
									className: cn(controls_module_default.focusOutline, controls_module_default.sliderThumb, session_replay_module_default.thumb)
								})
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: session_replay_module_default.time,
							children: [/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Total time "
							}), formatTime(duration, withHours)]
						}),
						/* @__PURE__ */ jsx(ToggleGroup$1, {
							type: "single",
							size: "sm",
							"aria-label": "Playback speed",
							value: String(speed),
							disabled,
							onValueChange: (value) => {
								if (!value) return;
								setSpeed(Number(value));
								setAnnouncement(`Speed ${value}x`);
							},
							children: SPEEDS.map((option) => /* @__PURE__ */ jsxs(ToggleGroupItem, {
								value: String(option),
								"aria-label": `${option}x speed`,
								children: [option, "x"]
							}, option))
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: session_replay_module_default.events,
				children: /* @__PURE__ */ jsxs("div", {
					className: session_replay_module_default.eventsBody,
					children: [/* @__PURE__ */ jsxs("div", {
						className: session_replay_module_default.eventsHead,
						children: [/* @__PURE__ */ jsx("span", { children: "Events" }), /* @__PURE__ */ jsx("span", {
							className: session_replay_module_default.count,
							children: listed.length.toLocaleString()
						})]
					}), listed.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: session_replay_module_default.empty,
						children: emptyLabel
					}) : /* @__PURE__ */ jsx(EventList, {
						listed,
						activeRow,
						withHours,
						listRef,
						onSeek: seekToEvent
					})]
				})
			})]
		}), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			role: "status",
			"aria-live": "polite",
			"aria-atomic": "true",
			children: announcement
		})]
	});
}
SessionReplay.displayName = "SessionReplay";
var EventList = React.memo(function EventList({ listed, activeRow, withHours, listRef, onSeek }) {
	return /* @__PURE__ */ jsx("ol", {
		ref: listRef,
		className: session_replay_module_default.list,
		"aria-label": "Events",
		children: listed.map(({ event, index }, row) => /* @__PURE__ */ jsx("li", {
			className: session_replay_module_default.entry,
			children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: cn(session_replay_module_default.row, controls_module_default.focusOutlineInset),
				"aria-current": row === activeRow ? "true" : void 0,
				"data-tone": event.tone,
				title: event.label,
				onClick: () => onSeek(event.time),
				children: [
					/* @__PURE__ */ jsx("span", {
						className: session_replay_module_default.rowTime,
						children: formatTime(event.time, withHours)
					}),
					event.kind && /* @__PURE__ */ jsx("span", {
						className: session_replay_module_default.kind,
						children: event.kind
					}),
					event.tone && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						"aria-hidden": true,
						className: session_replay_module_default.dot
					}), /* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: event.tone === "bad" ? "Error: " : "Warning: "
					})] }),
					/* @__PURE__ */ jsx("span", {
						className: session_replay_module_default.label,
						children: event.label
					})
				]
			})
		}, index))
	});
});
export { SessionReplay };

//# sourceMappingURL=session-replay.js.map