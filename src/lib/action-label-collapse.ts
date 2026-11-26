import * as React from "react";

/**
 * Set by a header actions slot. A Button inside it with a leading icon drops to icon-only when the
 * slot's container query sets --cipher-action-label-collapsed, and its label becomes a tooltip.
 */
export const ActionLabelCollapseContext = React.createContext(false);

export const actionLabelCollapsed = (element: Element) =>
  getComputedStyle(element).getPropertyValue("--cipher-action-label-collapsed").trim() === "1";
