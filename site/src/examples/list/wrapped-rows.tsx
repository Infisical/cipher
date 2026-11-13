import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { List, ListRow } from "@infisical/cipher/ui/list";

type Member = { id: string; name: string; email: string; owner?: boolean };
const members: Member[] = [
  { id: "ana", name: "Ana Torres", email: "ana@acme.dev", owner: true },
  { id: "kai", name: "Kai Moreno", email: "kai@acme.dev" },
  { id: "lee", name: "Lee Park", email: "lee@acme.dev" }
];

function MemberRow({ member }: { member: Member }) {
  return (
    <ListRow
      value={member.id}
      label={member.name}
      title={member.name}
      description={member.email}
      badge={member.owner ? <Badge tone="soft">Owner</Badge> : undefined}
      selectable={!member.owner}
    />
  );
}

export default function Example() {
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List
            label="Members"
            title="Members"
            selection="multiple"
            selectedIds={selected}
            onSelectionChange={setSelected}
          >
            {members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
            <>
              <ListRow
                value="invite"
                label="Pending invite"
                title="sam@acme.dev"
                description="Invited 2 days ago"
              />
            </>
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {`Rows in a wrapper component and a fragment. Selected: ${selected.length ? selected.join(", ") : "none"}`}
        </figcaption>
      </figure>
    </div>
  );
}
