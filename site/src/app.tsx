import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CipherRouterProvider, type CipherRouter } from "@infisical/cipher/lib/link";
import { defaultTheme, themeScheme, toTheme } from "@infisical/cipher/lib/theme-registry";
import { CipherScope } from "@infisical/cipher/scope";
import type { BreadcrumbCrumb } from "@infisical/cipher/ui/breadcrumb";
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuItemKind
} from "@infisical/cipher/ui/command-menu";
import { Icon, type IconName } from "@infisical/cipher/ui/icon";
import { Sidebar, type SidebarSection } from "@infisical/cipher/ui/sidebar";
import { TooltipProvider } from "@infisical/cipher/ui/tooltip";
import {
  AppInset,
  AppShell,
  PageGutter,
  TopBar,
  type ShellTheme,
  useAppShell
} from "@infisical/cipher/ui/top-bar";

import pkg from "../../package.json";
import catalog from "./catalog.json";
import { ComponentPage } from "./component-page";
import { foundationPages } from "./foundations";
import { href, useRoute } from "./router";

const repository = "https://github.com/Infisical/cipher";

const groupIcons: Record<string, IconName> = {
  Foundations: "apps",
  Actions: "plus",
  Forms: "file",
  Navigation: "menu",
  "Data display": "inbox",
  Feedback: "bell",
  Overlays: "folder-open",
  Composites: "building",
  Patterns: "sync",
  Code: "terminal",
  Utilities: "settings"
};

type Page = { id: string; title: string; route: string };
type Group = { label: string; icon: IconName; pages: Page[] };

const groups: Group[] = [
  {
    label: "Foundations",
    icon: groupIcons.Foundations,
    pages: foundationPages.map((page) => ({
      id: page.id,
      title: page.title,
      route: `/${page.id}`
    }))
  },
  ...Object.keys(groupIcons)
    .slice(1)
    .map((group) => ({
      label: group,
      icon: groupIcons[group],
      pages: catalog
        .filter((component) => component.group === group)
        .sort((left, right) => left.title.localeCompare(right.title))
        .map((component) => ({
          id: component.id,
          title: component.title,
          route: `/components/${component.id}`
        }))
    }))
];

const sections: SidebarSection[] = groups.map((group) => ({
  label: group.label,
  icon: group.icon,
  items: group.pages.map((page) => ({
    id: page.id,
    label: page.title,
    link: { href: href(page.route) }
  }))
}));

const go = (route: string) => {
  window.location.hash = route;
};

const router: CipherRouter = {
  Link: ({ link, ref, children, ...props }) => (
    <a ref={ref} href={link.href} {...props}>
      {children}
    </a>
  ),
  useLinkMatch: () => {
    const route = useRoute();
    return (link) =>
      link.href === href(route) ? { exact: true, length: route.length } : undefined;
  }
};

