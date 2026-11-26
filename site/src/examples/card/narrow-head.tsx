import { Button } from "@infisical/cipher/ui/button";
import { ButtonGroup } from "@infisical/cipher/ui/button-group";
import { Card } from "@infisical/cipher/ui/card";

const channelActions = (
  <ButtonGroup label="Slack channel">
    <Button variant="outline" icon="send">
      Send test
    </Button>
    <Button variant="outline">Edit</Button>
    <Button variant="outline">Disable</Button>
  </ButtonGroup>
);

const Figure = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    {children}
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-x-6 gap-y-8">
      <Figure caption="Plain: the actions drop below once the title would go under its 160px floor">
        <Card
          title="Slack: #security-alerts"
          description="Posts when a secret rotation fails or an access request waits more than an hour."
          action={channelActions}
        >
          Last delivered 12 minutes ago.
        </Card>
      </Figure>
      <Figure caption="Plain, long-label action">
        <Card
          title="PagerDuty: platform on-call"
          description="Pages the on-call engineer for critical alerts."
          action={<Button variant="outline">Send test notification</Button>}
        >
          Last delivered yesterday.
        </Card>
      </Figure>
      <Figure caption="Framed: the title keeps its text first and the action truncates in the band">
        <Card
          variant="framed"
          title="Slack: #security-alerts"
          action={<Button variant="outline">Send test notification</Button>}
        >
          Last delivered 12 minutes ago.
        </Card>
      </Figure>
    </div>
  );
}
