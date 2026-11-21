import { Input } from "@infisical/cipher/ui/input";
import { Inline } from "@infisical/cipher/ui/layout";
import { Toggle } from "@infisical/cipher/ui/toggle";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Inline gap={8} align="center" wrap={false}>
          <Input
            icon="search"
            aria-label="Search secrets"
            placeholder="Search secrets by key or value"
          />
          <Toggle aria-label="Show values">Show values</Toggle>
        </Inline>
        <figcaption className="text-muted-foreground text-xs">
          {"in a no-wrap Inline beside a full-width Input"}
        </figcaption>
      </figure>
    </div>
  );
}
