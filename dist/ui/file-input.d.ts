import * as React from "react";
import { type IconSource } from "./icon";
export declare const formatFileSize: (bytes: number) => string;
export type FileInputProps = {
    /** Selected files, listed under the zone. */
    files?: File[];
    /** Receives the files this pick or drop added that pass accept and maxSize. */
    onFiles: (files: File[]) => void;
    /** Renders a remove button on each listed file. */
    onRemove?: (file: File, index: number) => void;
    /** The native accept list: extensions (.json) and MIME types (image/png, image/*). Picked and dropped files are both checked against it. */
    accept?: string;
    multiple?: boolean;
    /** The largest file accepted, in bytes. */
    maxSize?: number;
    disabled?: boolean;
    /** A message from the caller, such as a file that failed to parse. Announced with the rejected files. */
    error?: string;
    title?: string;
    /** Replaces the accepted types and size line derived from accept and maxSize. */
    hint?: string;
    icon?: IconSource;
    size?: "default" | "sm";
    className?: string;
    id?: string;
    name?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
};
/**
 * A drop target for files with a Browse button over a hidden native file input. Picked and dropped
 * files are filtered by accept and maxSize; the rest are named in a live region instead of added.
 */
export declare function FileInput({ files, onFiles, onRemove, accept, multiple, maxSize, disabled, error, title, hint, icon, size, className, name, ref, ...props }: FileInputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace FileInput {
    var displayName: string;
}
