import { FrameScope } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { EmptyScope } from "./empty.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Skeleton } from "./skeleton.js";
import { toast } from "./sonner.js";
import { Spinner } from "./spinner.js";
import settings_card_module_default from "./settings-card.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/settings-card.tsx
var SAVED_VISIBLE_MS = 2e3;
/**
* Saves one setting as soon as it changes, for cards without a Save button. The value updates at once, goes back
* to the stored one if onSave throws, and an error toast says what failed. Toggles and selects call save(next);
* a text field calls edit(next) as the user types, save() on blur or Enter and reset() on Escape.
*/
function useAutosave({ value, onSave, errorMessage }) {
	const [draft, setDraft] = React.useState(value);
	const [stored, setStored] = React.useState(value);
	const [status, setStatus] = React.useState("idle");
	if (!Object.is(value, stored)) {
		setStored(value);
		setDraft(value);
	}
	React.useEffect(() => {
		if (status !== "saved") return void 0;
		const timer = window.setTimeout(() => setStatus("idle"), SAVED_VISIBLE_MS);
		return () => window.clearTimeout(timer);
	}, [status]);
	const pending = status === "saving";
	const save = async (next = draft) => {
		if (pending) return;
		setDraft(next);
		if (Object.is(next, stored)) return;
		setStatus("saving");
		try {
			await onSave(next);
			setStatus("saved");
		} catch {
			setDraft(stored);
			setStatus("idle");
			toast.error(errorMessage);
		}
	};
	return {
		value: draft,
		edit: setDraft,
		save,
		reset: () => setDraft(stored),
		status,
		pending
	};
}
function SaveStatus({ status }) {
	return /* @__PURE__ */ jsx("span", {
		className: settings_card_module_default.saveStatus,
		"data-state": status,
		role: "status",
		children: status !== "idle" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
			className: settings_card_module_default.mark,
			"aria-hidden": "true"
		}), status === "saving" ? "Saving" : "Saved"] })
	});
}
function FooterStatus({ hint, locked, saving, dirty }) {
	if (locked) return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Icon, {
		name: "lock",
		size: 14
	}), locked] });
	if (saving) return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Spinner, {}), "Saving"] });
	if (dirty) return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		className: cn(settings_card_module_default.mark, settings_card_module_default.dirtyMark),
		"aria-hidden": "true"
	}), "Unsaved changes"] });
	return hint;
}
function Footer({ hint, locked, saving, dirty, loading, tone, actions, onSave, onDiscard, saveLabel, saveDisabledReason }) {
	return /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.footer,
		children: [/* @__PURE__ */ jsx("p", {
			className: settings_card_module_default.status,
			role: "status",
			children: /* @__PURE__ */ jsx(FooterStatus, {
				hint,
				locked,
				saving,
				dirty
			})
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
	});
}
function hasFooterContent({ hint, locked, dirty, saving, tone, actions, onSave, onDiscard }) {
	if (tone === "danger") return Boolean(hint || locked || actions);
	return Boolean(hint || locked || dirty || saving || onSave || dirty && onDiscard);
}
function SettingsCard({ title, description, action, dirty = false, onSave, onDiscard, hint, locked, loading = false, saveLabel = "Save", saveDisabledReason, tone = "default", actions, flush = false, saveStatus, children, className, ref, ...props }) {
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
	const hasFooter = hasFooterContent({
		hint,
		locked,
		dirty,
		saving,
		tone,
		actions,
		onSave,
		onDiscard
	});
	const header = /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.header,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: settings_card_module_default.titleRow,
				children: [/* @__PURE__ */ jsx("h3", {
					id: titleId,
					className: settings_card_module_default.title,
					children: title
				}), saveStatus && /* @__PURE__ */ jsx(SaveStatus, { status: saveStatus })]
			}),
			action && /* @__PURE__ */ jsx("div", {
				className: settings_card_module_default.action,
				children: action
			}),
			description && /* @__PURE__ */ jsx("p", {
				className: settings_card_module_default.description,
				children: description
			})
		]
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
			children: /* @__PURE__ */ jsx(EmptyScope, {
				size: "sm",
				fill: true,
				children: /* @__PURE__ */ jsx("div", {
					className: settings_card_module_default.flushContent,
					children: body
				})
			})
		})]
	});
	return /* @__PURE__ */ jsx("section", {
		ref,
		"data-slot": "settings-card",
		"data-tone": tone,
		"data-footer": hasFooter ? "" : void 0,
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
					children: /* @__PURE__ */ jsx(EmptyScope, {
						size: "sm",
						fill: false,
						children: /* @__PURE__ */ jsx("fieldset", {
							className: settings_card_module_default.content,
							disabled: Boolean(locked) || saving,
							children: body
						})
					})
				}),
				hasFooter && /* @__PURE__ */ jsx(Footer, {
					hint,
					locked,
					saving,
					dirty,
					loading,
					tone,
					actions,
					onSave,
					onDiscard,
					saveLabel,
					saveDisabledReason
				})
			]
		})
	});
}
SettingsCard.displayName = "SettingsCard";
export { SettingsCard, useAutosave };

//# sourceMappingURL=settings-card.js.map