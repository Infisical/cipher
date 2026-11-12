
import { Sidebar, type SidebarLevel } from "@infisical/cipher/ui/sidebar";

const page = (group: string, component: string, label: string) => ({
  id: component,
  label,
  link: { href: `/design-system/components/${group}/${component}` }
});

const levels: SidebarLevel[] = [
  {
    id: "root",
    label: "Design system",
    sections: [
      {
        items: [
          {
            id: "overview",
            label: "Overview",
            icon: "home",
            link: { href: "/design-system" }
          },
          { id: "open-navigation", label: "Navigation", icon: "menu", level: "navigation" },
          { id: "open-feedback", label: "Feedback", icon: "bell", level: "feedback" }
        ]
      }
    ]
  },
  {
    id: "navigation",
    label: "Navigation",
    parent: "root",
    sections: [
      {
        label: "Navigation",
        icon: "menu",
        items: [
          page("navigation", "breadcrumb", "Breadcrumb"),
          page("navigation", "sidebar", "Sidebar"),
          page("navigation", "tabs", "Tabs"),
          page("navigation", "top-bar", "Top bar")
        ]
      }
    ]
  },
  {
    id: "feedback",
    label: "Feedback",
    parent: "root",
    sections: [
      {
        label: "Feedback",
        icon: "bell",
        items: [
          page("feedback", "alert", "Alert"),
          page("feedback", "loader", "Loader"),
          page("feedback", "toast", "Toast")
        ]
      }
    ]
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Sidebar label="Routed example" levels={levels} />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Routed levels, the current route's level open"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Sidebar label="Routed rail example" levels={levels} defaultCollapsed />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Routed levels in the rail"}
        </figcaption>
      </figure>
    </div>
  );
}
