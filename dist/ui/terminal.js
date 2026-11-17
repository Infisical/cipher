"use client";
import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { useTheme } from "../scope.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { MiddleTruncate } from "./middle-truncate.js";
import { Spinner } from "./spinner.js";
import frame_module_default from "./frame.module.js";
import terminal_module_default from "./terminal.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/terminal.tsx
var statusWords = {
	connecting: "Connecting",
	connected: "Connected",
	disconnected: "Disconnected",
	error: "Connection failed"
};
var themeTokens = {
	background: "surface",
	foreground: "ink",
	cursor: "mark",
	cursorAccent: "surface",
	selectionBackground: "selected-surface",
	scrollbarSliderBackground: "scroll-thumb",
	scrollbarSliderHoverBackground: "scroll-thumb-hover",
	scrollbarSliderActiveBackground: "scroll-thumb-hover",
	black: "ansi-black",
	red: "ansi-red",
	green: "ansi-green",
	yellow: "ansi-yellow",
	blue: "ansi-blue",
	magenta: "ansi-magenta",
	cyan: "ansi-cyan",
	white: "ansi-white",
	brightBlack: "ansi-bright-black",
	brightRed: "ansi-bright-red",
	brightGreen: "ansi-bright-green",
	brightYellow: "ansi-bright-yellow",
	brightBlue: "ansi-bright-blue",
	brightMagenta: "ansi-bright-magenta",
	brightCyan: "ansi-bright-cyan",
	brightWhite: "ansi-bright-white"
};
function readTheme(host) {
	const probe = document.createElement("span");
	host.appendChild(probe);
	const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
	const theme = Object.fromEntries(Object.entries(themeTokens).map(([key, token]) => {
		probe.style.color = `var(--cipher-${token})`;
		const color = getComputedStyle(probe).color;
		if (!context) return [key, color];
		context.clearRect(0, 0, 1, 1);
		context.fillStyle = color;
		context.fillRect(0, 0, 1, 1);
		const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
		return [key, `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`];
	}));
	probe.remove();
	return theme;
}
function Terminal({ label, icon = "terminal", status, message, onRetry, retryLabel, actions, onData, onResize, onReady, options, className, ref, ...props }) {
	const hostRef = React.useRef(null);
	const retryRef = React.useRef(null);
	const terminalRef = React.useRef(null);
	const fitRef = React.useRef(null);
	const pending = React.useRef([]);
	const latest = React.useRef({
		onData,
		onResize,
		onReady,
		options
	});
	latest.current = {
		onData,
		onResize,
		onReady,
		options
	};
	const [load, setLoad] = React.useState("loading");
	const theme = useTheme();
	const embedded = useInFrame("Terminal");
	const labelText = typeof label === "string" ? label : void 0;
	const labelId = React.useId();
	const ended = status === "disconnected" || status === "error" || load === "failed";
	React.useImperativeHandle(ref, () => ({
		write: (data) => {
			if (terminalRef.current) terminalRef.current.write(data);
			else pending.current?.push(data);
		},
		clear: () => {
			pending.current?.splice(0);
			terminalRef.current?.clear();
		},
		reset: () => {
			pending.current?.splice(0);
			terminalRef.current?.reset();
		},
		focus: () => terminalRef.current?.focus(),
		fit: () => fitRef.current?.fit()
	}), []);
	React.useEffect(() => {
		const host = hostRef.current;
		if (!host) return void 0;
		let disposed = false;
		let teardown = () => {};
		const style = getComputedStyle(host);
		Promise.all([
			import("@xterm/xterm"),
			import("@xterm/addon-fit"),
			import("@xterm/xterm/css/xterm.css"),
			document.fonts?.load(`${style.fontSize} ${style.fontFamily}`).catch(() => void 0)
		]).then(([xterm, fit]) => {
			if (disposed) return;
			const terminal = new xterm.Terminal({
				cursorBlink: true,
				scrollback: 1e4,
				minimumContrastRatio: 4.5,
				...latest.current.options,
				fontFamily: style.fontFamily,
				fontSize: parseFloat(style.fontSize),
				theme: readTheme(host)
			});
			const fitAddon = new fit.FitAddon();
			terminal.loadAddon(fitAddon);
			const subscriptions = [terminal.onData((data) => latest.current.onData?.(data)), terminal.onResize((size) => latest.current.onResize?.(size))];
			terminal.open(host);
			fitAddon.fit();
			latest.current.onResize?.({
				cols: terminal.cols,
				rows: terminal.rows
			});
			const observer = new ResizeObserver(() => fitAddon.fit());
			observer.observe(host);
			terminalRef.current = terminal;
			fitRef.current = fitAddon;
			latest.current.onReady?.(terminal);
			pending.current?.splice(0).forEach((data) => terminal.write(data));
			setLoad("ready");
			teardown = () => {
				observer.disconnect();
				subscriptions.forEach((subscription) => subscription.dispose());
				terminalRef.current = null;
				fitRef.current = null;
				terminal.dispose();
			};
		}, (error) => {
			if (disposed) return;
			pending.current = null;
			console.error("Terminal needs the optional peer dependencies @xterm/xterm and @xterm/addon-fit.", error);
			setLoad("failed");
		});
		return () => {
			disposed = true;
			teardown();
		};
	}, []);
	React.useEffect(() => {
		const host = hostRef.current;
		if (load !== "ready" || !host || !terminalRef.current) return;
		terminalRef.current.options.theme = readTheme(host);
	}, [load, theme]);
	React.useEffect(() => {
		const terminal = terminalRef.current;
		if (load !== "ready" || !terminal) return;
		terminal.options.disableStdin = ended || Boolean(latest.current.options?.disableStdin);
		if (status === "connected") terminal.focus();
		else if (ended && hostRef.current?.contains(document.activeElement)) retryRef.current?.focus();
	}, [
		load,
		status,
		ended
	]);
	const tone = load === "failed" ? "error" : status;
	const overlayTitle = load === "failed" ? "Terminal could not load" : status === "error" ? "Connection failed" : "Session ended";
	return /* @__PURE__ */ jsx("section", {
		"data-slot": "terminal",
		"data-status": tone,
		"data-embedded": embedded || void 0,
		"aria-label": labelText,
		"aria-labelledby": labelText ? void 0 : labelId,
		className: cn(!embedded && frame_module_default.frame, terminal_module_default.terminal, className),
		...props,
		children: /* @__PURE__ */ jsxs(FrameScope, {
			framed: true,
			children: [/* @__PURE__ */ jsxs("div", {
				className: cn(frame_module_default.frameHead, terminal_module_default.header),
				children: [
					/* @__PURE__ */ jsxs("div", {
						id: labelId,
						className: terminal_module_default.identity,
						children: [/* @__PURE__ */ jsx(Icon, { icon }), labelText ? /* @__PURE__ */ jsx(MiddleTruncate, {
							keepEnd: 16,
							className: terminal_module_default.label,
							children: labelText
						}) : label]
					}),
					/* @__PURE__ */ jsxs("span", {
						role: "status",
						className: terminal_module_default.status,
						"data-tone": tone,
						children: [tone === "connecting" ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							className: terminal_module_default.dot
						}), load === "failed" ? statusWords.error : statusWords[status]]
					}),
					actions && /* @__PURE__ */ jsx("div", {
						className: terminal_module_default.actions,
						children: actions
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: cn(frame_module_default.frameInset, terminal_module_default.body),
				children: [/* @__PURE__ */ jsx("div", {
					ref: hostRef,
					className: terminal_module_default.screen
				}), ended && /* @__PURE__ */ jsxs("div", {
					className: terminal_module_default.overlay,
					role: tone === "error" ? "alert" : void 0,
					children: [
						/* @__PURE__ */ jsx("p", {
							className: terminal_module_default.overlayTitle,
							children: overlayTitle
						}),
						message && load !== "failed" && /* @__PURE__ */ jsx("p", {
							className: terminal_module_default.message,
							children: message
						}),
						onRetry && load !== "failed" && /* @__PURE__ */ jsx(Button, {
							ref: retryRef,
							variant: "outline",
							icon: "sync",
							onClick: onRetry,
							children: retryLabel ?? (status === "error" ? "Retry" : "Reconnect")
						})
					]
				})]
			})]
		})
	});
}
Terminal.displayName = "Terminal";
export { Terminal };

//# sourceMappingURL=terminal.js.map