import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { hueScope } from "@infisical/cipher/lib/hue";

const scopes = [
  { label: "Outside every scope" },
  { label: "Hue 113.8", hue: 113.8 },
  { label: "Hue 56", hue: 56 },
  { label: "Hue 172", hue: 172 },
  { label: "Hue 305", hue: 305 },
  { label: "Hue 18", hue: 18 },
  { label: "Hue 152", hue: 152 },
  { label: "Hue 250", hue: 250 },
  { label: "Hue 264 at 0.45 lightness", hue: 264, lightness: 0.45 }
];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {scopes.map((scope) => (
        <div
          key={scope.label}
          className="flex flex-wrap items-center gap-3"
          {...(scope.hue === undefined
            ? {}
            : hueScope(scope.hue, "pop", { lightness: scope.lightness }))}
        >
          <Button variant="accent" icon="plus">
            New project
          </Button>
          <Badge tone="accent">New</Badge>
          <span className="text-muted-foreground text-xs">{scope.label}</span>
        </div>
      ))}
    </div>
  );
}
