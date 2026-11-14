import * as React from "react";
import { type IconName } from "../ui/icon";
import { type InputProps } from "../ui/input";
type FieldMappingSize = "sm" | "md" | "lg";
export type FieldMappingProps = {
    legend: string;
    sourceHeader: string;
    targetHeader: string;
    targetHint?: React.ReactNode;
    size?: FieldMappingSize;
    children: React.ReactNode;
};
export declare const FieldMapping: ({ legend, sourceHeader, targetHeader, targetHint, size, children }: FieldMappingProps) => React.JSX.Element;
export type FieldMappingRowProps = Omit<InputProps, "size" | "invalid"> & {
    source: string;
    icon?: IconName;
    error?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLInputElement>;
};
export declare const FieldMappingRow: ({ source, icon, error, ...props }: FieldMappingRowProps) => React.JSX.Element;
export {};
