import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { useDescendantFlags } from "../lib/descendant-flags";
import { FrameScope, useInFrame } from "../lib/frame-context";
import { CipherLink, type CipherLinkProps } from "../lib/link";
import { exit, spring } from "../lib/motion";
import { type PresenceReport, usePresenceCount, useReportPresence } from "../lib/presence-count";
import { RadioValueContext } from "../lib/radio-value-context";
import {
  StretchedLinkContext,
  useStretchedLink,
  useStretchedLinkHost
} from "../lib/stretched-link";
import { useControllableState } from "../lib/use-controllable-state";
import { cn } from "../lib/utils";

import { Badge } from "./badge";
import { Icon } from "./icon";
import { TooltipText } from "./tooltip";

import controlStyles from "./controls.module.css";
import frameStyles from "./frame.module.css";
import linkStyles from "./row-link.module.css";

const FramedContext = React.createContext(false);
const CardChoiceContext = React.createContext<PresenceReport | null>(null);

const cardFlags = {
  "data-has-slots":
    ':scope > :is([data-slot="card-header"], [data-slot="card-content"], [data-slot="card-footer"])',
  "data-frame-head": `:scope > .${frameStyles.frameHead}`,
  "data-frame-foot": `:scope > .${frameStyles.frameFoot}`
};
const cardWatch = {
  subtree: false,
  marks: {
    "data-before-footer": `:scope > .${controlStyles.cardBody}:has(+ .${controlStyles.cardFooter}:not([data-placement="frame"]))`
  }
};

