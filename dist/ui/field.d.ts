import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Label } from "./label";
declare function FieldSet({ className, ref, ...props }: React.ComponentProps<"fieldset">): React.JSX.Element;
declare namespace FieldSet {
    var displayName: string;
}
declare function FieldLegend({ className, variant, ref, ...props }: React.ComponentPropsWithoutRef<"legend"> & {
    variant?: "legend" | "label";
} & {
    ref?: React.Ref<React.ComponentRef<"legend">>;
}): React.JSX.Element;
declare namespace FieldLegend {
    var displayName: string;
}
declare function FieldGroup({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace FieldGroup {
    var displayName: string;
}
declare const fieldVariants: (props?: ({
    orientation?: "horizontal" | "responsive" | "vertical" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Field({ className, orientation, label, description, error, optional, help, group, wide, children, id, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof fieldVariants> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: string;
    optional?: boolean;
    wide?: boolean;
} & ({
    /** Help beside the label, outside its accessible name: a string becomes a FieldHelp tooltip, a node (FieldHelp with its own label, GlobPatternHelp) renders as given. A group field takes none, because its legend names the group. */
    help?: React.ReactNode;
    group?: false;
} | {
    help?: never;
    group: true;
}) & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Field {
    var displayName: string;
}
declare function FieldContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace FieldContent {
    var displayName: string;
}
declare function FieldLabel({ className, ref, ...props }: React.ComponentProps<typeof Label>): React.JSX.Element;
declare namespace FieldLabel {
    var displayName: string;
}
declare function FieldHelp({ label, children }: {
    /** The info button's accessible name; keep it short and say what the help is about. */
    label?: string;
    children: React.ReactNode;
}): React.JSX.Element;
declare namespace FieldHelp {
    var displayName: string;
}
declare function FieldTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace FieldTitle {
    var displayName: string;
}
declare function FieldDescription({ className, ref, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare namespace FieldDescription {
    var displayName: string;
}
declare function FieldSeparator({ children, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace FieldSeparator {
    var displayName: string;
}
declare function FieldError({ className, children, errors, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    errors?: Array<{
        message?: string;
    } | undefined>;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element | null;
declare namespace FieldError {
    var displayName: string;
}
export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldHelp, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle };
