import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { fieldBoxFlags, fieldBoxWatch } from "./input.js";
import controls_module_default from "./controls.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/tags-input.tsx
var separators = /[,\n\r]/;
var noTags = [];
function TagsInput({ value, defaultValue = noTags, onChange, onValueChange, label, placeholder, disabled, invalid, mono, validate, onValidationChange, className, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	const [tags, setTags] = useControllableState({
		value,
		defaultValue,
		onChange: (next) => {
			onChange?.([...next]);
			onValueChange?.([...next]);
		}
	});
	const [draft, setDraft] = React.useState("");
	const input = React.useRef(null);
	React.useImperativeHandle(ref, () => input.current);
	const box = React.useRef(null);
	const boxRef = useDescendantFlags(fieldBoxFlags, fieldBoxWatch, box);
	const refocus = React.useRef(void 0);
	React.useLayoutEffect(() => {
		if (refocus.current === void 0) return;
		const target = refocus.current;
		refocus.current = void 0;
		(Array.from(box.current?.querySelectorAll("[data-slot=tags-input-remove]") ?? []).find((button) => button.dataset.value === target) ?? input.current)?.focus();
	});
	const commit = (text) => {
		const accepted = [];
		const refused = [];
		let reason;
		text.split(separators).map((part) => part.trim()).filter(Boolean).forEach((part) => {
			const existing = [...tags, ...accepted];
			if (existing.includes(part)) return;
			const refusal = validate?.(part, existing);
			if (refusal) {
				refused.push(part);
				reason = reason ?? refusal;
				return;
			}
			accepted.push(part);
		});
		if (accepted.length) setTags([...tags, ...accepted]);
		setDraft(refused.join(", "));
		onValidationChange?.(reason);
	};
	const remove = (tag) => {
		const index = tags.indexOf(tag);
		refocus.current = tags[index + 1] ?? tags[index - 1] ?? null;
		setTags(tags.filter((item) => item !== tag));
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: boxRef,
		"data-slot": "tags-input",
		"data-size": "sm",
		"data-field-box": "",
		className: cn(controls_module_default.field, picker_module_default.multiCombobox, className),
		onPointerDown: (event) => {
			if (event.target !== event.currentTarget) return;
			event.preventDefault();
			input.current?.focus();
		},
		children: [tags.map((tag) => /* @__PURE__ */ jsxs("span", {
			className: cn(picker_module_default.chip, mono && picker_module_default.mono),
			"data-locked": disabled || void 0,
			children: [/* @__PURE__ */ jsx("span", {
				title: tag,
				children: tag
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "icon-xs",
				"aria-label": `Remove ${tag}`,
				"data-slot": "tags-input-remove",
				"data-value": tag,
				disabled,
				onClick: () => remove(tag),
				onKeyDown: (event) => {
					if (event.key !== "Backspace" && event.key !== "Delete") return;
					event.preventDefault();
					remove(tag);
				},
				children: /* @__PURE__ */ jsx(Icon, {
					name: "x",
					size: 12
				})
			})]
		}, tag)), /* @__PURE__ */ jsx("input", {
			ref: input,
			type: "text",
			"data-slot": "tags-input-input",
			"data-field-control": "",
			className: cn(controls_module_default.bare, mono && picker_module_default.mono),
			...field,
			"aria-label": field["aria-labelledby"] ? void 0 : label,
			"aria-invalid": invalid || field["aria-invalid"] || void 0,
			placeholder: tags.length ? void 0 : placeholder,
			disabled,
			value: draft,
			onChange: (event) => {
				setDraft(event.target.value);
				if (!event.target.value.trim()) onValidationChange?.(void 0);
			},
			onBlur: () => {
				if (draft.trim()) commit(draft);
			},
			onKeyDown: (event) => {
				if (event.nativeEvent.isComposing || event.keyCode === 229) return;
				if (event.key === "Enter" || event.key === ",") {
					if (event.key === "Enter" && !draft.trim()) return;
					event.preventDefault();
					commit(draft);
					return;
				}
				if (event.key === "Backspace" && !draft && tags.length) {
					event.preventDefault();
					setTags(tags.slice(0, -1));
				}
			},
			onPaste: (event) => {
				const pasted = event.clipboardData.getData("text");
				if (!separators.test(pasted)) return;
				event.preventDefault();
				const { selectionStart, selectionEnd } = event.currentTarget;
				commit(`${draft.slice(0, selectionStart ?? draft.length)}${pasted}${draft.slice(selectionEnd ?? draft.length)}`);
			}
		})]
	});
}
TagsInput.displayName = "TagsInput";
export { TagsInput };

//# sourceMappingURL=tags-input.js.map