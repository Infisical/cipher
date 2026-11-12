import { useState } from "react";

import { FileTree, type FileTreeNode } from "@infisical/cipher/ui/file-tree";

const items: FileTreeNode[] = [
  {
    id: "project",
    name: "Project configuration",
    meta: "2 files",
    children: [
      { id: "env", name: "Environment variables for the production deployment", meta: "12 keys" },
      { id: "policy", name: "Access policy", icon: "lock", meta: "Restricted" }
    ]
  }
];
export default function Example() {
  const [expanded, setExpanded] = useState<string[]>(["project"]);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileTree
            label="Selectable configuration files"
            items={items}
            selectable="files"
            truncate="end"
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelect={setSelected}
          />
          <p role="status" className="sr-only">
            Selected file: {selected ?? "none"}
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Files only / end truncation"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileTree
            label="Browse configuration"
            items={items}
            selectable="none"
            defaultExpanded={["project"]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Browse without selection"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileTree label="Empty archive" items={[]} empty="No archived configuration files" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty folder"}</figcaption>
      </figure>
    </div>
  );
}
