import { Code } from "@infisical/cipher/ui/code";
import { Highlight } from "@infisical/cipher/ui/text";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <p>
            Set{" "}
            <Code>
              <Highlight text="DATABASE_REPLICA_URL" query="replica" />
            </Code>{" "}
            before the replica starts.
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Inline Code with a search match"}
        </figcaption>
      </figure>
    </div>
  );
}
