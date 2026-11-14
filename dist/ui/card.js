import { useDescendantFlags } from "../lib/descendant-flags.js";
import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { CipherLink } from "../lib/link.js";
import { StretchedLinkContext, useStretchedLink, useStretchedLinkHost } from "../lib/stretched-link.js";
import { cn } from "../lib/utils.js";
import { Badge } from "./badge.js";
import { TooltipText } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import frame_module_default from "./frame.module.js";
import row_link_module_default from "./row-link.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/card.tsx
var FramedContext = React.createContext(false);
var cardFlags = {
	"data-has-slots": ":scope > :is([data-slot=\"card-header\"], [data-slot=\"card-content\"], [data-slot=\"card-footer\"])",
	"data-frame-head": `:scope > .${frame_module_default.frameHead}`,
	"data-frame-foot": `:scope > .${frame_module_default.frameFoot}`
};
var cardWatch = {
	subtree: false,
	marks: { "data-before-footer": `:scope > .${controls_module_default.cardBody}:has(+ .${controls_module_default.cardFooter}:not([data-placement="frame"]))` }
};
function Card({ className, size = "default", variant: requestedVariant = "plain", title, description, hint, action, footer, footerPlacement = "inset", flush = false, backdrop, children, ref, ...props }) {
	const convenience = title !== void 0 || description !== void 0 || action !== void 0 || footer !== void 0;
	const inFrame = useInFrame("Card", requestedVariant);
	const variant = inFrame ? "plain" : requestedVariant;
	const [hasLink, reportLink] = useStretchedLinkHost();
	const cardRef = useDescendantFlags(cardFlags, cardWatch, ref);
	const titleParts = React.Children.toArray(React.isValidElement(title) && title.type === React.Fragment ? title.props.children : title);
	const firstBadge = titleParts.findIndex((part) => React.isValidElement(part) && part.type === Badge);
	const hintText = firstBadge > 0 ? titleParts.slice(0, firstBadge) : titleParts;
	const lastText = hintText.at(-1);
	const trailingSpace = typeof lastText === "string" && /\s$/.test(lastText);
	const heading = title !== void 0 && (hint ? /* @__PURE__ */ jsxs(CardTitle, {
		"data-hint": "",
		children: [
			/* @__PURE__ */ jsx(TooltipText, {
				content: hint,
				align: "start",
				className: frame_module_default.frameTitleHint,
				children: trailingSpace ? [...hintText.slice(0, -1), lastText.trimEnd()] : hintText
			}),
			trailingSpace && " ",
			firstBadge > 0 && titleParts.slice(firstBadge)
		]
	}) : /* @__PURE__ */ jsx(CardTitle, { children: title }));
	return /* @__PURE__ */ jsx("div", {
		ref: cardRef,
		"data-slot": "card",
		"data-stretched-link": hasLink || void 0,
		"data-size": size,
		"data-variant": variant,
		"data-embedded": inFrame && requestedVariant === "framed" || void 0,
		"data-flush": flush || void 0,
		className: cn("group/card", controls_module_default.card, variant === "plain" ? controls_module_default.cardPlain : frame_module_default.frame, className),
		...props,
		children: /* @__PURE__ */ jsx(StretchedLinkContext, {
			value: reportLink,
			children: /* @__PURE__ */ jsx(FrameScope, {
				framed: inFrame || variant !== "plain",
				children: /* @__PURE__ */ jsx(FramedContext, {
					value: variant !== "plain",
					children: convenience && variant !== "plain" && footer !== void 0 && footerPlacement === "frame" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						"data-slot": "card-inset",
						className: cn(frame_module_default.frameInset, controls_module_default.cardInset),
						children: [backdrop, /* @__PURE__ */ jsxs(FramedContext, {
							value: false,
							children: [(title !== void 0 || description !== void 0 || action) && /* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx("div", {
								className: controls_module_default.cardTitleGroup,
								children: /* @__PURE__ */ jsxs("div", {
									className: controls_module_default.cardCopy,
									children: [heading, description !== void 0 && /* @__PURE__ */ jsx(CardDescription, { children: description })]
								})
							}), action && /* @__PURE__ */ jsx(CardAction, { children: action })] }), children !== void 0 && children !== null && /* @__PURE__ */ jsx(CardContent, { children })]
						})]
					}), /* @__PURE__ */ jsx(CardFooter, {
						placement: "frame",
						children: footer
					})] }) : convenience ? /* @__PURE__ */ jsxs(Fragment, { children: [
						backdrop,
						(title !== void 0 || description !== void 0 || action) && /* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx("div", {
							className: controls_module_default.cardTitleGroup,
							children: /* @__PURE__ */ jsxs("div", {
								className: controls_module_default.cardCopy,
								children: [heading, description !== void 0 && /* @__PURE__ */ jsx(CardDescription, { children: description })]
							})
						}), action && /* @__PURE__ */ jsx(CardAction, { children: action })] }),
						/* @__PURE__ */ jsx(CardContent, { children }),
						footer !== void 0 && /* @__PURE__ */ jsx(CardFooter, {
							placement: footerPlacement,
							children: footer
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [backdrop, children] })
				})
			})
		})
	});
}
Card.displayName = "Card";
function CardHeader({ className, ref, ...props }) {
	const framed = React.useContext(FramedContext);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-header",
		"data-framed": framed || void 0,
		className: cn(controls_module_default.cardHeader, framed && frame_module_default.frameHead, className),
		...props
	});
}
CardHeader.displayName = "CardHeader";
function CardTitle({ className, ref, ...props }) {
	const framed = React.useContext(FramedContext);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-title",
		className: cn(controls_module_default.cardHeading, framed && frame_module_default.frameTitle, className),
		...props
	});
}
CardTitle.displayName = "CardTitle";
function CardDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-description",
		className: cn(controls_module_default.cardDescription, className),
		...props
	});
}
CardDescription.displayName = "CardDescription";
function CardAction({ className, ref, ...props }) {
	const framed = React.useContext(FramedContext);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-action",
		className: cn(controls_module_default.cardAction, framed && frame_module_default.frameAction, className),
		...props
	});
}
CardAction.displayName = "CardAction";
function CardContent({ className, ref, ...props }) {
	const framed = React.useContext(FramedContext);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-content",
		className: cn(controls_module_default.cardBody, framed && frame_module_default.frameInset, className),
		...props
	});
}
CardContent.displayName = "CardContent";
function CardFooter({ className, placement = "inset", ref, ...props }) {
	const framed = React.useContext(FramedContext);
	const band = framed && placement === "frame";
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "card-footer",
		"data-placement": band ? "frame" : void 0,
		className: cn(controls_module_default.cardFooter, framed && (band ? frame_module_default.frameFoot : frame_module_default.frameInset), className),
		...props
	});
}
CardFooter.displayName = "CardFooter";
function CardLink({ className, disabled, title, children, ref, ...props }) {
	const off = disabled ?? props.link.disabled;
	useStretchedLink(!off);
	if (off) return /* @__PURE__ */ jsx("span", {
		role: "link",
		"aria-disabled": "true",
		title,
		"data-slot": "card-link",
		"data-disabled": "",
		className: cn(row_link_module_default.cardLink, className),
		children
	});
	return /* @__PURE__ */ jsx(CipherLink, {
		ref,
		title,
		"data-slot": "card-link",
		className: cn(row_link_module_default.cardLink, row_link_module_default.stretched, className),
		...props,
		children
	});
}
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardLink, CardTitle };

//# sourceMappingURL=card.js.map