import { BootLoader } from "@infisical/cipher/ui/boot-loader";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {["light", "dark"].map((theme) => (
        <figure key={theme} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <div className="h-80">
              <BootLoader theme={theme} fill="container" label="Loading Infisical" delay={0} />
            </div>
          </div>
          <figcaption className="text-muted-foreground text-xs">{`Boot, ${theme}`}</figcaption>
        </figure>
      ))}
    </div>
  );
}
