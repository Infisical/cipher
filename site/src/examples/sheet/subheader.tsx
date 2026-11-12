import { Button } from "@infisical/cipher/ui/button";
import { Code } from "@infisical/cipher/ui/code";
import * as UI from "@infisical/cipher/ui/sheet";

const keys = [
  "DATABASE_URL",
  "DATABASE_POOL_SIZE",
  "REDIS_URL",
  "QUEUE_CONCURRENCY",
  "PAYMENTS_WEBHOOK_URL",
  "PAYMENTS_RETRY_LIMIT",
  "LOG_LEVEL",
  "LOG_FORMAT",
  "FEATURE_REFUNDS",
  "FEATURE_INVOICES",
  "SESSION_TTL",
  "CORS_ORIGINS",
  "METRICS_ENDPOINT",
  "TRACE_SAMPLE_RATE",
  "SMTP_HOST",
  "SMTP_PORT",
  "CACHE_TTL",
  "RATE_LIMIT_PER_MINUTE",
  "REGION",
  "RELEASE_CHANNEL"
];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Sheet>
        <UI.SheetTrigger asChild>
          <Button variant="outline">Review import</Button>
        </UI.SheetTrigger>
        <UI.SheetContent>
          <UI.SheetHeader>
            <UI.SheetTitle>Import 20 secrets</UI.SheetTitle>
            <UI.SheetDescription>Existing keys at this path are overwritten.</UI.SheetDescription>
          </UI.SheetHeader>
          <UI.SheetSubheader>
            <Code>acme / payments-api / production</Code>
          </UI.SheetSubheader>
          <UI.SheetBody>
            <ul>
              {keys.map((key) => (
                <li key={key}>
                  <Code>{key}</Code>
                </li>
              ))}
            </ul>
          </UI.SheetBody>
          <UI.SheetFooter>
            <UI.SheetClose asChild>
              <Button>Import secrets</Button>
            </UI.SheetClose>
          </UI.SheetFooter>
        </UI.SheetContent>
      </UI.Sheet>
    </div>
  );
}
