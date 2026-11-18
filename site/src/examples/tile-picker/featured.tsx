import { TilePicker, type TilePickerItem } from "@infisical/cipher/patterns/tile-picker";

const templates: TilePickerItem[] = [
  {
    value: "openai",
    title: "OpenAI",
    description: "api.openai.com",
    category: "LLM providers",
    icon: "zap",
    popular: true
  },
  {
    value: "anthropic",
    title: "Anthropic",
    description: "api.anthropic.com",
    category: "LLM providers",
    icon: "zap",
    popular: true
  },
  {
    value: "github",
    title: "GitHub",
    description: "api.github.com",
    category: "Developer tools",
    icon: "git",
    popular: true
  },
  {
    value: "slack",
    title: "Slack",
    description: "slack.com",
    category: "Communication",
    icon: "users",
    popular: true
  },
  {
    value: "google-workspace",
    title: "Google Workspace",
    description: "gmail.googleapis.com",
    category: "Productivity",
    icon: "cloud",
    popular: true
  },
  { value: "cohere", title: "Cohere", category: "LLM providers", icon: "zap" },
  { value: "discord", title: "Discord", category: "Communication", icon: "users" },
  { value: "postmark", title: "Postmark", category: "Communication", icon: "users" },
  { value: "cloudflare", title: "Cloudflare", category: "Developer tools", icon: "cloud" },
  { value: "gitlab", title: "GitLab", category: "Developer tools", icon: "git" },
  { value: "shopify", title: "Shopify", category: "Commerce", icon: "key" },
  {
    value: "custom-http",
    title: "Custom HTTP API",
    description: "Configure the hosts yourself",
    icon: "link",
    pinned: true
  },
  {
    value: "custom-mcp",
    title: "Custom MCP server",
    description: "Connect any remote MCP server by its URL",
    icon: "folder",
    pinned: true
  }
];

export default function Example() {
  return (
    <TilePicker
      items={templates}
      onSelect={() => {}}
      popular="featured"
      pinnedLabel="Start from scratch"
      density="compact"
      groupBy="category"
      searchLabel="Search templates"
      searchPlaceholder="Search templates, such as OpenAI or GitLab"
      noun="templates"
    />
  );
}