function Card({
  className,
  size = "default",
  variant: requestedVariant = "plain",
  title,
  badges,
  description,
  hint,
  action,
  footer,
  footerPlacement = "inset",
  flush = false,
  backdrop,
  selected,
  children,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
  size?: "default" | "sm";
  title?: React.ReactNode;
  /** Badges on the title's line, right after its text, such as a plan tier. */
  badges?: React.ReactNode;
  /** Controls on the head's end. In a framed card's band they take the 28px band tier (size-control-band) and sit space-frame-inline from the corner, so leave their size unset; badges keep their text height. */
  action?: React.ReactNode;
  footer?: React.ReactNode;
  /** "frame" draws the footer in the frame band: its text keeps the title's start inset and its controls take the 28px band tier. */
  footerPlacement?: "inset" | "frame";
  flush?: boolean;
  /** Decoration such as a Halftone, painted under the surface that holds the title and the card link: the inset of a framed card with a frame footer, otherwise the card itself. That surface becomes the stacking context, so the link overlay and the controls above it stay in one layer. */
  backdrop?: React.ReactNode;
  /** Paints the card as chosen. A CardChoice inside sets it on its own; pass it for a selection the card does not own, and give the link aria-current when a selected card is the current item. */
  selected?: boolean;
} & (
    | { variant?: "plain"; description?: string; hint?: never }
    | {
        variant: "framed";
        /** A frame holds a small contained table or list, so its head is a title and actions only. A section that needs a description belongs in a plain Card or a SettingsCard. */
        description?: never;
        /** One short plain-text sentence about the section. The title takes a dotted underline, becomes focusable and shows this in a tooltip on hover and keyboard focus. */
        hint?: string;
      }
  ) & { ref?: React.Ref<React.ComponentRef<"div">> }) {
  const convenience =
    title !== undefined ||
    badges !== undefined ||
    description !== undefined ||
    action !== undefined ||
    footer !== undefined;
  const inFrame = useInFrame("Card", requestedVariant);
  const variant = inFrame ? "plain" : requestedVariant;
  const [hasLink, reportLink] = useStretchedLinkHost();
  const [choiceChecked, reportChoice] = usePresenceCount();
  const cardRef = useDescendantFlags(cardFlags, cardWatch, ref);
  const titleParts = React.Children.toArray(
    React.isValidElement<{ children?: React.ReactNode }>(title) && title.type === React.Fragment
      ? title.props.children
      : title
  );
  const firstBadge = titleParts.findIndex(
    (part) => React.isValidElement(part) && part.type === Badge
  );
  const hintText = firstBadge > 0 ? titleParts.slice(0, firstBadge) : titleParts;
  const lastText = hintText.at(-1);
  const trailingSpace = typeof lastText === "string" && /\s$/.test(lastText);
  const heading =
    title !== undefined &&
    (hint ? (
      <CardTitle data-hint="">
        <TooltipText content={hint} align="start" className={frameStyles.frameTitleHint}>
          {trailingSpace ? [...hintText.slice(0, -1), lastText.trimEnd()] : hintText}
        </TooltipText>
        {trailingSpace && " "}
        {firstBadge > 0 && titleParts.slice(firstBadge)}
      </CardTitle>
    ) : (
      <CardTitle>{title}</CardTitle>
    ));
  const header = (title !== undefined ||
    badges !== undefined ||
    description !== undefined ||
    action) && (
    <CardHeader>
      <div className={controlStyles.cardTitleGroup}>
        <div className={controlStyles.cardCopy}>
          {badges !== undefined ? (
            <div className={controlStyles.cardTitleRow}>
              {heading}
              <CardBadges>{badges}</CardBadges>
            </div>
          ) : (
            heading
          )}
          {description !== undefined && <CardDescription>{description}</CardDescription>}
        </div>
      </div>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
  );
  return (
    <div
      ref={cardRef}
      data-slot="card"
      data-stretched-link={hasLink || undefined}
      data-size={size}
      data-variant={variant}
      data-embedded={(inFrame && requestedVariant === "framed") || undefined}
      data-flush={flush || undefined}
      data-selected={(selected ?? choiceChecked) || undefined}
      className={cn(
        "group/card",
        controlStyles.card,
        variant === "plain" ? controlStyles.cardPlain : frameStyles.frame,
        className
      )}
      {...props}
    >
      <StretchedLinkContext value={reportLink}>
        <CardChoiceContext value={reportChoice}>
          <FrameScope framed={inFrame || variant !== "plain"}>
            <FramedContext value={variant !== "plain"}>
              {convenience &&
              variant !== "plain" &&
              footer !== undefined &&
              footerPlacement === "frame" ? (
                <>
                  <div
                    data-slot="card-inset"
                    className={cn(frameStyles.frameInset, controlStyles.cardInset)}
                  >
                    {backdrop}
                    <FramedContext value={false}>
                      {header}
                      {children !== undefined && children !== null && (
                        <CardContent>{children}</CardContent>
                      )}
                    </FramedContext>
                  </div>
                  <CardFooter placement="frame">{footer}</CardFooter>
                </>
              ) : convenience ? (
                <>
                  {backdrop}
                  {header}
                  <CardContent>{children}</CardContent>
                  {footer !== undefined && (
                    <CardFooter placement={footerPlacement}>{footer}</CardFooter>
                  )}
                </>
              ) : (
                <>
                  {backdrop}
                  {children}
                </>
              )}
            </FramedContext>
          </FrameScope>
        </CardChoiceContext>
      </StretchedLinkContext>
    </div>
  );
}
Card.displayName = "Card";

function CardHeader({ className, ref, ...props }: React.ComponentProps<"div">) {
  const framed = React.useContext(FramedContext);
  return (
    <div
      ref={ref}
      data-slot="card-header"
      data-framed={framed || undefined}
      className={cn(controlStyles.cardHeader, framed && frameStyles.frameHead, className)}
      {...props}
    />
  );
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, ref, ...props }: React.ComponentProps<"div">) {
  const framed = React.useContext(FramedContext);
  return (
    <div
      ref={ref}
      data-slot="card-title"
      className={cn(controlStyles.cardHeading, framed && frameStyles.frameTitle, className)}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";

function CardBadges({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="card-badges"
      className={cn(controlStyles.cardBadges, className)}
      {...props}
    />
  );
}
CardBadges.displayName = "CardBadges";

function CardDescription({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn(controlStyles.cardDescription, className)}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";

function CardAction({ className, ref, ...props }: React.ComponentProps<"div">) {
  const framed = React.useContext(FramedContext);
  return (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn(controlStyles.cardAction, framed && frameStyles.frameAction, className)}
      {...props}
    />
  );
}
CardAction.displayName = "CardAction";

function CardContent({ className, ref, ...props }: React.ComponentProps<"div">) {
  const framed = React.useContext(FramedContext);
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn(controlStyles.cardBody, framed && frameStyles.frameInset, className)}
      {...props}
    />
  );
}
CardContent.displayName = "CardContent";

