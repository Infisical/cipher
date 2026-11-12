import { useState } from "react";

import { AccessList, type AccessMember } from "@infisical/cipher/patterns/access-list";

const everyone: AccessMember[] = [
  {
    id: "sarah",
    name: "Sarah Lin",
    role: "Owner",
    via: "Created the project. Transfer ownership to remove.",
    lastUsed: "2m ago",
    owner: true,
    href: "#access-list"
  },
  {
    id: "marcus",
    name: "Marcus Okonkwo-Fitzgerald",
    role: "Admin",
    via: "Through the Platform team",
    lastUsed: "1h ago",
    href: "#access-list"
  },
  {
    id: "priya",
    name: "Priya Raman",
    role: "Read",
    via: "Temporary, until 11:46",
    lastUsed: "Yesterday",
    href: "#access-list"
  },
  {
    id: "deployer",
    name: "github-deployer",
    kind: "machine",
    role: "Write",
    via: "Machine identity, universal auth",
    lastUsed: "4m ago",
    href: "#access-list"
  },
  {
    id: "agent",
    name: "release-notes-agent",
    kind: "agent",
    role: "Read, 1 hour",
    via: "Granted by Marcus",
    href: "#access-list"
  }
];

export default function Example() {
  const [members, setMembers] = useState(everyone);
  const [open, setOpen] = useState("marcus");
  const missing = everyone.find((member) => !members.some((entry) => entry.id === member.id));
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <AccessList
          project="payments-api"
          members={members}
          current={open}
          onOpen={setOpen}
          onAdd={missing ? () => setMembers((value) => [...value, missing]) : undefined}
          onRevoke={(ids) =>
            setMembers((value) => value.filter((member) => !ids.includes(member.id)))
          }
          onRestore={(ids) =>
            setMembers((value) => [
              ...value,
              ...everyone.filter(
                (member) =>
                  ids.includes(member.id) && !value.some((entry) => entry.id === member.id)
              )
            ])
          }
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Owner locked, multiple selection with the bulk bar"}
      </figcaption>
    </figure>
  );
}
