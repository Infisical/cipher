import * as React from "react";

import { useDescendantFlags } from "../lib/descendant-flags";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon, type IconSource } from "./icon";

import helperStyles from "./helpers.module.css";

const alertFlags = {
  "data-has-icon": ":scope > svg",
  "data-has-title": `:scope > :is(.${helperStyles.alertTitle}, .${helperStyles.alertTitleRow})`,
  "data-has-action": ':scope > [data-slot="alert-action"]'
};
const alertWatch = { subtree: false };

function Alert({
  className,
  variant,
  tone = variant === "destructive" ? "bad" : "neutral",
  title,
  badges,
  actions,
  onDismiss,
  band,
  children,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
  variant?: "default" | "destructive" | null;
  tone?: "neutral" | "info" | "ok" | "warn" | "bad";
  /** Without a title the children are the message, still with the tone icon and actions. Children composed from AlertTitle, AlertDescription and an icon render as given. */
  title?: React.ReactNode;
  /** Right after the title: status badges, and a DocumentationLink so it stays paired with the title. They drop below the title before it wraps. Without a title they sit at the end of the message's first line, the place for its DocumentationLink. */
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  onDismiss?: () => void;
  /** A full-width band inside a framed block, such as a notice between a table's toolbar and its header: a rule below it and no side or top edge, at the frame's inline inset. */
  band?: boolean;
} & { ref?: React.Ref<React.ComponentRef<"div">> }) {
  const alertRef = useDescendantFlags(alertFlags, alertWatch, ref);
  const titled = title != null && title !== false;
  const composed = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === AlertTitle ||
        child.type === AlertDescription ||
        child.type === Icon ||
        child.type === "svg")
  );
  return (
    <div
      ref={alertRef}
      data-slot="alert"
      data-variant={variant ?? "default"}
      role={tone === "bad" ? "alert" : "status"}
      data-tone={tone}
      data-band={band || undefined}
      className={cn(helperStyles.alert, "[&>svg]:cipher-lead-line", className)}
      {...props}
    >
      {composed ? (
        children
      ) : (
        <>
          <Icon
            name={
              tone === "bad"
                ? "alert-c"
                : tone === "ok"
                  ? "check-c"
                  : tone === "warn"
                    ? "alert"
                    : "info"
            }
          />
          {titled &&
            (badges ? (
              <div className={cn(helperStyles.alertTitleRow, helperStyles.titleWithBadges)}>
                <AlertTitle>{title}</AlertTitle>
                <span data-slot="alert-badges" className={helperStyles.titleBadges}>
                  {badges}
                </span>
              </div>
            ) : (
              <AlertTitle>{title}</AlertTitle>
            ))}
          <AlertDescription>
            {badges && !titled ? (
              <div className={helperStyles.alertLine}>
                <div>{children}</div>
                <span data-slot="alert-trailing" className={helperStyles.alertTrailing}>
                  {badges}
                </span>
              </div>
            ) : (
              children
            )}
            {actions && <div className={helperStyles.alertActions}>{actions}</div>}
          </AlertDescription>
        </>
      )}
      {onDismiss && (
        <AlertAction>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Dismiss alert"
            onClick={onDismiss}
          >
            <Icon name="x" />
          </Button>
        </AlertAction>
      )}
    </div>
  );
}
Alert.displayName = "Alert";

function AlertTitle({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn(
        helperStyles.alertTitle,
        "[&_a:not([data-slot=button])]:underline [&_a:not([data-slot=button])]:underline-offset-3 [&_a:not([data-slot=button])]:hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

function AlertDescription({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        helperStyles.alertDescription,
        "text-muted-foreground text-balance md:text-pretty [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

function AlertAction({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="alert-action"
      className={cn(helperStyles.alertAction, className)}
      {...props}
    />
  );
}
AlertAction.displayName = "AlertAction";

export { Alert, AlertAction, AlertDescription, AlertTitle };

export const Banner = ({
  icon = "lock",
  children,
  action,
  onDismiss,
  className
}: {
  icon?: IconSource;
  children: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) => (
  <div data-slot="banner" role="status" className={cn(helperStyles.banner, className)}>
    <span className={helperStyles.bannerLead}>
      <Icon icon={icon} lead />
      <span className={helperStyles.bannerText}>{children}</span>
    </span>
    {action}
    {onDismiss && (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Dismiss banner"
        onClick={onDismiss}
      >
        <Icon name="x" />
      </Button>
    )}
  </div>
);
