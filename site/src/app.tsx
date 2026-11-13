import { useState } from "react";
import {
  CipherRouterProvider,
  type CipherRouter,
} from "@infisical/cipher/lib/link";
import { toTheme, themes } from "@infisical/cipher/lib/theme-registry";
import { CipherScope } from "@infisical/cipher/scope";
import { Sidebar, type SidebarSection } from "@infisical/cipher/ui/sidebar";
import { Toaster } from "@infisical/cipher/ui/sonner";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@infisical/cipher/ui/toggle-group";
import { TooltipProvider } from "@infisical/cipher/ui/tooltip";
import {
  AppInset,
  AppShell,
  PageGutter,
  TopBar,
} from "@infisical/cipher/ui/top-bar";

import catalog from "./catalog.json";
import { ComponentPage } from "./component-page";
import { foundationPages } from "./foundations";
import { href, useRoute } from "./router";

const groupOrder = [
  "Actions",
  "Forms",
  "Navigation",
  "Data display",
  "Feedback",
  "Overlays",
  "Composites",
  "Patterns",
  "Code",
  "Utilities",
];

const sections: SidebarSection[] = [
  {
    label: "Foundations",
    icon: "apps",
    items: foundationPages.map((page) => ({
      id: page.id,
      label: page.title,
      link: { href: href(`/${page.id}`) },
    })),
  },
  ...groupOrder.map((group) => ({
    label: group,
    items: catalog
      .filter((component) => component.group === group)
      .sort((left, right) => left.title.localeCompare(right.title))
      .map((component) => ({
        id: component.id,
        label: component.title,
        link: { href: href(`/components/${component.id}`) },
      })),
  })),
];

const router: CipherRouter = {
  Link: ({ link, ref, children, ...props }) => (
    <a ref={ref} href={link.href} {...props}>
      {children}
    </a>
  ),
  useLinkMatch: () => {
    const route = useRoute();
    return (link) =>
      link.href === href(route)
        ? { exact: true, length: route.length }
        : undefined;
  },
};

const initialTheme = () =>
  toTheme(new URLSearchParams(window.location.search).get("theme")) ??
  toTheme(window.localStorage.getItem("cipher-theme")) ??
  "light";

export function App() {
  const route = useRoute();
  const [theme, setTheme] = useState(initialTheme);
  const changeTheme = (next: string) => {
    if (!next) return;
    setTheme(next);
    window.localStorage.setItem("cipher-theme", next);
  };
  const componentId = route.startsWith("/components/")
    ? route.slice("/components/".length)
    : undefined;
  const component = catalog.find((entry) => entry.id === componentId);
  const foundation =
    foundationPages.find((page) => `/${page.id}` === route) ??
    foundationPages[0];
  const current = component?.id ?? foundation.id;
  const title = component?.title ?? foundation.title;
  return (
    <CipherScope theme={theme} className="flex h-dvh flex-col overflow-clip">
      <CipherRouterProvider router={router}>
        <TooltipProvider>
          <AppShell>
            <TopBar
              breadcrumb={[
                { label: "Cipher" },
                { label: component?.group ?? "Foundations" },
                { label: title },
              ]}
              actions={
                <ToggleGroup
                  type="single"
                  size="sm"
                  value={theme}
                  onValueChange={changeTheme}
                  aria-label="Theme"
                >
                  {themes.map((entry) => (
                    <ToggleGroupItem key={entry.id} value={entry.id}>
                      {entry.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              }
            />
            <Sidebar label="Cipher" sections={sections} current={current} />
            <AppInset>
              <PageGutter key={current}>
                <article>
                  {component ? (
                    <ComponentPage component={component} />
                  ) : (
                    <foundation.Page />
                  )}
                </article>
              </PageGutter>
            </AppInset>
            <Toaster />
          </AppShell>
        </TooltipProvider>
      </CipherRouterProvider>
    </CipherScope>
  );
}
