import * as React from "react";

/** Elements that act on their own when clicked or pressed, so they never pass a click or Enter through to their row. */
export const interactiveControl =
  "a, button, input, select, textarea, summary, [contenteditable], [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]";

type DescribeRow = (id: string) => () => void;

const RowDescriptionContext = React.createContext<DescribeRow | null>(null);

/**
 * A focusable, activatable table row reads its pass-through content to assistive technology: a TooltipText
 * inside it is no tab stop of its own, so its tooltip text joins the row's description instead.
 */
export function useRowDescriptionHost(active: boolean) {
  const [ids, setIds] = React.useState<string[]>([]);
  const describe = React.useCallback<DescribeRow>((id) => {
    setIds((current) => [...current, id]);
    return () => setIds((current) => current.filter((item) => item !== id));
  }, []);
  return [active ? ids : [], active ? describe : null] as const;
}

export { RowDescriptionContext };
