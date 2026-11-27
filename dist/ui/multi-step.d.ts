import * as React from "react";
import { type FieldErrorMap } from "../lib/field-context";
import { type IconName } from "./icon";
import { SheetContent } from "./sheet";
/**
 * false keeps the step (the step shows its own field errors). fields puts each message on the Field
 * with that name and focuses the first. message is the footer fallback, only for an error that has
 * no field and is not worth a toast. A thrown error is a toast. Returned by a step's validate and by
 * onComplete. onComplete's field errors go back to the step whose content holds a Field with that
 * name, the earliest one first, and each later step shows its own when it is reached; step names
 * the step for all of them instead, such as for a step drawn with render.
 */
export type MultiStepResult = boolean | void | {
    fields?: FieldErrorMap;
    message?: string;
    step?: number;
};
export interface MultiStepStep {
    title: string;
    heading?: string;
    /** Right after the step's heading: status badges, and a DocumentationLink so it stays paired with the heading. They drop below the heading before it wraps. Shown only where the step shows its heading; a single-step dialog or sheet puts them on its own badges. */
    badges?: React.ReactNode;
    description?: React.ReactNode;
    summary?: React.ReactNode;
    content?: React.ReactNode;
    /** Renders the step with `next`, which validates and advances once the state set beside it has rendered, so a step that is a single pick can advance on pick. Used instead of content. */
    render?: (step: {
        next: () => void;
    }) => React.ReactNode;
    validate?: () => MultiStepResult | Promise<MultiStepResult>;
    nextLabel?: string;
    /** Blocks Continue (or the final action on the last step) and says why, as Button's disabledReason does: it stays focusable and shows the reason in a tooltip. */
    disabledReason?: string;
    /** The final action's look when this is the last step: destructive for an irreversible submit, such as a break-glass request. */
    completeVariant?: "primary" | "destructive";
    completeIcon?: IconName;
    /** false drops the footer on this step, Cancel, Back and the primary button with it, for a step whose own control calls next, such as a picker. The dialog or sheet still closes from its close button and Escape, and a validate message has nowhere to show, so report problems on fields or with a toast. */
    footer?: false;
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
} & ({
    orientation?: "horizontal";
    onStepClick?: never;
} | {
    orientation: "vertical";
    onStepClick?: (index: number) => void;
});
export declare const Steps: ({ steps, current, orientation, onStepClick, label, showHeading, }: StepsProps) => React.JSX.Element;
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
    /** Leading media before the dialog or sheet title and description, such as a provider logo. It sits on the title's first line. */
    media?: React.ReactNode;
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
export declare const MultiStep: ({ steps, variant, layout, size, title, badges, media, description, open, defaultOpen, onOpenChange, trigger, onComplete, completeLabel, cancelLabel, footerStart, onCancel, step, defaultStep, onStepChange, className, }: MultiStepProps) => React.JSX.Element | null;
