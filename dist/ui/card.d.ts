import * as React from "react";
import { type CipherLinkProps } from "../lib/link";
declare function Card({ className, size, variant: requestedVariant, title, badges, description, hint, action, footer, footerPlacement, flush, backdrop, selected, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "title"> & {
    size?: "default" | "sm";
    title?: React.ReactNode;
    /** Badges on the title's line, right after its text, such as a plan tier. */
    badges?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    footerPlacement?: "inset" | "frame";
    flush?: boolean;
    /** Decoration such as a Halftone, painted under the surface that holds the title and the card link: the inset of a framed card with a frame footer, otherwise the card itself. That surface becomes the stacking context, so the link overlay and the controls above it stay in one layer. */
    backdrop?: React.ReactNode;
    /** Paints the card as chosen. A CardChoice inside sets it on its own; pass it for a selection the card does not own, and give the link aria-current when a selected card is the current item. */
    selected?: boolean;
} & ({
    variant?: "plain";
    description?: string;
    hint?: never;
} | {
    variant: "framed";
    /** A frame holds a small contained table or list, so its head is a title and actions only. A section that needs a description belongs in a plain Card or a SettingsCard. */
    description?: never;
    /** One short plain-text sentence about the section. The title takes a dotted underline, becomes focusable and shows this in a tooltip on hover and keyboard focus. */
    hint?: string;
}) & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Card {
    var displayName: string;
}
declare function CardHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardHeader {
    var displayName: string;
}
declare function CardTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardTitle {
    var displayName: string;
}
declare function CardBadges({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardBadges {
    var displayName: string;
}
declare function CardDescription({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardDescription {
    var displayName: string;
}
declare function CardAction({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardAction {
    var displayName: string;
}
declare function CardContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace CardContent {
    var displayName: string;
}
declare function CardFooter({ className, placement, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    placement?: "inset" | "frame";
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace CardFooter {
    var displayName: string;
}
declare function CardLink({ className, disabled, title, children, ref, ...props }: CipherLinkProps & {
    disabled?: boolean;
}): React.JSX.Element;
type CardChoiceProps = Omit<React.ComponentPropsWithoutRef<"button">, "value" | "defaultChecked" | "onChange"> & {
    /** Makes this a radio inside a RadioGroup, picked by the group's value. Without it the choice is a checkbox. */
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
} & {
    ref?: React.Ref<HTMLButtonElement>;
};
/**
 * Makes the whole Card one checkbox or radio, the way CardLink makes it one link: the label is its
 * accessible name, its overlay covers the card, and the card paints itself selected while it is checked.
 */
declare function CardChoice({ className, value, checked: checkedProp, defaultChecked, onCheckedChange, disabled, children, ref, ...props }: CardChoiceProps): React.JSX.Element;
declare namespace CardChoice {
    var displayName: string;
}
export { Card, CardAction, CardBadges, CardChoice, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };
