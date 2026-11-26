import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { FloatingActionBar } from "@infisical/cipher/ui/floating-action-bar";
import { List, ListRow } from "@infisical/cipher/ui/list";
import * as UI from "@infisical/cipher/ui/sheet";
import { toast } from "@infisical/cipher/ui/sonner";

const members = [
  "ada.lovelace@acme.dev",
  "alan.turing@acme.dev",
  "grace.hopper@acme.dev",
  "katherine.johnson@acme.dev",
  "linus.torvalds@acme.dev",
  "margaret.hamilton@acme.dev",
  "dennis.ritchie@acme.dev",
  "barbara.liskov@acme.dev",
  "ken.thompson@acme.dev",
  "frances.allen@acme.dev",
  "john.mccarthy@acme.dev",
  "radia.perlman@acme.dev"
];

export default function Example() {
  const [rows, setRows] = useState(members);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <UI.Sheet onOpenChange={(open) => !open && setSelected([])}>
      <UI.SheetTrigger asChild>
        <Button variant="outline">Manage members</Button>
      </UI.SheetTrigger>
      <UI.SheetContent size="md">
        <UI.SheetHeader>
          <UI.SheetTitle>Production members</UI.SheetTitle>
        </UI.SheetHeader>
        <UI.SheetBody>
          <List
            label="Members"
            selection="multiple"
            selectedIds={selected}
            onSelectionChange={setSelected}
          >
            {rows.map((email) => (
              <ListRow key={email} value={email} label={email} title={email} />
            ))}
          </List>
        </UI.SheetBody>
        <FloatingActionBar
          count={selected.length}
          total={rows.length}
          onSelectAll={() => setSelected(rows)}
          onClear={() => setSelected([])}
          actions={[
            {
              label: "Remove",
              icon: "trash",
              danger: true,
              onClick: () => {
                setRows(rows.filter((row) => !selected.includes(row)));
                toast(`Removed ${selected.length} members.`);
                setSelected([]);
              }
            }
          ]}
        />
        <UI.SheetFooter>
          <UI.SheetClose asChild>
            <Button>Done</Button>
          </UI.SheetClose>
        </UI.SheetFooter>
      </UI.SheetContent>
    </UI.Sheet>
  );
}
