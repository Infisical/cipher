"use client";
import { formControlSelector, skipAutoFocus } from "../lib/initial-focus.js";
import { exit, fade, spring } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogSubheader, DialogTitle, DialogTrigger } from "./dialog.js";
import { Field, FieldErrors } from "./field.js";
import { Icon } from "./icon.js";
import { Link } from "./link.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { ProgressSteps } from "./progress.js";
import { toast } from "./sonner.js";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSubheader, SheetTitle, SheetTrigger, useSheetView } from "./sheet.js";
import helpers_module_default from "./helpers.module.js";
import multi_step_module_default from "./multi-step.module.js";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/multi-step.tsx
var Steps = ({ steps, current, orientation = "horizontal", onStepClick, label = "Steps", showHeading }) => {
	if (orientation === "horizontal") return /* @__PURE__ */ jsx(ProgressSteps, {
		steps: steps.map((entry) => entry.title),
		current,
		label,
		showHeading
	});
	return /* @__PURE__ */ jsx("ol", {
		"data-slot": "steps",
		"aria-label": label,
		className: multi_step_module_default.steps,
		children: steps.map((entry, index) => {
			const state = index < current ? "done" : index === current ? "current" : "upcoming";
			const marker = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
				className: multi_step_module_default.marker,
				"aria-hidden": "true",
				children: state === "done" ? /* @__PURE__ */ jsx(Icon, {
					name: "check",
					size: 14
				}) : index + 1
			}), /* @__PURE__ */ jsxs("span", {
				className: multi_step_module_default.stepText,
				children: [/* @__PURE__ */ jsx("span", {
					className: multi_step_module_default.stepTitle,
					children: entry.title
				}), entry.summary && /* @__PURE__ */ jsx("span", {
					className: multi_step_module_default.stepSummary,
					children: entry.summary
				})]
			})] });
			return /* @__PURE__ */ jsx("li", {
				className: multi_step_module_default.step,
				"data-state": state,
				"aria-current": state === "current" ? "step" : void 0,
				children: onStepClick && index < current ? /* @__PURE__ */ jsx("button", {
					type: "button",
					className: multi_step_module_default.stepButton,
					onClick: () => onStepClick(index),
					children: marker
				}) : /* @__PURE__ */ jsx("span", {
					className: multi_step_module_default.stepButton,
					children: marker
				})
			}, entry.title);
		})
	});
};
var noErrors = {};
var holdsField = (node, name) => React.Children.toArray(node).some((child) => React.isValidElement(child) && (child.type === Field && child.props.name === name || holdsField(child.props.children, name)));
var MultiStep = ({ steps, variant = "dialog", layout = "stack", size, title, badges, media, description, open, defaultOpen = false, onOpenChange, trigger, onComplete, completeLabel = "Finish", cancelLabel = "Cancel", footerStart, onCancel, step, defaultStep = 0, onStepChange, className }) => {
	const [isOpen, setOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange
	});
	const [current, setCurrent] = useControllableState({
		value: step,
		defaultValue: defaultStep,
		onChange: onStepChange
	});
	const [busy, setBusy] = React.useState(false);
	const [error, setError] = React.useState();
	const [fieldErrors, setFieldErrors] = React.useState(noErrors);
	const [direction, setDirection] = React.useState(1);
	const [queued, setQueued] = React.useState(false);
	const [height, setHeight] = React.useState();
	const viewport = React.useRef(null);
	const activeStep = () => viewport.current?.querySelector(`[data-step="${current}"]`) ?? null;
	const moved = React.useRef(false);
	const revealed = React.useRef(null);
	const reveal = () => {
		const target = revealed.current;
		revealed.current = null;
		if (target && target === document.activeElement) target.scrollIntoView({ block: "nearest" });
	};
	const reduced = useReducedMotion();
	const formId = React.useId();
	const entry = steps[current];
	const last = current === steps.length - 1;
	const single = steps.length === 1;
	React.useLayoutEffect(() => {
		if (!moved.current) return;
		viewport.current?.closest("[data-slot=\"sheet-scroll\"], [data-slot=\"dialog-scroll\"]")?.scrollTo({ top: 0 });
	}, [current]);
	React.useEffect(() => {
		if (!moved.current) return;
		moved.current = false;
		const step = viewport.current?.querySelector(`[data-step="${current}"]`);
		const selected = step?.querySelector("[data-list-target][aria-current]");
		revealed.current = selected ?? null;
		if (selected) selected.focus({ preventScroll: true });
		else step?.querySelector(formControlSelector)?.focus({ preventScroll: variant !== "page" });
	}, [current]);
	const measure = React.useCallback((node) => {
		if (!node) return void 0;
		const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const routed = React.useRef(/* @__PURE__ */ new Map());
	const installed = React.useRef(void 0);
	const move = (target) => {
		const waiting = routed.current.get(target);
		routed.current.delete(target);
		installed.current = target;
		setError(void 0);
		setFieldErrors(waiting ?? noErrors);
		if (waiting) refocus.current = true;
		setDirection(target > current ? 1 : -1);
		moved.current = true;
		setCurrent(target);
	};
	React.useLayoutEffect(() => {
		const viaMove = installed.current === current;
		installed.current = void 0;
		if (viaMove || !routed.current.size) return;
		const waiting = routed.current.get(current);
		routed.current.delete(current);
		setFieldErrors(waiting ?? noErrors);
		if (waiting) refocus.current = true;
	}, [current]);
	React.useEffect(() => {
		if (!isOpen) routed.current.clear();
	}, [isOpen]);
	const reset = () => {
		routed.current.clear();
		setError(void 0);
		setFieldErrors(noErrors);
		if (current !== defaultStep) setCurrent(defaultStep);
	};
	const view = useSheetView();
	React.useEffect(() => {
		if (variant !== "view" || !view || !busy) return void 0;
		view.setPending(true);
		return () => view.setPending(false);
	}, [
		variant,
		view,
		busy
	]);
	const changeOpen = (next) => {
		if (!next && variant === "view") {
			if (!busy) view?.back(onCancel);
			return;
		}
		if (!next) {
			if (busy) return;
			onCancel?.();
			reset();
		}
		setOpen(next);
	};
	const refocus = React.useRef(false);
	React.useEffect(() => {
		if (busy || !refocus.current) return;
		refocus.current = false;
		activeStep()?.querySelector("[aria-invalid=true]")?.focus();
	});
	const blocks = (result) => {
		if (result === false) {
			refocus.current = true;
			return true;
		}
		if (!result || typeof result !== "object") {
			setFieldErrors(noErrors);
			return false;
		}
		const fields = result.fields ?? noErrors;
		setFieldErrors(fields);
		setError(result.message);
		if (Object.values(fields).some(Boolean)) refocus.current = true;
		return Object.values(fields).some(Boolean) || Boolean(result.message);
	};
	const advance = async () => {
		if (busy || !entry || entry.disabledReason) return;
		setError(void 0);
		setBusy(true);
		try {
			if (blocks(await entry.validate?.())) return;
			if (!last) {
				move(current + 1);
				return;
			}
			const result = await onComplete?.();
			if (result && typeof result === "object" && current > 0) {
				const override = result.step !== void 0 && steps[result.step] ? result.step : void 0;
				const byStep = /* @__PURE__ */ new Map();
				Object.entries(result.fields ?? noErrors).forEach(([name, message]) => {
					if (!message) return;
					const found = steps.findIndex((candidate) => holdsField(candidate.content, name));
					const target = override ?? (found === -1 ? current : found);
					byStep.set(target, {
						...byStep.get(target),
						[name]: message
					});
				});
				const earliest = byStep.size ? Math.min(...byStep.keys()) : override ?? current;
				if ((byStep.size || result.message) && earliest < current) {
					routed.current = byStep;
					move(earliest);
					setError(result.message);
					return;
				}
			}
			if (blocks(result)) return;
			if (variant === "view") view?.done();
			else if (variant !== "page") {
				reset();
				setOpen(false);
			}
		} catch (failure) {
			toast.error(failure instanceof Error ? failure.message : "Something went wrong. Try again.");
		} finally {
			setBusy(false);
		}
	};
	React.useEffect(() => {
		if (!queued) return;
		setQueued(false);
		advance();
	}, [queued]);
	if (!entry) return null;
	const axis = variant === "page" ? "y" : "x";
	const travel = reduced ? 0 : 24;
	const at = (offset) => axis === "x" ? { x: offset } : { y: offset };
	const slide = {
		enter: (sign) => ({
			opacity: 0,
			...at(sign * travel)
		}),
		center: {
			opacity: 1,
			...at(0),
			transition: reduced ? fade.enter : spring.slow
		},
		leave: (sign) => ({
			opacity: 0,
			...at(-sign * travel),
			transition: reduced ? fade.exit : exit.moderate
		})
	};
	const titled = variant === "page" || !single || !title && variant !== "view";
	const aside = layout === "aside" && (variant === "dialog" || variant === "sheet");
	const about = aside && entry.aside && /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("p", {
			className: multi_step_module_default.eyebrow,
			children: [
				"Step ",
				current + 1,
				" · ",
				entry.aside.title ?? entry.title
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: multi_step_module_default.lede,
			children: entry.aside.description
		}),
		entry.aside.docsHref && /* @__PURE__ */ jsxs(Link, {
			href: entry.aside.docsHref,
			target: "_blank",
			rel: "noopener noreferrer",
			className: multi_step_module_default.docs,
			children: [entry.aside.docsLabel ?? "Documentation", /* @__PURE__ */ jsx(Icon, {
				name: "external",
				size: 12
			})]
		})
	] });
	const stepHead = (titled || entry.description || about) && /* @__PURE__ */ jsxs("div", {
		className: multi_step_module_default.stepHead,
		children: [
			variant === "page" && !single && /* @__PURE__ */ jsxs("p", {
				className: multi_step_module_default.eyebrow,
				children: [
					"Step ",
					current + 1,
					" of ",
					steps.length
				]
			}),
			(titled || about) && /* @__PURE__ */ jsxs("div", {
				className: multi_step_module_default.headRow,
				children: [titled && (entry.badges ? /* @__PURE__ */ jsxs("div", {
					className: cn(multi_step_module_default.headingRow, helpers_module_default.titleWithBadges),
					children: [/* @__PURE__ */ jsx("h3", {
						className: multi_step_module_default.heading,
						children: entry.heading ?? entry.title
					}), /* @__PURE__ */ jsx("span", {
						"data-slot": "multi-step-badges",
						className: helpers_module_default.titleBadges,
						children: entry.badges
					})]
				}) : /* @__PURE__ */ jsx("h3", {
					className: multi_step_module_default.heading,
					children: entry.heading ?? entry.title
				})), about && /* @__PURE__ */ jsxs(Popover, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "ghost",
						size: "xs",
						icon: "info",
						className: multi_step_module_default.aboutToggle,
						children: "About this step"
					})
				}), /* @__PURE__ */ jsx(PopoverContent, {
					align: "end",
					className: multi_step_module_default.about,
					children: about
				})] })]
			}),
			entry.description && /* @__PURE__ */ jsx("p", {
				className: multi_step_module_default.lede,
				children: entry.description
			})
		]
	});
	const fields = /* @__PURE__ */ jsx("form", {
		id: formId,
		"data-slot": variant === "page" ? void 0 : "multi-step",
		"data-variant": variant === "page" ? void 0 : variant,
		noValidate: true,
		className: multi_step_module_default.form,
		onSubmit: (event) => {
			event.preventDefault();
			advance();
		},
		children: /* @__PURE__ */ jsx("fieldset", {
			disabled: busy,
			className: multi_step_module_default.fields,
			children: /* @__PURE__ */ jsx(motion.div, {
				ref: viewport,
				initial: false,
				animate: height === void 0 ? void 0 : { height },
				transition: reduced ? { duration: 0 } : spring.moderate,
				className: multi_step_module_default.viewport,
				children: /* @__PURE__ */ jsx(AnimatePresence, {
					mode: "popLayout",
					initial: false,
					custom: direction,
					children: /* @__PURE__ */ jsxs(motion.div, {
						ref: measure,
						"data-step": current,
						className: multi_step_module_default.body,
						custom: direction,
						variants: slide,
						initial: "enter",
						animate: "center",
						exit: "leave",
						onAnimationComplete: (definition) => {
							if (definition === "center") reveal();
						},
						children: [stepHead, /* @__PURE__ */ jsx(FieldErrors, {
							errors: fieldErrors,
							children: entry.render ? entry.render({ next: () => setQueued(true) }) : entry.content
						})]
					}, current)
				})
			})
		})
	});
	const footer = entry.footer !== false && /* @__PURE__ */ jsxs(Fragment, { children: [
		footerStart && /* @__PURE__ */ jsx("div", {
			className: multi_step_module_default.start,
			...skipAutoFocus,
			children: footerStart
		}),
		/* @__PURE__ */ jsx("p", {
			className: cn(multi_step_module_default.status, error && multi_step_module_default.error),
			role: "status",
			children: error ?? (variant === "page" || single ? null : `Step ${current + 1} of ${steps.length}`)
		}),
		/* @__PURE__ */ jsxs("div", {
			className: multi_step_module_default.buttons,
			children: [current === 0 ? /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: () => changeOpen(false),
				disabled: busy,
				children: cancelLabel
			}) : /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: () => move(current - 1),
				disabled: busy,
				children: "Back"
			}), /* @__PURE__ */ jsx(Button, {
				type: "submit",
				form: formId,
				variant: last ? entry.completeVariant ?? "primary" : "primary",
				icon: last ? entry.completeIcon : void 0,
				size: "sm",
				loading: busy,
				disabledReason: entry.disabledReason,
				children: last ? completeLabel : entry.nextLabel ?? "Continue"
			})]
		})
	] });
	const label = typeof title === "string" ? `${title} steps` : "Steps";
	if (variant === "page") return /* @__PURE__ */ jsx("div", {
		"data-slot": "multi-step",
		"data-variant": "page",
		className: cn(multi_step_module_default.page, className),
		children: /* @__PURE__ */ jsxs("div", {
			className: multi_step_module_default.pageGrid,
			"data-single": single || void 0,
			children: [!single && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: multi_step_module_default.rail,
				children: /* @__PURE__ */ jsx(Steps, {
					steps,
					current,
					orientation: "vertical",
					onStepClick: busy ? void 0 : move
				})
			}), /* @__PURE__ */ jsx("div", {
				className: multi_step_module_default.bar,
				children: /* @__PURE__ */ jsx(Steps, {
					steps,
					current,
					label
				})
			})] }), /* @__PURE__ */ jsxs("div", {
				className: multi_step_module_default.card,
				children: [fields, footer && /* @__PURE__ */ jsx("div", {
					className: multi_step_module_default.footer,
					children: footer
				})]
			})]
		})
	});
	const meter = single ? null : /* @__PURE__ */ jsx(Steps, {
		steps,
		current,
		label,
		showHeading: false
	});
	const asided = steps.some((candidate) => candidate.aside);
	const body = aside ? /* @__PURE__ */ jsxs("div", {
		className: multi_step_module_default.asideGrid,
		"data-rail": single ? void 0 : "",
		"data-aside": asided ? "" : void 0,
		children: [
			!single && /* @__PURE__ */ jsx("div", {
				className: multi_step_module_default.rail,
				children: /* @__PURE__ */ jsx(Steps, {
					steps,
					current,
					label,
					orientation: "vertical",
					onStepClick: busy ? void 0 : move
				})
			}),
			fields,
			asided && /* @__PURE__ */ jsx("aside", {
				"aria-label": "About this step",
				className: multi_step_module_default.aside,
				children: about
			})
		]
	}) : fields;
	const meterClass = aside && !single ? multi_step_module_default.meter : void 0;
	const lead = (head) => media ? /* @__PURE__ */ jsxs("div", {
		className: multi_step_module_default.titleRow,
		children: [/* @__PURE__ */ jsx("span", {
			className: cn(multi_step_module_default.media, "cipher-lead-block"),
			children: media
		}), /* @__PURE__ */ jsx("div", {
			className: multi_step_module_default.titleText,
			children: head
		})]
	}) : head;
	if (variant === "view") return /* @__PURE__ */ jsxs(Fragment, { children: [
		meter && view?.subheader && createPortal(/* @__PURE__ */ jsx(SheetSubheader, { children: meter }), view.subheader),
		/* @__PURE__ */ jsx(SheetBody, {
			className,
			children: fields
		}),
		footer && view?.footer && createPortal(/* @__PURE__ */ jsx(SheetFooter, {
			className: multi_step_module_default.footer,
			children: footer
		}), view.footer)
	] });
	if (variant === "sheet") return /* @__PURE__ */ jsxs(Sheet, {
		open: isOpen,
		onOpenChange: changeOpen,
		children: [trigger && /* @__PURE__ */ jsx(SheetTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsxs(SheetContent, {
			size: size ?? (aside ? "xl" : void 0),
			className: cn(aside && multi_step_module_default.asideFrame, className),
			children: [
				/* @__PURE__ */ jsx(SheetHeader, { children: lead(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SheetTitle, {
					badges,
					children: title
				}), description && /* @__PURE__ */ jsx(SheetDescription, { children: description })] })) }),
				meter && /* @__PURE__ */ jsx(SheetSubheader, {
					className: meterClass,
					children: meter
				}),
				/* @__PURE__ */ jsx(SheetBody, { children: body }),
				footer && /* @__PURE__ */ jsx(SheetFooter, {
					className: multi_step_module_default.footer,
					children: footer
				})
			]
		})]
	});
	return /* @__PURE__ */ jsxs(Dialog, {
		open: isOpen,
		onOpenChange: changeOpen,
		children: [trigger && /* @__PURE__ */ jsx(DialogTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsxs(DialogContent, {
			className: cn(aside && multi_step_module_default.asideFrame, aside && multi_step_module_default.asideDialog, className),
			children: [
				/* @__PURE__ */ jsx(DialogHeader, { children: lead(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DialogTitle, {
					badges,
					children: title
				}), description && /* @__PURE__ */ jsx(DialogDescription, { children: description })] })) }),
				meter && /* @__PURE__ */ jsx(DialogSubheader, {
					className: meterClass,
					children: meter
				}),
				body,
				footer && /* @__PURE__ */ jsx(DialogFooter, {
					className: multi_step_module_default.footer,
					children: footer
				})
			]
		})]
	});
};
export { MultiStep, Steps };

//# sourceMappingURL=multi-step.js.map