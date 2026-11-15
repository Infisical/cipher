import * as React from "react";

import { useFieldControlAttributes } from "../lib/field-context";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "./empty";
import { Icon, type IconSource } from "./icon";
import { Media } from "./item";
import { MiddleTruncate } from "./middle-truncate";

import styles from "./file-input.module.css";
import helperStyles from "./helpers.module.css";

const UNITS = ["B", "KB", "MB", "GB"];

export const formatFileSize = (bytes: number) => {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = unit === 0 || value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[unit]}`;
};

const acceptTokens = (accept?: string) =>
  (accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

const matchesAccept = (file: File, tokens: string[]) => {
  if (!tokens.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
};

const typeLabel = (token: string) => {
  if (token.startsWith(".")) return token.slice(1).toUpperCase();
  const [group, subtype] = token.split("/");
  if (subtype === "*") return `${group.charAt(0).toUpperCase()}${group.slice(1)} files`;
  return (subtype ?? group).replace(/^x-|\+.*$/g, "").toUpperCase();
};

const listFormat = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;

const MAX_LISTED_REJECTIONS = 3;

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
export function FileInput({
  files,
  onFiles,
  onRemove,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  error,
  title,
  hint,
  icon = "upload",
  size = "default",
  className,
  name,
  ref,
  ...props
}: FileInputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const field = useFieldControlAttributes(props);
  const generated = React.useId();
  const titleId = `${generated}-title`;
  const hintId = `${generated}-hint`;
  const messageId = `${generated}-message`;
  const input = React.useRef<HTMLInputElement>(null);
  const zone = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => input.current!, []);
  const [dragging, setDragging] = React.useState(false);
  const [rejections, setRejections] = React.useState<string[]>([]);
  const tokens = acceptTokens(accept);
  const noun = multiple ? "files" : "a file";
  const sizeLabel = maxSize === undefined ? undefined : formatFileSize(maxSize);
  const typesLabel = tokens.length ? listFormat([...new Set(tokens.map(typeLabel))]) : undefined;
  const derivedHint = [typesLabel, sizeLabel && `up to ${sizeLabel}`].filter(Boolean).join(", ");
  const hintText =
    hint ?? (derivedHint && derivedHint.charAt(0).toUpperCase() + derivedHint.slice(1));
  const invalid = Boolean(error || rejections.length || field["aria-invalid"]);
  const messages = [...(error ? [error] : []), ...rejections];

  const take = (list: File[]) => {
    if (disabled || !list.length) return;
    if (!multiple && list.length > 1) {
      setRejections(["Drop one file at a time."]);
      return;
    }
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of list) {
      if (!matchesAccept(file, tokens)) rejected.push(`${file.name} isn't a ${typesLabel} file.`);
      else if (maxSize !== undefined && file.size > maxSize)
        rejected.push(`${file.name} is larger than ${sizeLabel}.`);
      else accepted.push(file);
    }
    const hidden = rejected.length - MAX_LISTED_REJECTIONS;
    setRejections(
      hidden > 0
        ? [
            ...rejected.slice(0, MAX_LISTED_REJECTIONS),
            `${hidden} more ${hidden === 1 ? "file was" : "files were"} not added.`
          ]
        : rejected
    );
    if (accepted.length) onFiles(accepted);
  };

  const browse = () => {
    if (!disabled) input.current?.click();
  };

  const leaves = (event: React.DragEvent) =>
    !(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget));

  return (
    <div data-slot="file-input" data-size={size} className={cn(styles.root, className)}>
      <input
        ref={input}
        id={field.id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        hidden
        onChange={(event) => {
          take(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <Empty
        ref={zone}
        size={size}
        role="group"
        tabIndex={disabled ? -1 : 0}
        aria-label={props["aria-label"]}
        aria-labelledby={
          props["aria-label"]
            ? undefined
            : [field["aria-labelledby"], titleId].filter(Boolean).join(" ")
        }
        aria-describedby={
          [
            hintText ? hintId : undefined,
            messages.length ? messageId : undefined,
            field["aria-describedby"]
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className={styles.zone}
        onClick={browse}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          browse();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={(event) => {
          if (leaves(event)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          take(Array.from(event.dataTransfer.files));
        }}
      >
        <EmptyMedia>
          <Icon icon={icon} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle id={titleId}>
            {dragging
              ? `Drop to add ${multiple ? "the files" : "the file"}`
              : (title ?? `Drop ${noun} or browse`)}
          </EmptyTitle>
          {hintText && <EmptyDescription id={hintId}>{hintText}</EmptyDescription>}
        </EmptyHeader>
        <EmptyContent>
          <Button
            type="button"
            variant="outline"
            size={size === "sm" ? "xs" : "default"}
            disabled={disabled}
          >
            Browse
          </Button>
        </EmptyContent>
      </Empty>
      <div id={messageId} aria-live="polite" className={styles.messages}>
        {messages.map((message, index) => (
          <p key={index} className={helperStyles.fieldError}>
            <Icon name="alert" size={14} />
            <span>{message}</span>
          </p>
        ))}
      </div>
      {Boolean(files?.length) && (
        <ul className={styles.list} aria-label={multiple ? "Selected files" : "Selected file"}>
          {files!.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.file}>
              <Media icon="file" size="sm" />
              <MiddleTruncate
                className={styles.name}
                keepEnd={Math.max(8, file.name.length - file.name.lastIndexOf("."))}
              >
                {file.name}
              </MiddleTruncate>
              <span className={styles.size}>{formatFileSize(file.size)}</span>
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  icon="x"
                  iconOnly
                  disabled={disabled}
                  onClick={() => {
                    onRemove(file, index);
                    zone.current?.focus();
                  }}
                >{`Remove ${file.name}`}</Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
FileInput.displayName = "FileInput";
