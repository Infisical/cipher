import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <div
      aria-label="Input sizes"
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8"
    >
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex items-center gap-2">
            <Input
              size="xs"
              icon="search"
              placeholder="Search members"
              aria-label="Search members"
            />
            <Button variant="outline" size="xs">
              Export
            </Button>
            <Button variant="outline" size="xs" icon="plus">
              Invite
            </Button>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"xs"}</figcaption>
      </figure>
      {(["sm", "md", "lg"] as const).map((size) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Field label={`${size} name`}>
              <Input size={size} defaultValue="staging" />
            </Field>
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
