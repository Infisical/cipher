import { cn } from "../lib/utils.js";
import { CipherScope } from "../scope.js";
import { Button } from "./button.js";
import { EmptyState } from "./empty.js";
import { Kbd } from "./kbd.js";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "./popover.js";
import { Spinner } from "./spinner.js";
import { StatusText } from "./text.js";
import { Textarea } from "./textarea.js";
import { Tooltip } from "./tooltip.js";
import remote_desktop_module_default from "./remote-desktop.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ClipboardPaste, Keyboard, Maximize2, Minimize2, PlugZap } from "lucide-react";
// src/ui/remote-desktop.tsx
var statusText = {
	connecting: "Connecting",
	connected: "Connected",
	reconnecting: "Reconnecting",
	disconnected: "Disconnected",
	error: "Connection failed"
};
var statusTone = {
	connecting: "warn",
	connected: "ok",
	reconnecting: "warn",
	disconnected: "muted",
	error: "bad"
};
var releaseKeys = [
	"Ctrl",
	"Alt",
	"Shift"
];
var notConnected = "Available once connected";
var keyboardLock = () => typeof navigator === "undefined" ? void 0 : navigator.keyboard;
function ClipboardControl({ disabled, onSend }) {
	const id = React.useId();
	const [open, setOpen] = React.useState(false);
	const [text, setText] = React.useState("");
	const [sending, setSending] = React.useState(false);
	const [failed, setFailed] = React.useState(false);
	const send = async (event) => {
		event.preventDefault();
		setSending(true);
		setFailed(false);
		try {
			await onSend(text);
			setText("");
			setOpen(false);
		} catch {
			setFailed(true);
		} finally {
			setSending(false);
		}
	};
	const trigger = /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		size: "icon-sm",
		icon: ClipboardPaste,
		iconOnly: true,
		disabledReason: disabled ? notConnected : void 0,
		children: "Remote clipboard"
	});
	if (disabled) return trigger;
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(Tooltip, {
			content: "Remote clipboard",
			children: /* @__PURE__ */ jsx(PopoverTrigger, {
				asChild: true,
				children: trigger
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align: "end",
			side: "top",
			children: /* @__PURE__ */ jsxs("form", {
				className: remote_desktop_module_default.clipboard,
				onSubmit: send,
				children: [
					/* @__PURE__ */ jsx(PopoverHeader, { children: /* @__PURE__ */ jsx(PopoverTitle, { children: /* @__PURE__ */ jsx("label", {
						htmlFor: id,
						children: "Send to remote clipboard"
					}) }) }),
					/* @__PURE__ */ jsx(Textarea, {
						id,
						rows: 4,
						value: text,
						readOnly: sending,
						onChange: (event) => {
							setText(event.target.value);
							setFailed(false);
						}
					}),
					failed && /* @__PURE__ */ jsx(StatusText, {
						tone: "bad",
						icon: "alert",
						role: "alert",
						children: "Couldn't send to the remote clipboard. Try again."
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						size: "sm",
						loading: sending,
						disabled: !text,
						children: "Send"
					})
				]
			})
		})]
	});
}
function RemoteDesktop({ status, label, desktopSize = {
	width: 1920,
	height: 1080
}, canvasRef, surface, details, actions, error, onPointer, onWheel, onKey, onCtrlAltDel, onClipboardSend, onDisconnect, onReconnect, className, ref, ...props }) {
	const id = React.useId();
	const root = React.useRef(null);
	const stage = React.useRef(null);
	const frame = React.useRef(null);
	const toolbar = React.useRef(null);
	const pressed = React.useRef(/* @__PURE__ */ new Map());
	const buttonsHeld = React.useRef(/* @__PURE__ */ new Set());
	const lastPoint = React.useRef({
		x: 0,
		y: 0
	});
	const [fit, setFit] = React.useState();
	const [captured, setCaptured] = React.useState(false);
	const [fullscreen, setFullscreen] = React.useState(false);
	const [rootNode, setRootNode] = React.useState(null);
	const connected = status === "connected";
	const { width, height } = desktopSize;
	const assignRoot = React.useCallback((node) => {
		root.current = node;
		setRootNode(node);
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	React.useLayoutEffect(() => {
		const node = stage.current;
		if (!node) return void 0;
		const measure = () => {
			const style = getComputedStyle(node);
			const availableWidth = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			const availableHeight = node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
			const scale = Math.max(0, Math.min(availableWidth / width, availableHeight / height));
			setFit({
				width: Math.floor(width * scale),
				height: Math.floor(height * scale)
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, [width, height]);
	React.useEffect(() => {
		const update = () => {
			const active = document.fullscreenElement === root.current;
			setFullscreen(active);
			if (!active) keyboardLock()?.unlock?.();
		};
		document.addEventListener("fullscreenchange", update);
		return () => document.removeEventListener("fullscreenchange", update);
	}, []);
	const toRemote = (clientX, clientY) => {
		const rect = frame.current?.getBoundingClientRect();
		if (!rect || rect.width === 0 || rect.height === 0) return {
			x: 0,
			y: 0
		};
		const clamp = (value, max) => Math.min(Math.max(value, 0), max - 1);
		return {
			x: Math.round(clamp((clientX - rect.left) / rect.width * width, width)),
			y: Math.round(clamp((clientY - rect.top) / rect.height * height, height))
		};
	};
	const latest = React.useRef({
		onWheel,
		onKey,
		onPointer,
		toRemote
	});
	React.useEffect(() => {
		latest.current = {
			onWheel,
			onKey,
			onPointer,
			toRemote
		};
	});
	const releaseKeysHeld = () => {
		pressed.current.forEach((event) => latest.current.onKey?.({
			...event,
			type: "up",
			repeat: false
		}));
		pressed.current.clear();
	};
	const releaseButtonsHeld = () => {
		buttonsHeld.current.forEach((button) => latest.current.onPointer?.({
			type: "up",
			...lastPoint.current,
			button,
			buttons: 0
		}));
		buttonsHeld.current.clear();
	};
	React.useEffect(() => {
		if (connected) return;
		releaseKeysHeld();
		releaseButtonsHeld();
	}, [connected]);
	React.useEffect(() => {
		const node = stage.current;
		if (!node || !connected) return void 0;
		const wheel = (event) => {
			const { onWheel: handler, toRemote: map } = latest.current;
			if (!handler || !frame.current?.contains(event.target)) return;
			event.preventDefault();
			handler({
				...map(event.clientX, event.clientY),
				deltaX: event.deltaX,
				deltaY: event.deltaY,
				deltaMode: event.deltaMode
			});
		};
		node.addEventListener("wheel", wheel, { passive: false });
		return () => node.removeEventListener("wheel", wheel);
	}, [connected]);
	const keyEvent = (event, type) => {
		if (!connected || !onKey || event.target !== event.currentTarget) return;
		if (type === "down" && event.ctrlKey && event.altKey && event.shiftKey && [
			"Control",
			"Alt",
			"Shift"
		].includes(event.key)) {
			event.preventDefault();
			releaseKeysHeld();
			toolbar.current?.querySelector("button:not([aria-disabled='true'])")?.focus();
			return;
		}
		event.preventDefault();
		const remote = {
			type,
			code: event.code,
			key: event.key,
			repeat: event.repeat,
			ctrlKey: event.ctrlKey,
			altKey: event.altKey,
			shiftKey: event.shiftKey,
			metaKey: event.metaKey
		};
		if (type === "down") pressed.current.set(event.code, remote);
		else pressed.current.delete(event.code);
		onKey(remote);
	};
	const pointerEvent = (event, type) => {
		if (!connected || !onPointer) return;
		if (type === "down") {
			stage.current?.focus({ preventScroll: true });
			event.currentTarget.setPointerCapture(event.pointerId);
		}
		event.preventDefault();
		const point = toRemote(event.clientX, event.clientY);
		lastPoint.current = point;
		if (type === "down") buttonsHeld.current.add(event.button);
		else if (type === "up") buttonsHeld.current.delete(event.button);
		onPointer({
			type,
			...point,
			button: event.button,
			buttons: event.buttons
		});
	};
	const toggleFullscreen = async () => {
		if (document.fullscreenElement === root.current) {
			await document.exitFullscreen();
			return;
		}
		await root.current?.requestFullscreen();
		await keyboardLock()?.lock?.().catch(() => void 0);
		stage.current?.focus({ preventScroll: true });
	};
	const capturing = captured && connected;
	const hintId = id + "-hint";
	const overlay = status === "connecting" ? /* @__PURE__ */ jsx("div", {
		className: remote_desktop_module_default.overlay,
		"data-overlay": "solid",
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "page",
			label: "Connecting to remote desktop"
		})
	}) : status === "reconnecting" ? /* @__PURE__ */ jsx("div", {
		className: remote_desktop_module_default.overlay,
		"data-overlay": "scrim",
		children: /* @__PURE__ */ jsx("div", {
			className: remote_desktop_module_default.notice,
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "base",
				label: "Reconnecting"
			})
		})
	}) : status === "disconnected" ? /* @__PURE__ */ jsx("div", {
		className: remote_desktop_module_default.overlay,
		"data-overlay": "solid",
		children: /* @__PURE__ */ jsx(EmptyState, {
			icon: PlugZap,
			title: "Session disconnected",
			description: "Reconnect to start a new session.",
			actions: onReconnect && /* @__PURE__ */ jsx(Button, {
				onClick: onReconnect,
				children: "Reconnect"
			})
		})
	}) : status === "error" ? /* @__PURE__ */ jsx("div", {
		className: remote_desktop_module_default.overlay,
		"data-overlay": "solid",
		role: "alert",
		children: /* @__PURE__ */ jsx(EmptyState, {
			icon: "alert",
			title: "Connection failed",
			description: error,
			actions: onReconnect && /* @__PURE__ */ jsx(Button, {
				onClick: onReconnect,
				children: "Reconnect"
			})
		})
	}) : null;
	return /* @__PURE__ */ jsx("div", {
		ref: assignRoot,
		"data-slot": "remote-desktop",
		"data-status": status,
		"data-fullscreen": fullscreen || void 0,
		className: cn(remote_desktop_module_default.root, className),
		...props,
		children: /* @__PURE__ */ jsxs(CipherScope, {
			portalContainer: fullscreen ? rootNode : void 0,
			className: remote_desktop_module_default.scope,
			children: [/* @__PURE__ */ jsxs("div", {
				ref: stage,
				role: "application",
				"aria-roledescription": "remote desktop",
				"aria-label": label,
				"aria-describedby": connected && onKey ? hintId : void 0,
				"aria-busy": status === "connecting" || status === "reconnecting" || void 0,
				tabIndex: connected ? 0 : -1,
				"data-captured": capturing || void 0,
				className: remote_desktop_module_default.stage,
				onFocus: (event) => {
					if (event.target === event.currentTarget) setCaptured(true);
				},
				onBlur: (event) => {
					if (event.target !== event.currentTarget) return;
					releaseKeysHeld();
					setCaptured(false);
				},
				onKeyDown: (event) => keyEvent(event, "down"),
				onKeyUp: (event) => keyEvent(event, "up"),
				onContextMenu: (event) => {
					if (connected && onPointer) event.preventDefault();
				},
				children: [/* @__PURE__ */ jsx("div", {
					ref: frame,
					className: remote_desktop_module_default.frame,
					style: fit && {
						width: fit.width,
						height: fit.height
					},
					onPointerDown: (event) => pointerEvent(event, "down"),
					onPointerMove: (event) => pointerEvent(event, "move"),
					onPointerUp: (event) => pointerEvent(event, "up"),
					onPointerCancel: releaseButtonsHeld,
					onLostPointerCapture: releaseButtonsHeld,
					children: surface ?? /* @__PURE__ */ jsx("canvas", {
						ref: canvasRef,
						width,
						height
					})
				}), overlay]
			}), /* @__PURE__ */ jsxs("div", {
				ref: toolbar,
				role: "toolbar",
				"aria-label": "Remote desktop",
				className: remote_desktop_module_default.toolbar,
				children: [
					/* @__PURE__ */ jsxs("span", {
						role: "status",
						className: remote_desktop_module_default.status,
						children: [/* @__PURE__ */ jsx("span", {
							className: remote_desktop_module_default.dot,
							"data-tone": statusTone[status],
							"aria-hidden": true
						}), statusText[status]]
					}),
					connected && onKey && /* @__PURE__ */ jsxs("span", {
						id: hintId,
						className: remote_desktop_module_default.hint,
						"data-captured": capturing || void 0,
						children: ["Input captured, release with", /* @__PURE__ */ jsx(Kbd, {
							keys: releaseKeys,
							size: "sm"
						})]
					}),
					details && details.length > 0 && /* @__PURE__ */ jsx("dl", {
						className: remote_desktop_module_default.details,
						children: details.map((detail) => /* @__PURE__ */ jsxs("div", {
							className: remote_desktop_module_default.detail,
							children: [/* @__PURE__ */ jsx("dt", { children: detail.label }), /* @__PURE__ */ jsx("dd", {
								title: typeof detail.value === "string" ? detail.value : void 0,
								children: detail.value
							})]
						}, detail.label))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: remote_desktop_module_default.controls,
						children: [
							actions,
							onClipboardSend && /* @__PURE__ */ jsx(ClipboardControl, {
								disabled: !connected,
								onSend: onClipboardSend
							}),
							onCtrlAltDel && /* @__PURE__ */ jsx(Tooltip, {
								content: "Send Ctrl+Alt+Del",
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon-sm",
									icon: Keyboard,
									iconOnly: true,
									disabledReason: connected ? void 0 : notConnected,
									onClick: onCtrlAltDel,
									children: "Send Ctrl+Alt+Del"
								})
							}),
							/* @__PURE__ */ jsx(Tooltip, {
								content: fullscreen ? "Exit full screen" : "Full screen",
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon-sm",
									icon: fullscreen ? Minimize2 : Maximize2,
									iconOnly: true,
									"aria-pressed": fullscreen,
									onClick: toggleFullscreen,
									children: "Full screen"
								})
							}),
							onDisconnect && /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								disabledReason: status === "disconnected" || status === "error" ? "Not connected" : void 0,
								onClick: onDisconnect,
								children: "Disconnect"
							})
						]
					})
				]
			})]
		})
	});
}
RemoteDesktop.displayName = "RemoteDesktop";
export { RemoteDesktop };

//# sourceMappingURL=remote-desktop.js.map