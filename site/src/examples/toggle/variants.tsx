import { Icon } from "@infisical/cipher/ui/icon";
import { Toggle } from "@infisical/cipher/ui/toggle";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {(["outline", "ghost"] as const).map((variant) => (
        <figure
          key={variant}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <div className="flex gap-2">
              <Toggle variant={variant} aria-label="Show history">
                <Icon name="history" />
              </Toggle>
              <Toggle variant={variant} aria-label="Show values" defaultPressed>
                <Icon name="eye" />
              </Toggle>
            </div>
          </div>
          <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
        </figure>
      ))}
    </div>
  );
}
