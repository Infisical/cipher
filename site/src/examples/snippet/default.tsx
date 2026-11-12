import { Snippet } from "@infisical/cipher/ui/snippet";

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Snippet label="Run with project secrets" value="infisical run -- npm start" prompt="$" />
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Command"}</figcaption>
    </figure>
  );
}
