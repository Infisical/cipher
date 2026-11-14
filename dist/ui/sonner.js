"use client";
import { useScheme, useToastLayer } from "../scope.js";
import { Icon } from "./icon.js";
import { Spinner } from "./spinner.js";
import sonner_module_default from "./sonner.module.js";
import { ToastStack } from "./toast-stack.js";
import * as React from "react";
import { createPortal } from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Toaster as Toaster$1, toast as toast$1, useSonner } from "sonner";
// src/ui/sonner.tsx
var TOASTER_ID = "cipher";
var routed = (data) => ({
	...data,
	toasterId: data?.toasterId ?? "cipher"
});
var toast = Object.assign((message, data) => toast$1(message, routed(data)), {
	success: (message, data) => toast$1.success(message, routed(data)),
	error: (message, data) => toast$1.error(message, routed({
		duration: Infinity,
		...data
	})),
	info: (message, data) => toast$1.info(message, routed(data)),
	warning: (message, data) => toast$1.warning(message, routed(data)),
	loading: (message, data) => toast$1.loading(message, routed(data)),
	message: (message, data) => toast$1.message(message, routed(data)),
	promise: (promise, data) => toast$1.promise(promise, {
		...data,
		toasterId: data?.toasterId ?? "cipher"
	}),
	custom: (jsx, data) => toast$1.custom(jsx, routed(data)),
	dismiss: (id) => {
		if (id !== void 0) return toast$1.dismiss(id);
		toast$1.getToasts().filter((item) => "toasterId" in item && item.toasterId === "cipher").forEach((item) => toast$1.dismiss(item.id));
	}
});
var mountedToasters = /* @__PURE__ */ new Map();
var toasterListeners = /* @__PURE__ */ new Set();
var subscribeToasters = (listener) => {
	toasterListeners.add(listener);
	return () => {
		toasterListeners.delete(listener);
	};
};
var updateToasters = (id, change) => {
	mountedToasters.set(id, change(mountedToasters.get(id) ?? []));
	toasterListeners.forEach((listener) => listener());
};
var useOwnsToaster = (id) => {
	const [token] = React.useState(() => ({}));
	React.useLayoutEffect(() => {
		updateToasters(id, (tokens) => [...tokens, token]);
		return () => updateToasters(id, (tokens) => tokens.filter((item) => item !== token));
	}, [id, token]);
	return React.useSyncExternalStore(subscribeToasters, () => mountedToasters.get(id)?.[0] === token, () => false);
};
var announcementKey = (item) => `${item.id}:${item.type ?? "default"}:${spoken(item.title)}`;
var spoken = (value) => {
	if (typeof value === "string" || typeof value === "number") return String(value);
	if (!React.isValidElement(value)) return "";
	if (value.type !== React.Fragment && typeof value.type !== "string") return "";
	return React.Children.toArray(value.props.children).map(spoken).filter(Boolean).join(" ");
};
var announce = (fresh) => fresh.length ? {
	key: fresh.map(announcementKey).join("|"),
	text: fresh.map((item) => [spoken(item.title), spoken(item.description)].filter(Boolean).join(" ")).join(" ")
} : null;
var ToastAnnouncer = ({ toasterId }) => {
	const keys = useSonner().toasts.filter((item) => (item.toasterId ?? void 0) === toasterId).map((item) => ({
		item,
		key: announcementKey(item)
	}));
	const joined = keys.map(({ key }) => key).join("\n");
	const [previous, setPrevious] = React.useState(joined);
	const [polite, setPolite] = React.useState(null);
	const [assertive, setAssertive] = React.useState(null);
	if (previous !== joined) {
		setPrevious(joined);
		const known = new Set(previous.split("\n"));
		const fresh = keys.filter(({ key }) => !known.has(key)).map(({ item }) => item);
		const errors = announce(fresh.filter((item) => item.type === "error"));
		const others = announce(fresh.filter((item) => item.type !== "error"));
		if (errors) setAssertive(errors);
		if (others) setPolite(others);
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		role: "status",
		className: "sr-only",
		"data-slot": "toast-live-polite",
		children: polite && /* @__PURE__ */ jsx("p", { children: polite.text }, polite.key)
	}), /* @__PURE__ */ jsx("div", {
		role: "alert",
		className: "sr-only",
		"data-slot": "toast-live-assertive",
		children: assertive && /* @__PURE__ */ jsx("p", { children: assertive.text }, assertive.key)
	})] });
};
var Toaster = ({ ...props }) => {
	const resolvedTheme = useScheme();
	const layer = useToastLayer();
	if (!useOwnsToaster(props.id ?? "cipher")) return null;
	const toasterId = props.id ?? "cipher";
	const toaster = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ToastAnnouncer, { toasterId }), /* @__PURE__ */ jsx(Toaster$1, {
		ref: (node) => node?.setAttribute("aria-live", "off"),
		theme: props.theme ?? resolvedTheme ?? "system",
		className: sonner_module_default.toaster,
		expand: true,
		closeButton: true,
		gap: 8,
		icons: {
			success: /* @__PURE__ */ jsx(Icon, {
				name: "check-c",
				className: "size-4"
			}),
			info: /* @__PURE__ */ jsx(Icon, {
				name: "info",
				className: "size-4"
			}),
			warning: /* @__PURE__ */ jsx(Icon, {
				name: "alert",
				className: "size-4"
			}),
			error: /* @__PURE__ */ jsx(Icon, {
				name: "alert-c",
				className: "size-4"
			}),
			loading: /* @__PURE__ */ jsx(Spinner, {}),
			close: /* @__PURE__ */ jsx(Icon, { name: "x" })
		},
		style: { "--width": "min(var(--cipher-size-toast), calc(100vw - 2 * var(--cipher-space-16)))" },
		toastOptions: {
			unstyled: true,
			closeButtonAriaLabel: "Dismiss notification",
			classNames: {
				toast: sonner_module_default.toast,
				icon: sonner_module_default.icon,
				content: sonner_module_default.content,
				title: sonner_module_default.title,
				description: sonner_module_default.description,
				actionButton: sonner_module_default.action,
				closeButton: sonner_module_default.close
			}
		},
		...props,
		id: toasterId
	})] });
	return layer ? createPortal(toaster, layer) : toaster;
};
export { TOASTER_ID, ToastStack, Toaster, toast };

//# sourceMappingURL=sonner.js.map