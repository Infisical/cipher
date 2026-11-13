import * as React from "react";
import { SheetContent } from "./sheet";
type ValidateResult = boolean | string | void;
export interface MultiStepStep {
    title: string;
    heading?: string;
    description?: React.ReactNode;
    summary?: React.ReactNode;
    content: React.ReactNode;
    validate?: () => ValidateResult | Promise<ValidateResult>;
    nextLabel?: string;
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
