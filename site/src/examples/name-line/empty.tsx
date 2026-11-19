import { Badge } from "@infisical/cipher/ui/badge";
import { Icon } from "@infisical/cipher/ui/icon";
import { NameLine } from "@infisical/cipher/ui/name-line";
import { Meta } from "@infisical/cipher/ui/text";

type Row = {
  name: string;
  time?: string;
  badges: {
    label: string;
    tone?: "warn" | "soft" | "info" | "bad" | "ok";
    icon?: "clock" | "lock";
  }[];
};

const rows: Row[] = [
  { name: "API_URL", badges: [] },
  { name: "K", badges: [{ label: "Edited", tone: "warn" }] },
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="w-full max-w-sm max-w-full border border-border">
          {rows.map((row) => (
            <div
              key={row.name}
              className="border-b border-border px-3 py-2 last:border-b-0"
            >
              <NameLine
                media={<Icon name="key" />}
                badges={
                  row.badges.length ? (
                    <>
                      {row.badges.map((badge) => (
                        <Badge
                          key={badge.label}
                          tone={badge.tone}
                          icon={badge.icon}
                          collapse
                        >
                          {badge.label}
                        </Badge>
                      ))}
                    </>
                  ) : undefined
                }
                trailing={row.time ? <Meta>{row.time}</Meta> : undefined}
              >
                {row.name}
              </NameLine>
            </div>
          ))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"A name alone, and a one-letter name with one badge"}
        </figcaption>
      </figure>
    </div>
  );
}
