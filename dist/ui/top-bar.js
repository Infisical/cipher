import { usePresenceCount, useReportPresence } from "../lib/presence-count.js";
import { themes } from "../lib/theme-registry.js";
import { cn } from "../lib/utils.js";
import { useActionBarReport } from "../scope.js";
import { Count } from "./badge.js";
import { BandDivider, Breadcrumb } from "./breadcrumb.js";
import { Button } from "./button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Icon } from "./icon.js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet.js";
import { Toaster } from "./sonner.js";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";
import { Tooltip, TooltipProvider } from "./tooltip.js";
import top_bar_module_default from "./top-bar.module.js";
import * as React from "react";
import { createPortal } from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/top-bar.tsx
var ShellContext = React.createContext(null);
var useAppShell = () => React.useContext(ShellContext);
var ShellChromeContext = React.createContext(null);
/** A TopBar or inline Sidebar tells its AppShell it is there, which sets the inset's margins. */
var useShellChrome = () => React.useContext(ShellChromeContext);
var InsetReserveContext = React.createContext(null);
/** Pads AppInset by the floating action bar's height, and lifts the scope's toasts above it, while active holds. */
var useActionBarReserve = (active) => {
	useReportPresence(React.useContext(InsetReserveContext), active);
	useReportPresence(useActionBarReport(), active);
};
var sizeOf = (element, token) => parseFloat(getComputedStyle(element).getPropertyValue(token)) || 0;
var shellSelector = "[data-slot=\"app-shell\"]";
var typingSelector = "input, textarea, select, [contenteditable]:not([contenteditable=\"false\"]), [role=\"textbox\"], .cm-editor, .monaco-editor";
var lastPointerTarget = null;
var rememberPointer = (event) => {
	lastPointerTarget = event.target instanceof Element ? event.target : null;
};
var pointerWatchers = 0;
var watchPointer = () => {
	pointerWatchers += 1;
	if (pointerWatchers === 1) document.addEventListener("pointerdown", rememberPointer, true);
	return () => {
		pointerWatchers -= 1;
		if (pointerWatchers === 0) document.removeEventListener("pointerdown", rememberPointer, true);
	};
};
var isNavigationShortcut = (event) => {
	return (/Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "b";
};
var ownsShortcut = (shell, event) => {
	const focused = event.target instanceof Element ? event.target : null;
	const target = !focused || focused === document.body || lastPointerTarget && focused.contains(lastPointerTarget) ? lastPointerTarget : focused;
	if (target?.closest(`${typingSelector}, [role="dialog"]`)) return false;
	const owner = target?.isConnected ? target.closest(shellSelector) : null;
	if (owner) return owner === shell;
	return document.querySelector(shellSelector) === shell;
};
function AppShell({ className, grain = false, ref, ...props }) {
	const own = React.useRef(null);
	const [mode, setMode] = React.useState("wide");
	const [hasNavigation, setHasNavigation] = React.useState(false);
	const [navigationOpen, setNavigationOpen] = React.useState(false);
	const [navigationUnread, setNavigationUnread] = React.useState(false);
	const [slots, setSlots] = React.useState({});
	const setSlot = React.useCallback((slot, node) => setSlots((previous) => previous[slot] === node ? previous : {
		...previous,
		[slot]: node
	}), []);
	const navigationTrigger = React.useRef(null);
	const navigationToggle = React.useRef(null);
	const toggleNavigation = React.useCallback(() => navigationToggle.current?.(), []);
	const [hasTopBar, reportTopBar] = usePresenceCount();
	const [hasSidebar, reportSidebar] = usePresenceCount();
	const [sidebarOpen, reportSidebarOpen] = usePresenceCount();
	const chrome = React.useMemo(() => ({
		topBar: reportTopBar,
		sidebar: reportSidebar,
		sidebarOpen: reportSidebarOpen
	}), [
		reportTopBar,
		reportSidebar,
		reportSidebarOpen
	]);
	const sheetOpen = React.useRef(false);
	React.useEffect(() => {
		sheetOpen.current = navigationOpen;
	}, [navigationOpen]);
	React.useImperativeHandle(ref, () => own.current);
	React.useLayoutEffect(() => {
		const element = own.current;
		if (!element) return void 0;
		const measure = () => {
			const width = element.offsetWidth;
			let next = "wide";
			if (width < sizeOf(element, "--cipher-size-shell-collapse")) next = "narrow";
			else if (width < sizeOf(element, "--cipher-size-shell-rail")) next = "rail";
			setMode(next);
			if (next === "wide") setNavigationOpen(false);
		};
		measure();
		if (typeof ResizeObserver === "undefined") return void 0;
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	React.useEffect(() => {
		const element = own.current;
		if (!element) return void 0;
		const listener = (event) => {
			if (event.defaultPrevented || event.isComposing || event.repeat) return;
			if (!isNavigationShortcut(event) || !navigationToggle.current) return;
			if (!sheetOpen.current && !ownsShortcut(element, event)) return;
			event.preventDefault();
			navigationToggle.current();
		};
		const unwatch = watchPointer();
		document.addEventListener("keydown", listener);
		return () => {
			unwatch();
			document.removeEventListener("keydown", listener);
		};
	}, []);
	const value = React.useMemo(() => ({
		mode,
		narrow: mode === "narrow",
		hasNavigation,
		setHasNavigation,
		navigationOpen,
		setNavigationOpen,
		navigationTrigger,
		navigationToggle,
		toggleNavigation,
		navigationUnread,
		setNavigationUnread,
		slots,
		setSlot
	}), [
		mode,
		hasNavigation,
		navigationOpen,
		toggleNavigation,
		navigationUnread,
		slots,
		setSlot
	]);
	return /* @__PURE__ */ jsxs(ShellContext, {
		value,
		children: [/* @__PURE__ */ jsx(ShellChromeContext, {
			value: chrome,
			children: /* @__PURE__ */ jsx("div", {
				ref: own,
				"data-slot": "app-shell",
				"data-mode": mode,
				"data-narrow": mode === "narrow" || void 0,
				"data-has-top-bar": hasTopBar || void 0,
				"data-has-sidebar": hasSidebar || void 0,
				"data-sidebar-open": sidebarOpen || void 0,
				"data-grain": grain || void 0,
				className: cn(top_bar_module_default.shell, className),
				...props
			})
		}), /* @__PURE__ */ jsx(Toaster, {})]
	});
}
AppShell.displayName = "AppShell";
function AppInset({ className, ref, ...props }) {
	const [reserve, reportReserve] = usePresenceCount();
	return /* @__PURE__ */ jsx(InsetReserveContext, {
		value: reportReserve,
		children: /* @__PURE__ */ jsx("main", {
			ref,
			"data-slot": "app-inset",
			"data-action-bar-reserve": reserve || void 0,
			className: cn(top_bar_module_default.inset, className),
			...props
		})
	});
}
AppInset.displayName = "AppInset";
var scrollInsetTo = (target) => {
	const inset = target.closest("[data-slot=\"app-inset\"]");
	if (!inset) {
		target.scrollIntoView({ block: "start" });
		return;
	}
	const offset = parseFloat(getComputedStyle(inset).scrollPaddingTop) || 0;
	inset.scrollTo({ top: inset.scrollTop + target.getBoundingClientRect().top - inset.getBoundingClientRect().top - offset });
};
function PageGutter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "page-gutter",
		className: cn(top_bar_module_default.gutter, className),
		...props
	});
}
PageGutter.displayName = "PageGutter";
var glyph = (icon, size) => /* @__PURE__ */ jsx(Icon, {
	icon,
	size
}, "icon");
var itemContent = (item) => [
	item.icon && glyph(item.icon),
	item.label,
	item.external && /* @__PURE__ */ jsx(Icon, {
		name: "external",
		size: 14,
		className: top_bar_module_default.menuEnd
	}, "external")
];
var ShellMenuItems = ({ entries }) => entries.map((entry, index) => "type" in entry ? /* @__PURE__ */ jsx(DropdownMenuSeparator, {}, index) : /* @__PURE__ */ jsx(DropdownMenuItem, {
	disabled: entry.disabled,
	description: entry.disabled ? entry.disabledReason : void 0,
	onSelect: entry.onSelect,
	asChild: Boolean(entry.href) && !entry.disabled,
	children: entry.href && !entry.disabled ? /* @__PURE__ */ jsx("a", {
		href: entry.href,
		target: entry.external ? "_blank" : void 0,
		rel: entry.external ? "noreferrer" : void 0,
		children: itemContent(entry)
	}) : itemContent(entry)
}, index));
var ShellSheetRows = ({ entries, onDone }) => entries.map((entry, index) => {
	if ("type" in entry) return /* @__PURE__ */ jsx("span", {
		role: "separator",
		className: top_bar_module_default.sheetRule
	}, index);
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [
		entry.icon && glyph(entry.icon, 18),
		/* @__PURE__ */ jsxs("span", {
			className: top_bar_module_default.sheetRowText,
			children: [entry.label, entry.disabled && entry.disabledReason && /* @__PURE__ */ jsx("span", {
				className: top_bar_module_default.sheetRowMeta,
				children: entry.disabledReason
			})]
		}),
		entry.external && /* @__PURE__ */ jsx(Icon, {
			name: "external",
			size: 14,
			className: top_bar_module_default.menuEnd
		})
	] });
	if (entry.href && !entry.disabled) return /* @__PURE__ */ jsx("a", {
		className: top_bar_module_default.sheetRow,
		href: entry.href,
		target: entry.external ? "_blank" : void 0,
		rel: entry.external ? "noreferrer" : void 0,
		onClick: () => {
			entry.onSelect?.();
			onDone();
		},
		children: content
	}, index);
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		className: top_bar_module_default.sheetRow,
		disabled: entry.disabled,
		onClick: () => {
			entry.onSelect?.();
			onDone();
		},
		children: content
	}, index);
});
var ShellBottomSheet = ({ title, open, onOpenChange, children }) => /* @__PURE__ */ jsx(Sheet, {
	open,
	onOpenChange,
	children: /* @__PURE__ */ jsxs(SheetContent, {
		side: "bottom",
		"aria-describedby": void 0,
		className: top_bar_module_default.bottomSheet,
		children: [/* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: title }) }), /* @__PURE__ */ jsx("div", {
			className: top_bar_module_default.sheetRows,
			children
		})]
	})
});
var themeOptions = [{
	value: "system",
	label: "System"
}, ...themes.map((theme) => ({
	value: theme.id,
	label: theme.name
}))];
var Identity = ({ account }) => /* @__PURE__ */ jsxs("div", {
	className: top_bar_module_default.identity,
	children: [/* @__PURE__ */ jsx("span", {
		className: top_bar_module_default.identityName,
		children: account.name
	}), account.email && /* @__PURE__ */ jsx("span", {
		className: top_bar_module_default.identityMeta,
		children: account.email
	})]
});
var AccountMenu = ({ account }) => {
	const items = account.items ?? [];
	const endItems = account.endItems ?? [];
	return /* @__PURE__ */ jsxs(DropdownMenu, {
		modal: false,
		children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				icon: "user",
				layout: "trigger",
				"aria-label": `${account.label ?? "Account"}, ${account.name}`,
				children: account.name
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			className: top_bar_module_default.accountMenu,
			children: [
				/* @__PURE__ */ jsx(Identity, { account }),
				/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				/* @__PURE__ */ jsx(ShellMenuItems, { entries: items }),
				account.theme && /* @__PURE__ */ jsxs(Fragment, { children: [
					items.length > 0 && /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
					/* @__PURE__ */ jsx(DropdownMenuLabel, { children: account.theme.label ?? "Theme" }),
					/* @__PURE__ */ jsx(DropdownMenuRadioGroup, {
						value: account.theme.value,
						onValueChange: (value) => account.theme?.onChange(value),
						children: themeOptions.map((option) => /* @__PURE__ */ jsx(DropdownMenuRadioItem, {
							value: option.value,
							children: option.label
						}, option.value))
					})
				] }),
				endItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsx(ShellMenuItems, { entries: endItems })] })
			]
		})]
	});
};
var AccountSheet = ({ account, open, onOpenChange }) => {
	const close = () => onOpenChange(false);
	const items = account.items ?? [];
	const endItems = account.endItems ?? [];
	return /* @__PURE__ */ jsxs(ShellBottomSheet, {
		title: account.label ?? "Account",
		open,
		onOpenChange,
		children: [
			/* @__PURE__ */ jsx(Identity, { account }),
			/* @__PURE__ */ jsx("span", {
				role: "separator",
				className: top_bar_module_default.sheetRule
			}),
			/* @__PURE__ */ jsx(ShellSheetRows, {
				entries: items,
				onDone: close
			}),
			account.theme && /* @__PURE__ */ jsxs(Fragment, { children: [items.length > 0 && /* @__PURE__ */ jsx("span", {
				role: "separator",
				className: top_bar_module_default.sheetRule
			}), /* @__PURE__ */ jsxs("div", {
				className: top_bar_module_default.sheetTheme,
				children: [/* @__PURE__ */ jsx("span", {
					className: top_bar_module_default.sheetEyebrow,
					children: account.theme.label ?? "Theme"
				}), /* @__PURE__ */ jsx(ToggleGroup, {
					type: "single",
					"aria-label": account.theme.label ?? "Theme",
					value: account.theme.value,
					onValueChange: (value) => {
						if (value) account.theme?.onChange(value);
					},
					width: "full",
					className: top_bar_module_default.sheetThemeChoice,
					children: themeOptions.map((option) => /* @__PURE__ */ jsx(ToggleGroupItem, {
						value: option.value,
						children: option.label
					}, option.value))
				})]
			})] }),
			endItems.length > 0 && /* @__PURE__ */ jsx(ShellSheetRows, {
				entries: [{ type: "separator" }, ...endItems],
				onDone: close
			})
		]
	});
};
var plainCrumb = (crumb) => ({
	label: crumb.label,
	mono: crumb.mono,
	link: crumb.link,
	href: crumb.href,
	onNavigate: crumb.onNavigate
});
function TopBar({ breadcrumb, search, notifications, account, actions, label = "Location", navigationLabel = "Open navigation", className, ref, ...props }) {
	const shell = useAppShell();
	const mode = shell?.mode ?? "wide";
	const narrow = mode === "narrow";
	useReportPresence(useShellChrome()?.topBar, true);
	const [accountOpen, setAccountOpen] = React.useState(false);
	const searchLabel = search?.label ?? "Search";
	const notificationsLabel = notifications?.label ?? "Notifications";
	const unread = notifications?.unread ?? 0;
	const marked = unread > 0 || Boolean(shell?.navigationUnread);
	const [root, ...rest] = breadcrumb;
	const org = root?.switcher ? root : void 0;
	const orgZone = Boolean(org) && !narrow;
	const switchers = (org ? rest : breadcrumb).filter((crumb) => crumb.switcher);
	const slots = shell?.slots ?? {};
	const notificationsButton = (size) => /* @__PURE__ */ jsx(Tooltip, {
		content: notificationsLabel,
		side: "bottom",
		children: /* @__PURE__ */ jsxs("span", {
			className: top_bar_module_default.marked,
			children: [/* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size,
				icon: "bell",
				iconOnly: true,
				onClick: notifications?.onClick,
				children: unread > 0 ? `${notificationsLabel}, ${unread} unread` : notificationsLabel
			}), unread > 0 && (size === "sm" ? /* @__PURE__ */ jsx("span", {
				className: top_bar_module_default.marker,
				"aria-hidden": "true"
			}) : /* @__PURE__ */ jsx(Count, {
				className: top_bar_module_default.count,
				"aria-hidden": "true",
				children: unread
			}))]
		})
	});
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("header", {
		ref,
		"data-slot": "top-bar",
		"data-mode": mode,
		"data-org-zone": orgZone || void 0,
		className: cn(top_bar_module_default.topBar, className),
		...props,
		children: [
			narrow && shell?.hasNavigation && /* @__PURE__ */ jsxs("span", {
				className: top_bar_module_default.marked,
				children: [/* @__PURE__ */ jsx(Button, {
					ref: shell.navigationTrigger,
					type: "button",
					variant: "ghost",
					size: "icon-lg",
					icon: "menu",
					iconOnly: true,
					"aria-expanded": shell.navigationOpen,
					"aria-haspopup": "dialog",
					"aria-keyshortcuts": "Meta+B Control+B",
					onClick: () => shell.setNavigationOpen(true),
					children: marked ? `${navigationLabel}, unread updates` : navigationLabel
				}), marked && /* @__PURE__ */ jsx("span", {
					className: top_bar_module_default.marker,
					"aria-hidden": "true"
				})]
			}),
			/* @__PURE__ */ jsx(Breadcrumb, {
				"aria-label": label,
				variant: "product",
				items: narrow ? breadcrumb.slice(-2).map(plainCrumb) : breadcrumb,
				"data-org-zone": orgZone || void 0,
				className: top_bar_module_default.trail
			}),
			/* @__PURE__ */ jsxs("div", {
				className: top_bar_module_default.actions,
				children: [
					!narrow && actions,
					!narrow && notifications && notificationsButton("sm"),
					search && /* @__PURE__ */ jsx(Tooltip, {
						content: searchLabel,
						shortcut: search.shortcut ?? "mod+K",
						side: "bottom",
						children: /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: narrow ? "icon-lg" : "sm",
							icon: "search",
							iconOnly: true,
							"aria-keyshortcuts": "Meta+K Control+K",
							onClick: search.onClick,
							children: searchLabel
						})
					}),
					!narrow && account && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(BandDivider, {}), /* @__PURE__ */ jsx(AccountMenu, { account })] })
				]
			}),
			slots.org && org && createPortal(/* @__PURE__ */ jsx(Breadcrumb, {
				"aria-label": org.switcher?.label ?? label,
				variant: "product",
				lastIsCurrent: false,
				items: [org],
				"data-fill": "",
				className: top_bar_module_default.sheetOrg
			}), slots.org),
			slots.switchers && switchers.length > 0 && createPortal(switchers.map((crumb, index) => /* @__PURE__ */ jsx(Breadcrumb, {
				"aria-label": crumb.switcher?.label ?? label,
				variant: "product",
				lastIsCurrent: false,
				items: [crumb],
				"data-fill": "",
				className: top_bar_module_default.sheetSwitcher
			}, index)), slots.switchers),
			slots.account && account && createPortal(/* @__PURE__ */ jsxs("button", {
				type: "button",
				className: top_bar_module_default.userRow,
				"aria-haspopup": "dialog",
				"aria-expanded": accountOpen,
				onClick: () => setAccountOpen(true),
				children: [
					/* @__PURE__ */ jsx(Icon, {
						name: "user",
						size: 18
					}),
					/* @__PURE__ */ jsxs("span", {
						className: top_bar_module_default.identity,
						children: [/* @__PURE__ */ jsx("span", {
							className: top_bar_module_default.identityName,
							children: account.name
						}), account.email && /* @__PURE__ */ jsx("span", {
							className: top_bar_module_default.identityMeta,
							children: account.email
						})]
					}),
					/* @__PURE__ */ jsx(Icon, {
						name: "chev-ud",
						size: 16,
						className: top_bar_module_default.menuEnd
					})
				]
			}), slots.account),
			slots.icons && notifications && createPortal(notificationsButton("icon-lg"), slots.icons),
			narrow && account && /* @__PURE__ */ jsx(AccountSheet, {
				account,
				open: accountOpen,
				onOpenChange: setAccountOpen
			})
		]
	}) });
}
TopBar.displayName = "TopBar";
export { AppInset, AppShell, PageGutter, ShellBottomSheet, ShellMenuItems, ShellSheetRows, TopBar, scrollInsetTo, useActionBarReserve, useAppShell, useShellChrome };

//# sourceMappingURL=top-bar.js.map