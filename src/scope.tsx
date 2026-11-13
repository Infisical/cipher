import * as React from "react";
import { createPortal } from "react-dom";
import { MotionConfig } from "motion/react";

import { type PresenceReport, usePresenceCount } from "./lib/presence-count";
import { watchScrollEdges } from "./lib/scroll-edges";
import { defaultTheme, toTheme, themeScheme } from "./lib/theme-registry";
import type { Scheme } from "./lib/themes";
import { cn } from "./lib/utils";

const PortalContainerContext = React.createContext<HTMLElement | null | undefined>(undefined);
const ThemeContext = React.createContext<string | undefined>(undefined);
const CollisionBoundaryContext = React.createContext<HTMLElement | undefined>(undefined);
const ToastLayerContext = React.createContext<HTMLElement | null>(null);
const ActionBarReserveContext = React.createContext<PresenceReport | null>(null);

export const usePortalContainer = () => React.useContext(PortalContainerContext);
export const useCollisionBoundary = () => React.useContext(CollisionBoundaryContext);
export const useTheme = () => React.useContext(ThemeContext);
export const useScheme = (): Scheme | undefined => {
  const theme = useTheme();
  return theme ? themeScheme(theme) : undefined;
};
export const useToastLayer = () => React.useContext(ToastLayerContext);
/** A shown FloatingActionBar reports here, so every node of the scope, toast layer included, lifts its toasts clear of the bar. */
export const useActionBarReport = () => React.useContext(ActionBarReserveContext);

function inheritedTheme(node: HTMLElement, fallback: string | undefined): string {
  let ancestor = node.parentElement;
  while (ancestor) {
    const value = toTheme(ancestor.getAttribute("data-theme"));
    if (value) return value;
    ancestor = ancestor.parentElement;
  }
  return fallback ?? defaultTheme.light;
}

export function CipherScope({
  children,
  className,
  theme,
  portalContainer,
  ref: forwardedRef,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  theme?: string;
  portalContainer?: HTMLElement | null;
} & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const parentTheme = useTheme();
  const [wrapper, setWrapper] = React.useState<HTMLDivElement | null>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [toastLayer, setToastLayer] = React.useState<HTMLDivElement | null>(null);
  const [inherited, setInherited] = React.useState<string>();
  const [actionBarReserve, reportActionBar] = usePresenceCount();
  const reserve = actionBarReserve || undefined;
  const resolvedTheme = toTheme(theme) ?? inherited ?? parentTheme ?? defaultTheme.light;
  const scheme = themeScheme(resolvedTheme);
  const assignWrapper = React.useCallback(
    (node: HTMLDivElement | null) => {
      setWrapper(node);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else {
        const targetRef = forwardedRef;
        if (targetRef) targetRef.current = node;
      }
    },
    [forwardedRef]
  );
  React.useEffect(() => watchScrollEdges(), []);
  const appliedTheme = React.useRef(resolvedTheme);
  React.useLayoutEffect(() => {
    if (appliedTheme.current === resolvedTheme) return undefined;
    appliedTheme.current = resolvedTheme;
    const scopes = [wrapper, container, toastLayer].filter((node): node is HTMLDivElement =>
      Boolean(node)
    );
    scopes.forEach((node) => node.setAttribute("data-theme-switching", ""));
    scopes.forEach((node) => getComputedStyle(node).transitionProperty);
    const frame = requestAnimationFrame(() =>
      scopes.forEach((node) => node.removeAttribute("data-theme-switching"))
    );
    return () => {
      cancelAnimationFrame(frame);
      scopes.forEach((node) => node.removeAttribute("data-theme-switching"));
    };
  }, [resolvedTheme, wrapper, container, toastLayer]);
  React.useLayoutEffect(() => {
    if (!wrapper || theme !== undefined) return undefined;
    const update = () => setInherited(inheritedTheme(wrapper, parentTheme));
    update();
    const observer = new MutationObserver(update);
    let ancestor = wrapper.parentElement;
    while (ancestor) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ["data-theme"] });
      ancestor = ancestor.parentElement;
    }
    return () => observer.disconnect();
  }, [wrapper, theme, parentTheme]);

  return (
    <MotionConfig reducedMotion="user">
      <ThemeContext value={resolvedTheme}>
        <PortalContainerContext value={container}>
          <ToastLayerContext value={toastLayer}>
            <ActionBarReserveContext value={reportActionBar}>
              <CollisionBoundaryContext value={portalContainer ?? undefined}>
                <div
                  {...props}
                  ref={assignWrapper}
                  className={cn("cipher", className)}
                  data-theme={resolvedTheme}
                  data-scheme={scheme}
                  data-action-bar-reserve={reserve}
                >
                  {children}
                </div>
                {portalContainer !== null &&
                  createPortal(
                    <>
                      <div
                        ref={setContainer}
                        className="cipher"
                        data-theme={resolvedTheme}
                        data-scheme={scheme}
                        data-action-bar-reserve={reserve}
                      />
                      {/* After the overlay container, so a toast paints above every sheet and dialog on the same z-50 layer. */}
                      <div
                        ref={setToastLayer}
                        className="cipher"
                        data-theme={resolvedTheme}
                        data-scheme={scheme}
                        data-action-bar-reserve={reserve}
                        data-slot="cipher-toast-layer"
                      />
                    </>,
                    portalContainer ?? document.body
                  )}
              </CollisionBoundaryContext>
            </ActionBarReserveContext>
          </ToastLayerContext>
        </PortalContainerContext>
      </ThemeContext>
    </MotionConfig>
  );
}
CipherScope.displayName = "CipherScope";
