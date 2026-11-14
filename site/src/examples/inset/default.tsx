import { Badge } from "@infisical/cipher/ui/badge";
import { Card } from "@infisical/cipher/ui/card";
import { Inset } from "@infisical/cipher/ui/inset";
import { Stack } from "@infisical/cipher/ui/layout";

const resources = [
  { name: "LOG_LEVEL", change: "Updated", from: "info", to: "debug" },
  { name: "WORKERS", change: "Added", from: undefined, to: "8" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card variant="framed" title="Commit 4f2a9c1">
          <Stack gap={8}>
            {resources.map((resource) => (
              <Inset key={resource.name}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">{resource.name}</span>
                  <Badge>{resource.change}</Badge>
                </div>
                <p className="m-0 mt-1 font-mono text-xs text-[color:var(--cipher-text2)]">
                  {resource.from ? `${resource.from} to ${resource.to}` : resource.to}
                </p>
              </Inset>
            ))}
          </Stack>
        </Card>
        <figcaption className="text-muted-foreground text-xs">
          {"Blocks inside a framed card are tinted insets, never bordered cards"}
        </figcaption>
      </figure>
    </div>
  );
}
