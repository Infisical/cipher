import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <ToggleGroup type="single" defaultValue="all" aria-label="Connection status">
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="failing">Failing</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"single"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ToggleGroup
            type="single"
            width="full"
            defaultValue="all"
            aria-label="Connection status, full width"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="failing">Failing</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"single, full width"}</figcaption>
      </figure>
    </div>
  );
}
