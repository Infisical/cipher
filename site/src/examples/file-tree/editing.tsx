import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { ContextMenuItem, ContextMenuSeparator } from "@infisical/cipher/ui/context-menu";
import { FileTree, type FileTreeNode } from "@infisical/cipher/ui/file-tree";

const rename = (nodes: FileTreeNode[], id: string, name: string): FileTreeNode[] =>
  nodes.map((node) =>
    node.id === id
      ? { ...node, name }
      : { ...node, children: node.children && rename([...node.children], id, name) }
  );
const remove = (nodes: FileTreeNode[], id: string): FileTreeNode[] =>
  nodes
    .filter((node) => node.id !== id)
    .map((node) => ({ ...node, children: node.children && remove([...node.children], id) }));
const names = (nodes: readonly FileTreeNode[]): string[] =>
  nodes.flatMap((node) => [node.name, ...names(node.children ?? [])]);

const EditableTree = ({
  initial,
  label,
  expanded,
  selected,
  renaming
}: {
  initial: FileTreeNode[];
  label: string;
  expanded: string[];
  selected?: string;
  renaming?: string;
}) => {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(renaming ?? null);
  return (
    <FileTree
      label={label}
      items={items}
      defaultExpanded={expanded}
      defaultSelected={selected ?? null}
      selectable="files"
      renaming={editing}
      onRenamingChange={setEditing}
      onRename={(id, name) => {
        if (names(items).includes(name)) return `${name} already exists`;
        setItems((current) => rename(current, id, name));
        return undefined;
      }}
      renderActions={(node) => (
        <>
          <Button
            variant="ghost"
            size="xs"
            icon="pencil"
            aria-label={`Rename ${node.name}`}
            onClick={() => setEditing(node.id)}
          />
          <Button
            variant="ghost"
            size="xs"
            icon="trash"
            aria-label={`Delete ${node.name}`}
            onClick={() => setItems((current) => remove(current, node.id))}
          />
        </>
      )}
      renderContextMenu={(node) => (
        <>
          <ContextMenuItem onSelect={() => setEditing(node.id)}>Rename</ContextMenuItem>
          <ContextMenuItem>Duplicate</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onSelect={() => setItems((current) => remove(current, node.id))}
          >
            Delete
          </ContextMenuItem>
        </>
      )}
    />
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EditableTree
            label="Skill files"
            initial={[{ id: "skill", name: "SKILL.md" }]}
            expanded={[]}
            selected="skill"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"One file, selected"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EditableTree
            label="Skill files being renamed"
            initial={[
              { id: "skill", name: "SKILL.md" },
              {
                id: "scripts",
                name: "scripts",
                children: [
                  { id: "deploy", name: "deploy.sh", meta: "2 KB" },
                  { id: "rollback", name: "rollback.sh", meta: "1 KB" }
                ]
              },
              { id: "reference", name: "reference.md", meta: "8 KB" }
            ]}
            expanded={["scripts"]}
            renaming="deploy"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Inline rename, with row actions and a context menu"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EditableTree
            label="Long skill files"
            initial={[
              {
                id: "references",
                name: "references-for-the-payments-ledger-replication-runbook",
                children: [
                  {
                    id: "incident",
                    name: "incident-response-checklist-for-on-call-approvers-during-outages.md",
                    meta: "42 KB"
                  },
                  {
                    id: "replication",
                    name: "postgres-logical-replication-slot-recovery-procedure.md",
                    meta: "18 KB"
                  }
                ]
              }
            ]}
            expanded={["references"]}
            selected="incident"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Long names, with the selected row's actions showing"}
        </figcaption>
      </figure>
    </div>
  );
}
