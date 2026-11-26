import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

import { type FieldErrorMap } from "../lib/field-context";
import { formControlSelector, skipAutoFocus } from "../lib/initial-focus";
import { exit, fade, spring } from "../lib/motion";
import { useControllableState } from "../lib/use-controllable-state";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubheader,
  DialogTitle,
  DialogTrigger
} from "./dialog";
import { Field, FieldErrors } from "./field";
import { Icon, type IconName } from "./icon";
import { Link } from "./link";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ProgressSteps } from "./progress";
import { toast } from "./sonner";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSubheader,
  SheetTitle,
  SheetTrigger,
  useSheetView
} from "./sheet";

import styles from "./multi-step.module.css";

/**
 * false keeps the step (the step shows its own field errors). fields puts each message on the Field
 * with that name and focuses the first. message is the footer fallback, only for an error that has
 * no field and is not worth a toast. A thrown error is a toast. Returned by a step's validate and by
 * onComplete. onComplete's field errors go back to the step whose content holds a Field with that
 * name, the earliest one first, and each later step shows its own when it is reached; step names
 * the step for all of them instead, such as for a step drawn with render.
 */
export type MultiStepResult =
  boolean | void | { fields?: FieldErrorMap; message?: string; step?: number };

export interface MultiStepStep {
  title: string;
  heading?: string;
  description?: React.ReactNode;
  summary?: React.ReactNode;
  content?: React.ReactNode;
  /** Renders the step with `next`, which validates and advances once the state set beside it has rendered, so a step that is a single pick can advance on pick. Used instead of content. */
  render?: (step: { next: () => void }) => React.ReactNode;
  validate?: () => MultiStepResult | Promise<MultiStepResult>;
  nextLabel?: string;
  /** Blocks Continue (or the final action on the last step) and says why, as Button's disabledReason does: it stays focusable and shows the reason in a tooltip. */
  disabledReason?: string;
  /** The final action's look when this is the last step: destructive for an irreversible submit, such as a break-glass request. */
  completeVariant?: "primary" | "destructive";
  completeIcon?: IconName;
  /** What the step is for, beside the body in layout="aside" and in an "About this step" popover when that column does not fit. The eyebrow reads "Step N · title", title defaulting to the step's. */
  aside?: {
    title?: string;
    description: React.ReactNode;
    docsHref?: string;
    /** Defaults to "Documentation". */
    docsLabel?: string;
  };
}

export type StepsProps = {
  steps: readonly Pick<MultiStepStep, "title" | "summary">[];
  current: number;
  label?: string;
  showHeading?: boolean;
} & (
  | { orientation?: "horizontal"; onStepClick?: never }
  | { orientation: "vertical"; onStepClick?: (index: number) => void }
);

