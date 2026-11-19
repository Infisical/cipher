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
  {
    name: "DATABASE_CONNECTION_STRING_PRIMARY_REPLICA_US_EAST_1_READ_WRITE_POOL",
    time: "4m ago",
    badges: [
      { label: "Edited", tone: "warn" },
      { label: "Rotating", tone: "info", icon: "clock" },
      { label: "Locked", tone: "bad", icon: "lock" },
    ],
  },
  {
    name: "AWS_SECRET_ACCESS_KEY_FOR_THE_LEGACY_BILLING_EXPORT_PIPELINE",
    time: "Sep 14, 2026",
    badges: [
      { label: "Privileged Access Management · Enterprise", tone: "info" },
    ],
  },
  {
    name: "K",
    time: "Just now",
    badges: [{ label: "Production", tone: "soft" }],
  },
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
          {
            "Long names and several badges: badges give way first, then the name"
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="w-56 max-w-full border border-border">
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
          {
            "A very narrow column: icon badges drop to their glyph, text badges keep about 6ch"
          }
        </figcaption>
      </figure>
    </div>
  );
}
