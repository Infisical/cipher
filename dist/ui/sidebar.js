import { CipherLink, useCipherLinkMatch } from "../lib/link.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { useReportPresence } from "../lib/presence-count.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Count } from "./badge.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Icon } from "./icon.js";
import { Sheet, SheetContent, SheetTitle } from "./sheet.js";
import { Tabs, TabsList, TabsTrigger } from "./tabs.js";
import { Tooltip, TooltipProvider } from "./tooltip.js";
import { ShellBottomSheet, ShellMenuItems, ShellSheetRows, useAppShell, useShellChrome } from "./top-bar.js";
import sidebar_module_default from "./sidebar.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CircleHelp } from "lucide-react";
// src/ui/sidebar.tsx
var total = (items = []) => items.reduce((sum, item) => sum + (item.count ?? 0), 0);
var sectionsTotal = (sections) => sections.reduce((sum, section) => sum + section.items.reduce((acc, item) => acc + (item.count ?? 0) + total(item.children), 0), 0);
var holds = (sections, id) => id !== void 0 && sections.some((section) => section.items.some((item) => item.id === id || item.children?.some((childItem) => childItem.id === id)));
var LevelTrail = React.createContext([]);
var RowContent = ({ item, count, child, trailing }) => /* @__PURE__ */ jsxs(Fragment, { children: [
	item.icon && !child && /* @__PURE__ */ jsx(Icon, {
		name: item.icon,
		size: 18,
		className: sidebar_module_default.icon
	}),
	/* @__PURE__ */ jsx("span", {
		className: sidebar_module_default.label,
		children: item.label
	}),
	count ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Count, {
		className: sidebar_module_default.count,
		children: count
	}), /* @__PURE__ */ jsx("span", {
		className: sidebar_module_default.dot,
		"aria-hidden": "true"
	})] }) : null,
	item.external && /* @__PURE__ */ jsx(Icon, {
		name: "external",
		size: 14,
		className: sidebar_module_default.trailing
	}),
	trailing
] });
var drill = /* @__PURE__ */ jsx(Icon, {
	name: "chev-right",
	size: 14,
	className: sidebar_module_default.trailing
});
var SidebarRow = ({ item, current, rail, child, back, onNavigate }) => {
	const isCurrent = !back && item.id === current;
	const name = back ? `Back to ${item.label}` : item.label;
	const drillIn = !back && (item.drillIn || item.level !== void 0);
	const holdsCurrent = React.useContext(LevelTrail).includes(item.level ?? "") && !back;
	const shared = {
		className: cn(sidebar_module_default.row, back && sidebar_module_default.back),
		"data-sidebar-back": back || void 0,
		"data-sidebar-target": "",
		"data-current": isCurrent || void 0,
		"data-holds-current": holdsCurrent && !isCurrent || void 0,
		"data-child": child || void 0,
		"aria-current": isCurrent ? "page" : void 0,
		"aria-label": rail || back ? name : void 0,
		"aria-description": drillIn ? "Opens section" : void 0,
		onClick: (event) => {
			if (item.disabled) {
				event.preventDefault();
				return;
			}
			item.onClick?.();
			onNavigate?.(item);
		}
	};
	const content = /* @__PURE__ */ jsx(RowContent, {
		item,
		count: item.count,
		child,
		trailing: drillIn && !rail ? drill : void 0
	});
	const row = item.link && !item.disabled ? /* @__PURE__ */ jsx(CipherLink, {
		link: item.link,
		...shared,
		children: content
	}) : item.href || item.link ? /* @__PURE__ */ jsx("a", {
		...shared,
		href: item.disabled ? void 0 : item.href,
		"aria-disabled": item.disabled || void 0,
		target: item.external ? "_blank" : void 0,
		rel: item.external ? "noreferrer" : void 0,
		children: content
	}) : /* @__PURE__ */ jsx("button", {
		...shared,
		type: "button",
		disabled: item.disabled,
		children: content
	});
	return rail ? /* @__PURE__ */ jsx(Tooltip, {
		content: drillIn ? `${name}, opens section` : name,
		side: "right",
		children: row
	}) : row;
};
var SidebarGroup = ({ item, current, rail, onNavigate }) => {
	const children = item.children ?? [];
	const holdsCurrent = children.some((childItem) => childItem.id === current);
	const [open, setOpen] = React.useState(item.defaultOpen ?? holdsCurrent);
	const listId = React.useId();
	React.useEffect(() => {
		if (holdsCurrent) setOpen(true);
	}, [holdsCurrent]);
	if (rail) return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(Tooltip, {
		content: item.label,
		side: "right",
		children: /* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: sidebar_module_default.row,
				"data-sidebar-target": "",
				"data-holds-current": holdsCurrent || void 0,
				"aria-label": item.label,
				disabled: item.disabled,
				onKeyDown: (event) => {
					if (event.key === "ArrowDown" || event.key === "ArrowUp") event.preventDefault();
				},
				children: /* @__PURE__ */ jsx(RowContent, {
					item,
					count: total(children)
				})
			})
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		side: "right",
		align: "start",
		children: [/* @__PURE__ */ jsx(DropdownMenuLabel, { children: item.label }), children.map((childItem) => /* @__PURE__ */ jsx(DropdownMenuItem, {
			disabled: childItem.disabled,
			"data-current": childItem.id === current || void 0,
			"aria-current": childItem.id === current ? "page" : void 0,
			className: childItem.id === current ? sidebar_module_default.flyoutCurrent : void 0,
			onSelect: () => {
				childItem.onClick?.();
				onNavigate?.(childItem);
			},
			asChild: Boolean(childItem.href || childItem.link),
			children: childItem.link ? /* @__PURE__ */ jsxs(CipherLink, {
				link: childItem.link,
				"data-current": childItem.id === current || void 0,
				children: [childItem.label, childItem.count ? /* @__PURE__ */ jsx(Count, { children: childItem.count }) : null]
			}) : childItem.href ? /* @__PURE__ */ jsxs("a", {
				href: childItem.href,
				target: childItem.external ? "_blank" : void 0,
				rel: childItem.external ? "noreferrer" : void 0,
				children: [childItem.label, childItem.count ? /* @__PURE__ */ jsx(Count, { children: childItem.count }) : null]
			}) : /* @__PURE__ */ jsxs("span", { children: [childItem.label, childItem.count ? /* @__PURE__ */ jsx(Count, { children: childItem.count }) : null] })
		}, childItem.id))]
	})] });
	return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("button", {
		type: "button",
		className: sidebar_module_default.row,
		"data-sidebar-target": "",
		"data-holds-current": holdsCurrent || void 0,
		"aria-expanded": open,
		"aria-controls": listId,
		disabled: item.disabled,
		onClick: () => setOpen(!open),
		children: /* @__PURE__ */ jsx(RowContent, {
			item,
			count: open ? void 0 : total(children),
			trailing: /* @__PURE__ */ jsx(Icon, {
				name: "chev-right",
				size: 14,
				className: sidebar_module_default.chevron
			})
		})
	}), /* @__PURE__ */ jsx("ul", {
		id: listId,
		className: sidebar_module_default.children,
		hidden: !open,
		children: children.map((childItem) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SidebarRow, {
			item: childItem,
			current,
			rail: false,
			child: true,
			onNavigate
		}) }, childItem.id))
	})] });
};
var SidebarItems = ({ items, current, rail, onNavigate }) => /* @__PURE__ */ jsx("ul", {
	className: sidebar_module_default.rows,
	children: items.map((item) => item.children?.length ? rail ? /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SidebarGroup, {
		item,
		current,
		rail: true,
		onNavigate
	}) }, item.id) : /* @__PURE__ */ jsx(SidebarGroup, {
		item,
		current,
		rail: false,
		onNavigate
	}, item.id) : /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(SidebarRow, {
		item,
		current,
		rail,
		onNavigate
	}) }, item.id))
});
var moveFocus = (event) => {
	if (![
		"ArrowDown",
		"ArrowUp",
		"Home",
		"End"
	].includes(event.key)) return;
	const targets = [...event.currentTarget.querySelectorAll("[data-sidebar-target]")].filter((target) => !target.closest("[hidden]") && !target.hasAttribute("disabled") && target.getAttribute("aria-disabled") !== "true");
	const index = targets.indexOf(document.activeElement);
	if (index === -1) return;
	event.preventDefault();
	targets[event.key === "Home" ? 0 : event.key === "End" ? targets.length - 1 : Math.min(Math.max(index + (event.key === "ArrowDown" ? 1 : -1), 0), targets.length - 1)]?.focus();
};
var HelpMenu = ({ help, rail }) => /* @__PURE__ */ jsxs(DropdownMenuContent, {
	side: rail ? "right" : "top",
	align: "end",
	className: sidebar_module_default.helpMenu,
	children: [
		help.status && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ jsx("a", {
				href: help.status.href,
				target: "_blank",
				rel: "noreferrer",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: sidebar_module_default.statusMark,
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx("span", {
							className: sidebar_module_default.statusDot,
							"data-state": help.status.state ?? "ok"
						})
					}, "dot"),
					help.status.label,
					/* @__PURE__ */ jsx(Icon, {
						name: "external",
						size: 14,
						className: sidebar_module_default.menuEnd
					}, "external")
				]
			})
		}), /* @__PURE__ */ jsx(DropdownMenuSeparator, {})] }),
		help.whatsNew && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
			onSelect: help.whatsNew.onSelect,
			children: [
				/* @__PURE__ */ jsx(Icon, { name: "megaphone" }, "icon"),
				help.whatsNew.label ?? "What's new",
				help.whatsNew.unread ? /* @__PURE__ */ jsx(Count, {
					className: sidebar_module_default.helpCount,
					children: help.whatsNew.unread
				}, "count") : help.whatsNew.latest && /* @__PURE__ */ jsx("span", {
					className: sidebar_module_default.helpMeta,
					children: help.whatsNew.latest
				}, "latest")
			]
		}), /* @__PURE__ */ jsx(DropdownMenuSeparator, {})] }),
		/* @__PURE__ */ jsx(ShellMenuItems, { entries: help.items ?? [] }),
		help.version && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownMenuSeparator, {}), /* @__PURE__ */ jsxs("div", {
			className: sidebar_module_default.version,
			children: [
				/* @__PURE__ */ jsx(Icon, { name: "info" }),
				/* @__PURE__ */ jsx("span", { children: "Version" }),
				/* @__PURE__ */ jsx("span", {
					className: sidebar_module_default.versionValue,
					children: help.version
				})
			]
		})] })
	]
});
var HelpSheet = ({ help, open, onOpenChange }) => {
	const close = () => onOpenChange(false);
	const lead = [...help.status ? [{
		label: help.status.label,
		href: help.status.href,
		external: true
	}, { type: "separator" }] : [], ...help.whatsNew ? [{
		label: help.whatsNew.unread ? `${help.whatsNew.label ?? "What's new"}, ${help.whatsNew.unread} unread` : help.whatsNew.label ?? "What's new",
		icon: "megaphone",
		onSelect: help.whatsNew.onSelect
	}, { type: "separator" }] : []];
	return /* @__PURE__ */ jsxs(ShellBottomSheet, {
		title: help.label ?? "Help",
		open,
		onOpenChange,
		children: [/* @__PURE__ */ jsx(ShellSheetRows, {
			entries: [...lead, ...help.items ?? []],
			onDone: close
		}), help.version && /* @__PURE__ */ jsxs("div", {
			className: sidebar_module_default.sheetVersion,
			children: [
				/* @__PURE__ */ jsx(Icon, {
					name: "info",
					size: 18
				}),
				/* @__PURE__ */ jsx("span", { children: "Version" }),
				/* @__PURE__ */ jsx("span", {
					className: sidebar_module_default.versionValue,
					children: help.version
				})
			]
		})]
	});
};
var SidebarView = ({ sections, levels, scope: scopeProp, spaces, space, defaultSpace, onSpaceChange, spacesLabel = "Navigation", current, onNavigate, help, announcements, footerItems, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = true, header, edge = true, label, className }) => {
	const [isCollapsed, setCollapsed] = useControllableState({
		value: collapsed,
		defaultValue: defaultCollapsed,
		onChange: onCollapsedChange
	});
	const currentSpace = spaces?.find((entry) => holds(entry.sections, current))?.id;
	const [spaceId, setSpaceId] = useControllableState({
		value: space,
		defaultValue: defaultSpace ?? currentSpace ?? spaces?.[0]?.id ?? "",
		onChange: onSpaceChange
	});
	const lastCurrent = React.useRef(current);
	React.useEffect(() => {
		if (current === lastCurrent.current) return;
		lastCurrent.current = current;
		if (currentSpace) setSpaceId(currentSpace);
	}, [
		current,
		currentSpace,
		setSpaceId
	]);
	const activeSpace = spaces?.find((entry) => entry.id === spaceId) ?? spaces?.[0];
	const levelOf = (id) => levels?.find((entry) => entry.id === id);
	const currentLevel = levels?.find((entry) => holds(entry.sections, current)) ?? levels?.find((entry) => !entry.parent);
	const [levelId, setLevelId] = React.useState(currentLevel?.id);
	const lastLevelCurrent = React.useRef(current);
	React.useEffect(() => {
		if (current === lastLevelCurrent.current) return;
		lastLevelCurrent.current = current;
		setLevelId(currentLevel?.id);
	}, [current, currentLevel?.id]);
	const shownLevel = levelOf(levelId) ?? currentLevel;
	const parentLevel = levelOf(shownLevel?.parent);
	const scope = shownLevel && parentLevel ? {
		id: shownLevel.id,
		back: {
			id: parentLevel.id,
			label: parentLevel.label,
			level: parentLevel.id
		},
		sections: shownLevel.sections
	} : scopeProp;
	const trail = [];
	for (let entry = currentLevel; entry; entry = levelOf(entry.parent)) trail.push(entry.id);
	const shownSections = scope?.sections ?? shownLevel?.sections ?? activeSpace?.sections ?? sections ?? [];
	const shell = useAppShell();
	const mode = shell?.mode ?? "wide";
	const narrow = mode === "narrow";
	const sheeted = Boolean(shell) && mode !== "wide";
	const setHasNavigation = shell?.setHasNavigation;
	React.useEffect(() => {
		if (!setHasNavigation) return void 0;
		setHasNavigation(true);
		return () => setHasNavigation(false);
	}, [setHasNavigation]);
	const unread = (announcements?.unread ?? 0) > 0;
	const setNavigationUnread = shell?.setNavigationUnread;
	React.useEffect(() => {
		if (!setNavigationUnread) return void 0;
		setNavigationUnread(unread);
		return () => setNavigationUnread(false);
	}, [setNavigationUnread, unread]);
	const setNavigationOpen = shell?.setNavigationOpen;
	const openedAt = React.useRef(current);
	React.useEffect(() => {
		if (!sheeted || !setNavigationOpen) return;
		if (openedAt.current !== current) setNavigationOpen(false);
		openedAt.current = current;
	}, [
		current,
		sheeted,
		setNavigationOpen
	]);
	const navigationToggle = shell?.navigationToggle;
	React.useEffect(() => {
		if (!navigationToggle) return void 0;
		navigationToggle.current = () => {
			if (sheeted) setNavigationOpen?.(!shell?.navigationOpen);
			else if (collapsible) setCollapsed(!isCollapsed);
		};
		return () => {
			navigationToggle.current = null;
		};
	});
	const setSlot = shell?.setSlot;
	const slotRefs = React.useMemo(() => {
		const bind = (slot) => (node) => setSlot?.(slot, node);
		return {
			org: bind("org"),
			switchers: bind("switchers"),
			account: bind("account"),
			icons: bind("icons")
		};
	}, [setSlot]);
	const [helpSheetOpen, setHelpSheetOpen] = React.useState(false);
	const toggleRef = React.useRef(null);
	const railed = mode === "rail" || !narrow && collapsible && isCollapsed;
	const chrome = useShellChrome();
	useReportPresence(chrome?.sidebar, !narrow);
	useReportPresence(chrome?.sidebarOpen, !narrow && !railed);
	const view = scope?.id ?? activeSpace?.id ?? "root";
	const navRef = React.useRef(null);
	const backRef = React.useRef(null);
	const refocus = React.useRef(false);
	const keyed = React.useRef(false);
	const navigate = (item) => {
		if (item.level) {
			refocus.current = keyed.current;
			setLevelId(item.level);
		}
		onNavigate?.(item);
	};
	const lastScope = React.useRef(scope);
	const [enter, setEnter] = React.useState();
	React.useEffect(() => {
		const previous = lastScope.current;
		lastScope.current = scope;
		if (previous?.id === scope?.id) return;
		setEnter(!scope || previous?.back.id === scope.id ? "back" : "forward");
		if (!refocus.current) return;
		refocus.current = false;
		navRef.current?.querySelector("[data-sidebar-target]")?.focus();
	}, [scope, navRef]);
	const goUp = (event) => {
		if (!scope) return;
		if (event.target.closest("input, textarea, [contenteditable='true']")) return;
		if (event.key !== "Backspace" && !(event.altKey && event.key === "ArrowLeft")) return;
		event.preventDefault();
		refocus.current = true;
		backRef.current?.click();
	};
	const spaceRefs = React.useRef([]);
	const hasUpdates = (entry) => entry.id !== activeSpace?.id && sectionsTotal(entry.sections) > 0;
	const panel = (inSheet) => {
		const rail = !inSheet && railed;
		const tooltipSide = rail ? "right" : "top";
		const helpLabel = help?.label ?? "Help";
		const announcementsLabel = announcements?.label ?? "What's new";
		const toggle = !inSheet && (mode === "rail" || collapsible) ? /* @__PURE__ */ jsx(Tooltip, {
			content: rail ? "Expand sidebar" : "Collapse sidebar",
			shortcut: shell ? "mod+B" : void 0,
			side: tooltipSide,
			children: /* @__PURE__ */ jsx("button", {
				ref: toggleRef,
				type: "button",
				className: sidebar_module_default.tool,
				"aria-label": rail ? "Expand sidebar" : "Collapse sidebar",
				"aria-expanded": mode === "rail" ? Boolean(shell?.navigationOpen) : !rail,
				onClick: () => {
					if (mode === "rail") setNavigationOpen?.(true);
					else setCollapsed(!isCollapsed);
				},
				children: /* @__PURE__ */ jsx(Icon, {
					name: "sidebar",
					size: 18
				})
			})
		}) : null;
		const cornerEnd = (announcements || help) && /* @__PURE__ */ jsxs("span", {
			className: sidebar_module_default.cornerEnd,
			children: [announcements && /* @__PURE__ */ jsx(Tooltip, {
				content: announcementsLabel,
				side: tooltipSide,
				children: /* @__PURE__ */ jsxs("span", {
					className: sidebar_module_default.marked,
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: sidebar_module_default.tool,
						"aria-label": unread ? `${announcementsLabel}, ${announcements.unread} unread` : announcementsLabel,
						onClick: announcements.onClick,
						children: /* @__PURE__ */ jsx(Icon, {
							name: "megaphone",
							size: 18
						})
					}), unread && /* @__PURE__ */ jsx("span", {
						className: sidebar_module_default.unread,
						"aria-hidden": "true"
					})]
				})
			}), help && (inSheet && narrow ? /* @__PURE__ */ jsx(Tooltip, {
				content: helpLabel,
				side: tooltipSide,
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: sidebar_module_default.tool,
					"aria-label": helpLabel,
					"aria-haspopup": "dialog",
					"aria-expanded": helpSheetOpen,
					onClick: () => setHelpSheetOpen(true),
					children: /* @__PURE__ */ jsx(Icon, {
						icon: CircleHelp,
						size: 18
					})
				})
			}) : /* @__PURE__ */ jsxs(DropdownMenu, {
				modal: false,
				children: [/* @__PURE__ */ jsx(Tooltip, {
					content: helpLabel,
					side: tooltipSide,
					children: /* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: sidebar_module_default.tool,
							"aria-label": helpLabel,
							children: /* @__PURE__ */ jsx(Icon, {
								icon: CircleHelp,
								size: 18
							})
						})
					})
				}), /* @__PURE__ */ jsx(HelpMenu, {
					help,
					rail
				})]
			}))]
		});
		return /* @__PURE__ */ jsxs("aside", {
			"data-slot": "sidebar",
			"data-collapsed": rail || void 0,
			"data-sheet": inSheet || void 0,
			"data-edge": edge || void 0,
			className: cn(sidebar_module_default.sidebar, className),
			children: [
				header,
				inSheet && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: sidebar_module_default.sheetHead,
					children: [/* @__PURE__ */ jsx("div", {
						ref: slotRefs.org,
						className: sidebar_module_default.sheetOrg
					}), /* @__PURE__ */ jsx(Tooltip, {
						content: "Close navigation",
						shortcut: "mod+B",
						side: "bottom",
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: sidebar_module_default.tool,
							"aria-label": "Close navigation",
							onClick: () => setNavigationOpen?.(false),
							children: /* @__PURE__ */ jsx(Icon, {
								name: "x",
								size: 18
							})
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					ref: slotRefs.switchers,
					className: sidebar_module_default.sheetSwitchers
				})] }),
				!scope && spaces && activeSpace && !rail && /* @__PURE__ */ jsx(Tabs, {
					className: sidebar_module_default.spaces,
					width: "full",
					value: activeSpace.id,
					onValueChange: setSpaceId,
					children: /* @__PURE__ */ jsx(TabsList, {
						variant: "segmented",
						"aria-label": spacesLabel,
						children: spaces.map((entry) => /* @__PURE__ */ jsxs(TabsTrigger, {
							value: entry.id,
							className: sidebar_module_default.spaceTab,
							children: [entry.label, hasUpdates(entry) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
								className: sidebar_module_default.spaceDot,
								"aria-hidden": "true"
							}), /* @__PURE__ */ jsx("span", {
								className: sidebar_module_default.srOnly,
								children: ", has updates"
							})] })]
						}, entry.id))
					})
				}),
				!scope && spaces && activeSpace && rail && /* @__PURE__ */ jsx("div", {
					className: sidebar_module_default.railSpacesShelf,
					children: /* @__PURE__ */ jsx("div", {
						role: "tablist",
						"aria-label": spacesLabel,
						"aria-orientation": "vertical",
						className: sidebar_module_default.railSpaces,
						children: spaces.map((entry, index) => {
							const selected = entry.id === activeSpace.id;
							return /* @__PURE__ */ jsx(Tooltip, {
								content: entry.label,
								side: "right",
								children: /* @__PURE__ */ jsxs("button", {
									ref: (node) => {
										spaceRefs.current[index] = node;
									},
									type: "button",
									role: "tab",
									"aria-selected": selected,
									tabIndex: selected ? 0 : -1,
									"aria-label": hasUpdates(entry) ? `${entry.label}, has updates` : entry.label,
									className: sidebar_module_default.railSpace,
									onClick: () => setSpaceId(entry.id),
									onKeyDown: (event) => {
										const step = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(event.key) ? -1 : 0;
										if (!step) return;
										event.preventDefault();
										const next = (index + step + spaces.length) % spaces.length;
										setSpaceId(spaces[next].id);
										spaceRefs.current[next]?.focus();
									},
									children: [/* @__PURE__ */ jsx(Icon, {
										name: entry.icon,
										size: 18
									}), hasUpdates(entry) && /* @__PURE__ */ jsx("span", {
										className: sidebar_module_default.railDot,
										"aria-hidden": "true"
									})]
								})
							}, entry.id);
						})
					})
				}),
				/* @__PURE__ */ jsxs("nav", {
					"aria-label": label ?? (activeSpace ? `${activeSpace.label} navigation` : "Main"),
					className: sidebar_module_default.navigation,
					onKeyDown: (event) => {
						keyed.current = event.key === "Enter" || event.key === " ";
						goUp(event);
						moveFocus(event);
					},
					onPointerDown: () => {
						keyed.current = false;
					},
					children: [/* @__PURE__ */ jsxs("div", {
						ref: navRef,
						"data-enter": enter,
						"data-scroll-fade": "y",
						className: sidebar_module_default.nav,
						children: [
							scope && /* @__PURE__ */ jsx("div", {
								className: sidebar_module_default.section,
								ref: (node) => {
									backRef.current = node?.querySelector("[data-sidebar-back]") ?? null;
								},
								children: /* @__PURE__ */ jsx(SidebarRow, {
									item: {
										...scope.back,
										icon: "chev-left"
									},
									rail,
									back: true,
									onNavigate: navigate
								})
							}),
							shownSections.map((section, index) => /* @__PURE__ */ jsxs("div", {
								className: sidebar_module_default.section,
								children: [section.label && /* @__PURE__ */ jsx("p", {
									className: sidebar_module_default.sectionLabel,
									children: /* @__PURE__ */ jsx("span", { children: section.label })
								}), /* @__PURE__ */ jsx(SidebarItems, {
									items: rail && section.icon && section.label ? [{
										id: `section-${section.label}`,
										label: section.label,
										icon: section.icon,
										children: section.items
									}] : section.items,
									current,
									rail,
									onNavigate: navigate
								})]
							}, section.label ?? index)),
							/* @__PURE__ */ jsx(ListHighlight, {})
						]
					}, view), footerItems && footerItems.length > 0 && /* @__PURE__ */ jsx("div", {
						className: sidebar_module_default.footer,
						children: /* @__PURE__ */ jsx(SidebarItems, {
							items: footerItems,
							current,
							rail,
							onNavigate: navigate
						})
					})]
				}),
				inSheet && narrow && /* @__PURE__ */ jsx("div", {
					ref: slotRefs.account,
					className: sidebar_module_default.sheetAccount
				}),
				(toggle || cornerEnd || inSheet && narrow) && /* @__PURE__ */ jsxs("div", {
					className: sidebar_module_default.corner,
					"data-has-end": Boolean(cornerEnd) || void 0,
					children: [
						toggle,
						inSheet && narrow && /* @__PURE__ */ jsx("span", {
							ref: slotRefs.icons,
							className: sidebar_module_default.cornerSlot
						}),
						cornerEnd
					]
				})
			]
		});
	};
	const sheetLabel = label ?? (activeSpace ? `${activeSpace.label} navigation` : "Main");
	return /* @__PURE__ */ jsx(LevelTrail, {
		value: trail,
		children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
			!narrow && panel(false),
			sheeted && shell && /* @__PURE__ */ jsx(Sheet, {
				open: shell.navigationOpen,
				onOpenChange: shell.setNavigationOpen,
				children: /* @__PURE__ */ jsxs(SheetContent, {
					side: "left",
					showCloseButton: false,
					"aria-describedby": void 0,
					className: sidebar_module_default.sheet,
					style: { width: "fit-content" },
					onCloseAutoFocus: (event) => {
						event.preventDefault();
						(narrow ? shell.navigationTrigger.current : toggleRef.current)?.focus();
					},
					onOpenAutoFocus: (event) => {
						const target = event.currentTarget.querySelector("[aria-current=\"page\"]");
						if (!target) return;
						event.preventDefault();
						target.focus();
					},
					children: [/* @__PURE__ */ jsx(SheetTitle, {
						className: sidebar_module_default.srOnly,
						children: sheetLabel
					}), panel(true)]
				})
			}),
			help && narrow && /* @__PURE__ */ jsx(HelpSheet, {
				help,
				open: helpSheetOpen,
				onOpenChange: setHelpSheetOpen
			})
		] })
	});
};
var sidebarLinks = ({ sections, levels, scope, spaces, footerItems }) => [
	...sections ?? [],
	...(levels ?? []).flatMap((entry) => entry.sections),
	...scope?.sections ?? [],
	...(spaces ?? []).flatMap((entry) => entry.sections)
].flatMap((section) => section.items).concat(footerItems ?? []).flatMap((item) => [item, ...item.children ?? []]).filter((item) => item.link);
var RoutedSidebar = ({ links, ...props }) => {
	const match = useCipherLinkMatch();
	let routed;
	links.forEach((item) => {
		const found = item.link && match(item.link);
		if (!found) return;
		const rank = (found.exact ? 1e6 : 0) + found.length;
		if (!routed || rank > routed.rank) routed = {
			id: item.id,
			rank
		};
	});
	return /* @__PURE__ */ jsx(SidebarView, {
		...props,
		current: routed?.id ?? props.current
	});
};
var Sidebar = (props) => {
	const links = sidebarLinks(props);
	return links.length ? /* @__PURE__ */ jsx(RoutedSidebar, {
		...props,
		links
	}) : /* @__PURE__ */ jsx(SidebarView, { ...props });
};
export { Sidebar };

//# sourceMappingURL=sidebar.js.map