import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { Input } from "@infisical/cipher/ui/input";
import { Inline } from "@infisical/cipher/ui/layout";

const rows = [
  { label: "md (default), beside a 32px row", badge: "md", control: "sm", button: "default" },
  {
    label: "control-sm, beside Input sm and Button default",
    badge: "control-sm",
    control: "sm",
    button: "default"
  },
  {
    label: "control-md, beside Input md and Button md",
    badge: "control-md",
    control: "md",
    button: "md"
  },
  {
    label: "control-lg, beside Input lg and Button lg",
    badge: "control-lg",
    control: "lg",
    button: "lg"
  }
] as const;

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      {rows.map((row) => (
        <figure key={row.badge} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
            <Inline gap={8} wrap={false}>
              <Badge tone="soft" size={row.badge}>
                <Icon name="key" />
                Access key ID
              </Badge>
              <Input
                size={row.control}
                mono
                aria-label={`Secret name, ${row.badge}`}
                defaultValue="AWS_ACCESS_KEY_ID"
              />
              <Button variant="outline" size={row.button}>
                Generate
              </Button>
            </Inline>
          </div>
          <figcaption className="text-muted-foreground text-xs">{row.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
