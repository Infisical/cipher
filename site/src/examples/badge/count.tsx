import { Count } from "@infisical/cipher/ui/badge";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {(["accent", "ink", "neutral"] as const).map((tone) => (
        <figure
          key={tone}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <span className="flex items-center gap-2">
              Waiting requests
              <Count tone={tone} aria-label="4 waiting requests">
                4
              </Count>
            </span>
          </div>
          <figcaption className="text-muted-foreground text-xs">{tone}</figcaption>
        </figure>
      ))}
    </div>
  );
}