function CardFooter({
  className,
  placement = "inset",
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { placement?: "inset" | "frame" } & {
  ref?: React.Ref<React.ComponentRef<"div">>;
}) {
  const framed = React.useContext(FramedContext);
  const band = framed && placement === "frame";
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      data-placement={band ? "frame" : undefined}
      className={cn(
        controlStyles.cardFooter,
        framed && (band ? frameStyles.frameFoot : frameStyles.frameInset),
        className
      )}
      {...props}
    />
  );
}
CardFooter.displayName = "CardFooter";

function CardLink({
  className,
  disabled,
  title,
  children,
  ref,
  ...props
}: CipherLinkProps & {
  disabled?: boolean;
}) {
  const off = disabled ?? (props.link as { disabled?: boolean }).disabled;
  useStretchedLink(!off);
  if (off)
    return (
      <span
        role="link"
        aria-disabled="true"
        title={title}
        data-slot="card-link"
        data-disabled=""
        className={cn(linkStyles.cardLink, className)}
      >
        {children}
      </span>
    );
  return (
    <CipherLink
      ref={ref}
      title={title}
      data-slot="card-link"
      className={cn(linkStyles.cardLink, linkStyles.stretched, className)}
      {...props}
    >
      {children}
    </CipherLink>
  );
}

type CardChoiceProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "value" | "defaultChecked" | "onChange"
> & {
  /** Makes this a radio inside a RadioGroup, picked by the group's value. Without it the choice is a checkbox. */
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
} & { ref?: React.Ref<HTMLButtonElement> };

/**
 * Makes the whole Card one checkbox or radio, the way CardLink makes it one link: the label is its
 * accessible name, its overlay covers the card, and the card paints itself selected while it is checked.
 */
function CardChoice({
  className,
  value,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  disabled,
  children,
  ref,
  ...props
}: CardChoiceProps) {
  const reduced = useReducedMotion();
  const groupValue = React.useContext(RadioValueContext);
  const [toggled, setToggled] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange
  });
  const radio = value !== undefined;
  const checked = radio ? groupValue === value : toggled;
  useStretchedLink(!disabled);
  useReportPresence(React.useContext(CardChoiceContext), checked);
  const state = checked ? "checked" : "unchecked";
  const classes = cn(
    linkStyles.cardLink,
    linkStyles.cardChoice,
    !disabled && linkStyles.stretched,
    className
  );
  const label = (
    <>
      <span
        aria-hidden
        data-state={state}
        className={cn(
          controlStyles.choiceMark,
          radio ? controlStyles.choiceCardMark : controlStyles.cardChoiceCheck
        )}
      >
        {radio ? (
          <motion.span
            className={controlStyles.radioDot}
            initial={false}
            animate={{
              scale: checked || reduced ? 1 : 0.3,
              opacity: checked ? 1 : 0
            }}
            transition={checked ? spring.fast : exit.fast}
          />
        ) : (
          checked && <Icon name="check" strokeWidth={2} />
        )}
      </span>
      <span className={linkStyles.cardChoiceLabel}>{children}</span>
    </>
  );
  if (radio)
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        data-slot="card-choice"
        value={value}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {label}
      </RadioGroupPrimitive.Item>
    );
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="card-choice"
      checked={toggled}
      onCheckedChange={(next) => setToggled(next === true)}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {label}
    </CheckboxPrimitive.Root>
  );
}
CardChoice.displayName = "CardChoice";

export {
  Card,
  CardAction,
  CardBadges,
  CardChoice,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle
};
