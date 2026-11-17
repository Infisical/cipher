import { Media, Tile } from "@infisical/cipher/ui/item";
import { Grid } from "@infisical/cipher/ui/layout";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <Tile
          href="#/organizations/acme/settings/billing"
          media={<Media icon="folder" />}
          title="Billing"
          description="Plan, invoices and payment method"
        />
        <Tile
          href="https://infisical.com/docs/documentation/getting-started/introduction"
          external
          media={<Media icon="book-open" />}
          title="Documentation"
          description="Guides and API reference"
        />
      </div>
      <Grid columns={3} gap={12}>
        <Tile
          layout="stacked"
          href="#/agent-vault/connections/new/github"
          media={<Media icon="git" />}
          eyebrow="Source control"
          title="GitHub"
          description="Repositories, issues and pull requests."
        />
        <Tile
          layout="stacked"
          href="https://modelcontextprotocol.io/docs/getting-started/intro"
          external
          media={<Media icon="link" />}
          eyebrow="Protocol"
          title="MCP"
          description="Any server that speaks the Model Context Protocol."
        />
        <Tile
          layout="stacked"
          href="https://infisical.com/docs"
          external
          media={<Media icon="cloud" />}
          title="Custom HTTP"
          description="Any HTTP API, with headers and auth you define."
        />
      </Grid>
    </div>
  );
}
