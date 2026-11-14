import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import kbd_module_default from "./kbd.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowBigUp, ArrowDown, ArrowLeft, ArrowRight, ArrowRightToLine, ArrowUp, ChevronUp, Command, CornerDownLeft, Delete, Option } from "lucide-react";
// src/ui/kbd.tsx
var symbolIcons = {
	"⌘": Command,
	"⇧": ArrowBigUp,
	"⌥": Option,
	"⌃": ChevronUp,
	"↵": CornerDownLeft,
	"⌫": Delete,
	"↑": ArrowUp,
	"↓": ArrowDown,
	"←": ArrowLeft,
	"→": ArrowRight,
	"⇥": ArrowRightToLine
};
var KeyGlyph = ({ glyph }) => {
	const symbol = symbolIcons[glyph];
	return symbol ? /* @__PURE__ */ jsx(Icon, {
		icon: symbol,
		size: "var(--cipher-size-icon-xs)",
		className: kbd_module_default.icon
	}) : glyph;
};
function splitCombo(value) {
	const text = value.trim();
	if (!text) return [];
	if (text === "+") return ["+"];
	if (text.includes("+")) {
		const parts = text.split("+").filter(Boolean);
		if (text.endsWith("++")) parts.push("+");
		return parts;
	}
	return text.replace(/([⌘⇧⌥⌃↵⌫⇥↑↓←→])/g, "$1 ").trim().split(/\s+/);
}
function shortcutSteps(keys) {
	if (typeof keys === "string") return keys.split(/\s+then\s+/i).map(splitCombo).filter((step) => step.length > 0);
	if (!keys.length) return [];
	if (keys.every((key) => typeof key === "string")) return [keys];
	return keys.filter((key) => Array.isArray(key));
}
function keyLabel(key, apple) {
	const lower = key.toLowerCase();
	return {
		mod: apple ? {
			glyph: "⌘",
			name: "Command"
		} : {
			glyph: "Ctrl",
			name: "Control"
		},
		cmd: {
			glyph: "⌘",
			name: "Command"
		},
		command: {
			glyph: "⌘",
			name: "Command"
		},
		"⌘": {
			glyph: "⌘",
			name: "Command"
		},
		ctrl: apple ? {
			glyph: "⌃",
			name: "Control"
		} : {
			glyph: "Ctrl",
			name: "Control"
		},
		control: {
			glyph: "Ctrl",
			name: "Control"
		},
		"⌃": {
			glyph: "⌃",
			name: "Control"
		},
		shift: apple ? {
			glyph: "⇧",
			name: "Shift"
		} : {
			glyph: "Shift",
			name: "Shift"
		},
		"⇧": {
			glyph: "⇧",
			name: "Shift"
		},
		alt: apple ? {
			glyph: "⌥",
			name: "Option"
		} : {
			glyph: "Alt",
			name: "Alt"
		},
		option: {
			glyph: "⌥",
			name: "Option"
		},
		"⌥": {
			glyph: "⌥",
			name: "Option"
		},
		enter: {
			glyph: "↵",
			name: "Enter"
		},
		return: {
			glyph: "↵",
			name: "Enter"
		},
		"↵": {
			glyph: "↵",
			name: "Enter"
		},
		esc: {
			glyph: "Esc",
			name: "Escape"
		},
		escape: {
			glyph: "Esc",
			name: "Escape"
		},
		backspace: {
			glyph: "⌫",
			name: "Backspace"
		},
		"⌫": {
			glyph: "⌫",
			name: "Backspace"
		},
		up: {
			glyph: "↑",
			name: "Arrow up"
		},
		down: {
			glyph: "↓",
			name: "Arrow down"
		},
		left: {
			glyph: "←",
			name: "Arrow left"
		},
		right: {
			glyph: "→",
			name: "Arrow right"
		},
		"↑": {
			glyph: "↑",
			name: "Arrow up"
		},
		"↓": {
			glyph: "↓",
			name: "Arrow down"
		},
		"←": {
			glyph: "←",
			name: "Arrow left"
		},
		"→": {
			glyph: "→",
			name: "Arrow right"
		},
		space: {
			glyph: "Space",
			name: "Space"
		},
		tab: apple ? {
			glyph: "⇥",
			name: "Tab"
		} : {
			glyph: "Tab",
			name: "Tab"
		},
		"⇥": {
			glyph: "⇥",
			name: "Tab"
		},
		"+": {
			glyph: "+",
			name: "Plus"
		}
	}[lower] ?? {
		glyph: key.length === 1 ? key.toUpperCase() : key,
		name: key.length === 1 ? key.toUpperCase() : key
	};
}
function Kbd({ className, children, keys, size = "md", platform = "auto", ref, ...props }) {
	const source = keys ?? (typeof children === "string" ? children : null);
	const apple = platform === "mac" || platform === "auto" && typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
	if (source === null) return /* @__PURE__ */ jsx("kbd", {
		ref,
		"data-slot": "kbd",
		"data-size": size,
		"data-glyph": typeof children === "string" && [...children].length === 1 ? "single" : void 0,
		className: cn(kbd_module_default.cap, className),
		...props,
		children
	});
	const steps = shortcutSteps(source).map((step) => step.map((key) => keyLabel(key, apple)));
	const label = steps.map((step) => step.map((key) => key.name).join(" ")).join(" then ");
	return /* @__PURE__ */ jsx("kbd", {
		ref,
		"data-slot": "kbd-group",
		"data-size": size,
		role: "group",
		"aria-label": label,
		className: cn(kbd_module_default.group, className),
		...props,
		children: steps.map((step, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [index > 0 && /* @__PURE__ */ jsx("span", {
			"aria-hidden": true,
			className: kbd_module_default.then,
			children: "then"
		}), step.map((key, i) => /* @__PURE__ */ jsx("kbd", {
			"aria-hidden": true,
			"data-slot": "kbd",
			"data-size": size,
			"data-glyph": [...key.glyph].length === 1 ? "single" : void 0,
			className: kbd_module_default.cap,
			children: /* @__PURE__ */ jsx(KeyGlyph, { glyph: key.glyph })
		}, `${key.name}-${i}`))] }, index))
	});
}
Kbd.displayName = "Kbd";
function KbdGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "kbd-group",
		className: cn(kbd_module_default.group, className),
		...props
	});
}
KbdGroup.displayName = "KbdGroup";
export { Kbd, KbdGroup, KeyGlyph, shortcutSteps };

//# sourceMappingURL=kbd.js.map