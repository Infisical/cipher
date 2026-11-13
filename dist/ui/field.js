"use client";
import { Button } from "./button.js";
import { Label } from "./label.js";
import { Separator } from "./separator.js";
import { Tooltip } from "./tooltip.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { FieldControlContext } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
// src/ui/field.tsx
var setFlags = { "data-has-choice-group": ":scope > :is([data-slot=\"checkbox-group\"], [data-slot=\"radio-group\"])" };
var childrenOnly = { subtree: false };
var fieldFlags = {
	"data-has-content": ":scope > [data-slot=\"field-content\"]",
	"data-has-disabled": ":disabled"
};
var fieldWatch = { attributes: ["disabled"] };
var labelFlags = {
	"data-has-checked": "[data-state=\"checked\"]",
	"data-has-field": ":scope > [data-slot=\"field\"]",
	"data-has-disabled": ":disabled, [data-disabled]",
	"data-has-focus-visible": ":focus-visible"
};
var labelWatch = {
	attributes: [
		"data-state",
		"disabled",
		"data-disabled"
	],
	focus: true
};
function FieldSet({ className, ref, ...props }) {
	const setRef = useDescendantFlags(setFlags, childrenOnly, ref);
	return /* @__PURE__ */ jsx("fieldset", {
		ref: setRef,
		"data-slot": "field-set",
		className: cn("flex flex-col gap-4 data-[has-choice-group]:gap-3", className),
		...props
	});
}
FieldSet.displayName = "FieldSet";
function FieldLegend({ className, variant = "legend", ref, ...props }) {
	return /* @__PURE__ */ jsx("legend", {
		ref,
		"data-slot": "field-legend",
		"data-variant": variant,
		className: cn(helpers_module_default.fieldLegend, className),
		...props
	});
}
FieldLegend.displayName = "FieldLegend";
function FieldGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "field-group",
		className: cn(helpers_module_default.fieldGroup, "group/field-group @container/field-group flex w-full flex-col data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4", className),
		...props
	});
}
FieldGroup.displayName = "FieldGroup";
var fieldVariants = cva("group/field flex w-full", {
	variants: { orientation: {
		vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
		horizontal: "flex-row items-center data-[has-content]:items-start *:data-[slot=field-label]:flex-auto data-[has-content]:[&>[role=checkbox],[role=radio]]:mt-px",
		responsive: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:data-[has-content]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:data-[has-content]:[&>[role=checkbox],[role=radio]]:mt-px"
	} },
	defaultVariants: { orientation: "vertical" }
});
function Field({ className, orientation = "vertical", label, description, error, optional = false, help, group = false, wide = false, children, id, ref, ...props }) {
	const generated = React.useId();
	const child = React.isValidElement(children) ? children : null;
	const controlId = child?.props.id ?? id ?? generated;
	const noteId = `${controlId}-note`;
	const fieldRef = useDescendantFlags(fieldFlags, fieldWatch, ref);
	const labelId = `${controlId}-label`;
	const hasNote = Boolean(error) || description != null && description !== false && description !== "";
	const attributes = {
		id: group ? void 0 : controlId,
		"aria-describedby": hasNote ? noteId : void 0,
		"aria-invalid": Boolean(error) || void 0,
		"aria-labelledby": group ? void 0 : labelId
	};
	const control = child && typeof child.type === "string" ? React.cloneElement(child, { ...attributes }) : children;
	const note = hasNote && /* @__PURE__ */ jsxs("p", {
		id: noteId,
		role: error ? "alert" : void 0,
		className: error ? helpers_module_default.fieldError : helpers_module_default.fieldDescription,
		children: [error && /* @__PURE__ */ jsx(Icon, {
			name: "alert",
			size: 14
		}), error ? /* @__PURE__ */ jsx("span", { children: error }) : description]
	});
	return /* @__PURE__ */ jsx(FieldControlContext, {
		value: label ? attributes : {},
		children: /* @__PURE__ */ jsx("div", {
			ref: fieldRef,
			role: label ? void 0 : "group",
			"data-slot": "field",
			"data-orientation": orientation,
			"data-width": wide ? "wide" : void 0,
			"data-invalid": Boolean(error) || void 0,
			className: cn(fieldVariants({ orientation }), helpers_module_default.field, className),
			...props,
			children: label ? group ? /* @__PURE__ */ jsxs("fieldset", {
				className: helpers_module_default.fieldset,
				children: [
					/* @__PURE__ */ jsxs("legend", {
						id: labelId,
						children: [label, optional && " (optional)"]
					}),
					/* @__PURE__ */ jsx("div", {
						className: helpers_module_default.fieldControl,
						children: control
					}),
					note
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: helpers_module_default.fieldLabels,
				children: /* @__PURE__ */ jsxs("div", {
					className: helpers_module_default.fieldLabelRow,
					children: [/* @__PURE__ */ jsxs(FieldLabel, {
						id: labelId,
						htmlFor: controlId,
						children: [label, optional && " (optional)"]
					}), typeof help === "string" ? /* @__PURE__ */ jsx(FieldHelp, { children: help }) : help]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: helpers_module_default.fieldControl,
				children: [control, note]
			})] }) : children
		})
	});
}
Field.displayName = "Field";
function FieldContent({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "field-content",
		className: cn("group/field-content flex flex-1 flex-col gap-1", className),
		...props
	});
}
FieldContent.displayName = "FieldContent";
function FieldLabel({ className, ref, ...props }) {
	const labelRef = useDescendantFlags(labelFlags, labelWatch, ref);
	return /* @__PURE__ */ jsx(Label, {
		ref: labelRef,
		"data-slot": "field-label",
		className: cn("group/field-label peer/field-label flex w-fit gap-2 border-[color:var(--v4-line-soft)] group-data-[disabled=true]/field:opacity-50 data-[has-checked]:border-[color:var(--v4-choice-selected-border)] data-[has-checked]:bg-[color:var(--v4-choice-selected-surface)] data-[has-field]:rounded-lg data-[has-field]:border data-[has-field]:not-data-[has-disabled]:hover:bg-[color:var(--v4-hover)] data-[has-field]:data-[has-focus-visible]:border-ring data-[has-field]:data-[has-focus-visible]:ring-2 data-[has-field]:data-[has-focus-visible]:ring-[color:var(--v4-focus-ring)] *:data-[slot=field]:p-2.5", "data-[has-field]:w-full data-[has-field]:flex-col", className),
		...props
	});
}
FieldLabel.displayName = "FieldLabel";
function FieldHelp({ label = "More information", children }) {
	return /* @__PURE__ */ jsx(Tooltip, {
		content: children,
		children: /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-xs",
			"aria-label": label,
			"data-slot": "field-help",
			className: helpers_module_default.fieldHelp,
			children: /* @__PURE__ */ jsx(Icon, { name: "info" })
		})
	});
}
FieldHelp.displayName = "FieldHelp";
function FieldTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "field-label",
		className: cn(helpers_module_default.fieldTitle, "flex w-fit items-center gap-2 group-data-[disabled=true]/field:opacity-50", className),
		...props
	});
}
FieldTitle.displayName = "FieldTitle";
function FieldDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "field-description",
		className: cn(helpers_module_default.fieldDescription, "text-muted-foreground text-left group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5", "last:mt-0 nth-last-2:-mt-1", className),
		...props
	});
}
FieldDescription.displayName = "FieldDescription";
function FieldSeparator({ children, className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "field-separator",
		"data-content": !!children,
		className: cn("relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2", className),
		...props,
		children: [/* @__PURE__ */ jsx(Separator, { className: "absolute inset-0 top-1/2" }), children && /* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground relative mx-auto block w-fit bg-background px-2",
			"data-slot": "field-separator-content",
			children
		})]
	});
}
FieldSeparator.displayName = "FieldSeparator";
function FieldError({ className, children, errors, ref, ...props }) {
	const content = useMemo(() => {
		if (children) return children;
		const messages = [...new Set((errors ?? []).map((error) => error?.message).filter(Boolean))];
		if (messages.length < 2) return messages[0] ?? null;
		return /* @__PURE__ */ jsx("span", {
			className: helpers_module_default.fieldErrorLines,
			children: messages.map((message) => /* @__PURE__ */ jsx("span", { children: message }, message))
		});
	}, [children, errors]);
	if (!content) return null;
	return /* @__PURE__ */ jsxs("div", {
		ref,
		role: "alert",
		"data-slot": "field-error",
		className: cn(helpers_module_default.fieldError, className),
		...props,
		children: [/* @__PURE__ */ jsx(Icon, {
			name: "alert",
			size: 14
		}), /* @__PURE__ */ jsx("span", { children: content })]
	});
}
FieldError.displayName = "FieldError";
export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldHelp, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle };

//# sourceMappingURL=field.js.map