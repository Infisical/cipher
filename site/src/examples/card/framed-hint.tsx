import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <Card
        variant="framed"
        title="Cross-project sharing"
        hint="Projects listed here can import or reference folders from this one."
        action={
          <Button variant="outline" size="xs" icon="plus">
            Add project
          </Button>
        }
      >
        Payments can read /shared/stripe in staging and production.
      </Card>
      <Card
        variant="framed"
        title="Secret validation rules"
        hint="Checked on secret writes and on generated passwords."
        footer="2 rules"
        footerPlacement="frame"
      >
        Keys must be uppercase. Values must be at least 16 characters.
      </Card>
    </div>
  );
}
