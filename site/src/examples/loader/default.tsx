import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListRow } from "@infisical/cipher/ui/list";
import { Loader } from "@infisical/cipher/ui/loader";
import { Skeleton } from "@infisical/cipher/ui/skeleton";

const connections = [
  { value: "vercel", title: "Vercel", description: "Production, 14 secrets", icon: "globe" },
  { value: "github", title: "GitHub", description: "Actions, 9 secrets", icon: "git" }
] as const;

export default function Example() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Loader size="base" label="Loading secrets" delay={0} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"base"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Loader
            size="page"
            label="Connecting to Vercel"
            description="Large projects can take up to a minute."
            delay={0}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"page"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 2000);
            }}
          >
            Reload connections
          </Button>
          <div aria-busy={loading}>
            {loading && (
              <span role="status" className="sr-only">
                Loading connections
              </span>
            )}
            <List label="Connections">
              {connections.map((connection) =>
                loading ? (
                  <ListRow
                    key={connection.value}
                    value={connection.value}
                    label={connection.title}
                    media={<Skeleton width={40} height={40} />}
                    title={
                      <span className="flex h-(--v4-type-row-title-line-height) items-center">
                        <Skeleton width={48} height={12} />
                      </span>
                    }
                    meta={<Skeleton width={68} height={20} />}
                  >
                    <span className="flex h-(--v4-type-small-line-height) items-center">
                      <Skeleton width={144} height={10} />
                    </span>
                  </ListRow>
                ) : (
                  <ListRow
                    key={connection.value}
                    value={connection.value}
                    label={connection.title}
                    media={<Media icon={connection.icon} />}
                    title={connection.title}
                    description={connection.description}
                    meta={
                      <Badge tone="ok" dot>
                        Synced
                      </Badge>
                    }
                  />
                )
              )}
            </List>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Known rows reload as skeleton rows"}
        </figcaption>
      </figure>
    </div>
  );
}
