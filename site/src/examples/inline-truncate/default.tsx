import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { Inline, InlineGrow, InlineItem, Stack } from "@infisical/cipher/ui/layout";
import { Meta, SmallText, Text } from "@infisical/cipher/ui/text";

const frame = "w-full max-w-md rounded-md border border-border px-3 py-2";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Inline gap={8} wrap={false}>
            <InlineItem shrink={false}>
              <Icon name="key" />
            </InlineItem>
            <InlineGrow>
              <Text truncate>STRIPE_WEBHOOK_SIGNING_SECRET_PRODUCTION</Text>
            </InlineGrow>
            <Badge tone="warn">Production</Badge>
            <InlineItem shrink={false}>
              <Meta>2h ago</Meta>
            </InlineItem>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Text truncate in InlineGrow; the icon and timestamp keep their width"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Inline gap={8} wrap={false}>
            <Button variant="link" underline="hover">
              Read production secrets
            </Button>
            <Meta mono={false} truncate>
              Lets the deploy pipeline read every secret under /apps/payments in production
            </Meta>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Meta truncate beside a link"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Inline gap={8} align="baseline" wrap={false}>
            <InlineItem truncate>GitHub Actions, payments-service deploy workflow</InlineItem>
            <InlineItem shrink={false}>
              <Meta>192.168.14.207</Meta>
            </InlineItem>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"InlineItem truncate for plain text, a fixed IP address"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className={frame}>
          <Stack gap={0}>
            <Text truncate>Payments service deploy identity</Text>
            <SmallText muted truncate>
              On behalf of maya.okafor@example.com, approved by the platform team
            </SmallText>
          </Stack>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Two lines in a Stack"}</figcaption>
      </figure>
    </div>
  );
}
