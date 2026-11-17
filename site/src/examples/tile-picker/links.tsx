import { TilePicker, type TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

const services: TilePickerItem[] = [
  {
    value: "github",
    title: "GitHub",
    description: "Repositories, issues and pull requests.",
    eyebrow: "Source control",
    icon: "git",
    href: "#/agent-vault/connections/new/github",
    popular: true
  },
  {
    value: "linear",
    title: "Linear",
    description: "Issues, projects and cycles.",
    eyebrow: "Project management",
    icon: "folder",
    href: "#/agent-vault/connections/new/linear"
  },
  {
    value: "custom-http",
    title: "Custom HTTP",
    description: "Any HTTP API, with headers and auth you define.",
    eyebrow: "Generic",
    icon: "cloud",
    href: "https://infisical.com/docs",
    external: true
  },
  {
    value: "mcp",
    title: "MCP",
    description: "Any server that speaks the Model Context Protocol.",
    eyebrow: "Protocol",
    icon: "link",
    href: "https://modelcontextprotocol.io/docs/getting-started/intro",
    external: true
  }
];

export default function Example() {
  return (
    <TilePicker
      items={services}
      searchLabel="Search services"
      allLabel="All services"
      noun="services"
    />
  );
}
