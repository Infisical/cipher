import { Badge } from "@infisical/cipher/ui/badge";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListRow } from "@infisical/cipher/ui/list";

const rows = [
  {
    key: "STRIPE_WEBHOOK_SIGNING_SECRET_FOR_BILLING_RECONCILIATION_JOBS_EU_CENTRAL_1",
    environment: "Production",
    path: "/platform/core-services/shared-infrastructure/eu-central-1/postgres-primary",
    due: "Tomorrow"
  },
  {
    key: "DATADOG_API_KEY_FOR_SYNTHETIC_MONITORING_AND_LOG_FORWARDING_PIPELINES",
    environment: "Staging",
    path: "/observability/datadog/synthetic-monitoring/log-forwarding/us-east-1",
    due: "Nov 21"
  },
  { key: "DATABASE_URL", environment: "Development", path: "/", due: "Dec 2" }
];

export default function Example() {
  return (
    <div className="w-full max-w-md min-w-0">
      <List label="Due this week" title="Due this week">
        {rows.map((row) => (
          <ListRow
            key={row.key}
            value={row.key}
            label={row.key}
            media={<Media icon="sync" size="sm" />}
            title={row.key}
            description={
              <span className="flex min-w-0 gap-1.5">
                <span className="shrink-0">{row.environment}</span>
                {row.path !== "/" && <span className="truncate">{row.path}</span>}
              </span>
            }
            meta={row.due}
            onClick={() => undefined}
          />
        ))}
        <ListRow
          value="wrapped"
          label="SENDGRID_TRANSACTIONAL_EMAIL_API_KEY_WITH_FULL_ACCESS_TO_TEMPLATES"
          title="SENDGRID_TRANSACTIONAL_EMAIL_API_KEY_WITH_FULL_ACCESS_TO_TEMPLATES"
          description="/notifications/email/sendgrid/transactional/templates/password-reset-and-invitations"
          badge={<Badge tone="warn">Rotation overdue</Badge>}
        />
      </List>
    </div>
  );
}
