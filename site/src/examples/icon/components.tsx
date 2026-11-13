import { FlaskConical, Package, ShieldCheck } from "lucide-react";

import { Button } from "@infisical/cipher/ui/button";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { Icon } from "@infisical/cipher/ui/icon";
import { Media } from "@infisical/cipher/ui/item";

const added = ["flask", "package", "sparkles", "shield", "infinity"] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-wrap items-center gap-6">
            {added.map((name) => (
              <span key={name} className="flex flex-col items-center gap-2 text-sm">
                <Icon name={name} size={24} />
                <span>{name}</span>
              </span>
            ))}
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Cipher glyphs: flask, package, sparkles, shield, infinity"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button icon={FlaskConical}>Run trial</Button>
            <Button variant="outline" icon={Package}>
              Packages
            </Button>
            <Media icon={ShieldCheck} />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Button and Media take a component as well as a name"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <EmptyState
            icon={Package}
            title="No packages yet"
            description="Packages you publish show up here."
            actions={<Button icon="plus">Publish package</Button>}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"EmptyState with a Lucide component"}</figcaption>
      </figure>
    </div>
  );
}
