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
import { Sidebar, type SidebarHelp, type SidebarSection } from "@infisical/cipher/ui/sidebar";
import { TooltipProvider } from "@infisical/cipher/ui/tooltip";
import {
  AppInset,
  AppShell,
  PageGutter,
  TopBar,
  type ShellTheme,
  useAppShell
} from "@infisical/cipher/ui/top-bar";

import { version } from "../../package.json";
import catalog from "./catalog.json";
import { ComponentPage } from "./component-page";
import { foundationPages } from "./foundations";
import { href, useRoute } from "./router";

const repository = "https://github.com/Infisical/cipher";

const InfisicalMark = () => (
  <svg width={20} height={20} viewBox="0 0 91 43" fill="currentColor" aria-hidden="true">
    <path d="M21.9734 0C24.8526 0 27.4793 0.412021 29.8535 1.23606C32.2528 2.06011 34.4123 3.13386 36.3318 4.45732C38.2766 5.75581 39.9814 7.10424 41.4463 8.50261C42.2545 9.25174 42.987 9.98839 43.6436 10.7125C44.3003 11.4367 44.9317 12.1609 45.5379 12.885C46.0935 12.1609 46.6618 11.4617 47.2427 10.7875C47.8489 10.0883 48.6066 9.32665 49.5158 8.50261C51.7132 6.38008 54.4409 4.43235 57.699 2.65941C60.9824 0.886471 64.7835 0 69.1024 0C73.1435 0 76.8183 0.97387 80.127 2.92161C83.4609 4.84437 86.1002 7.42886 88.045 10.6751C90.015 13.9213 91 17.5171 91 21.4625C91 24.4591 90.4317 27.2683 89.2952 29.8902C88.1586 32.4872 86.5927 34.7721 84.5974 36.7448C82.6021 38.6925 80.2785 40.2282 77.6266 41.3519C74.9746 42.4506 72.1332 43 69.1024 43C66.2231 43 63.5712 42.6005 61.1465 41.8014C58.7472 40.9774 56.5751 39.9286 54.6303 38.6551C52.7108 37.3815 51.0186 36.0706 49.5537 34.7221C48.7202 33.8981 47.9752 33.124 47.3185 32.3998C46.6871 31.6507 46.0935 30.9141 45.5379 30.1899C44.9065 30.9141 44.2624 31.6507 43.6057 32.3998C42.9491 33.149 42.2166 33.9231 41.4084 34.7221C39.9688 36.0706 38.2766 37.3815 36.3318 38.6551C34.4123 39.9036 32.2528 40.9399 29.8535 41.7639C27.4793 42.588 24.8526 43 21.9734 43C17.8818 43 14.1817 42.0386 10.873 40.1159C7.56439 38.1931 4.92506 35.6086 2.95504 32.3624C0.985013 29.0912 0 25.4579 0 21.4625C0 18.491 0.555648 15.7192 1.66694 13.1472C2.8035 10.5502 4.36941 8.26539 6.3647 6.29269C8.38523 4.31998 10.7215 2.78427 13.3734 1.68554C16.0507 0.561848 18.9173 0 21.9734 0ZM10.4563 21.4625C10.4563 23.5351 10.974 25.4204 12.0096 27.1185C13.0451 28.8165 14.4342 30.1649 16.1769 31.1638C17.9197 32.1626 19.8518 32.662 21.9734 32.662C24.3475 32.662 26.5322 32.1376 28.5275 31.0889C30.5228 30.0401 32.3791 28.7166 34.0966 27.1185C35.1826 26.0947 36.1171 25.1083 36.9001 24.1594C37.683 23.2105 38.365 22.3116 38.9459 21.4625C38.3397 20.6635 37.6199 19.777 36.7864 18.8031C35.9782 17.8043 35.0816 16.8554 34.0966 15.9564C32.4802 14.3833 30.649 13.0598 28.6032 11.9861C26.5575 10.8873 24.3475 10.338 21.9734 10.338C19.8518 10.338 17.9197 10.8499 16.1769 11.8737C14.4342 12.8725 13.0451 14.221 12.0096 15.919C10.974 17.592 10.4563 19.4399 10.4563 21.4625ZM80.4679 21.4625C80.4679 19.4399 79.9502 17.592 78.9146 15.919C77.9044 14.221 76.5405 12.8725 74.8231 11.8737C73.1056 10.8499 71.1987 10.338 69.1024 10.338C67.486 10.338 65.9453 10.5877 64.4804 11.0871C63.0155 11.5865 61.639 12.2607 60.351 13.1098C59.0881 13.9588 57.9263 14.9077 56.8655 15.9564C55.729 17.0052 54.7313 18.079 53.8726 19.1777C53.0139 20.2515 52.3951 21.0131 52.0162 21.4625C52.6477 22.3365 53.3549 23.248 54.1378 24.1969C54.9208 25.1208 55.83 26.0947 56.8655 27.1185C58.5577 28.7166 60.4015 30.0401 62.3968 31.0889C64.4173 32.1376 66.6525 32.662 69.1024 32.662C71.1987 32.662 73.1056 32.1626 74.8231 31.1638C76.5405 30.1649 77.9044 28.8165 78.9146 27.1185C79.9502 25.4204 80.4679 23.5351 80.4679 21.4625Z" />
  </svg>
);

const help: SidebarHelp = {
  items: [
    { label: "GitHub repository", icon: "git", href: repository, external: true },
    { label: "Releases", icon: "package", href: `${repository}/releases`, external: true },
    { label: "GitHub issues", icon: "alert-c", href: `${repository}/issues`, external: true }
  ],
  version: `v${version}`
};

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
    { label: "Cipher", media: <InfisicalMark />, href: href(groups[0].pages[0].route) },
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
              theme={{ value: choice, onChange: chooseTheme }}
            />
            <Sidebar label="Cipher" sections={sections} current={page.id} help={help} />
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
