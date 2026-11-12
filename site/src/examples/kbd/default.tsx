import { Input } from "@infisical/cipher/ui/input";
import { Kbd, KbdGroup } from "@infisical/cipher/ui/kbd";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <p>
            Search with <Kbd keys="mod+K" />
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Chord in a sentence"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <p>
            Go to secrets <Kbd keys={[["g"], ["s"]]} />
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Sequence"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <KbdGroup>
            <Kbd>enter</Kbd>
            <span>confirms</span>
            <Kbd>esc</Kbd>
            <span>cancels</span>
          </KbdGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Key legend"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Input aria-label="Filter secrets" placeholder="Filter by name" kbd="mod+K" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Input hint"}</figcaption>
      </figure>
    </div>
  );
}
