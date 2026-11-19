import { Badge } from "@infisical/cipher/ui/badge";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex w-40 max-w-full min-w-0 flex-col items-start gap-2 border border-border p-2">
          <Badge tone="info" collapse>
            Privileged Access Management · Enterprise
          </Badge>
          <Badge tone="warn" icon="clock" collapse>
            Expires in 7 days
          </Badge>
          <Badge tone="soft" collapse>
            Edited
          </Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "In a narrow cell a long badge truncates and shows the full text on hover"
          }
        </figcaption>
      </figure>
    </div>
  );
}
