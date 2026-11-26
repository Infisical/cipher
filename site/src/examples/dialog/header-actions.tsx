import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";

const HeaderDialog = ({
  label,
  title,
  action
}: {
  label: string;
  title: string;
  action: React.ReactNode;
}) => (
  <UI.Dialog>
    <UI.DialogTrigger asChild>
      <Button variant="outline">{label}</Button>
    </UI.DialogTrigger>
    <UI.DialogContent>
      <UI.DialogHeader actions={action}>
        <UI.DialogTitle>{title}</UI.DialogTitle>
        <UI.DialogDescription>
          Members can read and write secrets in this folder.
        </UI.DialogDescription>
      </UI.DialogHeader>
      <UI.DialogFooter>
        <UI.DialogClose asChild>
          <Button>Done</Button>
        </UI.DialogClose>
      </UI.DialogFooter>
    </UI.DialogContent>
  </UI.Dialog>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <HeaderDialog
        label="Folder access"
        title="Folder access"
        action={
          <Button variant="outline" size="sm" icon="plus">
            Add member
          </Button>
        }
      />
      <HeaderDialog
        label="Long title, action without an icon"
        title="Access to /payments/ledger/replication/readwrite/us-east-1"
        action={
          <Button variant="outline" size="sm">
            Add member or machine identity
          </Button>
        }
      />
    </div>
  );
}
