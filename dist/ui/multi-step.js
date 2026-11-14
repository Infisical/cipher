import "../lib/initial-focus.js";
import { exit, fade, spring } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogSubheader, DialogTitle, DialogTrigger } from "./dialog.js";
import { FieldErrors } from "./field.js";
import { Icon } from "./icon.js";
import { ProgressSteps } from "./progress.js";
import { toast } from "./sonner.js";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSubheader, SheetTitle, SheetTrigger } from "./sheet.js";
import multi_step_module_default from "./multi-step.module.js";
import * as React from "react";
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
var MultiStep = ({ steps, variant = "dialog", size, title, description, open, defaultOpen = false, onOpenChange, trigger, onComplete, completeLabel = "Finish", onCancel, step, defaultStep = 0, onStepChange, className }) => {
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
	const reduced = useReducedMotion();
	const formId = React.useId();
	const entry = steps[current];
	const last = current === steps.length - 1;
	React.useLayoutEffect(() => {
		if (!moved.current) return;
		viewport.current?.closest("[data-slot=\"sheet-scroll\"], [data-slot=\"dialog-scroll\"]")?.scrollTo({ top: 0 });
	}, [current]);
	React.useEffect(() => {
		if (!moved.current) return;
		moved.current = false;
		const step = viewport.current?.querySelector(`[data-step="${current}"]`);
		(step?.querySelector("[data-list-target][aria-current]") ?? step?.querySelector(":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])"))?.focus();
	}, [current]);
	const measure = React.useCallback((node) => {
		if (!node) return void 0;
		const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const move = (target) => {
		setError(void 0);
		setFieldErrors(noErrors);
		setDirection(target > current ? 1 : -1);
		moved.current = true;
		setCurrent(target);
	};
	const reset = () => {
		setError(void 0);
		setFieldErrors(noErrors);
		if (current !== defaultStep) setCurrent(defaultStep);
	};
	const changeOpen = (next) => {
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
	const advance = async () => {
		if (busy || !entry || entry.disabledReason) return;
		setError(void 0);
		setBusy(true);
		try {
			const result = await entry.validate?.();
			if (result === false) {
				refocus.current = true;
				return;
			}
			if (result && typeof result === "object") {
				const fields = result.fields ?? noErrors;
				setFieldErrors(fields);
				setError(result.message);
				if (Object.values(fields).some(Boolean)) {
					refocus.current = true;
					return;
				}
				if (result.message) return;
			}
			if (!last) {
				move(current + 1);
				return;
			}
			await onComplete?.();
			if (variant !== "page") {
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
	const stepHead = /* @__PURE__ */ jsxs("div", {
		className: multi_step_module_default.stepHead,
		children: [
			variant === "page" && /* @__PURE__ */ jsxs("p", {
				className: multi_step_module_default.eyebrow,
				children: [
					"Step ",
					current + 1,
					" of ",
					steps.length
				]
			}),
			/* @__PURE__ */ jsx("h3", {
				className: multi_step_module_default.heading,
				children: entry.heading ?? entry.title
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
						children: [stepHead, /* @__PURE__ */ jsx(FieldErrors, {
							errors: fieldErrors,
							children: entry.render ? entry.render({ next: () => setQueued(true) }) : entry.content
						})]
					}, current)
				})
			})
		})
	});
	const footer = /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
		className: cn(multi_step_module_default.status, error && multi_step_module_default.error),
		role: "status",
		children: error ?? (variant === "page" ? null : `Step ${current + 1} of ${steps.length}`)
	}), /* @__PURE__ */ jsxs("div", {
		className: multi_step_module_default.buttons,
		children: [current === 0 ? /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "sm",
			onClick: () => changeOpen(false),
			disabled: busy,
			children: "Cancel"
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
			variant: "primary",
			size: "sm",
			loading: busy,
			disabledReason: entry.disabledReason,
			children: last ? completeLabel : entry.nextLabel ?? "Continue"
		})]
	})] });
	const label = typeof title === "string" ? `${title} steps` : "Steps";
	if (variant === "page") return /* @__PURE__ */ jsx("div", {
		"data-slot": "multi-step",
		"data-variant": "page",
		className: cn(multi_step_module_default.page, className),
		children: /* @__PURE__ */ jsxs("div", {
			className: multi_step_module_default.pageGrid,
			children: [
				/* @__PURE__ */ jsx("div", {
					className: multi_step_module_default.rail,
					children: /* @__PURE__ */ jsx(Steps, {
						steps,
						current,
						orientation: "vertical",
						onStepClick: busy ? void 0 : move
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: multi_step_module_default.bar,
					children: /* @__PURE__ */ jsx(Steps, {
						steps,
						current,
						label
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: multi_step_module_default.card,
					children: [fields, /* @__PURE__ */ jsx("div", {
						className: multi_step_module_default.footer,
						children: footer
					})]
				})
			]
		})
	});
	const meter = /* @__PURE__ */ jsx(Steps, {
		steps,
		current,
		label,
		showHeading: false
	});
	if (variant === "sheet") return /* @__PURE__ */ jsxs(Sheet, {
		open: isOpen,
		onOpenChange: changeOpen,
		children: [trigger && /* @__PURE__ */ jsx(SheetTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsxs(SheetContent, {
			size,
			className,
			children: [
				/* @__PURE__ */ jsxs(SheetHeader, { children: [/* @__PURE__ */ jsx(SheetTitle, { children: title }), description && /* @__PURE__ */ jsx(SheetDescription, { children: description })] }),
				/* @__PURE__ */ jsx(SheetSubheader, { children: meter }),
				/* @__PURE__ */ jsx(SheetBody, { children: fields }),
				/* @__PURE__ */ jsx(SheetFooter, {
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
			className,
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: title }), description && /* @__PURE__ */ jsx(DialogDescription, { children: description })] }),
				/* @__PURE__ */ jsx(DialogSubheader, { children: meter }),
				fields,
				/* @__PURE__ */ jsx(DialogFooter, {
					className: multi_step_module_default.footer,
					children: footer
				})
			]
		})]
	});
};
export { MultiStep, Steps };

//# sourceMappingURL=multi-step.js.map