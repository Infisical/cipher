import * as React from "react";
/** Elements that act on their own when clicked or pressed, so they never pass a click or Enter through to their row. */
export declare const interactiveControl = "a, button, input, select, textarea, summary, [contenteditable], [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]";
type DescribeRow = (id: string) => () => void;
declare const RowDescriptionContext: React.Context<DescribeRow | null>;
/**
 * A focusable, activatable table row reads its pass-through content to assistive technology: a TooltipText
 * inside it is no tab stop of its own, so its tooltip text joins the row's description instead.
 */
export declare function useRowDescriptionHost(active: boolean): readonly [string[], DescribeRow | null];
export { RowDescriptionContext };