export const Steps = ({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  label = "Steps",
  showHeading
}: StepsProps) => {
  if (orientation === "horizontal")
    return (
      <ProgressSteps
        steps={steps.map((entry) => entry.title)}
        current={current}
        label={label}
        showHeading={showHeading}
      />
    );
  return (
    <ol data-slot="steps" aria-label={label} className={styles.steps}>
      {steps.map((entry, index) => {
        const state = index < current ? "done" : index === current ? "current" : "upcoming";
        const marker = (
          <>
            <span className={styles.marker} aria-hidden="true">
              {state === "done" ? <Icon name="check" size={14} /> : index + 1}
            </span>
            <span className={styles.stepText}>
              <span className={styles.stepTitle}>{entry.title}</span>
              {entry.summary && <span className={styles.stepSummary}>{entry.summary}</span>}
            </span>
          </>
        );
        return (
          <li
            key={entry.title}
            className={styles.step}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
          >
            {onStepClick && index < current ? (
              <button
                type="button"
                className={styles.stepButton}
                onClick={() => onStepClick(index)}
              >
                {marker}
              </button>
            ) : (
              <span className={styles.stepButton}>{marker}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export type MultiStepProps = {
  steps: readonly MultiStepStep[];
  /** view renders inside a SheetView: its meter and footer go to the view's slots, Cancel on the first step goes back, and completing returns to the parent view. */
  variant?: "dialog" | "sheet" | "page" | "view";
  /** aside lays a dialog or sheet out as the steps rail, the step body and each step's aside. It follows the width of the dialog or sheet, not the viewport: the aside becomes a popover first, then the rail becomes the meter above the body. The sheet defaults to size xl and the dialog widens to the same width. */
  layout?: "stack" | "aside";
  size?: React.ComponentProps<typeof SheetContent>["size"];
  title?: React.ReactNode;
  /** Right after the dialog or sheet title, such as its DocumentationLink. In a view, set badges on the SheetView. */
  badges?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onComplete?: () => MultiStepResult | Promise<MultiStepResult>;
  completeLabel?: string;
  cancelLabel?: string;
  /** Start of the footer, before the step status: a secondary action such as Delete on an edit sheet. Disable it while the flow is pending if it must not run during a save. */
  footerStart?: React.ReactNode;
  onCancel?: () => void;
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
};

const noErrors: FieldErrorMap = {};

const holdsField = (node: React.ReactNode, name: string): boolean =>
  React.Children.toArray(node).some(
    (child) =>
      React.isValidElement<{ name?: unknown; children?: React.ReactNode }>(child) &&
      ((child.type === Field && child.props.name === name) ||
        holdsField(child.props.children, name))
  );

export const MultiStep = ({
  steps,
  variant = "dialog",
  layout = "stack",
  size,
  title,
  badges,
  description,
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  onComplete,
  completeLabel = "Finish",
  cancelLabel = "Cancel",
  footerStart,
  onCancel,
  step,
  defaultStep = 0,
  onStepChange,
  className
}: MultiStepProps) => {
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
  const [error, setError] = React.useState<string>();
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrorMap>(noErrors);
  const [direction, setDirection] = React.useState(1);
  const [queued, setQueued] = React.useState(false);
  const [height, setHeight] = React.useState<number>();
  const viewport = React.useRef<HTMLDivElement | null>(null);
  const activeStep = () =>
    viewport.current?.querySelector<HTMLElement>(`[data-step="${current}"]`) ?? null;
  const moved = React.useRef(false);
  const reduced = useReducedMotion();
  const formId = React.useId();
  const entry = steps[current];
  const last = current === steps.length - 1;
  const single = steps.length === 1;
  React.useLayoutEffect(() => {
    if (!moved.current) return;
    viewport.current
      ?.closest<HTMLElement>('[data-slot="sheet-scroll"], [data-slot="dialog-scroll"]')
      ?.scrollTo({ top: 0 });
  }, [current]);
  React.useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const step = viewport.current?.querySelector<HTMLElement>(`[data-step="${current}"]`);
    (
      step?.querySelector<HTMLElement>("[data-list-target][aria-current]") ??
      step?.querySelector<HTMLElement>(formControlSelector)
    )?.focus();
  }, [current]);
  const measure = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return undefined;
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const routed = React.useRef(new Map<number, FieldErrorMap>());
  const installed = React.useRef<number | undefined>(undefined);
  const move = (target: number) => {
    const waiting = routed.current.get(target);
    routed.current.delete(target);
    installed.current = target;
    setError(undefined);
    setFieldErrors(waiting ?? noErrors);
    if (waiting) refocus.current = true;
    setDirection(target > current ? 1 : -1);
    moved.current = true;
    setCurrent(target);
  };
  React.useLayoutEffect(() => {
    const viaMove = installed.current === current;
    installed.current = undefined;
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
    setError(undefined);
    setFieldErrors(noErrors);
    if (current !== defaultStep) setCurrent(defaultStep);
  };
  const view = useSheetView();
  React.useEffect(() => {
    if (variant !== "view" || !view || !busy) return undefined;
    view.setPending(true);
    return () => view.setPending(false);
  }, [variant, view, busy]);
  const changeOpen = (next: boolean) => {
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
    activeStep()?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  });
  const blocks = (result: MultiStepResult) => {
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
    setError(undefined);
    setBusy(true);
    try {
      if (blocks(await entry.validate?.())) return;
      if (!last) {
        move(current + 1);
        return;
      }
      const result = await onComplete?.();
      if (result && typeof result === "object" && current > 0) {
        const override = result.step !== undefined && steps[result.step] ? result.step : undefined;
        const byStep = new Map<number, FieldErrorMap>();
        Object.entries(result.fields ?? noErrors).forEach(([name, message]) => {
          if (!message) return;
          const found = steps.findIndex((candidate) => holdsField(candidate.content, name));
          const target = override ?? (found === -1 ? current : found);
          byStep.set(target, { ...byStep.get(target), [name]: message });
        });
        const earliest = byStep.size ? Math.min(...byStep.keys()) : (override ?? current);
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
  const at = (offset: number) => (axis === "x" ? { x: offset } : { y: offset });
  const slide: Variants = {
    enter: (sign: number) => ({ opacity: 0, ...at(sign * travel) }),
    center: {
      opacity: 1,
      ...at(0),
      transition: reduced ? fade.enter : spring.slow
    },
    leave: (sign: number) => ({
      opacity: 0,
      ...at(-sign * travel),
      transition: reduced ? fade.exit : exit.moderate
    })
  };
  const titled = variant === "page" || !single || (!title && variant !== "view");
  const aside = layout === "aside" && (variant === "dialog" || variant === "sheet");
  const about = aside && entry.aside && (
    <>
      <p className={styles.eyebrow}>
        Step {current + 1} · {entry.aside.title ?? entry.title}
      </p>
      <div className={styles.lede}>{entry.aside.description}</div>
      {entry.aside.docsHref && (
        <Link
          href={entry.aside.docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docs}
        >
          {entry.aside.docsLabel ?? "Documentation"}
          <Icon name="external" size={12} />
        </Link>
      )}
    </>
  );
  const stepHead = (titled || entry.description || about) && (
    <div className={styles.stepHead}>
      {variant === "page" && !single && (
        <p className={styles.eyebrow}>
          Step {current + 1} of {steps.length}
        </p>
      )}
      {(titled || about) && (
        <div className={styles.headRow}>
          {titled && <h3 className={styles.heading}>{entry.heading ?? entry.title}</h3>}
          {about && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  icon="info"
                  className={styles.aboutToggle}
                >
                  About this step
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className={styles.about}>
                {about}
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
      {entry.description && <p className={styles.lede}>{entry.description}</p>}
    </div>
  );
  const fields = (
    <form
      id={formId}
      data-slot={variant === "page" ? undefined : "multi-step"}
      data-variant={variant === "page" ? undefined : variant}
      noValidate
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        advance();
      }}
    >
      <fieldset disabled={busy} className={styles.fields}>
        <motion.div
          ref={viewport}
          initial={false}
          animate={height === undefined ? undefined : { height }}
          transition={reduced ? { duration: 0 } : spring.moderate}
          className={styles.viewport}
        >
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={current}
              ref={measure}
              data-step={current}
              className={styles.body}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="leave"
            >
              {stepHead}
              <FieldErrors errors={fieldErrors}>
                {entry.render ? entry.render({ next: () => setQueued(true) }) : entry.content}
              </FieldErrors>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </fieldset>
    </form>
  );
  const footer = (
    <>
      {footerStart && (
        <div className={styles.start} {...skipAutoFocus}>
          {footerStart}
        </div>
      )}
      <p className={cn(styles.status, error && styles.error)} role="status">
        {error ?? (variant === "page" || single ? null : `Step ${current + 1} of ${steps.length}`)}
      </p>
      <div className={styles.buttons}>
        {current === 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => changeOpen(false)}
            disabled={busy}
          >
            {cancelLabel}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => move(current - 1)}
            disabled={busy}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          form={formId}
          variant={last ? (entry.completeVariant ?? "primary") : "primary"}
          icon={last ? entry.completeIcon : undefined}
          size="sm"
          loading={busy}
          disabledReason={entry.disabledReason}
        >
          {last ? completeLabel : (entry.nextLabel ?? "Continue")}
        </Button>
      </div>
    </>
  );
  const label = typeof title === "string" ? `${title} steps` : "Steps";
  if (variant === "page")
    return (
      <div data-slot="multi-step" data-variant="page" className={cn(styles.page, className)}>
        <div className={styles.pageGrid} data-single={single || undefined}>
          {!single && (
            <>
              <div className={styles.rail}>
                <Steps
                  steps={steps}
                  current={current}
                  orientation="vertical"
                  onStepClick={busy ? undefined : move}
                />
              </div>
              <div className={styles.bar}>
                <Steps steps={steps} current={current} label={label} />
              </div>
            </>
          )}
          <div className={styles.card}>
            {fields}
            <div className={styles.footer}>{footer}</div>
          </div>
        </div>
      </div>
    );
  const meter = single ? null : (
    <Steps steps={steps} current={current} label={label} showHeading={false} />
  );
  const asided = steps.some((candidate) => candidate.aside);
  const body = aside ? (
    <div className={styles.asideGrid} data-bare={asided ? undefined : ""}>
      {!single && (
        <div className={styles.rail}>
          <Steps
            steps={steps}
            current={current}
            label={label}
            orientation="vertical"
            onStepClick={busy ? undefined : move}
          />
        </div>
      )}
      {fields}
      {asided && (
        <aside aria-label="About this step" className={styles.aside}>
          {about}
        </aside>
      )}
    </div>
  ) : (
    fields
  );
  const meterClass = aside && !single ? styles.meter : undefined;
  if (variant === "view")
    return (
      <>
        {meter &&
          view?.subheader &&
          createPortal(<SheetSubheader>{meter}</SheetSubheader>, view.subheader)}
        <SheetBody className={className}>{fields}</SheetBody>
        {view?.footer &&
          createPortal(<SheetFooter className={styles.footer}>{footer}</SheetFooter>, view.footer)}
      </>
    );
  if (variant === "sheet")
    return (
      <Sheet open={isOpen} onOpenChange={changeOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          size={size ?? (aside ? "xl" : undefined)}
          className={cn(aside && styles.asideFrame, className)}
        >
          <SheetHeader>
            <SheetTitle badges={badges}>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {meter && <SheetSubheader className={meterClass}>{meter}</SheetSubheader>}
          <SheetBody>{body}</SheetBody>
          <SheetFooter className={styles.footer}>{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(aside && styles.asideFrame, aside && styles.asideDialog, className)}
      >
        <DialogHeader>
          <DialogTitle badges={badges}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {meter && <DialogSubheader className={meterClass}>{meter}</DialogSubheader>}
        {body}
        <DialogFooter className={styles.footer}>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