const darkQuery = "(prefers-color-scheme: dark)";
const subscribeScheme = (onChange: () => void) => {
  const media = window.matchMedia(darkQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const useSystemScheme = () =>
  useSyncExternalStore(subscribeScheme, () =>
    window.matchMedia(darkQuery).matches ? "dark" : "light"
  );

const initialChoice = (): ShellTheme => {
  const stored = window.localStorage.getItem("cipher-theme");
  return (
    toTheme(new URLSearchParams(window.location.search).get("theme")) ??
    (stored === "system" ? stored : toTheme(stored)) ??
    "light"
  );
};

const kindOf = (group: string): CommandMenuItemKind => {
  if (group === "Foundations") return "foundation";
  if (group === "Patterns" || group === "Composites") return "pattern";
  return "component";
};

function SitePalette({
  open,
  onOpenChange,
  toggleTheme
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toggleTheme: () => void;
}) {
  const shell = useAppShell();
  const menu: CommandMenuGroup[] = [
    ...groups.map((group) => ({
      label: group.label,
      items: group.pages.map((page) => ({
        id: page.id,
        label: page.title,
        icon: group.icon,
        kind: kindOf(group.label),
        keywords: [page.id],
        onSelect: () => go(page.route)
      }))
    })),
    {
      label: "Commands",
      items: [
        {
          id: "action:theme",
          label: "Toggle theme",
          icon: "moon",
          kind: "action",
          onSelect: toggleTheme
        },
        {
          id: "action:sidebar",
          label: "Toggle sidebar",
          icon: "sidebar",
          kind: "action",
          shortcut: "mod+B",
          onSelect: () => shell?.toggleNavigation()
        }
      ]
    }
  ];
  return (
    <CommandMenu groups={menu} open={open} onOpenChange={onOpenChange} label="Search Cipher" />
  );
}

export function App() {
  const route = useRoute();
  const system = useSystemScheme();
  const [choice, setChoice] = useState(initialChoice);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const insetRef = useRef<HTMLElement>(null);
  const theme = choice === "system" ? defaultTheme[system] : choice;
  const chooseTheme = (next: ShellTheme) => {
    setChoice(next);
    window.localStorage.setItem("cipher-theme", next);
  };
  const toggleTheme = () =>
    chooseTheme(defaultTheme[themeScheme(theme) === "dark" ? "light" : "dark"]);
  const group =
    groups.find((entry) => entry.pages.some((page) => page.route === route)) ?? groups[0];
  const page = group.pages.find((entry) => entry.route === route) ?? group.pages[0];
  const component = catalog.find((entry) => `/components/${entry.id}` === page.route);
  const foundation = foundationPages.find((entry) => entry.id === page.id) ?? foundationPages[0];
  useEffect(() => {
    insetRef.current?.scrollTo({ top: 0 });
  }, [page.id]);
  const breadcrumb: BreadcrumbCrumb[] = [
    {
      label: group.label,
      media: <Icon name={group.icon} />,
      href: href(group.pages[0].route),
      switcher: {
        label: "Switch section",
        options: groups.map((entry) => ({
          value: entry.label,
          label: entry.label,
          media: <Icon name={entry.icon} />
        })),
        value: group.label,
        onChange: (value: string) => {
          const next = groups.find((entry) => entry.label === value);
          if (next) go(next.pages[0].route);
        }
      }
    },
    {
      label: page.title,
      switcher: {
        label: `Switch ${group.label.toLowerCase()} page`,
        searchable: group.pages.length > 8,
        placeholder: `Search ${group.label.toLowerCase()}`,
        options: group.pages.map((entry) => ({ value: entry.id, label: entry.title })),
        value: page.id,
        onChange: (value: string) => {
          const next = group.pages.find((entry) => entry.id === value);
          if (next) go(next.route);
        }
      }
    }
  ];
  return (
    <CipherScope theme={theme} className="flex h-dvh flex-col overflow-clip">
      <CipherRouterProvider router={router}>
        <TooltipProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:p-3"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("content")?.focus();
            }}
          >
            Skip to content
          </a>
          <AppShell>
            <TopBar
              breadcrumb={breadcrumb}
              search={{ onClick: () => setPaletteOpen(true), label: "Search Cipher" }}
              account={{
                label: "Showcase",
                name: "Cipher",
                email: `v${pkg.version}`,
                items: [
                  { label: "GitHub repository", icon: "git", href: repository, external: true },
                  {
                    label: "Releases",
                    icon: "package",
                    href: `${repository}/releases`,
                    external: true
                  }
                ],
                theme: { value: choice, onChange: chooseTheme }
              }}
            />
            <Sidebar label="Cipher" sections={sections} current={page.id} />
            <AppInset ref={insetRef}>
              <PageGutter key={page.id}>
                <article id="content" tabIndex={-1} className="outline-none">
                  {component ? <ComponentPage component={component} /> : <foundation.Page />}
                </article>
              </PageGutter>
            </AppInset>
            <SitePalette
              open={paletteOpen}
              onOpenChange={setPaletteOpen}
              toggleTheme={toggleTheme}
            />
          </AppShell>
        </TooltipProvider>
      </CipherRouterProvider>
    </CipherScope>
  );
}
