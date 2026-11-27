import { Button } from "@infisical/cipher/ui/button";

const consumerBorder =
  "[data-consumer-utilities] .border { border-width: 1px; border-style: solid; }";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div data-consumer-utilities="" className="flex w-full min-w-0 flex-wrap items-start gap-2">
          <style>{consumerBorder}</style>
          <Button variant="accent" icon="plus">
            Add contact
          </Button>
          <Button variant="outline">Import</Button>
          <Button>Save</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="ghost" size="icon" icon="more" iconOnly aria-label="More actions" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "Inside an app whose own .border utility outranks Cipher's: every variant keeps its height"
          }
        </figcaption>
      </figure>
    </div>
  );
}
