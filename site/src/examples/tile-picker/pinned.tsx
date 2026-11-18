import { TilePicker, type TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

const services: TilePickerItem[] = [
  {
    value: "github",
    title: "GitHub",
    description: "Repositories, issues and pull requests.",
    category: "Source control",
    icon: "git"
  },
  {
    value: "gitlab",
    title: "GitLab",
    description: "Projects, merge requests and pipelines.",
    category: "Source control",
    icon: "git"
  },
  {
    value: "linear",
    title: "Linear",
    description: "Issues, projects and cycles.",
    category: "Project management",
    icon: "folder"
  },
  {
    value: "stripe",
    title: "Stripe",
    description: "Customers, invoices and subscriptions.",
    category: "Payments",
    icon: "key"
  },
  {
    value: "custom-http",
    title: "Custom HTTP",
    description: "Any HTTP API, with headers and auth you define.",
    category: "Generic",
    icon: "cloud",
    pinned: true
  },
  {
    value: "mcp",
    title: "MCP",
    description: "Any server that speaks the Model Context Protocol.",
    category: "Protocol",
    icon: "link",
    pinned: true
  }
];

export default function Example() {
  return (
    <TilePicker
      items={services}
      onSelect={() => {}}
      searchLabel="Search services"
      allLabel="All services"
      noun="services"
    />
  );
}
