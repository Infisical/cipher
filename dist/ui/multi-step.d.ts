import * as React from "react";
import { type FieldErrorMap } from "../lib/field-context";
import { SheetContent } from "./sheet";
/**
 * false keeps the step (the step shows its own field errors). fields puts each message on the Field
 * with that name and focuses the first. message is the footer fallback, only for an error that has
 * no field and is not worth a toast. A thrown error is a toast.
 */
type ValidateResult = boolean | void | {
    fields?: FieldErrorMap;
    message?: string;
};
export interface MultiStepStep {
    title: string;
    heading?: string;
    description?: React.ReactNode;
    summary?: React.ReactNode;
    content?: React.ReactNode;
    /** Renders the step with `next`, which validates and advances once the state set beside it has rendered, so a step that is a single pick can advance on pick. Used instead of content. */
    render?: (step: {
        next: () => void;
    }) => React.ReactNode;
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
} & ({
    orientation?: "horizontal";
    onStepClick?: never;
} | {
    orientation: "vertical";
    onStepClick?: (index: number) => void;
});
export declare const Steps: ({ steps, current, orientation, onStepClick, label, showHeading }: StepsProps) => React.JSX.Element;
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
export declare const MultiStep: ({ steps, variant, size, title, description, open, defaultOpen, onOpenChange, trigger, onComplete, completeLabel, onCancel, step, defaultStep, onStepChange, className }: MultiStepProps) => React.JSX.Element | null;
export {};
