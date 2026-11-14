import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

import { type FieldErrorMap } from "../lib/field-context";
import { formControlSelector } from "../lib/initial-focus";
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
import { FieldErrors } from "./field";
import { Icon } from "./icon";
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
  SheetTrigger
} from "./sheet";

import styles from "./multi-step.module.css";

/**
 * false keeps the step (the step shows its own field errors). fields puts each message on the Field
 * with that name and focuses the first. message is the footer fallback, only for an error that has
 * no field and is not worth a toast. A thrown error is a toast.
 */
type ValidateResult = boolean | void | { fields?: FieldErrorMap; message?: string };

export interface MultiStepStep {
  title: string;
  heading?: string;
  description?: React.ReactNode;
  summary?: React.ReactNode;
  content?: React.ReactNode;
  /** Renders the step with `next`, which validates and advances once the state set beside it has rendered, so a step that is a single pick can advance on pick. Used instead of content. */
  render?: (step: { next: () => void }) => React.ReactNode;
  validate?: () => ValidateResult | Promise<ValidateResult>;
  nextLabel?: string;
  /** Blocks Continue (or the final action on the last step) and says why, as Button's disabledReason does: it stays focusable and shows the reason in a tooltip. */
  disabledReason?: string;
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
  variant?: "dialog" | "sheet" | "page";
  size?: React.ComponentProps<typeof SheetContent>["size"];
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  onComplete?: () => void | Promise<unknown>;
  completeLabel?: string;
  onCancel?: () => void;
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
};

const noErrors: FieldErrorMap = {};

export const MultiStep = ({
  steps,
  variant = "dialog",
  size,
  title,
  description,
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  onComplete,
  completeLabel = "Finish",
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
  const move = (target: number) => {
    setError(undefined);
    setFieldErrors(noErrors);
    setDirection(target > current ? 1 : -1);
    moved.current = true;
    setCurrent(target);
  };
  const reset = () => {
    setError(undefined);
    setFieldErrors(noErrors);
    if (current !== defaultStep) setCurrent(defaultStep);
  };
  const changeOpen = (next: boolean) => {
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
  const advance = async () => {
    if (busy || !entry || entry.disabledReason) return;
    setError(undefined);
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
  const at = (offset: number) => (axis === "x" ? { x: offset } : { y: offset });
  const slide: Variants = {
    enter: (sign: number) => ({ opacity: 0, ...at(sign * travel) }),
    center: { opacity: 1, ...at(0), transition: reduced ? fade.enter : spring.slow },
    leave: (sign: number) => ({
      opacity: 0,
      ...at(-sign * travel),
      transition: reduced ? fade.exit : exit.moderate
    })
  };
  const stepHead = (
    <div className={styles.stepHead}>
      {variant === "page" && (
        <p className={styles.eyebrow}>
          Step {current + 1} of {steps.length}
        </p>
      )}
      <h3 className={styles.heading}>{entry.heading ?? entry.title}</h3>
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
      <p className={cn(styles.status, error && styles.error)} role="status">
        {error ?? (variant === "page" ? null : `Step ${current + 1} of ${steps.length}`)}
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
            Cancel
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
          variant="primary"
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
        <div className={styles.pageGrid}>
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
          <div className={styles.card}>
            {fields}
            <div className={styles.footer}>{footer}</div>
          </div>
        </div>
      </div>
    );
  const meter = <Steps steps={steps} current={current} label={label} showHeading={false} />;
  if (variant === "sheet")
    return (
      <Sheet open={isOpen} onOpenChange={changeOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent size={size} className={className}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <SheetSubheader>{meter}</SheetSubheader>
          <SheetBody>{fields}</SheetBody>
          <SheetFooter className={styles.footer}>{footer}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogSubheader>{meter}</DialogSubheader>
        {fields}
        <DialogFooter className={styles.footer}>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
