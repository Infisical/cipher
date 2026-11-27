import { Button } from "@infisical/cipher/ui/button";
import { ButtonGroup } from "@infisical/cipher/ui/button-group";
import { Card } from "@infisical/cipher/ui/card";

export default function Example() {
  return (
    <figure className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
      <Card
        variant="framed"
        title="Slack: #security-alerts"
        action={
          <ButtonGroup label="Slack channel">
            <Button variant="outline" icon="send">
              Send test
            </Button>
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Disable</Button>
          </ButtonGroup>
        }
      >
        Last delivered 12 minutes ago.
      </Card>
      <figcaption className="text-muted-foreground text-xs">
        The group sits on the title's line while both fit, and drops under the title inside the band
        when they don't, so no button is clipped
      </figcaption>
    </figure>
  );
}
