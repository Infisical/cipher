import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn, type DataTableRowProps } from "@infisical/cipher/ui/data-table";

type Plan = { id: string; name: string; key: string };
const initial: Plan[] = [
  { id: "free", name: "Free", key: "free" },
  { id: "pro", name: "Pro", key: "pro-2026" },
  { id: "team", name: "Team", key: "team-2026" },
  { id: "enterprise", name: "Enterprise", key: "enterprise" }
];

const move = (list: Plan[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item as Plan);
  return next;
};

export default function Example() {
  const [plans, setPlans] = React.useState(initial);
  const [dragged, setDragged] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<{ id: string; edge: "before" | "after" } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");

  const moveBy = (plan: Plan, step: number) => {
    const from = plans.indexOf(plan);
    const to = from + step;
    if (to < 0 || to >= plans.length) return;
    setPlans(move(plans, from, to));
    setAnnouncement(`Moved ${plan.name} to position ${to + 1} of ${plans.length}.`);
  };

  const rowProps = (plan: Plan): DataTableRowProps => ({
    "data-drop-target": over?.id === plan.id ? over.edge : undefined,
    onDragOver: (event) => {
      if (!dragged || dragged === plan.id) return;
      event.preventDefault();
      const box = event.currentTarget.getBoundingClientRect();
      const edge = event.clientY < box.top + box.height / 2 ? "before" : "after";
      if (over?.id !== plan.id || over.edge !== edge) setOver({ id: plan.id, edge });
    },
    onDragLeave: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null);
    },
    onDrop: (event) => {
      event.preventDefault();
      const from = plans.findIndex((item) => item.id === dragged);
      const target = plans.indexOf(plan);
      if (from < 0 || !over) return;
      const to = target + (over.edge === "after" ? 1 : 0) - (from < target ? 1 : 0);
      setPlans(move(plans, from, to));
      setOver(null);
    }
  });

  const columns: DataTableColumn<Plan>[] = [
    {
      id: "handle",
      header: "Reorder",
      hideHeader: true,
      width: 56,
      render: (plan) => (
        <Button
          variant="ghost"
          size="icon-row"
          icon="grip"
          iconOnly
          draggable
          data-row-interactive
          aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
          onDragStart={(event) => {
            const row = event.currentTarget.closest("tr");
            if (row) event.dataTransfer.setDragImage(row, 16, 16);
            event.dataTransfer.effectAllowed = "move";
            setDragged(plan.id);
          }}
          onDragEnd={() => {
            setDragged(null);
            setOver(null);
          }}
          onKeyDown={(event) => {
            if (!event.altKey || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) return;
            event.preventDefault();
            moveBy(plan, event.key === "ArrowUp" ? -1 : 1);
          }}
        >
          {`Reorder ${plan.name}`}
        </Button>
      )
    },
    { id: "name", header: "Plan", primary: true, grow: true, render: (plan) => plan.name },
    { id: "key", header: "Key", mono: true, width: 180, render: (plan) => plan.key }
  ];

  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Plans"
            rows={plans}
            columns={columns}
            getRowId={(plan) => plan.id}
            rowLabel={(plan) => plan.name}
            rowProps={rowProps}
          />
          <span className="sr-only" role="status" aria-live="polite">
            {announcement}
          </span>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {`Drag a handle onto a row, or Alt with an arrow key on it. Order: ${plans.map((plan) => plan.name).join(", ")}`}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Drop indicators"
            rows={initial.slice(0, 3)}
            columns={columns.slice(1)}
            getRowId={(plan) => plan.id}
            rowLabel={(plan) => plan.name}
            rowProps={(plan) => ({
              "data-drop-target":
                plan.id === "free" ? "after" : plan.id === "team" ? "inside" : undefined
            })}
            rowActions={{ inline: [{ label: "Copy key", icon: "copy", onSelect: () => undefined }] }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"data-drop-target: after on Free, inside on Team"}
        </figcaption>
      </figure>
    </div>
  );
}
