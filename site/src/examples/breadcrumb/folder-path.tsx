import { Breadcrumb, type BreadcrumbCrumb } from "@infisical/cipher/ui/breadcrumb";
import { DropdownMenuItem } from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";

const crumbs = (path: string[]): BreadcrumbCrumb[] => [
  { label: "Root", media: <Icon name="home" />, href: "#breadcrumb" },
  ...path.map((folder, index) => ({
    label: folder,
    href: index < path.length - 1 ? "#breadcrumb" : undefined,
    menu:
      index === path.length - 1 ? (
        <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText("/" + path.join("/"))}>
          <Icon name="copy" />
          Copy path
        </DropdownMenuItem>
      ) : undefined
  }))
];

const cases = [
  { caption: "Root only: a trailing divider", path: [] as string[] },
  { caption: "Short path, a menu on the current folder", path: ["backend", "payments"] },
  {
    caption: "Long, deep path: the middle collapses into a menu",
    path: [
      "services",
      "payments-ledger-replication",
      "us-east-1",
      "readwrite",
      "primary-cluster",
      "connection-pools",
      "service-tokens"
    ]
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-y-8">
      {cases.map((item) => (
        <figure key={item.caption} className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
          <Breadcrumb aria-label={item.caption} trailingDivider items={crumbs(item.path)} />
          <figcaption className="text-muted-foreground text-xs">{item.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
