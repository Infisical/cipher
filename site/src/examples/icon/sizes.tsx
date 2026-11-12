import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {([12, 16, 20, 24] as const).map((size) => (
        <figure
          key={size}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Icon name="key" size={size} />
          </div>
          <figcaption className="text-muted-foreground text-xs">{<>{size}px</>}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Icon name="lock" label="Encrypted" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Named image"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button asChild variant="outline" icon="key">
            <a href="#sensitive-editor">View editor</a>
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Action icon"}</figcaption>
      </figure>
    </div>
  );
}
