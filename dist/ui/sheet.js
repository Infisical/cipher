"use client";
import { usePortalContainer } from "../scope.js";
import { EmptySurface } from "./empty.js";
import { DiscardChangesAlertDialog } from "./alert-dialog.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Panes } from "./layout.js";
import { Tabs as Tabs$1, TabsList, TabsTrigger } from "./tabs.js";
import { FrameScope } from "../lib/frame-context.js";
import { focusFirstControl } from "../lib/initial-focus.js";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending.js";
import { flattenFragments, renderInForm, splitOverlaySections } from "../lib/overlay-sections.js";
import { useOwnedEscape } from "../lib/use-owned-escape.js";
import { cn } from "../lib/utils.js";
import overlay_module_default from "./overlay.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Dialog, Slot } from "radix-ui";
// src/ui/sheet.tsx
var SheetHostContext = React.createContext(null);
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Trigger, {
		ref,
		"data-slot": "sheet-trigger",
		...props
	});
}
SheetTrigger.displayName = "SheetTrigger";
function SheetClose({ ref, disabled, onClick, ...props }) {
	const pending = useOverlayPending();
	const host = React.useContext(SheetHostContext);
	return /* @__PURE__ */ jsx(Dialog.Close, {
		ref,
		"data-slot": "sheet-close",
		disabled: disabled || pending,
		onClick: (event) => {
			onClick?.(event);
			if (!event.defaultPrevented) host?.interceptClose(event);
		},
		...props
	});
}
SheetClose.displayName = "SheetClose";
function SheetPortal({ children, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		container: usePortalContainer(),
		"data-slot": "sheet-portal",
		...props,
		children: /* @__PURE__ */ jsx(FrameScope, {
			framed: false,
			children: /* @__PURE__ */ jsx(EmptySurface, { children })
		})
	});
}
function SheetOverlay({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Overlay, {
		ref,
		"data-slot": "sheet-overlay",
		className: cn("z-50", overlay_module_default.scrim, overlay_module_default.scrimSlow, className),
		...props
	});
}
SheetOverlay.displayName = "SheetOverlay";
var SheetLayout = ({ head, scroll, footer }) => /* @__PURE__ */ jsxs(Fragment, { children: [
	head && /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-head",
		children: head
	}),
	scroll && /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-scroll",
		"data-scroll-fade": "y",
		"data-before-footer": Boolean(footer) || void 0,
		children: scroll
	}),
	footer
] });
function SheetContent({ className, children, side = "right", size = "sm", showCloseButton = true, pending = false, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, onOpenAutoFocus, ref, ...props }) {
	const escape = useOwnedEscape(ref, onEscapeKeyDown);
	const [viewPending, setViewPending] = React.useState(false);
	const blocked = pending || viewPending;
	const guard = useDismissGuard(blocked, {
		onEscapeKeyDown: escape.onEscapeKeyDown,
		onPointerDownOutside,
		onInteractOutside
	});
	const [viewSize, setViewSize] = React.useState();
	const [viewLabels, setViewLabels] = React.useState();
	const intercept = React.useRef(null);
	const closeRef = React.useRef(null);
	const closing = React.useRef(false);
	const host = React.useMemo(() => {
		const proceed = () => {
			closing.current = true;
			closeRef.current?.click();
			closing.current = false;
		};
		return {
			setViewSize,
			setViewPending,
			setViewLabels,
			intercept,
			interceptClose: (event) => {
				if (closing.current) return;
				if (intercept.current?.close(proceed)) event.preventDefault();
			}
		};
	}, []);
	const top = flattenFragments(children);
	const aside = top.find((child) => React.isValidElement(child) && child.type === SheetAside);
	const rest = aside ? top.filter((child) => child !== aside) : children;
	const detailsTabId = React.useId();
	const detailsPanelId = React.useId();
	const sections = splitOverlaySections(rest, {
		header: SheetHeader,
		subheader: SheetSubheader,
		body: SheetBody,
		footer: SheetFooter
	}, {
		pinHeader: true,
		lookThroughForm: true
	});
	const content = sections ? renderInForm(sections.form, "sheet-form", /* @__PURE__ */ jsx(SheetLayout, {
		head: sections.pinned.length > 0 && sections.pinned,
		scroll: sections.scroll.length > 0 && sections.scroll,
		footer: sections.footer.length > 0 && sections.footer
	})) : rest;
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsx(Dialog.Content, {
		ref: escape.ref,
		"data-slot": "sheet-content",
		"data-has-close": showCloseButton || void 0,
		"data-scroll-fade": sections || aside ? void 0 : "y",
		"data-sections": sections || aside ? "" : void 0,
		"data-panes": aside ? "" : void 0,
		"data-side": side,
		"data-size": viewSize ?? size,
		className: cn("fixed z-50 flex flex-col gap-4 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto", overlay_module_default.pop, overlay_module_default.sheet, className),
		"aria-busy": blocked || void 0,
		onOpenAutoFocus: (event) => {
			onOpenAutoFocus?.(event);
			focusFirstControl(event, aside ? "[data-slot=\"sheet-main\"]" : void 0);
		},
		...props,
		...viewLabels?.title ? { "aria-labelledby": viewLabels.title } : {},
		...viewLabels ? { "aria-describedby": viewLabels.description ?? props["aria-describedby"] } : {},
		...guard,
		onEscapeKeyDown: (event) => {
			guard.onEscapeKeyDown(event);
			if (!event.defaultPrevented && intercept.current?.escape()) event.preventDefault();
		},
		onInteractOutside: (event) => {
			guard.onInteractOutside(event);
			if (!event.defaultPrevented) host.interceptClose(event);
		},
		children: /* @__PURE__ */ jsx(SheetHostContext, {
			value: host,
			children: /* @__PURE__ */ jsx(SheetViewDescribeContext, {
				value: null,
				children: /* @__PURE__ */ jsxs(OverlayPendingContext, {
					value: blocked,
					children: [aside ? /* @__PURE__ */ jsx(Panes, {
						identity: {
							media: aside.props.media,
							title: /* @__PURE__ */ jsx(SheetTitle, { children: aside.props.title }),
							description: aside.props.description && /* @__PURE__ */ jsx(SheetDescription, { children: aside.props.description }),
							badges: aside.props.badges
						},
						aside: aside.props.children,
						asideLabel: aside.props.label,
						asideClassName: aside.props.className,
						children: (panes) => /* @__PURE__ */ jsx("div", {
							"data-slot": "sheet-main",
							"data-sections": "",
							children: renderAsideMain({
								panes,
								aside: aside.props,
								sections,
								rest,
								detailsTabId,
								detailsPanelId
							})
						})
					}) : content, showCloseButton ? /* @__PURE__ */ jsx(Dialog.Close, {
						"data-slot": "sheet-close",
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							ref: closeRef,
							variant: "ghost",
							className: overlay_module_default.close,
							size: "icon-sm",
							disabled: blocked,
							onClick: host.interceptClose,
							children: [/* @__PURE__ */ jsx(Icon, { name: "x" }), /* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Close"
							})]
						})
					}) : /* @__PURE__ */ jsx(Dialog.Close, {
						ref: closeRef,
						hidden: true,
						tabIndex: -1,
						"aria-hidden": true
					})]
				})
			})
		})
	})] });
}
SheetContent.displayName = "SheetContent";
/**
* The pinned layout for content that SheetContent cannot see: a view component that renders its own
* header and footer, or a header wrapped in another component. header and footer are pinned and
* children scroll between them, so pinning never depends on what the direct children are.
*/
function SheetSections({ header, footer, children, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-sections",
		"data-sections": "",
		className: cn(className),
		...props,
		children: /* @__PURE__ */ jsx(SheetLayout, {
			head: header,
			scroll: children,
			footer: footer && /* @__PURE__ */ jsx("div", {
				"data-slot": "sheet-foot",
				children: footer
			})
		})
	});
}
SheetSections.displayName = "SheetSections";
/**
* The fixed left pane of a two-pane sheet. It declares the identity (media, title, description,
* badges) and, as children, the body such as a summary DataList. As a direct child of SheetContent
* (outside any form) it splits the sheet, and the header, tabs, body, footer or SheetViews beside
* it form the main pane. Use it with size="xl". Below size-pane-collapse the identity becomes the
* fixed header and the body becomes the first header tab (label). A header with controlled Tabs
* and a TabsList keeps its tabs after it; otherwise a second tab, mainLabel, holds the main pane.
* The sheet opens on the main pane's tab either way. Only a header that is a direct child of
* SheetContent merges its tabs: beside SheetViews or SheetSections the Details and mainLabel tabs
* sit above their headers, so keep tabs out of those headers or give the sheet a direct header.
*/
function SheetAside(_) {
	return null;
}
SheetAside.displayName = "SheetAside";
var DETAILS_TAB = "cipher-sheet-aside-details";
var MAIN_TAB = "cipher-sheet-aside-main";
var withDetailsTab = (tabs, label, open, setOpen, triggerId, panelId) => {
	if (!React.isValidElement(tabs) || tabs.type !== Tabs$1) return null;
	const element = tabs;
	if (element.props.value === void 0 || element.props.tabs) return null;
	let found = false;
	const children = React.Children.map(element.props.children, (child) => {
		if (!React.isValidElement(child) || child.type !== TabsList) return child;
		found = true;
		return React.cloneElement(child, void 0, /* @__PURE__ */ jsx(TabsTrigger, {
			value: DETAILS_TAB,
			id: triggerId,
			"aria-controls": panelId,
			children: label
		}, DETAILS_TAB), child.props.children);
	});
	if (!found) return null;
	return React.cloneElement(element, {
		value: open ? DETAILS_TAB : element.props.value,
		onChange: void 0,
		onValueChange: (value) => {
			setOpen(value === DETAILS_TAB);
			if (value === DETAILS_TAB) return;
			element.props.onValueChange?.(value);
			element.props.onChange?.(value);
		}
	}, children);
};
var hide = (node, hidden) => React.isValidElement(node) ? React.cloneElement(node, { "data-hidden": hidden || void 0 }) : node;
/**
* The main pane beside a SheetAside, with the aside body as the first header tab while narrow.
* Both widths render the same tree so the main pane's state survives a resize.
*/
function renderAsideMain({ panes, aside, sections, rest, detailsTabId, detailsPanelId }) {
	const { narrow, detailsOpen: open, setDetailsOpen } = panes;
	const label = aside.label ?? "Details";
	const mainTabId = detailsTabId + "main";
	const mainPanelId = detailsPanelId + "main";
	const pinned = sections?.pinned ?? [];
	const tabbedIndex = pinned.findIndex((child) => React.isValidElement(child) && child.type === SheetHeader && Boolean(child.props.tabs));
	const tabbedHeader = pinned[tabbedIndex];
	const tabs = narrow && tabbedHeader ? withDetailsTab(tabbedHeader.props.tabs, label, open, setDetailsOpen, detailsTabId, detailsPanelId) : null;
	const ownTabs = narrow && !tabs && /* @__PURE__ */ jsx(SheetHeader, { tabs: /* @__PURE__ */ jsx(Tabs$1, {
		value: open ? DETAILS_TAB : MAIN_TAB,
		onValueChange: (value) => setDetailsOpen(value === DETAILS_TAB),
		children: /* @__PURE__ */ jsxs(TabsList, { children: [/* @__PURE__ */ jsx(TabsTrigger, {
			value: DETAILS_TAB,
			id: detailsTabId,
			"aria-controls": detailsPanelId,
			children: label
		}), /* @__PURE__ */ jsx(TabsTrigger, {
			value: MAIN_TAB,
			id: mainTabId,
			"aria-controls": mainPanelId,
			children: aside.mainLabel
		})] })
	}) });
	const mainPanel = ownTabs ? {
		role: "tabpanel",
		id: mainPanelId,
		"aria-labelledby": mainTabId
	} : {};
	const details = narrow && /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-scroll",
		"data-scroll-fade": "y",
		"data-hidden": !open || void 0,
		children: /* @__PURE__ */ jsx(SheetBody, {
			role: "tabpanel",
			id: detailsPanelId,
			"aria-labelledby": detailsTabId,
			children: aside.children
		})
	});
	if (!sections) return /* @__PURE__ */ jsxs(Fragment, { children: [
		ownTabs && /* @__PURE__ */ jsx("div", {
			"data-slot": "sheet-head",
			children: ownTabs
		}),
		details,
		/* @__PURE__ */ jsx("div", {
			"data-slot": "sheet-sections",
			"data-sections": "",
			"data-hidden": open || void 0,
			...mainPanel,
			children: rest
		})
	] });
	const head = tabs ? pinned.map((child, index) => index === tabbedIndex && tabbedHeader ? React.cloneElement(tabbedHeader, { tabs }) : child) : pinned;
	const footer = sections.footer.map((child) => hide(child, open));
	return renderInForm(sections.form, "sheet-form", /* @__PURE__ */ jsxs(Fragment, { children: [
		(head.length > 0 || ownTabs) && /* @__PURE__ */ jsxs("div", {
			"data-slot": "sheet-head",
			children: [head, ownTabs]
		}),
		details,
		sections.scroll.length > 0 && /* @__PURE__ */ jsx("div", {
			"data-slot": "sheet-scroll",
			"data-scroll-fade": "y",
			"data-before-footer": footer.length > 0 || void 0,
			"data-hidden": open || void 0,
			...mainPanel,
			children: sections.scroll
		}),
		footer
	] }));
}
/** One level of a SheetViews stack. SheetViews reads its props; it renders nothing on its own. */
function SheetView(_) {
	return null;
}
SheetView.displayName = "SheetView";
var SheetViewContext = React.createContext(null);
var SheetViewDescribeContext = React.createContext(null);
/** The view a component renders in, for MultiStep's view variant: its subheader and footer slots and its exits. */
var useSheetView = () => React.useContext(SheetViewContext);
function SheetViewFrame({ view, trail, active, onBack, onDone, backDisabled, setPending }) {
	const host = React.useContext(SheetHostContext);
	const titleId = React.useId();
	const descriptionId = React.useId();
	const labelled = active && trail.length > 0;
	const [describedBy, setDescribedBy] = React.useState();
	const ownDescription = labelled && view.description ? descriptionId : void 0;
	React.useLayoutEffect(() => {
		if (!host || !active) return void 0;
		host.setViewLabels({
			title: labelled ? titleId : void 0,
			description: ownDescription ?? describedBy
		});
		return () => host.setViewLabels(void 0);
	}, [
		host,
		active,
		labelled,
		titleId,
		ownDescription,
		describedBy
	]);
	const [subheader, setSubheader] = React.useState(null);
	const [footer, setFooter] = React.useState(null);
	const slots = React.useMemo(() => ({
		subheader,
		footer,
		back: onBack,
		done: onDone,
		setPending
	}), [
		subheader,
		footer,
		onBack,
		onDone,
		setPending
	]);
	const header = trail.length ? /* @__PURE__ */ jsxs(SheetHeader, {
		tabs: view.tabs,
		children: [/* @__PURE__ */ jsxs("div", {
			className: overlay_module_default.viewTitleRow,
			children: [
				/* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": "Back to " + trail[trail.length - 1],
					disabled: backDisabled,
					onClick: () => onBack(),
					children: /* @__PURE__ */ jsx(Icon, { name: "chev-left" })
				}),
				/* @__PURE__ */ jsxs("h2", {
					id: titleId,
					"data-slot": "sheet-title",
					className: overlay_module_default.viewTitle,
					children: [trail.map((name) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: overlay_module_default.viewTrail,
						children: name
					}), /* @__PURE__ */ jsx("span", {
						className: overlay_module_default.viewTrail,
						"aria-hidden": "true",
						children: " / "
					})] }, name)), view.title]
				}),
				view.badges && /* @__PURE__ */ jsx("span", {
					"data-slot": "overlay-title-badges",
					className: overlay_module_default.titleBadges,
					children: view.badges
				})
			]
		}), view.description && /* @__PURE__ */ jsx("p", {
			id: descriptionId,
			"data-slot": "sheet-description",
			children: view.description
		})]
	}) : view.header;
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-view",
		"data-view": view.id,
		"data-hidden": !active || void 0,
		"data-sections": "",
		className: overlay_module_default.view,
		...!active ? {
			inert: true,
			"aria-hidden": true
		} : {},
		children: /* @__PURE__ */ jsx(SheetViewDescribeContext, {
			value: setDescribedBy,
			children: /* @__PURE__ */ jsx(SheetViewContext, {
				value: slots,
				children: /* @__PURE__ */ jsx(SheetLayout, {
					head: /* @__PURE__ */ jsxs(Fragment, { children: [header, /* @__PURE__ */ jsx("div", {
						ref: setSubheader,
						"data-slot": "sheet-view-subheader",
						className: overlay_module_default.viewSlot
					})] }),
					scroll: view.children,
					footer: /* @__PURE__ */ jsxs("div", {
						"data-slot": "sheet-foot",
						className: overlay_module_default.viewFoot,
						children: [view.footer, /* @__PURE__ */ jsx("div", {
							ref: setFooter,
							className: overlay_module_default.viewSlot
						})]
					})
				})
			})
		})
	});
}
/**
* A stack of views inside one SheetContent, such as a folder and a New alert flow opened from it.
* The first SheetView is the base. Showing another view keeps the views under it mounted but hidden,
* so their scroll and unsaved edits survive, and gives it a back control and a breadcrumb title.
* Back, Escape, and Cancel on a nested MultiStep's first step return to the parent view; the close
* button closes the whole sheet. Each asks first when a view it leaves is dirty.
*/
function SheetViews({ view, onViewChange, children }) {
	const host = React.useContext(SheetHostContext);
	const views = React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === SheetView).map((child) => child.props);
	const base = views[0];
	const byId = new Map(views.map((entry) => [entry.id, entry]));
	const chain = [];
	let entry = byId.get(view) ?? base;
	while (entry && !chain.includes(entry)) {
		chain.unshift(entry);
		entry = entry.id === base?.id ? void 0 : byId.get(entry.parent ?? base?.id ?? "");
	}
	const current = chain[chain.length - 1];
	const parentOf = chain[chain.length - 2];
	const [pending, setPending] = React.useState(false);
	const returnFocus = React.useRef(null);
	const [discard, setDiscard] = React.useState();
	const ask = (dirty, proceed) => {
		if (!dirty) {
			proceed();
			return;
		}
		returnFocus.current = null;
		setDiscard({
			proceed,
			title: dirty.discardTitle,
			description: dirty.discardDescription
		});
	};
	const askEach = (dirty, proceed) => {
		const [first, ...rest] = dirty;
		if (!first) proceed();
		else ask(first, () => askEach(rest, proceed));
	};
	const back = (onLeave) => {
		if (pending || !parentOf || !current) return;
		ask(current.dirty ? current : void 0, () => {
			onLeave?.();
			onViewChange(parentOf.id);
		});
	};
	const done = () => {
		if (parentOf) onViewChange(parentOf.id);
	};
	const latest = React.useRef({
		back,
		done
	});
	React.useLayoutEffect(() => {
		latest.current = {
			back,
			done
		};
	});
	const stableBack = React.useCallback((onLeave) => latest.current.back(onLeave), []);
	const stableDone = React.useCallback(() => latest.current.done(), []);
	React.useLayoutEffect(() => {
		if (!host) return;
		host.intercept.current = {
			escape: () => {
				if (chain.length < 2) return false;
				back();
				return true;
			},
			close: (proceed) => {
				if (pending) return true;
				const dirty = chain.slice(1).filter((entry) => entry.dirty).reverse();
				if (!dirty.length) return false;
				askEach(dirty, proceed);
				return true;
			}
		};
	});
	React.useLayoutEffect(() => {
		if (!host) return void 0;
		host.setViewSize(chain.length > 1 ? current?.size : void 0);
		return () => host.setViewSize(void 0);
	}, [
		host,
		chain.length,
		current?.size
	]);
	React.useLayoutEffect(() => () => {
		if (host) host.intercept.current = null;
	}, [host]);
	React.useLayoutEffect(() => {
		if (!host) return void 0;
		host.setViewPending(pending);
		return () => host.setViewPending(false);
	}, [host, pending]);
	const frames = React.useRef(/* @__PURE__ */ new Map());
	const openers = React.useRef(/* @__PURE__ */ new Map());
	const shown = React.useRef(current?.id);
	React.useLayoutEffect(() => {
		const previous = shown.current;
		shown.current = current?.id;
		if (!current || previous === current.id) return;
		if (previous !== void 0 && !chain.some((entry) => entry.id === previous)) {
			const opener = openers.current.get(previous);
			openers.current.delete(previous);
			if (opener?.isConnected) {
				returnFocus.current = opener;
				opener.focus();
				return;
			}
		} else if (document.activeElement instanceof HTMLElement) openers.current.set(current.id, document.activeElement);
		const frame = frames.current.get(current.id);
		const target = frame?.querySelector("[data-slot=\"sheet-scroll\"] :is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])") ?? frame?.querySelector("button, [href], [tabindex]:not([tabindex='-1'])");
		if (!target) return;
		returnFocus.current = target;
		target.focus({ preventScroll: true });
	});
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "sheet-views",
		className: overlay_module_default.views,
		children: [chain.map((entry, index) => /* @__PURE__ */ jsx("div", {
			className: overlay_module_default.viewCell,
			ref: (node) => {
				if (node) frames.current.set(entry.id, node);
				else frames.current.delete(entry.id);
			},
			children: /* @__PURE__ */ jsx(SheetViewFrame, {
				view: entry,
				trail: chain.slice(0, index).map((item) => item.title),
				active: entry === current,
				onBack: stableBack,
				onDone: stableDone,
				backDisabled: pending,
				setPending
			})
		}, entry.id)), /* @__PURE__ */ jsx(DiscardChangesAlertDialog, {
			open: Boolean(discard),
			onOpenChange: (open) => {
				if (!open) setDiscard(void 0);
			},
			onDiscard: () => {
				const proceed = discard?.proceed;
				setDiscard(void 0);
				proceed?.();
			},
			title: discard?.title,
			description: discard?.description,
			onCloseAutoFocus: (event) => {
				const target = returnFocus.current;
				returnFocus.current = null;
				if (!target?.isConnected) return;
				event.preventDefault();
				target.focus();
			}
		})]
	});
}
SheetViews.displayName = "SheetViews";
function SheetHeader({ className, tabs, children, ref, ...props }) {
	const titled = React.Children.toArray(children).length > 0;
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "sheet-header",
		"data-tabs": tabs ? titled ? "" : "only" : void 0,
		className: cn("flex flex-col gap-0.5 p-4", className),
		...props,
		children: [children, tabs && /* @__PURE__ */ jsx("div", {
			"data-slot": "sheet-header-tabs",
			children: tabs
		})]
	});
}
SheetHeader.displayName = "SheetHeader";
function SheetSubheader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-subheader",
		className: cn(className),
		...props
	});
}
SheetSubheader.displayName = "SheetSubheader";
function SheetBody({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-body",
		className: cn(className),
		...props
	});
}
SheetBody.displayName = "SheetBody";
function SheetFooter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-footer",
		className: cn("mt-auto flex flex-wrap items-center justify-end gap-2 p-4", className),
		...props
	});
}
SheetFooter.displayName = "SheetFooter";
function SheetTitle({ className, ref, badges, ...props }) {
	const title = /* @__PURE__ */ jsx(Dialog.Title, {
		ref,
		"data-slot": "sheet-title",
		className: cn("text-foreground", className),
		...props
	});
	if (!badges) return title;
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "sheet-title-line",
		className: overlay_module_default.titleLine,
		children: [title, /* @__PURE__ */ jsx("span", {
			"data-slot": "overlay-title-badges",
			className: overlay_module_default.titleBadges,
			children: badges
		})]
	});
}
SheetTitle.displayName = "SheetTitle";
function SheetDescription({ className, ref, asChild, id, ...props }) {
	const describe = React.useContext(SheetViewDescribeContext);
	const ownId = React.useId();
	const viewId = id ?? ownId;
	React.useLayoutEffect(() => {
		if (!describe) return void 0;
		describe(viewId);
		return () => describe(void 0);
	}, [describe, viewId]);
	if (describe) {
		const Description = asChild ? Slot.Root : "p";
		return /* @__PURE__ */ jsx(Description, {
			ref,
			id: viewId,
			"data-slot": "sheet-description",
			className: cn("text-muted-foreground", className),
			...props
		});
	}
	return /* @__PURE__ */ jsx(Dialog.Description, {
		ref,
		"data-slot": "sheet-description",
		className: cn("text-muted-foreground", className),
		asChild,
		id,
		...props
	});
}
SheetDescription.displayName = "SheetDescription";
export { Sheet, SheetAside, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSections, SheetSubheader, SheetTitle, SheetTrigger, SheetView, SheetViews, useSheetView };

//# sourceMappingURL=sheet.js.map