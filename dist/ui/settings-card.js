import { FrameScope } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Skeleton } from "./skeleton.js";
import { Spinner } from "./spinner.js";
import settings_card_module_default from "./settings-card.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/settings-card.tsx
function SettingsCard({ title, description, action, dirty = false, onSave, onDiscard, hint, locked, loading = false, saveLabel = "Save", saveDisabledReason, tone = "default", actions, flush = false, children, className, ref, ...props }) {
	const [saving, setSaving] = React.useState(false);
	const titleId = React.useId();
	const save = async () => {
		if (!onSave || !dirty || saving || locked || saveDisabledReason) return;
		setSaving(true);
		try {
			await onSave();
		} catch {} finally {
			setSaving(false);
		}
	};
	let status = hint;
	if (locked) status = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Icon, {
		name: "lock",
		size: 14
	}), locked] });
	else if (saving) status = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Spinner, {}), "Saving"] });
	else if (dirty) status = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		className: settings_card_module_default.dirtyMark,
		"aria-hidden": "true"
	}), "Unsaved changes"] });
	const header = /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.header,
		children: [/* @__PURE__ */ jsxs("div", {
			className: settings_card_module_default.copy,
			children: [/* @__PURE__ */ jsx("h3", {
				id: titleId,
				className: settings_card_module_default.title,
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: settings_card_module_default.description,
				children: description
			})]
		}), action && /* @__PURE__ */ jsx("div", {
			className: settings_card_module_default.action,
			children: action
		})]
	});
	const body = loading ? /* @__PURE__ */ jsx(Skeleton, {
		lines: 2,
		height: 32
	}) : children;
	const hasBody = loading || React.Children.toArray(children).length > 0;
	if (flush) return /* @__PURE__ */ jsxs("section", {
		ref,
		"data-slot": "settings-card",
		"data-tone": tone,
		"data-flush": "",
		"aria-labelledby": titleId,
		className: cn(settings_card_module_default.card, className),
		...props,
		children: [header, hasBody && /* @__PURE__ */ jsx(FrameScope, {
			framed: true,
			children: /* @__PURE__ */ jsx("div", {
				className: settings_card_module_default.flushContent,
				children: body
			})
		})]
	});
	return /* @__PURE__ */ jsx("section", {
		ref,
		"data-slot": "settings-card",
		"data-tone": tone,
		"aria-labelledby": titleId,
		className: cn(settings_card_module_default.card, className),
		...props,
		children: /* @__PURE__ */ jsxs("form", {
			noValidate: true,
			onSubmit: (event) => {
				event.preventDefault();
				save();
			},
			children: [
				header,
				hasBody && /* @__PURE__ */ jsx(FrameScope, {
					framed: true,
					children: /* @__PURE__ */ jsx("fieldset", {
						className: settings_card_module_default.content,
						disabled: Boolean(locked) || saving,
						children: body
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: settings_card_module_default.footer,
					children: [/* @__PURE__ */ jsx("p", {
						className: settings_card_module_default.status,
						role: "status",
						children: status
					}), !locked && /* @__PURE__ */ jsx("div", {
						className: settings_card_module_default.buttons,
						children: tone === "danger" ? actions : /* @__PURE__ */ jsxs(Fragment, { children: [dirty && onDiscard && !saving && /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: onDiscard,
							children: "Discard"
						}), onSave && /* @__PURE__ */ jsx(Button, {
							type: "submit",
							variant: "primary",
							size: "sm",
							disabled: !saveDisabledReason && (!dirty || loading),
							disabledReason: saveDisabledReason,
							loading: saving,
							children: saveLabel
						})] })
					})]
				})
			]
		})
	});
}
SettingsCard.displayName = "SettingsCard";
export { SettingsCard };

//# sourceMappingURL=settings-card.js.map