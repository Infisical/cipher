import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { Inline, InlineGrow, InlineItem } from "@infisical/cipher/ui/layout";
import { Meta, Text } from "@infisical/cipher/ui/text";

const secrets = [
  ["DATABASE_CONNECTION_STRING_PRIMARY_REPLICA_US_EAST_1_READ_WRITE_POOL", "Production", "4m ago"],
  [
    "AWS_SECRET_ACCESS_KEY_FOR_THE_LEGACY_BILLING_EXPORT_PIPELINE_DO_NOT_ROTATE",
    "Staging",
    "1h ago"
  ],
  ["OAUTH_CLIENT_SECRET_GOOGLE_WORKSPACE_DIRECTORY_SYNC_SERVICE_ACCOUNT", "Development", "3d ago"],
  [
    "SLACK_BOT_TOKEN_INCIDENT_RESPONSE_PAGER_ESCALATION_CHANNEL_INTEGRATION",
    "Production",
    "12d ago"
  ],
  ["SENDGRID_API_KEY_TRANSACTIONAL_EMAIL_RECEIPTS_AND_PASSWORD_RESETS", "Preview", "Sep 14, 2026"],
  ["K", "Production", "Just now"]
] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="w-full max-w-sm rounded-md border border-border">
          {secrets.map(([name, environment, time]) => (
            <div key={name} className="border-b border-border px-3 py-2 last:border-b-0">
              <Inline gap={8} wrap={false}>
                <InlineItem shrink={false}>
                  <Icon name="key" />
                </InlineItem>
                <InlineGrow>
                  <Text truncate>{name}</Text>
                </InlineGrow>
                <Badge tone={environment === "Production" ? "warn" : "soft"}>{environment}</Badge>
                <InlineItem shrink={false}>
                  <Meta>{time}</Meta>
                </InlineItem>
              </Inline>
            </div>
          ))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Many rows with long names in a narrow list"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="w-full max-w-sm rounded-md border border-border px-3 py-2">
          <Inline gap={8} wrap={false}>
            <Button variant="link" underline="hover">
              Rotate billing exporter
            </Button>
            <Meta mono={false} truncate>
              Applies to every environment and every folder below /apps/billing/exports
            </Meta>
            <Badge tone="bad">Needs attention</Badge>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Link and badge keep their width; the description gives way first"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="w-48 max-w-full rounded-md border border-border px-3 py-2">
          <Inline gap={4} wrap={false}>
            <InlineItem shrink={false}>
              <Icon name="folder" />
            </InlineItem>
            <InlineItem truncate>applications/staging/services/payment-processing</InlineItem>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Very narrow, 192px"}</figcaption>
      </figure>
    </div>
  );
}
