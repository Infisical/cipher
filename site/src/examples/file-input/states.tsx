import { FileInput } from "@infisical/cipher/ui/file-input";

const noop = () => undefined;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileInput
            aria-label="Logo"
            size="sm"
            accept="image/png,image/jpeg,image/svg+xml"
            maxSize={1024 * 1024}
            onFiles={noop}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Small"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileInput
            aria-label="Export file"
            title="Drop an EnvKey export or browse"
            hint="The .txt file EnvKey exports"
            onFiles={noop}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Custom title and hint"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <FileInput aria-label="Skill" accept=".zip,.md" disabled onFiles={noop} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
