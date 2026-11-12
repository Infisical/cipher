import * as React from "react";

import { Input } from "@infisical/cipher/ui/input";
import { Highlight } from "@infisical/cipher/ui/text";

const variables = [
  "DATABASE_URL",
  "DATABASE_REPLICA_URL",
  "REDIS_URL",
  "SENTRY_DSN",
  "API_BASE_URL"
];

export default function Example() {
  const [query, setQuery] = React.useState("url");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <div className="flex flex-col gap-2">
            <Input
              aria-label="Search environment variables"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ul className="flex flex-col gap-1 font-mono">
              {variables.map((name) => (
                <li key={name}>
                  <Highlight text={name} query={query} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Every match, case-insensitive"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <p>
            <Highlight
              text="Rotate the database password before the replica restarts"
              query="database replica"
              terms
            />
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"terms: each word on its own"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <p className="font-mono">
            <Highlight text="api.v1.(beta) and apixv1" query="api.v1.(beta)" />
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Literal query, not a pattern"}
        </figcaption>
      </figure>
    </div>
  );
}
