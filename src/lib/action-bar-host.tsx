import * as React from "react";

const ActionBarHostContext = React.createContext<HTMLElement | null | undefined>(undefined);

/** The scroller a FloatingActionBar under a modal overlay portals into, or undefined outside one. Null while the scroller mounts. */
export const useActionBarHost = () => React.useContext(ActionBarHostContext);

/** Provides an overlay scroller as the action bar host, so the bar stays inside the overlay's focus trap and dismiss layer instead of portalling under its scrim. */
export function ActionBarHost({
  host,
  children
}: {
  host: HTMLElement | null;
  children?: React.ReactNode;
}) {
  return <ActionBarHostContext value={host}>{children}</ActionBarHostContext>;
}

/** An overlay scroller that hosts a FloatingActionBar rendered inside it. */
export function ActionBarScroller({ children, ...props }: React.ComponentProps<"div">) {
  const [host, setHost] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setHost} {...props}>
      <ActionBarHost host={host}>{children}</ActionBarHost>
    </div>
  );
}
