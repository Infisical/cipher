import { FileTree, type FileTreeNode } from "@infisical/cipher/ui/file-tree";

const items: FileTreeNode[] = [
  {
    id: "project",
    name: "project",
    children: [
      { id: "env", name: "application.production.environment", meta: "12 keys" },
      {
        id: "locked",
        name: "archive",
        disabled: true,
        label: "archive, access restricted",
        children: []
      }
    ]
  }
];
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {(["sm", "md"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <FileTree
              label={`${size} file tree`}
              size={size}
              items={items}
              defaultExpanded={["project"]}
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
