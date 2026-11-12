import { Kbd } from "@infisical/cipher/ui/kbd";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Kbd keys={["mod", "shift", "p"]} platform="mac" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"mac"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Kbd keys={["mod", "shift", "p"]} platform="other" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"other"}</figcaption>
      </figure>
    </div>
  );
}
