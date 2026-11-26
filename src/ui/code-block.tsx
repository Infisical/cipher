import * as React from "react";

import { FrameScope, useInFrame } from "../lib/frame-context";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Code, type CodeProps } from "./code";
import { Icon, type IconSource } from "./icon";
import { Json, type JsonProps, prepareJson } from "./json";
import { MiddleTruncate } from "./middle-truncate";
import { HIDDEN_SECRET_VALUE } from "./secret-input";
import { CopyButton } from "./sensitive-editor";
import { Tooltip } from "./tooltip";

import geometry from "./button-geometry.module.css";
import styles from "./code.module.css";
import frame from "./frame.module.css";

export type CodeBlockProps = Omit<CodeProps, "children" | "block" | "onCopy" | "label"> & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  icon?: IconSource;
  actions?: React.ReactNode;
  copyable?: boolean;
  copyValue?: string;
  copyLabel?: string;
  onCopy?: (value: string) => void;
  writeClipboard?: (value: string) => Promise<void>;
  /** Masks the content until the reveal toggle is pressed. Copy still writes the real value. */
  sensitive?: boolean;
};
export const CodeBlock = ({
  children,
  code,
  label,
  icon,
  actions,
  copyable = true,
  copyValue,
  copyLabel = "Copy code",
  onCopy,
  writeClipboard,
  sensitive = false,
  className,
  ...props
}: CodeBlockProps) => {
  const json =
    React.isValidElement<JsonProps>(children) && children.type === Json ? children : null;
  const source = json
    ? prepareJson(json.props.value, json.props.redact).text
    : (copyValue ?? code ?? (typeof children === "string" ? children : ""));
  const hasCopySource =
    Boolean(json) || copyValue !== undefined || code !== undefined || typeof children === "string";
  const embedded = useInFrame("CodeBlock");
  const labelText = typeof label === "string" ? label : undefined;
  const identityId = React.useId();
  const [revealed, setRevealed] = React.useState<string | null>(null);
  React.useEffect(() => setRevealed(null), [source]);
  const masked = sensitive && revealed !== source;
  return (
    <section
      data-slot="code-block"
      aria-label={labelText}
      aria-labelledby={label && !labelText ? identityId : undefined}
      data-embedded={embedded || undefined}
      className={cn(!embedded && frame.frame, styles.codeBlock, className)}
    >
      <FrameScope framed>
        {(label || actions || copyable || sensitive) && (
          <div className={styles.header} data-has-actions={Boolean(actions) || undefined}>
            <div id={identityId} className={styles.identity}>
              {icon && <Icon icon={icon} />}
              {labelText ? (
                <MiddleTruncate keepEnd={16} className={styles.blockLabel}>
                  {labelText}
                </MiddleTruncate>
              ) : (
                label
              )}
            </div>
            {(actions || copyable || sensitive) && (
              <div className={styles.actions}>
                {actions}
                {sensitive && (
                  <Tooltip content={masked ? "Reveal value" : "Hide value"}>
                    <Button
                      type="button"
                      variant="ghost"
                      className={geometry.nestedAction}
                      iconOnly
                      icon={masked ? "eye" : "eye-off"}
                      aria-pressed={!masked}
                      onClick={() => setRevealed(masked ? source : null)}
                    >
                      Reveal value
                    </Button>
                  </Tooltip>
                )}
                {copyable && (
                  <CopyButton
                    value={source}
                    disabled={!hasCopySource}
                    label={copyLabel}
                    iconOnly
                    onCopy={onCopy}
                    writeClipboard={writeClipboard}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className={cn(frame.frameInset, styles.body)}>
          {masked ? (
            <Code
              block
              {...props}
              format="plain"
              code={(source || HIDDEN_SECRET_VALUE).replace(/./gu, "•")}
              label={`${labelText ?? "Code"}, hidden`}
              aria-hidden
              data-masked=""
            />
          ) : (
            (json ??
            (typeof children === "string" || children === undefined ? (
              <Code block code={code ?? children} label={labelText} {...props} />
            ) : (
              <div className={styles.customContent}>{children}</div>
            )))
          )}
        </div>
      </FrameScope>
    </section>
  );
};
