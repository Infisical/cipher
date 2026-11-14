import * as React from "react";

import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Rule = { id: string; name: string; match: string; action: string; locked?: boolean };
const initial: Rule[] = [
  { id: "deny-prod", name: "Deny production deletes", match: "prod/**", action: "Deny" },
  { id: "approve-staging", name: "Approve staging writes", match: "staging/**", action: "Require approval" },
  { id: "allow-dev", name: "Allow development", match: "dev/**", action: "Allow" },
  { id: "audit-all", name: "Audit everything", match: "**", action: "Log", locked: true }
];

const columns: DataTableColumn<Rule>[] = [
  { id: "name", header: "Rule", primary: true, render: (rule) => rule.name },
  { id: "match", header: "Path", mono: true, render: (rule) => rule.match },
  { id: "action", header: "Action", render: (rule) => rule.action }
];

export default function Example() {
  const [rules, setRules] = React.useState(initial);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <DataTable
        label="Access rules"
        rows={rules}
        columns={columns}
        getRowId={(rule) => rule.id}
        rowLabel={(rule) => rule.name}
        reorder={{ onReorder: setRules, isRowDisabled: (rule) => Boolean(rule.locked) }}
      />
      <figcaption className="text-muted-foreground text-xs">
        {`Evaluated in order: ${rules.map((rule) => rule.name).join(", ")}. The catch-all rule is locked.`}
      </figcaption>
    </figure>
  );
}
