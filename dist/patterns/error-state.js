import { isDev } from "../lib/dev.js";
import { CipherLink } from "../lib/link.js";
import { Button } from "../ui/button.js";
import { CodeBlock } from "../ui/code-block.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.js";
import { Icon } from "../ui/icon.js";
import { CopyButton } from "../ui/sensitive-editor.js";
import { Heading, Text } from "../ui/text.js";
import { useAppShell } from "../ui/top-bar.js";
import error_state_module_default from "./error-state.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/patterns/error-state.tsx
var presets = {
	"not-found": {
		title: "Page not found",
		description: "The link may be broken, or the page was moved or removed."
	},
	forbidden: {
		title: "You don't have access",
		description: "Your role doesn't include access to this page. An admin can grant it."
	},
	crash: {
		title: "Something went wrong",
		description: "This page hit an error. Reload to try again."
	}
};
var markCells = 12;
var markTarget = 6;
function ErrorState({ preset, layout = "auto", description, error, details = [], showStack = isDev, homeHref = "/", onHome, homeLabel = "Go to organization home", homeLink, onBack = () => window.history.back(), onReload = () => window.location.reload(), onReport, actions, actionLabel, actionLink, onAction }) {
	const shell = useAppShell();
	const fullPage = layout === "full-page" || layout === "auto" && !shell;
	const crash = preset === "crash";
	const report = React.useEffectEvent((reported) => onReport?.(reported));
	React.useEffect(() => {
		if (crash && error !== void 0) report(error);
	}, [crash, error]);
	const name = error instanceof Error ? error.name : "Error";
	let message = "";
	if (error instanceof Error) message = error.message;
	else if (error !== void 0 && error !== null) message = String(error);
	const stack = showStack && error instanceof Error ? error.stack : void 0;
	const reportText = [
		`error: ${name}`,
		message && `message: ${message}`,
		...details.map((detail) => `${detail.label}: ${detail.value}`),
		stack && `\n${stack}`
	].filter(Boolean).join("\n");
	const label = actionLabel ?? (crash ? "Reload" : homeLabel);
	const home = (variant, text) => /* @__PURE__ */ jsx(Button, {
		variant,
		asChild: true,
		children: homeLink !== void 0 ? /* @__PURE__ */ jsx(CipherLink, {
			link: homeLink,
			children: text
		}) : /* @__PURE__ */ jsx("a", {
			href: homeHref,
			onClick: onHome,
			children: text
		})
	});
	let primary;
	if (actionLink !== void 0) primary = /* @__PURE__ */ jsx(Button, {
		variant: "accent",
		asChild: true,
		children: /* @__PURE__ */ jsx(CipherLink, {
			link: actionLink,
			children: label
		})
	});
	else if (onAction || crash) primary = /* @__PURE__ */ jsx(Button, {
		variant: "accent",
		onClick: onAction ?? onReload,
		children: label
	});
	else primary = home("accent", label);
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "error-state",
		"data-preset": preset,
		"data-layout": fullPage ? "full-page" : "in-shell",
		className: error_state_module_default.root,
		children: /* @__PURE__ */ jsxs("div", {
			className: error_state_module_default.body,
			children: [
				/* @__PURE__ */ jsx("div", {
					className: error_state_module_default.mark,
					"aria-hidden": "true",
					children: Array.from({ length: markCells }, (_, index) => /* @__PURE__ */ jsx("span", { "data-target": index === markTarget || void 0 }, index))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: error_state_module_default.copy,
					children: [/* @__PURE__ */ jsx(Heading, {
						level: 1,
						size: "section",
						children: presets[preset].title
					}), /* @__PURE__ */ jsx(Text, {
						muted: true,
						children: description ?? presets[preset].description
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: error_state_module_default.actions,
					children: crash ? /* @__PURE__ */ jsxs(Fragment, { children: [
						primary,
						actions,
						home("outline", homeLabel)
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
						primary,
						actions,
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: onBack,
							children: "Go back"
						})
					] })
				}),
				crash && /* @__PURE__ */ jsxs(Collapsible, {
					className: error_state_module_default.details,
					children: [/* @__PURE__ */ jsx(CollapsibleTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: error_state_module_default.detailsTrigger,
							children: [/* @__PURE__ */ jsx(Icon, {
								name: "chev-right",
								"data-chevron": ""
							}), "Error details"]
						})
					}), /* @__PURE__ */ jsxs(CollapsibleContent, {
						className: error_state_module_default.detailsPanel,
						children: [/* @__PURE__ */ jsx(CodeBlock, {
							code: reportText,
							copyable: false
						}), /* @__PURE__ */ jsx("span", {
							className: error_state_module_default.detailsCopy,
							children: /* @__PURE__ */ jsx(CopyButton, {
								value: reportText,
								label: "Copy details",
								iconOnly: true
							})
						})]
					})]
				})
			]
		})
	});
}
ErrorState.displayName = "ErrorState";
export { ErrorState };

//# sourceMappingURL=error-state.js.map