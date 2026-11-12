import * as React from "react";

import { List, ListRow } from "@infisical/cipher/ui/list";

const environments = [
  { id: "development", title: "Development", description: "14 secrets, synced 2 minutes ago" },
  { id: "staging", title: "Staging", description: "12 secrets, synced 1 hour ago" },
  { id: "production", title: "Production", description: "12 secrets, approval required" }
];
export default function Interactive() {
  const [current, setCurrent] = React.useState("staging");
  const [opened, setOpened] = React.useState("None");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Environments" title="Environments">
            {environments.map((row) => (
              <ListRow
                key={row.id}
                value={row.id}
                label={row.title}
                title={row.title}
                description={row.description}
                href={`#list-${row.id}`}
                current={current === row.id}
                onClick={(event) => {
                  event.preventDefault();
                  setCurrent(row.id);
                }}
              />
            ))}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Link rows, hover a row, staging is current"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Related components" title="Related components">
            {(
              [
                ["table", "Table", "Typed rows with selection and row actions"],
                ["card", "Card", "Plain by default, framed for emphasis"]
              ] as const
            ).map(([component, title, description]) => (
              <ListRow
                key={component}
                value={component}
                label={title}
                title={title}
                description={description}
                link={{ href: `/design-system/components/data-display/${component}` }}
              />
            ))}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Router link rows, a modifier click opens a new tab"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Recent requests" title="Recent requests">
            <ListRow
              value="rotate"
              label="Rotate database credentials"
              title="Rotate database credentials"
              meta="2m"
              onClick={() => setOpened("Rotate database credentials")}
            />
            <ListRow
              value="access"
              label="Grant staging access"
              title="Grant staging access"
              meta="1h"
              onClick={() => setOpened("Grant staging access")}
            />
            <ListRow
              value="expired"
              label="Expired request"
              title="Expired request"
              meta="3d"
              disabled
              onClick={() => setOpened("Expired request")}
            />
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{`Button rows, hover or press a row. Opened: ${opened}`}</figcaption>
      </figure>
    </div>
  );
}
